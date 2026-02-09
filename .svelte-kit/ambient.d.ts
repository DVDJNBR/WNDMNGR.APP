
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```sh
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const ENV_FOR_DYNACONF: string;
	export const AZURE_TENANT_ID: string;
	export const AZURE_CLIENT_ID: string;
	export const AZURE_CLIENT_SECRET: string;
	export const SUPABASE_URL: string;
	export const SUPABASE_ANON_KEY: string;
	export const ALLUSERSPROFILE: string;
	export const APPDATA: string;
	export const BUNDLED_DEBUGPY_PATH: string;
	export const CHROME_CRASHPAD_PIPE_NAME: string;
	export const CLAUDE_CODE_SSE_PORT: string;
	export const COLORTERM: string;
	export const CommonProgramFiles: string;
	export const CommonProgramW6432: string;
	export const COMPUTERNAME: string;
	export const ComSpec: string;
	export const DriverData: string;
	export const EFC_11636_1592913036: string;
	export const ENABLE_IDE_INTEGRATION: string;
	export const GEMINI_CLI_NO_RELAUNCH: string;
	export const GIT_ASKPASS: string;
	export const GNUPLOT_LIB: string;
	export const HOME: string;
	export const HOMEDRIVE: string;
	export const HOMEPATH: string;
	export const LANG: string;
	export const LOCALAPPDATA: string;
	export const LOGONSERVER: string;
	export const LOGSERVER: string;
	export const NODE_EXTRA_CA_CERTS: string;
	export const NODE_TLS_REJECT_UNAUTHORIZED: string;
	export const Npm: string;
	export const NUMBER_OF_PROCESSORS: string;
	export const OneDrive: string;
	export const OneDriveCommercial: string;
	export const OS: string;
	export const PACKAGESERVER: string;
	export const Path: string;
	export const PATHEXT: string;
	export const PBX: string;
	export const POWERSHELL_DISTRIBUTION_CHANNEL: string;
	export const PROCESSOR_ARCHITECTURE: string;
	export const PROCESSOR_IDENTIFIER: string;
	export const PROCESSOR_LEVEL: string;
	export const PROCESSOR_REVISION: string;
	export const ProgramData: string;
	export const ProgramFiles: string;
	export const ProgramW6432: string;
	export const PSModulePath: string;
	export const PUBLIC: string;
	export const PYDEVD_DISABLE_FILE_VALIDATION: string;
	export const PYTHONSTARTUP: string;
	export const PYTHON_BASIC_REPL: string;
	export const SESSIONNAME: string;
	export const SystemDrive: string;
	export const SystemRoot: string;
	export const TEMP: string;
	export const TERM_PROGRAM: string;
	export const TERM_PROGRAM_VERSION: string;
	export const TMP: string;
	export const USERDNSDOMAIN: string;
	export const USERDOMAIN: string;
	export const USERDOMAIN_ROAMINGPROFILE: string;
	export const USERNAME: string;
	export const USERPROFILE: string;
	export const VIRTUAL_ENV: string;
	export const VIRTUAL_ENV_PROMPT: string;
	export const VSCODE_A11Y_MODE: string;
	export const VSCODE_DEBUGPY_ADAPTER_ENDPOINTS: string;
	export const VSCODE_GIT_ASKPASS_EXTRA_ARGS: string;
	export const VSCODE_GIT_ASKPASS_MAIN: string;
	export const VSCODE_GIT_ASKPASS_NODE: string;
	export const VSCODE_GIT_IPC_HANDLE: string;
	export const VSCODE_INJECTION: string;
	export const VSCODE_NONCE: string;
	export const VSCODE_STABLE: string;
	export const windir: string;
	export const ZES_ENABLE_SYSMAN: string;
	export const _OLD_VIRTUAL_PATH: string;
	export const GEMINI_CLI: string;
	export const TERM: string;
	export const PAGER: string;
	export const GIT_PAGER: string;
}

/**
 * Similar to [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		ENV_FOR_DYNACONF: string;
		AZURE_TENANT_ID: string;
		AZURE_CLIENT_ID: string;
		AZURE_CLIENT_SECRET: string;
		SUPABASE_URL: string;
		SUPABASE_ANON_KEY: string;
		ALLUSERSPROFILE: string;
		APPDATA: string;
		BUNDLED_DEBUGPY_PATH: string;
		CHROME_CRASHPAD_PIPE_NAME: string;
		CLAUDE_CODE_SSE_PORT: string;
		COLORTERM: string;
		CommonProgramFiles: string;
		CommonProgramW6432: string;
		COMPUTERNAME: string;
		ComSpec: string;
		DriverData: string;
		EFC_11636_1592913036: string;
		ENABLE_IDE_INTEGRATION: string;
		GEMINI_CLI_NO_RELAUNCH: string;
		GIT_ASKPASS: string;
		GNUPLOT_LIB: string;
		HOME: string;
		HOMEDRIVE: string;
		HOMEPATH: string;
		LANG: string;
		LOCALAPPDATA: string;
		LOGONSERVER: string;
		LOGSERVER: string;
		NODE_EXTRA_CA_CERTS: string;
		NODE_TLS_REJECT_UNAUTHORIZED: string;
		Npm: string;
		NUMBER_OF_PROCESSORS: string;
		OneDrive: string;
		OneDriveCommercial: string;
		OS: string;
		PACKAGESERVER: string;
		Path: string;
		PATHEXT: string;
		PBX: string;
		POWERSHELL_DISTRIBUTION_CHANNEL: string;
		PROCESSOR_ARCHITECTURE: string;
		PROCESSOR_IDENTIFIER: string;
		PROCESSOR_LEVEL: string;
		PROCESSOR_REVISION: string;
		ProgramData: string;
		ProgramFiles: string;
		ProgramW6432: string;
		PSModulePath: string;
		PUBLIC: string;
		PYDEVD_DISABLE_FILE_VALIDATION: string;
		PYTHONSTARTUP: string;
		PYTHON_BASIC_REPL: string;
		SESSIONNAME: string;
		SystemDrive: string;
		SystemRoot: string;
		TEMP: string;
		TERM_PROGRAM: string;
		TERM_PROGRAM_VERSION: string;
		TMP: string;
		USERDNSDOMAIN: string;
		USERDOMAIN: string;
		USERDOMAIN_ROAMINGPROFILE: string;
		USERNAME: string;
		USERPROFILE: string;
		VIRTUAL_ENV: string;
		VIRTUAL_ENV_PROMPT: string;
		VSCODE_A11Y_MODE: string;
		VSCODE_DEBUGPY_ADAPTER_ENDPOINTS: string;
		VSCODE_GIT_ASKPASS_EXTRA_ARGS: string;
		VSCODE_GIT_ASKPASS_MAIN: string;
		VSCODE_GIT_ASKPASS_NODE: string;
		VSCODE_GIT_IPC_HANDLE: string;
		VSCODE_INJECTION: string;
		VSCODE_NONCE: string;
		VSCODE_STABLE: string;
		windir: string;
		ZES_ENABLE_SYSMAN: string;
		_OLD_VIRTUAL_PATH: string;
		GEMINI_CLI: string;
		TERM: string;
		PAGER: string;
		GIT_PAGER: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
