'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import Link from 'next/link';
import { ArrowLeft, Check, ChevronRight } from 'lucide-react';

export default function NewFarmPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    project: '',
    spv: '',
    code: '',
    farm_type_id: 1, // Default: Wind
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'farm_type_id' ? parseInt(value) : value
    }));
  };

  const nextStep = () => {
    if (step === 1 && (!formData.project || !formData.spv || !formData.code)) {
      setError('Please fill in all identity fields.');
      return;
    }
    setError(null);
    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    const { data, error: apiError } = await api.post<any>('/farms', formData);

    if (data) {
      router.push(`/farms/${data.uuid}`);
    } else {
      setError(apiError || 'Failed to create farm');
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    router.push('/');
    return null;
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-2xl">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/farms"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Add New Farm</h1>
        <div className="flex items-center gap-2 mt-4">
          <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`h-2 flex-1 rounded-full ${step >= 3 ? 'bg-primary' : 'bg-muted'}`} />
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground font-medium uppercase tracking-wider">
          <span className={step === 1 ? 'text-primary' : ''}>Identity</span>
          <span className={step === 2 ? 'text-primary' : ''}>Type</span>
          <span className={step === 3 ? 'text-primary' : ''}>Review</span>
        </div>
      </div>

      <Card>
        {step === 1 && (
          <>
            <CardHeader>
              <CardTitle>Farm Identity</CardTitle>
              <CardDescription>Enter the basic identification details for the farm.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Project Name</label>
                <Input 
                  name="project" 
                  value={formData.project} 
                  onChange={handleChange} 
                  placeholder="e.g. Grand Vent Wind Farm" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">SPV (Entity Name)</label>
                <Input 
                  name="spv" 
                  value={formData.spv} 
                  onChange={handleChange} 
                  placeholder="e.g. SAS Wind Power 1" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Internal Code</label>
                <Input 
                  name="code" 
                  value={formData.code} 
                  onChange={handleChange} 
                  placeholder="e.g. W001" 
                  maxLength={10}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={nextStep}>
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        )}

        {step === 2 && (
          <>
            <CardHeader>
              <CardTitle>Farm Type</CardTitle>
              <CardDescription>Select the energy source for this farm.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select name="farm_type_id" value={formData.farm_type_id} onChange={handleChange}>
                  <option value={1}>Wind (Éolien)</option>
                  <option value={2}>Solar (Photovoltaïque)</option>
                  <option value={3}>Hybrid</option>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={prevStep}>Back</Button>
              <Button className="flex-1" onClick={nextStep}>
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        )}

        {step === 3 && (
          <>
            <CardHeader>
              <CardTitle>Review & Submit</CardTitle>
              <CardDescription>Verify the information before creating the farm record.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Project</span>
                  <span className="text-sm font-medium">{formData.project}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">SPV</span>
                  <span className="text-sm font-medium">{formData.spv}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Code</span>
                  <span className="text-sm font-mono font-medium">{formData.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <span className="text-sm font-medium">
                    {formData.farm_type_id === 1 ? 'Wind' : formData.farm_type_id === 2 ? 'Solar' : 'Hybrid'}
                  </span>
                </div>
              </div>
              {error && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                  {error}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={prevStep} disabled={isSubmitting}>Back</Button>
              <Button className="flex-1" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Farm'} <Check className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}
