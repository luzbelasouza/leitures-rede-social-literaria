'use client'

import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Heart, MessageCircle, Send, Award } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import type { Comment } from '@/lib/types'

interface CommentSectionProps {
  postId: string
  comments: Comment[]
  onAddComment: (content: string) => void
  onLikeComment: (commentId: string) => void
}

export default function CommentSection({ 
  postId, 
  comments, 
  onAddComment, 
  onLikeComment 
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAllComments, setShowAllComments] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      await onAddComment(newComment.trim())
      setNewComment('')
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const visibleComments = showAllComments ? comments : comments.slice(0, 3)
  const hasMoreComments = comments.length > 3

  const getBadgeColor = (category: string) => {
    const colors = {
      engagement: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      consistency: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      quality: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      community: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    }
    return colors[category as keyof typeof colors] || colors.engagement
  }

  return (
    <div className="space-y-6">
      {/* Formulário de novo comentário */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          placeholder="Compartilhe suas impressões sobre este trecho..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
          maxLength={300}
          className="resize-none bg-input dark:bg-input border-border dark:border-border-dark focus:border-primary dark:focus:border-primary-dark"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground dark:text-muted-foreground-dark">
            {newComment.length}/300 caracteres
          </span>
          <Button
            type="submit"
            size="sm"
            disabled={!newComment.trim() || isSubmitting}
            className="bg-primary dark:bg-primary-dark hover:bg-primary/90 dark:hover:bg-primary-dark/90 text-primary-foreground dark:text-primary-foreground-dark"
          >
            {isSubmitting ? (
              'Enviando...'
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Comentar
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Lista de comentários */}
      {comments.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-foreground dark:text-foreground-dark flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            {comments.length} {comments.length === 1 ? 'Comentário' : 'Comentários'}
          </h4>

          <div className="space-y-4">
            {visibleComments.map((comment) => (
              <div key={comment.id} className="flex gap-3 p-4 bg-secondary/30 dark:bg-secondary-dark/30 rounded-lg">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={comment.user.avatar_url} />
                  <AvatarFallback className="bg-primary/10 dark:bg-primary-dark/10 text-primary dark:text-primary-dark text-xs">
                    {comment.user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-sm text-foreground dark:text-foreground-dark">
                      {comment.user.name}
                    </span>
                    
                    {/* Badges do usuário */}
                    {comment.user.badges && comment.user.badges.length > 0 && (
                      <div className="flex gap-1">
                        {comment.user.badges.slice(0, 2).map((badge) => (
                          <Badge
                            key={badge.id}
                            variant="secondary"
                            className={cn(
                              "text-xs px-2 py-0.5 rounded-full flex items-center gap-1",
                              getBadgeColor(badge.category)
                            )}
                            title={badge.description}
                          >
                            <Award className="h-3 w-3" />
                            {badge.name}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <span className="text-xs text-muted-foreground dark:text-muted-foreground-dark">
                      {formatDistanceToNow(new Date(comment.created_at), { 
                        addSuffix: true, 
                        locale: ptBR 
                      })}
                    </span>
                  </div>

                  <p className="text-sm text-foreground dark:text-foreground-dark leading-relaxed mb-3">
                    {comment.content}
                  </p>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onLikeComment(comment.id)}
                    className={cn(
                      "h-8 px-2 text-xs hover:bg-secondary dark:hover:bg-secondary-dark",
                      comment.is_liked 
                        ? "text-red-500 hover:text-red-600" 
                        : "text-muted-foreground dark:text-muted-foreground-dark hover:text-foreground dark:hover:text-foreground-dark"
                    )}
                  >
                    <Heart className={cn("h-3 w-3 mr-1", comment.is_liked && "fill-current")} />
                    {comment.likes_count}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Botão para mostrar mais comentários */}
          {hasMoreComments && !showAllComments && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllComments(true)}
              className="text-primary dark:text-primary-dark hover:text-primary/80 dark:hover:text-primary-dark/80"
            >
              Ver mais {comments.length - 3} comentários
            </Button>
          )}
        </div>
      )}
    </div>
  )
}