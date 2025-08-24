'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { UserPlus, UserCheck, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FollowButtonProps {
  userId: string
  isFollowing: boolean
  onFollowChange: (userId: string, isFollowing: boolean) => void
  className?: string
  size?: 'sm' | 'default' | 'lg'
}

export default function FollowButton({ 
  userId, 
  isFollowing, 
  onFollowChange, 
  className,
  size = 'sm'
}: FollowButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    try {
      await onFollowChange(userId, !isFollowing)
    } catch (error) {
      console.error('Erro ao alterar seguimento:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      size={size}
      variant={isFollowing ? "outline" : "default"}
      className={cn(
        "transition-all duration-200",
        isFollowing 
          ? "border-border dark:border-border-dark text-foreground dark:text-foreground-dark hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-700"
          : "bg-primary dark:bg-primary-dark text-primary-foreground dark:text-primary-foreground-dark hover:bg-primary/90 dark:hover:bg-primary-dark/90",
        className
      )}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isFollowing ? (
        <>
          <UserCheck className="h-4 w-4 mr-2" />
          Seguindo
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4 mr-2" />
          Seguir
        </>
      )}
    </Button>
  )
}