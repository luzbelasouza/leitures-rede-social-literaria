'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from './supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  signUp: (email: string, password: string, name: string) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Pegar sessão inicial
    const getSession = async () => {
      if (!supabase) {
        setLoading(false)
        return
      }
      
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    if (!supabase) {
      return
    }

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, name: string) => {
    if (!supabase) {
      // Modo de demonstração - simular cadastro bem-sucedido
      console.log('Modo demonstração: simulando cadastro para', email)
      const mockUser = {
        id: 'demo-user-' + Date.now(),
        email,
        user_metadata: {
          name
        }
      } as User
      
      setUser(mockUser)
      setSession({ user: mockUser } as Session)
      return { user: mockUser }
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        },
        emailRedirectTo: undefined, // Desabilita confirmação por email
        captcha: undefined
      }
    })

    if (error) throw error

    // Criar perfil do usuário
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          name,
          bio: '',
          avatar_url: null
        })

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError)
        // Não falhar se o perfil já existir
        if (profileError.code !== '23505') { // duplicate key error
          throw profileError
        }
      }
    }

    return data
  }

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      // Modo de demonstração - simular login bem-sucedido
      console.log('Modo demonstração: simulando login para', email)
      if (email === 'teste@teste.com' && password === '123456') {
        // Simular usuário logado
        const mockUser = {
          id: 'demo-user-id',
          email: 'teste@teste.com',
          user_metadata: {
            name: 'Usuário Teste'
          }
        } as User
        
        setUser(mockUser)
        setSession({ user: mockUser } as Session)
        return { user: mockUser }
      } else {
        throw new Error('Email ou senha incorretos')
      }
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.error('Erro de login:', error)
      throw new Error('Email ou senha incorretos')
    }
    return data
  }

  const signOut = async () => {
    if (!supabase) {
      // Modo de demonstração - simular logout
      console.log('Modo demonstração: fazendo logout')
      setUser(null)
      setSession(null)
      return
    }
    
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{
      user,
      session,
      signUp,
      signIn,
      signOut,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}