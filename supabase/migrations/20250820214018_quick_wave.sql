/*
  # Inserir dados de teste

  1. Test Data
    - Criar posts de exemplo para demonstração
    - Adicionar curtidas e comentários de teste
    - Popular o banco com conteúdo literário

  Nota: O usuário de teste será criado através do sistema de autenticação do Supabase
*/

-- Inserir posts de exemplo (serão associados ao usuário de teste após criação)
-- Estes dados serão inseridos via aplicação após o usuário de teste ser criado

-- Posts literários de exemplo para popular o feed
INSERT INTO posts (id, user_id, content, book_title, book_link, image_url, created_at) VALUES
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000', -- Placeholder, será atualizado
  'A vida é como andar de bicicleta. Para manter o equilíbrio, você deve continuar se movendo.',
  'Einstein: Sua Vida e Seus Mundos',
  'https://www.amazon.com.br/Einstein-Sua-Vida-Seus-Mundos/dp/8535926457',
  'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=800',
  now() - interval '2 hours'
) ON CONFLICT DO NOTHING;

-- Mais posts serão adicionados via aplicação