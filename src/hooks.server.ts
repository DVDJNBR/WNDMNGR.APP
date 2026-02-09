import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Cloudflare Access headers
	const email = event.request.headers.get('cf-access-authenticated-user-email');
	const commonName = event.request.headers.get('cf-access-authenticated-user-common-name');
	
	// Dev/Mock logic: allow access if no headers are present AND we are in development
	// In production (Cloudflare), Access will ensure these headers exist.
	const isDev = process.env.NODE_ENV === 'development';
	
	// If no email header, and not in dev, we could consider the request unauthorized
	// However, Cloudflare Access usually blocks at the edge. 
	// This hook is an extra layer of safety and identity propagation.
	if (!email && !isDev) {
		// Optional: Redirect to a custom unauthorized page or let Cloudflare handle it
		// return new Response('Unauthorized', { status: 401 });
	}

	// Restrict to @wpd.fr if email exists
	if (email && !email.endsWith('@wpd.fr')) {
		return new Response('Access Restricted to wpd.fr domain', { status: 403 });
	}

	// Propagate identity to the app via locals
	event.locals.user = email ? {
		email,
		name: commonName || email.split('@')[0]
	} : isDev ? {
		email: 'dev@wpd.fr',
		name: 'Dev User (Mock)'
	} : null;

	const response = await resolve(event);
	return response;
};
