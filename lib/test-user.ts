import { supabase } from './supabase'

export const createTestUser = async () => {
  // Se o Supabase não estiver configurado, apenas log sem erro
  if (!supabase) {
    console.log('🔧 Modo demonstração ativo - Supabase não configurado')
    console.log('📝 Para conectar ao Supabase, clique no botão "Connect to Supabase" no topo da tela')
    return
  }


  try {
    // Verificar se o usuário de teste já existe tentando fazer login
    const { data: existingUser, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'teste@teste.com',
      password: '123456'
    })

    if (existingUser.user && !loginError) {
      console.log('Usuário de teste já existe:', existingUser.user.email)
      await supabase.auth.signOut() // Fazer logout após verificação
      return existingUser.user
    }

    // Se não existe ou houve erro, tentar criar o usuário
    console.log('Criando usuário de teste...')
    const { data, error } = await supabase.auth.signUp({
      email: 'teste@teste.com',
      password: '123456',
      options: {
        data: {
          name: 'Usuário Teste'
        },
        emailRedirectTo: undefined, // Desabilita confirmação por email
        captcha: undefined
      }
    })

    if (error) {
      console.error('Erro ao criar usuário de teste:', error)
      // Se o usuário já existe, não é um erro crítico
      if (error.message?.includes('already registered')) {
        console.log('Usuário de teste já existe no sistema')
        return null
      }
      return null
    }

    if (data.user) {
      // Criar perfil do usuário
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          name: 'Usuário Teste',
          bio: 'Usuário de teste para demonstração do Leitures',
          avatar_url: null
        })

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError)
        // Não falhar se o perfil já existir
      }

      // Criar alguns posts de exemplo
      const samplePosts = [
        {
          user_id: data.user.id,
          content: 'A vida é como andar de bicicleta. Para manter o equilíbrio, você deve continuar se movendo.',
          book_title: 'Einstein: Sua Vida e Seus Mundos',
          book_link: 'https://www.amazon.com.br/Einstein-Sua-Vida-Seus-Mundos/dp/8535926457',
          image_url: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
        {
          user_id: data.user.id,
          content: 'Não é sobre ter tempo. É sobre fazer tempo.',
          book_title: 'A Sutil Arte de Ligar o F*da-se',
          book_link: null,
          image_url: 'https://images.pexels.com/photos/1029147/pexels-photo-1029147.jpeg?auto=compress&cs=tinysrgb&w=800'
        }
      ]

      const { error: postsError } = await supabase
        .from('posts')
        .insert(samplePosts)

      if (postsError) {
        console.error('Erro ao criar posts de exemplo:', postsError)
      }

      console.log('Usuário de teste criado com sucesso:', data.user.email)
      
      // Fazer logout após criar o usuário
      await supabase.auth.signOut()
      return data.user
    }

    return null
  } catch (error) {
    console.error('Erro ao criar usuário de teste:', error)
    return null
  }
}
