'use client'

import React, { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { BookOpen, Edit, Users } from 'lucide-react'
import { toast } from 'react-hot-toast'
import PostCard from '@/components/posts/PostCard'
import BadgeDisplay from '@/components/social/BadgeDisplay'
import FollowButton from '@/components/social/FollowButton'

export default function PerfilPage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user?.user_metadata?.name || '')
  const [bio, setBio] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Mock de badges do usuário
  const userBadges = [
    {
      id: 'leitor-dedicado',
      name: 'Leitor Dedicado',
      description: 'Postou mais de 10 trechos literários',
      icon: 'book',
      color: 'blue',
      earned_at: new Date().toISOString(),
      category: 'consistency' as const
    },
    {
      id: 'comentarista',
      name: 'Comentarista Ativo',
      description: 'Fez mais de 50 comentários construtivos',
      icon: 'message',
      color: 'green',
      earned_at: new Date().toISOString(),
      category: 'engagement' as const
    }
  ]

  const handleFollowChange = (userId: string, isFollowing: boolean) => {
    console.log('Seguir/Desseguir:', userId, isFollowing)
  }

  // Posts mock do usuário
  const userPosts = [
    {
      id: 'user-1',
      user: {
        id: user?.id || '1',
        name: user?.user_metadata?.name || 'Você',
        avatar_url: null,
        badges: userBadges
      },
      content: 'A única maneira de fazer um excelente trabalho é amar o que você faz.',
      book_title: 'Steve Jobs',
      book_link: null,
      image_url: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=800',
      created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      likes_count: 15,
      comments_count: 5,
      is_liked: false,
      comments: []
    }
  ]

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Aqui implementaremos a lógica para atualizar o perfil no Supabase
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Perfil atualizado com sucesso!')
      setIsEditing(false)
    } catch (error) {
      toast.error('Erro ao atualizar perfil')
    } finally {
      setIsLoading(false)
    }
  }

  const stats = {
    posts: userPosts.length,
    followers: 42 // Mock
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Header do Perfil */}
      <Card className="mb-8 border-stone-200 bg-white shadow-sm">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Avatar className="h-24 w-24 mx-auto md:mx-0">
              <AvatarImage src="" />
              <AvatarFallback className="bg-amber-100 text-amber-800 text-2xl">
                {user?.user_metadata?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome"
                      className="bg-white border-stone-200 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Conte um pouco sobre você e suas leituras favoritas..."
                      rows={3}
                      className="bg-white border-stone-200 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      size="sm"
                      disabled={isLoading}
                      className="bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      {isLoading ? 'Salvando...' : 'Salvar'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(false)}
                      className="border-stone-300 text-stone-700 hover:bg-stone-50"
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-stone-800">
                      {user?.user_metadata?.name || 'Usuário'}
                    </h1>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="hover:bg-stone-100 text-stone-600"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-stone-600 mb-4">
                    {bio || 'Apaixonado por literatura e compartilhamento de conhecimento.'}
                  </p>

                  {/* Badges do usuário */}
                  {userBadges.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-stone-700 mb-2">Conquistas</h3>
                      <BadgeDisplay badges={userBadges} maxVisible={4} size="md" />
                    </div>
                  )}
                  
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="mb-4 border-stone-300 text-stone-700 hover:bg-stone-50"
                  >
                    Editar Perfil
                  </Button>
                </>
              )}

              {/* Estatísticas */}
              <div className="flex justify-center md:justify-start gap-6 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 text-stone-800 font-semibold text-lg">
                    <BookOpen className="h-4 w-4" />
                    {stats.posts}
                  </div>
                  <span className="text-sm text-stone-600">Posts</span>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-stone-800 font-semibold text-lg">
                    <Users className="h-4 w-4" />
                    {stats.followers}
                  </div>
                  <span className="text-sm text-stone-600">Seguidores</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts do Usuário */}
      <div>
        <h2 className="text-xl font-semibold text-stone-800 mb-6">
          Meus Posts Literários
        </h2>
        
        <div className="max-w-2xl">
          {userPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-stone-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-stone-500" />
              </div>
              <h3 className="text-xl font-semibold text-stone-800 mb-2">
                Nenhum post ainda
              </h3>
              <p className="text-stone-600 mb-6">
                Compartilhe seu primeiro trecho literário
              </p>
              <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                Criar Primeiro Post
              </Button>
            </div>
          ) : (
            userPosts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}