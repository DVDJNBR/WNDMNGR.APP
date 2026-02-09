'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { Database, Table as TableIcon, FileCode, ArrowLeft } from 'lucide-react';

interface Column {
  column_name: string;
  data_type: string;
  is_nullable: string;
}

interface TableSchema {
  table_name: string;
  columns: Column[];
}

export default function DocsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [schema, setSchema] = useState<TableSchema[] | null>(null);
  const [setupSql, setSetupSql] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !user) return;

    const fetchSchema = async () => {
      setIsLoading(true);
      const { data, error } = await api.get<any>('/db/schema');
      
      if (data) {
        if (data.sql) {
          setSetupSql(data.sql);
        } else {
          setSchema(data);
        }
      } else {
        setError(error || 'Failed to fetch database schema');
      }
      setIsLoading(false);
    };

    fetchSchema();
  }, [user, authLoading]);

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-6">Technical documentation is restricted to authenticated users.</p>
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Database className="mr-2 h-8 w-8 text-primary" /> Database Documentation
          </h1>
          <p className="text-muted-foreground">Live schema information from Supabase.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/farms">Back to Dashboard</Link>
        </Button>
      </div>

      {setupSql && (
        <Card className="mb-8 border-amber-500/50 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="text-amber-600 flex items-center">
              <FileCode className="mr-2 h-5 w-5" /> Setup Required
            </CardTitle>
            <CardDescription>
              To enable live schema documentation, please execute the following SQL in your Supabase SQL Editor:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="p-4 bg-muted rounded-md text-xs font-mono overflow-x-auto">
              {setupSql}
            </pre>
          </CardContent>
        </Card>
      )}

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-8">
          {error}
        </div>
      )}

      <div className="space-y-8">
        {schema ? (
          schema.map((table) => (
            <Card key={table.table_name}>
              <CardHeader className="bg-muted/30">
                <CardTitle className="flex items-center text-xl">
                  <TableIcon className="mr-2 h-5 w-5 text-muted-foreground" /> {table.table_name}
                </CardTitle>
                <CardDescription>
                  Table schema and column definitions.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Column Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Nullable</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {table.columns.map((column) => (
                      <TableRow key={column.column_name}>
                        <TableCell className="font-mono font-medium">{column.column_name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{column.data_type}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {column.is_nullable === 'YES' ? 'Yes' : 'No'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))
        ) : !setupSql && !error && (
          <p className="text-center py-20 text-muted-foreground">No schema data available.</p>
        )}
      </div>
    </div>
  );
}
