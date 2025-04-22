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
import { Card, CardContent, CardHeader } from "../ui/card";
import { Progress } from "../ui/progress";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import Marquee from "react-fast-marquee";
import { useSpotifyData } from "@/hooks/useSpotifyData";

export default function SpotifyNowPlaying() {
  const { data: spotifyData, isLoading } = useSpotifyData()
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
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </div>
        </div>
      );
    }

    if (spotifyData?.is_playing && spotifyData?.item) {
      return (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Avatar className="w-12 h-12">
              {spotifyData.item.album.images[0] ? (
                <AvatarImage
                  src={spotifyData.item.album.images[0].url}
                  alt={spotifyData.item.album.name}
                />
              ) : (
                <AvatarFallback>
                  <Music className="w-6 h-6" />
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{spotifyData.item.name}</p>
              <p className="text-sm text-muted-foreground truncate">
                {spotifyData.item.artists[0].name}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Progress value={getProgressPercentage()} className="h-1" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(spotifyData.progress_ms || 0)}</span>
              <span>{formatTime(spotifyData.item.duration_ms)}</span>
            </div>
          </div>

          {spotifyData.device && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                <span className="flex items-center gap-1">
                  <span>Playing on</span>
                  <span className="font-medium">{spotifyData.device.name}</span>
                </span>
              </Badge>
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
        <div
            className="flex items-center gap-2"
          >
            <FaSpotify className="text-[#1DB954] text-xl" />
            {spotifyData?.is_playing && spotifyData?.item && (
              <div className="w-full max-w-[100px]">
                <Marquee
                  speed={30}
                >                
                  <span className="text-sm font-medium">
                    {spotifyData.item.name}
                  </span>
                </Marquee>
              </div>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] mt-2 p-0" align="start">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <FaSpotify className="text-[#1DB954]" />
              <h3 className="font-semibold">Kartik is listening to now</h3>
            </CardHeader>
            <CardContent>
              {renderSpotifyContent()}
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="flex items-center gap-2"
          >
            <FaSpotify className="text-[#1DB954] text-xl" />
            {spotifyData?.is_playing && spotifyData?.item && (
              <div className="w-full max-w-[150px]">
                <Marquee
                  speed={30}
                  pauseOnHover={true}
                  pauseOnClick={true}
                >
                  <span className="text-sm font-medium">
                    {spotifyData.item.name}
                  </span>
                </Marquee>
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent className="p-0 rounded-2xl mt-3" side="bottom" align="start">
          <Card className="w-[300px]">
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <FaSpotify className="text-[#1DB954]" />
              <h3 className="font-semibold">Kartik currently listening to</h3>
            </CardHeader>
            <CardContent>
              {renderSpotifyContent()}
            </CardContent>
          </Card>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 