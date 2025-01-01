'use client'

import { toast } from 'sonner'
import { useEffect } from 'react'

interface NotificationsProps {
  message?: string
  type?: 'success' | 'error' | 'info'
}

export function Notifications({ message, type = 'success' }: NotificationsProps) {
  useEffect(() => {
    if (message) {
      toast[type](message)
    }
  }, [message, type])

  return null
} 