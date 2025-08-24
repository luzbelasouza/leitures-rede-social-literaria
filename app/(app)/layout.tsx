'use client'

import React, { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import MobileNav from '@/components/layout/MobileNav'
import TopBar from '@/components/layout/TopBar'
import PublishModal from '@/components/modals/PublishModal'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-stone-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Sidebar Desktop */}
      <Sidebar onPublishClick={() => setIsPublishModalOpen(true)} />
      
      {/* Main Content */}
      <div className="lg:ml-64">
        <TopBar />
        <main className="p-4 lg:p-8 pb-20 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav onPublishClick={() => setIsPublishModalOpen(true)} />

      {/* Publish Modal */}
      <PublishModal 
        isOpen={isPublishModalOpen} 
        onClose={() => setIsPublishModalOpen(false)} 
      />
    </div>
  )
}