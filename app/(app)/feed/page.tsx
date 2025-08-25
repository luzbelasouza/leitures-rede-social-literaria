'use client'

import React from 'react'
import PostCard from '@/components/posts/PostCard'
import { BookOpen } from 'lucide-react'

export default function FeedPage() {
  // Dados mock para demonstração
  const mockPosts = [
    {
      id: '1',
      user: {
        id: '1',
        name: 'Maria Silva',
        avatar_url: null,
        badges: [
          {
            id: 'leitor-dedicado',
            name: 'Leitor Dedicado',
            description: 'Postou mais de 10 trechos',
            icon: 'book',
            color: 'blue',
            earned_at: new Date().toISOString(),
            category: 'consistency'
          }
        ]
      },
      content: 'A vida é como andar de bicicleta. Para manter o equilíbrio, você deve continuar se movendo.',
      book_title: 'Einstein: Sua Vida e Seus Mundos',
      book_link: 'https://www.amazon.com.br/Einstein-Sua-Vida-Seus-Mundos/dp/8535926457',
      image_url: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=800',
      post_type: 'excerpt' as const,
      tags: ['biografia', 'ciência', 'filosofia'],
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 horas atrás
      likes_count: 12,
      comments_count: 3,
      is_liked: false,
      comments: [
        {
          id: 'comment-1',
          user_id: '2',
          post_id: '1',
          user: {
            id: '2',
            name: 'João Santos',
            avatar_url: null,
            badges: [
              {
                id: 'comentarista',
                name: 'Comentarista',
                description: 'Fez mais de 50 comentários',
                icon: 'message',
                color: 'green',
                earned_at: new Date().toISOString(),
                category: 'engagement'
              }
            ]
          },
          content: 'Que reflexão profunda! Einstein realmente tinha uma visão única sobre a vida.',
          created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          likes_count: 2,
          is_liked: false
        }
      ]
    },
    {
      id: '2',
      user: {
        id: '2',
        name: 'João Santos',
        avatar_url: null,
        badges: [
          {
            id: 'influenciador',
            name: 'Influenciador',
            description: 'Recebeu mais de 100 curtidas',
            icon: 'star',
            color: 'purple',
            earned_at: new Date().toISOString(),
            category: 'quality'
          }
        ]
      },
      content: 'Uma obra que revoluciona nossa perspectiva sobre produtividade e propósito. O autor apresenta conceitos profundos de forma acessível, questionando paradigmas estabelecidos sobre sucesso e felicidade.',
      book_title: 'A Sutil Arte de Ligar o F*da-se',
      book_link: null,
      image_url: 'https://images.pexels.com/photos/1029147/pexels-photo-1029147.jpeg?auto=compress&cs=tinysrgb&w=800',
      post_type: 'review' as const,
      tags: ['autoajuda', 'filosofia'],
      created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 horas atrás
      likes_count: 8,
      comments_count: 1,
      is_liked: true,
      comments: []
    },
    {
      id: '3',
      user: {
        id: '3',
        name: 'Ana Oliveira',
        avatar_url: null,
        badges: [
          {
            id: 'sequencia-leitura',
            name: 'Sequência de Leitura',
            description: 'Postou por 7 dias consecutivos',
            icon: 'flame',
            color: 'orange',
            earned_at: new Date().toISOString(),
            category: 'consistency'
          }
        ]
      },
      content: 'Gravei minha interpretação deste trecho emocionante sobre a evolução da humanidade...',
      book_title: 'Sapiens: Uma Breve História da Humanidade',
      book_link: 'https://www.amazon.com.br/Sapiens-Uma-breve-história-humanidade/dp/8525432180',
      image_url: 'https://images.pexels.com/photos/1029143/pexels-photo-1029143.jpeg?auto=compress&cs=tinysrgb&w=800',
      post_type: 'audio' as const,
      audio_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // URL de exemplo
      tags: ['história', 'antropologia', 'evolução'],
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 dia atrás
      likes_count: 25,
      comments_count: 7,
      is_liked: false,
      comments: []
    },
    {
      id: '4',
      user: {
        id: '4',
        name: 'Carlos Mendes',
        avatar_url: null,
        badges: [
          {
            id: 'curador',
            name: 'Curador',
            description: 'Compartilhou conteúdo de alta qualidade',
            icon: 'crown',
            color: 'gold',
            earned_at: new Date().toISOString(),
            category: 'quality'
          }
        ]
      },
      content: 'Criei esta ilustração inspirada na descrição poética do realismo mágico de García Márquez. As cores representam a mistura entre realidade e fantasia.',
      book_title: 'Cem Anos de Solidão',
      book_link: null,
      image_url: 'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=800',
      post_type: 'illustration' as const,
      tags: ['arte', 'realismo mágico', 'literatura'],
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 dias atrás
      likes_count: 42,
      comments_count: 15,
      is_liked: false,
      comments: []
    }
  ]

  return (
    <div className="feed-container">
      {/* Header do Feed */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground dark:text-foreground-dark mb-2 tracking-tight">
          Feed Literário
        </h1>
        <p className="text-muted-foreground dark:text-muted-foreground-dark leading-relaxed">
          Descubra trechos marcantes e novos livros
        </p>
      </div>

      {/* Lista de Posts */}
      <div>
        {mockPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-secondary dark:bg-secondary-dark w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-muted-foreground dark:text-muted-foreground-dark" />
            </div>
            <h3 className="text-xl font-serif font-semibold text-foreground dark:text-foreground-dark mb-2">
              Nenhum post ainda
            </h3>
            <p className="text-muted-foreground dark:text-muted-foreground-dark">
              Os posts da comunidade aparecerão aqui
            </p>
          </div>
        ) : (
          mockPosts.map((post) => (
  <PostCard 
    key={post.id} 
    {...post} 
    showSimilar={false}
    user={{
      ...post.user,
      avatar_url: post.user.avatar_url ?? "/default-avatar.png",
    }}
  />
))

        )}
      </div>
    </div>
  )
}