'use client'

import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        queryFn: async ({ queryKey }) => {
          const [url] = queryKey as [string];
          const res = await fetch(url);
          if (!res.ok) {
            throw new Error(`${res.status} ${res.statusText}`);
          }
          return res.json();
        },
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}