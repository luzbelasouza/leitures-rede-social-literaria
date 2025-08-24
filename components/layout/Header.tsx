'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { useTheme } from '@/lib/theme'
import { Button } from '@/components/ui/button'
import { BookOpen, User, PlusCircle, LogOut, Sun, Moon, Monitor, Bell } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import NotificationCenter from '@/components/social/NotificationCenter'
import type { Notification } from '@/lib/types'

export default function Header() {
  const { user, signOut } = useAuth()
  const { theme, setTheme } = useTheme()

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />
      case 'dark':
        return <Moon className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  // Mock de notificações para demonstração
  const mockNotifications: Notification[] = [
    {
      id: '1',
      user_id: user?.id || '',
      type: 'like',
      title: 'Nova curtida',
      message: 'Maria Silva curtiu seu trecho de "Einstein: Sua Vida e Seus Mundos"',
      data: { postId: '1', userId: 'maria-silva' },
      read: false,
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      user_id: user?.id || '',
      type: 'comment',
      title: 'Novo comentário',
      message: 'João Santos comentou: "Que reflexão profunda sobre a vida!"',
      data: { postId: '2', commentId: 'comment-1' },
      read: false,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      user_id: user?.id || '',
      type: 'badge',
      title: 'Nova conquista!',
      message: 'Você ganhou a insígnia "Leitor Dedicado" por postar 10 trechos',
      data: { badgeId: 'leitor-dedicado' },
      read: true,
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    }
  ]

  const unreadCount = mockNotifications.filter(n => !n.read).length

  const handleMarkAsRead = (notificationId: string) => {
    // Implementar lógica de marcar como lida
    console.log('Marcar como lida:', notificationId)
  }

  const handleMarkAllAsRead = () => {
    // Implementar lógica de marcar todas como lidas
    console.log('Marcar todas como lidas')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border dark:border-border-dark bg-background/95 dark:bg-background-dark/95 backdrop-blur-md mobile-safe-area">
      <div className="flex items-center justify-between px-4 py-3 max-w-full">
        <Link href="/" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 md:h-8 md:w-8 text-primary dark:text-primary-dark" />
          <span className="font-serif font-bold text-xl md:text-2xl text-foreground dark:text-foreground-dark">Leitures</span>
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            {/* Botão de tema */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="touch-target">
                  {getThemeIcon()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card dark:bg-card-dark border-border dark:border-border-dark">
                <DropdownMenuItem 
                  onClick={() => setTheme('light')}
                  className="flex items-center gap-2 text-foreground dark:text-foreground-dark hover:bg-muted dark:hover:bg-muted-dark"
                >
                  <Sun className="h-4 w-4" />
                  Claro
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setTheme('dark')}
                  className="flex items-center gap-2 text-foreground dark:text-foreground-dark hover:bg-muted dark:hover:bg-muted-dark"
                >
                  <Moon className="h-4 w-4" />
                  Escuro
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setTheme('system')}
                  className="flex items-center gap-2 text-foreground dark:text-foreground-dark hover:bg-muted dark:hover:bg-muted-dark"
                >
                  <Monitor className="h-4 w-4" />
                  Sistema
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Centro de notificações */}
            <NotificationCenter
              notifications={mockNotifications}
              unreadCount={unreadCount}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
            />

            {/* Botão de criar post sempre visível no mobile */}
            <Button variant="ghost" size="sm" asChild className="md:hidden touch-target">
              <Link href="/criar-post">
                <PlusCircle className="h-5 w-5" />
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative rounded-full tap-highlight-none touch-target">
                  <Avatar className="h-8 w-8 md:h-10 md:w-10">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary/10 dark:bg-primary-dark/10 text-primary dark:text-primary-dark">
                      {user.user_metadata.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card dark:bg-card-dark border-border dark:border-border-dark">
                <DropdownMenuItem asChild className="md:hidden">
                  <Link href="/criar-post" className="flex items-center gap-2 text-foreground dark:text-foreground-dark hover:bg-muted dark:hover:bg-muted-dark">
                    <PlusCircle className="h-4 w-4" />
                    Novo Post
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="md:hidden bg-border dark:bg-border-dark" />
                <DropdownMenuItem asChild>
                  <Link href="/perfil" className="flex items-center gap-2 text-foreground dark:text-foreground-dark hover:bg-muted dark:hover:bg-muted-dark">
                    <User className="h-4 w-4" />
                    Meu Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()} className="text-destructive dark:text-destructive-dark hover:bg-destructive/10 dark:hover:bg-destructive-dark/10">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {/* Botão de tema para usuários não logados */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="touch-target">
                  {getThemeIcon()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card dark:bg-card-dark border-border dark:border-border-dark">
                <DropdownMenuItem 
                  onClick={() => setTheme('light')}
                  className="flex items-center gap-2 text-foreground dark:text-foreground-dark hover:bg-muted dark:hover:bg-muted-dark"
                >
                  <Sun className="h-4 w-4" />
                  Claro
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setTheme('dark')}
                  className="flex items-center gap-2 text-foreground dark:text-foreground-dark hover:bg-muted dark:hover:bg-muted-dark"
                >
                  <Moon className="h-4 w-4" />
                  Escuro
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setTheme('system')}
                  className="flex items-center gap-2 text-foreground dark:text-foreground-dark hover:bg-muted dark:hover:bg-muted-dark"
                >
                  <Monitor className="h-4 w-4" />
                  Sistema
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="ghost" size="sm" asChild className="tap-highlight-none touch-target">
              <Link href="/login">Entrar</Link>
            </Button>
            <Button size="sm" asChild className="tap-highlight-none touch-target btn-editorial">
              <Link href="/cadastro">Cadastrar</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}