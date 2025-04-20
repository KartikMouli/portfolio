"use client";

import { motion } from "framer-motion";
import { FaSpotify } from "react-icons/fa";
import { Music } from "lucide-react";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "../ui/skeleton";
import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSpotify } from "../../context/spotify/spotify-context";



export default function SpotifyNowPlaying() {
  const {spotifyData, isLoading} = useSpotify();
  const isMobile = useMediaQuery("(max-width: 768px)");


  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 1000 / 60);
    const seconds = Math.floor((ms / 1000) % 60);
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (!spotifyData?.progress_ms || !spotifyData?.item?.duration_ms) return 0;
    return (spotifyData.progress_ms / spotifyData.item.duration_ms) * 100;
  };

  const renderSpotifyContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-12 w-12 rounded" />
        </div>
      );
    }

    if (spotifyData?.is_playing && spotifyData?.item) {
      return (
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            {spotifyData.item.album.images[0] ? (
              <Image
                src={spotifyData.item.album.images[0].url}
                alt={spotifyData.item.album.name}
                className="w-12 h-12 rounded shadow-md"
                height={48}
                width={48}
              />
            ) : (
              <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                <Music className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{spotifyData.item.name}</p>
              <p className="text-sm text-muted-foreground truncate">
                {spotifyData.item.artists[0].name}
              </p>
            </div>
          </div>
          
          <div className="space-y-1">
            <Progress value={getProgressPercentage()} className="h-1" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(spotifyData.progress_ms || 0)}</span>
              <span>{formatTime(spotifyData.item.duration_ms)}</span>
            </div>
          </div>

          {spotifyData.device && (
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <span>Playing on</span>
              <span className="font-medium">{spotifyData.device.name}</span>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center p-4">
        <p className="text-muted-foreground">Not playing</p>
      </div>
    );
  };

  if (isMobile) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <FaSpotify className="text-[#1DB954] text-xl" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="end">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <FaSpotify className="text-[#1DB954]" />
              <h3 className="font-semibold">Kartik is listening to now</h3>
            </div>
            {renderSpotifyContent()}
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className="flex items-center gap-2 cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaSpotify className="text-[#1DB954] text-xl" />
            {spotifyData?.is_playing && spotifyData?.item && (
              <span className="text-sm font-medium">
                {spotifyData.item.name}
              </span>
            )}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent className="p-0 rounded-2xl border-none" side="bottom" align="start">
          <Card className="w-[300px]">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <FaSpotify className="text-[#1DB954]" />
                <h3 className="font-semibold">Kartik currently listening to</h3>
              </div>
              {renderSpotifyContent()}
            </CardContent>
          </Card>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 