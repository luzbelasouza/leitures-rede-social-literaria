'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { Home, Search, Plus, User, BookOpen, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  onPublishClick: () => void
}

export default function Sidebar({ onPublishClick }: SidebarProps) {
  const pathname = usePathname()
  const { user } = useAuth()

  if (!user) return null

  const navItems = [
    { href: '/feed', icon: Home, label: 'Início' },
    { href: '/descobrir', icon: Search, label: 'Descobrir' },
    { href: '/comunidade', icon: Users, label: 'Comunidade' },
    { href: '/perfil', icon: User, label: 'Perfil' },
  ]

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-stone-50 border-r border-stone-200 z-40 hidden lg:block">
      <div className="flex flex-col h-full p-6">
        {/* Logo */}
        <div className="mb-12">
          <Link href="/" className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-amber-600" />
            <span className="text-2xl font-bold text-stone-800">Leitures</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-3">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-stone-100',
                pathname === href 
                  ? 'bg-stone-800 text-white shadow-sm' 
                  : 'text-stone-600 hover:text-stone-800'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{label}</span>
            </Link>
          ))}

          {/* Publicar Button - Destacado */}
          <Button
            onClick={onPublishClick}
            className="w-full justify-start gap-4 mt-6 bg-amber-600 hover:bg-amber-700 text-white rounded-xl py-4 px-4 text-base font-medium shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Plus className="h-6 w-6" />
            <span>Publicar</span>
          </Button>
        </nav>

        {/* User Info */}
        <div className="mt-auto pt-6 border-t border-stone-200">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
              <span className="text-amber-800 font-semibold text-sm">
                {user.user_metadata?.name?.charAt(0) || user.email?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-stone-800 truncate">
                {user.user_metadata?.name || 'Usuário'}
              </p>
              <p className="text-xs text-stone-500 truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}