"use client";

import { useState, useEffect, Suspense } from 'react';
import { getAuthorizationUrl } from '@/lib/spotify/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useSearchParams } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import MoviesAdmin from '@/components/MoviesAdmin';

function AdminContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);
  
  const searchParams = useSearchParams();
  const success = searchParams.get('success');

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (success) {
      setIsSpotifyConnected(true);
      toast({
        title: "🎉 Success!",
        description: "Spotify connected successfully. Your currently playing track will now be displayed.",
        className: "bg-green-500/10 border-green-500/20 text-green-500",
      });
    }
  }, [success]);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/check');
      const data = await response.json();
      
      if (response.ok && data.isAuthenticated) {
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      setError('Failed to check authentication status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();

      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError('Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConnectSpotify = () => {
    const authUrl = getAuthorizationUrl();
    window.location.href = authUrl;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-[400px]">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">Checking authentication...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={isSubmitting}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Admin Dashboard</CardTitle>
            <CardDescription>Manage your portfolio settings and integrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Spotify Integration</h2>
                {isSpotifyConnected ? (
                  <div className="flex items-center gap-2 text-green-500">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <p>Spotify is connected</p>
                  </div>
                ) : (
                  <>
                    <p className="text-muted-foreground">
                      Connect your Spotify account to display your currently playing track
                    </p>
                    <Button 
                      onClick={handleConnectSpotify} 
                      className="bg-[#1DB954] hover:bg-[#1DB954]/90 text-white"
                    >
                      Connect Spotify
                    </Button>
                  </>
                )}
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Movies Management</h2>
                <MoviesAdmin />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-[400px]">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <AdminContent />
    </Suspense>
  );
} 