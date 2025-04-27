'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';



export default function MoviesAdmin() {
    const [file, setFile] = useState<File | null>(null);

    const uploadMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await axios.post('/api/movies', formData);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Movies updated successfully");
            setFile(null);
        },
        onError: (error: Error) => {
            toast.error("Error updating movies",{
                description: error.message || 'Failed to update movies',
            });
        }
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            toast.error("Please select a file");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        uploadMutation.mutate(formData);
    };

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">Movies Management</CardTitle>
                <CardDescription className="text-sm">Upload a CSV file to update the movies database</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="space-y-1">
                        <Label htmlFor="file" className="text-sm">CSV File</Label>
                        <Input
                            id="file"
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            disabled={uploadMutation.isPending}
                            className="h-8"
                        />
                        <p className="text-xs text-muted-foreground">
                            CSV should have columns: date,name,year,letterboxd_uri
                        </p>
                    </div>
                    <Button 
                        type="submit" 
                        disabled={!file || uploadMutation.isPending} 
                        size="sm"
                    >
                        {uploadMutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            'Update Movies'
                        )}
                    </Button>
                </form>

                {uploadMutation.data?.statistics && (
                    <Card className="mt-2">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Upload Statistics</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <p className="text-xs text-muted-foreground">Total</p>
                                    <p className="text-lg font-bold">{uploadMutation.data.statistics.totalRecords}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Successful</p>
                                    <p className="text-lg font-bold text-green-600">{uploadMutation.data.statistics.successfulRecords}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Failed</p>
                                    <p className="text-lg font-bold text-red-600">{uploadMutation.data.statistics.failedRecords}</p>
                                </div>
                            </div>

                            {uploadMutation.data.statistics.failedRecords > 0 && (
                                <div className="mt-2">
                                    <h4 className="text-sm font-medium text-red-600 mb-1">Failed Records:</h4>
                                    <div className="max-h-32 overflow-y-auto text-xs">
                                        {uploadMutation.data.statistics.failedDetails.map((detail: string, index: number) => (
                                            <p key={index} className="text-red-500 mb-0.5">{detail}</p>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </CardContent>
        </Card>
    );
} 