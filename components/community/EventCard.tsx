'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin,
  DollarSign,
  BookOpen,
  Mic,
  GraduationCap,
  Video
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import type { Event } from '@/lib/types'

interface EventCardProps extends Event {
  onRegister: (eventId: string) => void
  onUnregister: (eventId: string) => void
}

const EVENT_ICONS = {
  book_launch: BookOpen,
  author_talk: Mic,
  reading_session: Users,
  workshop: GraduationCap
}

const EVENT_COLORS = {
  book_launch: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
  author_talk: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
  reading_session: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20',
  workshop: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20'
}

const EVENT_LABELS = {
  book_launch: 'Lançamento',
  author_talk: 'Conversa com Autor',
  reading_session: 'Sessão de Leitura',
  workshop: 'Workshop'
}

export default function EventCard({
  id,
  title,
  description,
  type,
  date,
  duration,
  host,
  cover_image,
  is_free,
  price,
  max_participants,
  current_participants,
  is_registered,
  meeting_link,
  tags,
  onRegister,
  onUnregister
}: EventCardProps) {
  const Icon = EVENT_ICONS[type]
  const colorClass = EVENT_COLORS[type]
  const typeLabel = EVENT_LABELS[type]
  const eventDate = new Date(date)
  const isUpcoming = eventDate > new Date()
  const isFull = max_participants ? current_participants >= max_participants : false

  return (
    <Card className="hover-lift border-border dark:border-border-dark bg-card dark:bg-card-dark">
      {/* Imagem de capa */}
      {cover_image && (
        <div className="w-full h-48 overflow-hidden rounded-t-lg">
          <img
            src={cover_image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <CardHeader className="pb-4">
        <div className="flex items-start gap-3">
          <div className={cn("p-2 rounded-lg flex-shrink-0", colorClass)}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                {typeLabel}
              </Badge>
              {!is_free && (
                <Badge variant="outline" className="text-xs border-green-300 text-green-700 dark:border-green-700 dark:text-green-400">
                  R$ {price}
                </Badge>
              )}
              {is_free && (
                <Badge variant="outline" className="text-xs border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-400">
                  Gratuito
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg font-serif text-foreground dark:text-foreground-dark line-clamp-2">
              {title}
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark leading-relaxed line-clamp-3">
          {description}
        </p>

        {/* Informações do evento */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-foreground dark:text-foreground-dark">
            <Calendar className="h-4 w-4 text-muted-foreground dark:text-muted-foreground-dark" />
            <span>
              {format(eventDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground dark:text-foreground-dark">
            <Clock className="h-4 w-4 text-muted-foreground dark:text-muted-foreground-dark" />
            <span>
              {format(eventDate, "HH:mm", { locale: ptBR })} • {duration} min
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground dark:text-foreground-dark">
            <Video className="h-4 w-4 text-muted-foreground dark:text-muted-foreground-dark" />
            <span>Evento online</span>
          </div>
        </div>

        {/* Host */}
        <div className="flex items-center gap-3 p-3 bg-secondary/30 dark:bg-secondary-dark/30 rounded-lg">
          <Avatar className="h-10 w-10">
            <AvatarImage src={host.avatar_url} />
            <AvatarFallback className="bg-primary/10 dark:bg-primary-dark/10 text-primary dark:text-primary-dark">
              {host.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground dark:text-foreground-dark">
              {host.name}
            </p>
            {host.bio && (
              <p className="text-xs text-muted-foreground dark:text-muted-foreground-dark line-clamp-1">
                {host.bio}
              </p>
            )}
          </div>
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
              <span>
                {current_participants}
                {max_participants && `/${max_participants}`}
              </span>
            </div>
            {!isUpcoming && (
              <Badge variant="secondary" className="text-xs">
                Encerrado
              </Badge>
            )}
          </div>

          <Button
            onClick={() => is_registered ? onUnregister(id) : onRegister(id)}
            size="sm"
            variant={is_registered ? "outline" : "default"}
            disabled={!isUpcoming || (isFull && !is_registered)}
            className={cn(
              "transition-all duration-200",
              is_registered 
                ? "border-border dark:border-border-dark hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                : "bg-primary dark:bg-primary-dark text-primary-foreground dark:text-primary-foreground-dark",
              isFull && !is_registered && "opacity-50 cursor-not-allowed"
            )}
          >
            {!isUpcoming ? 'Encerrado' : 
             isFull && !is_registered ? 'Lotado' :
             is_registered ? 'Cancelar' : 'Inscrever-se'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}