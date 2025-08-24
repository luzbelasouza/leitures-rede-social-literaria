'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Trophy, 
  Users, 
  Calendar, 
  Target,
  BookOpen,
  MessageCircle,
  Heart
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import type { Challenge } from '@/lib/types'

interface ChallengeCardProps extends Challenge {
  onJoin: (challengeId: string) => void
  onLeave: (challengeId: string) => void
}

const CHALLENGE_ICONS = {
  reading: BookOpen,
  posting: MessageCircle,
  engagement: Heart
}

const CHALLENGE_COLORS = {
  reading: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
  posting: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
  engagement: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
}

export default function ChallengeCard({
  id,
  title,
  description,
  type,
  target,
  current_progress,
  start_date,
  end_date,
  reward_badge,
  participants_count,
  is_participating,
  tags,
  onJoin,
  onLeave
}: ChallengeCardProps) {
  const Icon = CHALLENGE_ICONS[type]
  const colorClass = CHALLENGE_COLORS[type]
  const progressPercentage = Math.min((current_progress / target) * 100, 100)
  const isCompleted = current_progress >= target
  const daysLeft = Math.ceil((new Date(end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  const getTypeLabel = (type: string) => {
    const labels = {
      reading: 'Leitura',
      posting: 'Publicação',
      engagement: 'Engajamento'
    }
    return labels[type as keyof typeof labels] || type
  }

  return (
    <Card className="hover-lift border-border dark:border-border-dark bg-card dark:bg-card-dark">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg", colorClass)}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-serif text-foreground dark:text-foreground-dark">
                {title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {getTypeLabel(type)}
                </Badge>
                {daysLeft > 0 ? (
                  <span className="text-xs text-muted-foreground dark:text-muted-foreground-dark">
                    {daysLeft} dias restantes
                  </span>
                ) : (
                  <span className="text-xs text-red-500">
                    Encerrado
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {reward_badge && (
            <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
              <Trophy className="h-4 w-4" />
              <span className="text-xs font-medium">Recompensa</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark leading-relaxed">
          {description}
        </p>

        {/* Progresso */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground dark:text-foreground-dark font-medium">
              Progresso
            </span>
            <span className="text-muted-foreground dark:text-muted-foreground-dark">
              {current_progress}/{target}
            </span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-2"
          />
          {isCompleted && (
            <p className="text-xs text-green-600 dark:text-green-400 font-medium">
              ✅ Desafio concluído!
            </p>
          )}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs px-2 py-0.5 border-border dark:border-border-dark"
              >
                #{tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border dark:border-border-dark">
          <div className="flex items-center gap-4 text-sm text-muted-foreground dark:text-muted-foreground-dark">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{participants_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                {formatDistanceToNow(new Date(end_date), { 
                  addSuffix: true, 
                  locale: ptBR 
                })}
              </span>
            </div>
          </div>

          <Button
            onClick={() => is_participating ? onLeave(id) : onJoin(id)}
            size="sm"
            variant={is_participating ? "outline" : "default"}
            disabled={daysLeft <= 0}
            className={cn(
              "transition-all duration-200",
              is_participating 
                ? "border-border dark:border-border-dark hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                : "bg-primary dark:bg-primary-dark text-primary-foreground dark:text-primary-foreground-dark"
            )}
          >
            {is_participating ? 'Sair' : 'Participar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}