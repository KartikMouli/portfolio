'use client';

import { motion } from 'framer-motion';
import { EyeIcon } from 'lucide-react';
import { useVisitorCount } from '@/hooks/useVisitorCount';

export default function VisitorCounter() {
  const { count, isLoading, error } = useVisitorCount();

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-destructive text-sm"
      >
        Failed to fetch view count
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-2 text-sm text-muted-foreground"
    >
      <EyeIcon className="size-4" />
      <span>
        {isLoading ? (
          'Loading...'
        ) : (
          <>
            <span className="font-serif text-primary">{count?.toLocaleString()}</span> views
          </>
        )}
      </span>
    </motion.div>
  );
} 