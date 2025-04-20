"use client";
import { SpotifyData } from "@/models/spotify";
import axios from "axios";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface SpotifyContextType {
    spotifyData: SpotifyData | null;
    isLoading: boolean;
    error: string | null;
}

const SpotifyContext = createContext<SpotifyContextType>({
    spotifyData: null,
    isLoading: true,
    error: null,
});

export const useSpotify = () => useContext(SpotifyContext);

interface Props {
    children: ReactNode;
}

export function SpotifyProvider({ children }: Props) {
    const [spotifyData, setSpotifyData] = useState<SpotifyData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const fetchSpotifyData = async () => {
            try {
                const response = await axios.get("/api/spotify/now-playing");
                setSpotifyData(response.data);
                setError(null);
            } catch (error) {
                console.error("Error fetching Spotify data:", error);
                setError("Failed to fetch Spotify data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSpotifyData();
        const interval = setInterval(fetchSpotifyData, 1 * 60 * 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);


    return (
        <SpotifyContext.Provider value={{ spotifyData, isLoading, error }}>
            {children}
        </SpotifyContext.Provider>
    );
}