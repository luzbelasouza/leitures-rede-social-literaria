'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Award, Star, Flame, Users, BookOpen, Heart, Zap, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Badge as BadgeType } from '@/lib/types'

interface BadgeDisplayProps {
  badges: BadgeType[]
  maxVisible?: number
  size?: 'sm' | 'md' | 'lg'
  showTooltip?: boolean
}

const BADGE_ICONS = {
  'leitor-dedicado': BookOpen,
  'comentarista': Users,
  'influenciador': Star,
  'sequencia-leitura': Flame,
  'curador': Crown,
  'engajador': Heart,
  'descobridor': Zap,
  'veterano': Award
}

const BADGE_COLORS = {
  engagement: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800',
  consistency: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800',
  quality: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border-purple-200 dark:border-purple-800',
  community: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border-orange-200 dark:border-orange-800'
}

export default function BadgeDisplay({ 
  badges, 
  maxVisible = 3, 
  size = 'sm',
  showTooltip = true 
}: BadgeDisplayProps) {
  if (!badges || badges.length === 0) return null

  const visibleBadges = badges.slice(0, maxVisible)
  const remainingCount = badges.length - maxVisible

  const getBadgeIcon = (badgeId: string) => {
    const IconComponent = BADGE_ICONS[badgeId as keyof typeof BADGE_ICONS] || Award
    return IconComponent
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'lg':
        return 'text-sm px-3 py-1.5'
      case 'md':
        return 'text-xs px-2.5 py-1'
      case 'sm':
      default:
        return 'text-xs px-2 py-0.5'
    }
  }

  const getIconSize = () => {
    switch (size) {
      case 'lg':
        return 'h-4 w-4'
      case 'md':
        return 'h-3.5 w-3.5'
      case 'sm':
      default:
        return 'h-3 w-3'
    }
  }

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {visibleBadges.map((badge) => {
        const IconComponent = getBadgeIcon(badge.id)
        const colorClass = BADGE_COLORS[badge.category] || BADGE_COLORS.engagement

        return (
          <Badge
            key={badge.id}
            variant="secondary"
            className={cn(
              "flex items-center gap-1 rounded-full font-medium border transition-all duration-200 hover:scale-105",
              getSizeClasses(),
              colorClass
            )}
            title={showTooltip ? `${badge.name}: ${badge.description}` : undefined}
          >
            <IconComponent className={getIconSize()} />
            {size !== 'sm' && badge.name}
          </Badge>
        )
      })}

      {remainingCount > 0 && (
        <Badge
          variant="secondary"
          className={cn(
            "rounded-full bg-secondary dark:bg-secondary-dark text-muted-foreground dark:text-muted-foreground-dark border border-border dark:border-border-dark",
            getSizeClasses()
          )}
          title={`+${remainingCount} outras conquistas`}
        >
          +{remainingCount}
        </Badge>
      )}
    </div>
  )
}