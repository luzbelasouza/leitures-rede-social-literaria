/*
  # Criar tabela de posts literários

  1. New Tables
    - `posts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, referencia profiles.id)
      - `content` (text, trecho do livro)
      - `book_title` (text, título do livro)
      - `book_link` (text, link para o livro)
      - `image_url` (text, URL da imagem)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `posts` table
    - Add policy for users to read all posts
    - Add policy for users to create their own posts
    - Add policy for users to update/delete their own posts
*/

CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL CHECK (length(content) <= 500),
  book_title text,
  book_link text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policy para permitir que usuários vejam todos os posts
CREATE POLICY "Users can view all posts"
  ON posts
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy para permitir que usuários criem posts
CREATE POLICY "Users can create posts"
  ON posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy para permitir que usuários atualizem seus próprios posts
CREATE POLICY "Users can update own posts"
  ON posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy para permitir que usuários deletem seus próprios posts
CREATE POLICY "Users can delete own posts"
  ON posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);