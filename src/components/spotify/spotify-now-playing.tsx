"use client";

import { motion} from "framer-motion";
import { FaSpotify } from "react-icons/fa";
import { Music } from "lucide-react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
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
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start gap-3">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </div>
        </motion.div>
      );
    }

    if (spotifyData?.is_playing && spotifyData?.item) {
      return (
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Avatar className="w-12 h-12 ring-2 ring-[#1DB954]/20 dark:ring-[#1DB954]/30">
                {spotifyData.item.album.images[0] ? (
                  <AvatarImage
                    src={spotifyData.item.album.images[0].url}
                    alt={spotifyData.item.album.name}
                    className="object-cover"
                  />
                ) : (
                  <AvatarFallback>
                    <Music className="w-6 h-6" />
                  </AvatarFallback>
                )}
              </Avatar>
            </motion.div>
            <div className="flex-1 min-w-0">
              <motion.p 
                className="font-semibold truncate text-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {spotifyData.item.name}
              </motion.p>
              <motion.p 
                className="text-sm text-muted-foreground truncate"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {spotifyData.item.artists[0].name}
              </motion.p>
            </div>
          </div>

          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Progress 
              value={getProgressPercentage()} 
              className="h-1 bg-background/50"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(spotifyData.progress_ms || 0)}</span>
              <span>{formatTime(spotifyData.item.duration_ms)}</span>
            </div>
          </motion.div>

          {spotifyData.device && (
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Badge variant="outline" className="text-xs bg-background/50">
                <span className="flex items-center gap-1">
                  <span>Playing on</span>
                  <span className="font-medium">{spotifyData.device.name}</span>
                </span>
              </Badge>
            </motion.div>
          )}
        </motion.div>
      );
    }

    return (
      <motion.div 
        className="flex flex-col items-center justify-center p-4 space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2">
          <Music className="w-6 h-6 text-muted-foreground" />
          <p className="text-muted-foreground">Kartik is AFK</p>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Probably coding something awesome or taking a well-deserved break!
        </p>
      </motion.div>
    );
  };

  if (isMobile) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <motion.div
            className="flex items-center gap-2 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaSpotify className="text-[#1DB954] text-xl" />
            {spotifyData?.is_playing && spotifyData?.item && (
              <div className="w-full max-w-[100px]">
                <Marquee speed={30}>
                  <span className="text-sm font-medium">
                    {spotifyData.item.name}
                  </span>
                </Marquee>
              </div>
            )}
          </motion.div>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[300px] mt-2 p-0 border-none shadow-lg" 
          align="start"
        >
          <Card className="bg-background/80 backdrop-blur-sm border-none">
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
    <HoverCard>
      <HoverCardTrigger asChild>
        <motion.div
          className="flex items-center gap-2 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
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
        </motion.div>
      </HoverCardTrigger>
      <HoverCardContent 
        className="p-0 rounded-2xl mt-3 border-none shadow-lg" 
        side="bottom" 
        align="start"
      >
        <Card className="w-[300px] bg-background/80 backdrop-blur-sm border">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <h3 className="font-semibold">Kartik currently listening to 🎧</h3>
          </CardHeader>
          <CardContent>
            {renderSpotifyContent()}
          </CardContent>
        </Card>
      </HoverCardContent>
    </HoverCard>
  );
} 