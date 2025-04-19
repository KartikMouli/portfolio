'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updateVisitorCount = async () => {
      try {
        await axios.post('/api/visitors');
        const response = await axios.get('/api/visitors');
        
        if (response.data.count !== undefined) {
          setCount(response.data.count);
        } else {
          setError('Failed to fetch view count');
        }
      } catch (err) {
        setError('Failed to update view count');
      }
    };

    updateVisitorCount();
  }, []);

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-destructive text-sm"
      >
        {error}
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-2 text-sm text-muted-foreground"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          transition: { duration: 2, repeat: Infinity }
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      </motion.div>
      <span>
        {count !== null ? (
          <>
            <span className="font-semibold text-primary">{count.toLocaleString()}</span> views
          </>
        ) : (
          'Loading...'
        )}
      </span>
    </motion.div>
  );
} 