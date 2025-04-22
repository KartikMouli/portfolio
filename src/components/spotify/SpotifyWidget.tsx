'use client';

import { motion } from 'framer-motion';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { Music } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FaSpotify } from 'react-icons/fa';

export default function SpotifyWidget() {
  const { data: spotifyData } = useSpotifyData();

  if (!spotifyData?.is_playing || !spotifyData?.item) return null;

  const handleClick = () => {
    window.open(spotifyData.item?.external_urls.spotify, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={handleClick}
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1DB954]/10 to-[#1DB954]/5 p-4",
        "border border-[#1DB954]/20 dark:border-[#1DB954]/10",
        "shadow-[0_0_20px_rgba(29,185,84,0.1)] dark:shadow-[0_0_20px_rgba(29,185,84,0.05)]",
        "cursor-pointer hover:scale-[1.02] transition-transform duration-300"
      )}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1DB954]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <FaSpotify className="text-[#1DB954] text-xl" />
          <span className="text-sm font-medium text-[#1DB954]">Now Playing</span>
        </div>

        {/* Track Info */}
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-16 h-16 rounded-lg overflow-hidden"
          >
            <img
              src={spotifyData.item.album.images[0]?.url}
              alt={spotifyData.item.album.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </motion.div>

          <div className="flex-1 min-w-0">
            <motion.h3 
              className="font-semibold truncate text-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {spotifyData.item.name}
            </motion.h3>
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

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="h-1 w-full bg-[#1DB954]/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#1DB954] rounded-full"
              initial={{ width: 0 }}
              animate={{ 
                width: `${((spotifyData.progress_ms || 0) / spotifyData.item.duration_ms) * 100}%` 
              }}
              transition={{ duration: 1, ease: "linear" }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {Math.floor((spotifyData.progress_ms || 0) / 1000 / 60)}:
              {String(Math.floor(((spotifyData.progress_ms || 0) / 1000) % 60)).padStart(2, '0')}
            </span>
            <span>
              {Math.floor(spotifyData.item.duration_ms / 1000 / 60)}:
              {String(Math.floor((spotifyData.item.duration_ms / 1000) % 60)).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 