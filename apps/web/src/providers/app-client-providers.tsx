"use client"

import type { ReactNode } from "react"

import { QueryProvider } from "@/providers/query-provider"
import { SocketProvider } from "@/providers/socket-provider"
import { ToastProvider } from "@/providers/toast-provider"
import { TrpcProvider } from "@/lib/trpc/provider"

type AppClientProvidersProps = {
  children: ReactNode
}

export function AppClientProviders({ children }: AppClientProvidersProps) {
  return (
    <QueryProvider>
      <TrpcProvider>
        <SocketProvider>
          {children}
          <ToastProvider />
        </SocketProvider>
      </TrpcProvider>
    </QueryProvider>
  )
}
