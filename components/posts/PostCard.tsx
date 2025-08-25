'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Heart, MessageCircle, Share2, ExternalLink, BookOpen, Star, Mic, Image as ImageIcon, Play, Pause } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import CommentSection from './CommentSection'
import BadgeDisplay from '@/components/social/BadgeDisplay'
import SimilarPosts from './SimilarPosts'
import ShareCard from '@/components/social/ShareCard'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Comment } from '@/lib/types'

interface PostProps {
  id: string
  user: {
    id: string
    name: string
    // ✅ Corrigido: permite string, null ou undefined
    avatar_url?: string | null 
    badges?: any[]
  }
  content: string
  book_title?: string
  book_link?: string
  image_url?: string
  post_type?: 'excerpt' | 'review' | 'audio' | 'illustration'
  audio_url?: string
  tags?: string[]
  created_at: string
  likes_count: number
  comments_count: number
  is_liked: boolean
  comments?: Comment[]
  showSimilar?: boolean
  showComments?: boolean
}


const POST_TYPE_CONFIG = {
  excerpt: {
    icon: BookOpen,
    label: 'Trecho',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20'
  },
  review: {
    icon: Star,
    label: 'Resenha',
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
  },
  audio: {
    icon: Mic,
    label: 'Áudio',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-900/20'
  },
  illustration: {
    icon: ImageIcon,
    label: 'Ilustração',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20'
  }
}

export default function PostCard({
  id,
  user,
  content,
  book_title,
  book_link,
  image_url,
  post_type = 'excerpt',
  audio_url,
  tags = [],
  created_at,
  likes_count = 0,
  comments_count = 0,
  is_liked = false,
  comments = [],
  showSimilar = false,
  showComments = true
}: PostProps) {
  const [liked, setLiked] = useState(is_liked)
  const [likesCount, setLikesCount] = useState(likes_count)
  const [commentsData, setCommentsData] = useState<Comment[]>(comments)
  const [commentsCount, setCommentsCount] = useState(comments_count)
  const [showCommentsSection, setShowCommentsSection] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)

  const handleLike = async () => {
    // Aqui implementaremos a lógica de curtir
    setLiked(!liked)
    setLikesCount(prev => liked ? prev - 1 : prev + 1)
  }

  const handleAddComment = async (content: string) => {
    // Simular adição de comentário
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      user_id: 'current-user',
      post_id: id,
      user: {
        id: 'current-user',
        name: 'Você',
        avatar_url: undefined,
        badges: []
      },
      content,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      likes_count: 0,
      is_liked: false
    }
    
    setCommentsData(prev => [newComment, ...prev])
    setCommentsCount(prev => prev + 1)
  }

  const handleLikeComment = async (commentId: string) => {
    setCommentsData(prev => prev.map(comment => 
      comment.id === commentId 
        ? { 
            ...comment, 
            is_liked: !comment.is_liked,
            likes_count: comment.is_liked ? comment.likes_count - 1 : comment.likes_count + 1
          }
        : comment
    ))
  }

  const handlePlayAudio = () => {
    if (!audio_url) return

    if (!audioRef) {
      const audio = new Audio(audio_url)
      audio.onended = () => setIsPlayingAudio(false)
      audio.onpause = () => setIsPlayingAudio(false)
      setAudioRef(audio)
      audio.play()
      setIsPlayingAudio(true)
    } else {
      if (isPlayingAudio) {
        audioRef.pause()
        setIsPlayingAudio(false)
      } else {
        audioRef.play()
        setIsPlayingAudio(true)
      }
    }
  }

  const handleShare = async () => {
    setShowShareModal(true)
  }

  const typeConfig = POST_TYPE_CONFIG[post_type]
  const TypeIcon = typeConfig.icon

  const getTagColor = (tagName: string) => {
    const colors = [
      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
      'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    ]
    return colors[tagName.length % colors.length]
  }

  return (
    <>
      <article className="post-card mb-8">
        {/* Header do post */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar_url} />
            <AvatarFallback className="bg-primary/10 dark:bg-primary-dark/10 text-primary dark:text-primary-dark">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-foreground dark:text-foreground-dark">{user.name}</p>
              
              {/* Badges do usuário */}
              {user.badges && user.badges.length > 0 && (
                <BadgeDisplay badges={user.badges} maxVisible={2} size="sm" />
              )}
              
              <div className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                typeConfig.bgColor
              )}>
                <TypeIcon className={cn("h-3 w-3", typeConfig.color)} />
                <span className={typeConfig.color}>{typeConfig.label}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
              {formatDistanceToNow(new Date(created_at), { 
                addSuffix: true, 
                locale: ptBR 
              })}
            </p>
          </div>
        </div>

        {/* Player de áudio */}
        {post_type === 'audio' && audio_url && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3">
              <Button
                onClick={handlePlayAudio}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white rounded-full w-10 h-10 p-0"
              >
                {isPlayingAudio ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  {isPlayingAudio ? 'Reproduzindo áudio...' : 'Clique para ouvir'}
                </p>
                <p className="text-xs text-green-600 dark:text-green-300">
                  Gravação de {user.name}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Imagem do post */}
        {image_url && (
          <div className="mb-6 rounded-lg overflow-hidden">
            <img
              src={image_url}
              alt={post_type === 'illustration' ? 'Ilustração compartilhada' : 'Imagem do post'}
              className="w-full aspect-[4/3] object-cover"
            />
          </div>
        )}

        {/* Conteúdo do post */}
        <div className="mb-6">
          {post_type === 'excerpt' ? (
            <blockquote className="text-foreground dark:text-foreground-dark text-lg md:text-xl leading-7 italic border-l-4 border-accent dark:border-accent-dark pl-6 mb-6 font-serif">
              "{content}"
            </blockquote>
          ) : (
            <div className="text-foreground dark:text-foreground-dark text-base md:text-lg leading-relaxed mb-6">
              {content}
            </div>
          )}

          {book_title && (
            <div className="flex items-center gap-2 text-muted-foreground dark:text-muted-foreground-dark mb-4">
              <span className="font-medium">— {book_title}</span>
              {book_link && (
                <Link 
                  href={book_link} 
                  target="_blank"
                  className="inline-flex items-center gap-1 text-accent dark:text-accent-dark hover:text-accent/80 dark:hover:text-accent-dark/80 transition-colors font-medium"
                >
                  Ler mais
                  <ExternalLink className="h-3 w-3" />
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className={cn(
                  "text-xs px-3 py-1 rounded-full font-medium hover:scale-105 transition-transform cursor-pointer",
                  getTagColor(tag)
                )}
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Ações do post */}
        <div className="flex items-center justify-between pt-6 border-t border-border dark:border-border-dark">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={cn(
                "flex items-center gap-2 hover:bg-secondary dark:hover:bg-secondary-dark px-3 py-2 rounded-lg transition-all duration-300 touch-target",
                liked ? "text-red-500 hover:text-red-600" : "text-muted-foreground dark:text-muted-foreground-dark hover:text-foreground dark:hover:text-foreground-dark"
              )}
            >
              <Heart className={cn("h-5 w-5 transition-all duration-300", liked && "fill-current")} />
              <span className="font-medium">{likesCount}</span>
            </Button>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowCommentsSection(!showCommentsSection)}
              className="flex items-center gap-2 hover:bg-secondary dark:hover:bg-secondary-dark px-3 py-2 rounded-lg transition-all duration-300 text-muted-foreground dark:text-muted-foreground-dark hover:text-foreground dark:hover:text-foreground-dark touch-target"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="font-medium">{commentsCount}</span>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="flex items-center gap-2 hover:bg-secondary dark:hover:bg-secondary-dark px-3 py-2 rounded-lg transition-all duration-300 text-muted-foreground dark:text-muted-foreground-dark hover:text-foreground dark:hover:text-foreground-dark touch-target"
          >
            <Share2 className="h-5 w-5" />
            <span className="font-medium">Compartilhar</span>
          </Button>
        </div>

        {/* Modal de Compartilhamento */}
        <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-serif text-foreground dark:text-foreground-dark">
                Compartilhar Post
              </DialogTitle>
            </DialogHeader>
            <ShareCard
              content={content}
              bookTitle={book_title}
              authorName={user.name}
              postType={post_type}
              imageUrl={image_url}
            />
          </DialogContent>
        </Dialog>

        {/* Seção de comentários */}
        {showComments && showCommentsSection && (
          <div className="mt-6 pt-6 border-t border-border dark:border-border-dark">
            <CommentSection
              postId={id}
              comments={commentsData}
              onAddComment={handleAddComment}
              onLikeComment={handleLikeComment}
            />
          </div>
        )}
      </article>

      {/* Posts similares */}
      {showSimilar && (
        <SimilarPosts
          currentPostId={id}
          currentTags={tags}
          currentBookTitle={book_title}
        />
      )}
    </>
  )
}