'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { Home, Search, Plus, User, Users } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface MobileNavProps {
  onPublishClick: () => void
}

export default function MobileNav({ onPublishClick }: MobileNavProps) {
  const { user } = useAuth()
  const pathname = usePathname()

  if (!user) return null

  const navItems = [
    { href: '/feed', icon: Home, label: 'Início' },
    { href: '/descobrir', icon: Search, label: 'Descobrir' },
    { href: '/comunidade', icon: Users, label: 'Comunidade' },
    { href: '/perfil', icon: User, label: 'Perfil' },
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-border dark:border-border-dark">
      <div className="flex items-center justify-around py-2 px-2 safe-area-bottom">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-300 min-w-[60px] touch-target",
              pathname === href 
                ? "text-foreground dark:text-foreground-dark bg-secondary dark:bg-secondary-dark scale-105" 
                : "text-muted-foreground dark:text-muted-foreground-dark hover:text-foreground dark:hover:text-foreground-dark active:scale-95"
            )}
          >
            <Icon className={cn(
              "h-5 w-5 transition-all duration-300",
              pathname === href && "scale-110"
            )} />
            <span className={cn(
              "text-xs transition-all duration-300",
              pathname === href ? "font-semibold" : "font-normal"
            )}>{label}</span>
          </Link>
        ))}
        
        {/* Botão Publicar Mobile */}
        <Button
          onClick={onPublishClick}
          className="flex flex-col items-center gap-1 p-3 bg-primary dark:bg-primary-dark hover:bg-primary/90 dark:hover:bg-primary-dark/90 text-primary-foreground dark:text-primary-foreground-dark rounded-xl min-w-[60px] active:scale-95 transition-all duration-300 touch-target"
        >
          <Plus className="h-6 w-6" />
          <span className="text-xs font-semibold">Publicar</span>
        </Button>
      </div>
    </nav>
  )
}