'use client'

import React from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Star, Mic, Image, Heart } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface SimilarPost {
  id: string
  user: {
    id: string
    name: string
    avatar_url?: string
  }
  content: string
  book_title?: string
  post_type: 'excerpt' | 'review' | 'audio' | 'illustration'
  tags: string[]
  created_at: string
  likes_count: number
  image_url?: string
}

interface SimilarPostsProps {
  currentPostId: string
  currentTags: string[]
  currentBookTitle?: string
}

const POST_TYPE_ICONS = {
  excerpt: BookOpen,
  review: Star,
  audio: Mic,
  illustration: Image
}

const POST_TYPE_COLORS = {
  excerpt: 'text-blue-600 dark:text-blue-400',
  review: 'text-yellow-600 dark:text-yellow-400',
  audio: 'text-green-600 dark:text-green-400',
  illustration: 'text-purple-600 dark:text-purple-400'
}

export default function SimilarPosts({ currentPostId, currentTags, currentBookTitle }: SimilarPostsProps) {
  // Posts similares mockados baseados nas tags e livro atual
  const similarPosts: SimilarPost[] = [
    {
      id: 'similar-1',
      user: {
        id: 'user-1',
        name: 'Ana Silva',
        avatar_url: undefined
      },
      content: 'Uma reflexão profunda sobre a natureza humana e suas contradições...',
      book_title: 'Dom Casmurro',
      post_type: 'review',
      tags: ['clássico', 'literatura brasileira'],
      created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      likes_count: 15,
      image_url: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'similar-2',
      user: {
        id: 'user-2',
        name: 'Carlos Mendes',
        avatar_url: undefined
      },
      content: 'Gravei minha interpretação deste trecho emocionante...',
      book_title: 'O Pequeno Príncipe',
      post_type: 'audio',
      tags: ['filosofia', 'infantil'],
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      likes_count: 8
    },
    {
      id: 'similar-3',
      user: {
        id: 'user-3',
        name: 'Lucia Costa',
        avatar_url: undefined
      },
      content: 'Ilustração inspirada na descrição poética do autor...',
      book_title: 'Cem Anos de Solidão',
      post_type: 'illustration',
      tags: ['arte', 'realismo mágico'],
      created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      likes_count: 23,
      image_url: 'https://images.pexels.com/photos/1029147/pexels-photo-1029147.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ]

  // Filtrar posts que não sejam o atual
  const filteredPosts = similarPosts.filter(post => post.id !== currentPostId)

  if (filteredPosts.length === 0) {
    return null
  }

  const getTagColor = (tagName: string) => {
    const colors = [
      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
    ]
    return colors[tagName.length % colors.length]
  }

  return (
    <div className="mt-12 pt-8 border-t border-border dark:border-border-dark">
      <h3 className="text-xl font-serif font-semibold text-foreground dark:text-foreground-dark mb-6">
        Você também pode gostar de...
      </h3>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => {
          const Icon = POST_TYPE_ICONS[post.post_type]
          const iconColor = POST_TYPE_COLORS[post.post_type]
          
          return (
            <Card key={post.id} className="hover-lift cursor-pointer group border-border dark:border-border-dark bg-card dark:bg-card-dark">
              <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={post.user.avatar_url} />
                    <AvatarFallback className="bg-primary/10 dark:bg-primary-dark/10 text-primary dark:text-primary-dark text-xs">
                      {post.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground dark:text-foreground-dark truncate">
                      {post.user.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <Icon className={cn("h-3 w-3", iconColor)} />
                      <span className="text-xs text-muted-foreground dark:text-muted-foreground-dark">
                        {formatDistanceToNow(new Date(post.created_at), { 
                          addSuffix: true, 
                          locale: ptBR 
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Imagem */}
                {post.image_url && (
                  <div className="mb-3 rounded-lg overflow-hidden">
                    <img
                      src={post.image_url}
                      alt="Imagem do post"
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Conteúdo */}
                <div className="mb-3">
                  <p className="text-sm text-foreground dark:text-foreground-dark line-clamp-2 mb-2">
                    {post.content}
                  </p>
                  {post.book_title && (
                    <p className="text-xs font-medium text-muted-foreground dark:text-muted-foreground-dark">
                      — {post.book_title}
                    </p>
                  )}
                </div>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {post.tags.slice(0, 2).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full",
                          getTagColor(tag)
                        )}
                      >
                        #{tag}
                      </Badge>
                    ))}
                    {post.tags.length > 2 && (
                      <Badge
                        variant="secondary"
                        className="text-xs px-2 py-0.5 rounded-full bg-secondary dark:bg-secondary-dark text-muted-foreground dark:text-muted-foreground-dark"
                      >
                        +{post.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-muted-foreground dark:text-muted-foreground-dark">
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    <span>{post.likes_count}</span>
                  </div>
                  <Link
                    href={`/post/${post.id}`}
                    className="text-primary dark:text-primary-dark hover:text-primary/80 dark:hover:text-primary-dark/80 font-medium"
                  >
                    Ver mais
                  </Link>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}