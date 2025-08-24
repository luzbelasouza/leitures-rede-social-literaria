'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Users, 
  Calendar, 
  BookOpen,
  Lock,
  Globe,
  Clock
} from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import type { BookClub } from '@/lib/types'

interface BookClubCardProps extends BookClub {
  onJoin: (clubId: string) => void
  onLeave: (clubId: string) => void
}

export default function BookClubCard({
  id,
  name,
  description,
  cover_image,
  current_book,
  members_count,
  is_member,
  is_private,
  created_at,
  next_meeting,
  reading_schedule,
  onJoin,
  onLeave
}: BookClubCardProps) {
  return (
    <Card className="hover-lift border-border dark:border-border-dark bg-card dark:bg-card-dark">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          {/* Capa do clube ou livro atual */}
          <div className="flex-shrink-0">
            {current_book?.cover_url ? (
              <img
                src={current_book.cover_url}
                alt={`Capa de ${current_book.title}`}
                className="w-16 h-20 object-cover rounded-lg shadow-sm"
              />
            ) : cover_image ? (
              <img
                src={cover_image}
                alt={`Capa do clube ${name}`}
                className="w-16 h-20 object-cover rounded-lg shadow-sm"
              />
            ) : (
              <div className="w-16 h-20 bg-primary/10 dark:bg-primary-dark/10 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary dark:text-primary-dark" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg font-serif text-foreground dark:text-foreground-dark truncate">
                {name}
              </CardTitle>
              {is_private ? (
                <Lock className="h-4 w-4 text-muted-foreground dark:text-muted-foreground-dark" />
              ) : (
                <Globe className="h-4 w-4 text-muted-foreground dark:text-muted-foreground-dark" />
              )}
            </div>

            <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark line-clamp-2 mb-3">
              {description}
            </p>

            {current_book && (
              <div className="mb-3">
                <p className="text-xs text-muted-foreground dark:text-muted-foreground-dark mb-1">
                  Leitura atual:
                </p>
                <p className="text-sm font-medium text-foreground dark:text-foreground-dark">
                  {current_book.title}
                </p>
                <p className="text-xs text-muted-foreground dark:text-muted-foreground-dark">
                  por {current_book.author}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Próximo encontro */}
        {next_meeting && (
          <div className="bg-secondary/30 dark:bg-secondary-dark/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-primary dark:text-primary-dark" />
              <span className="text-sm font-medium text-foreground dark:text-foreground-dark">
                Próximo Encontro
              </span>
            </div>
            <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
              {format(new Date(next_meeting), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
            </p>
          </div>
        )}

        {/* Cronograma de leitura */}
        {reading_schedule && reading_schedule.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground dark:text-foreground-dark flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Cronograma
            </h4>
            <div className="space-y-1">
              {reading_schedule.slice(0, 2).map((schedule, index) => (
                <div key={index} className="text-xs text-muted-foreground dark:text-muted-foreground-dark">
                  <span className="font-medium">Semana {schedule.week}:</span> {schedule.chapters}
                </div>
              ))}
              {reading_schedule.length > 2 && (
                <p className="text-xs text-muted-foreground dark:text-muted-foreground-dark">
                  +{reading_schedule.length - 2} semanas mais...
                </p>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border dark:border-border-dark">
          <div className="flex items-center gap-4 text-sm text-muted-foreground dark:text-muted-foreground-dark">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{members_count} membros</span>
            </div>
            <Badge 
              variant="outline" 
              className="text-xs border-border dark:border-border-dark"
            >
              {is_private ? 'Privado' : 'Público'}
            </Badge>
          </div>

          <Button
            onClick={() => is_member ? onLeave(id) : onJoin(id)}
            size="sm"
            variant={is_member ? "outline" : "default"}
            className={cn(
              "transition-all duration-200",
              is_member 
                ? "border-border dark:border-border-dark hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                : "bg-primary dark:bg-primary-dark text-primary-foreground dark:text-primary-foreground-dark"
            )}
          >
            {is_member ? 'Sair' : 'Entrar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}