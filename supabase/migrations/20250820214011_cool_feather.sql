/*
  # Criar tabela de curtidas

  1. New Tables
    - `likes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, referencia profiles.id)
      - `post_id` (uuid, referencia posts.id)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `likes` table
    - Add policies for CRUD operations
    - Add unique constraint to prevent duplicate likes
*/

CREATE TABLE IF NOT EXISTS likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, post_id)
);

ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Policy para permitir que usuários vejam todas as curtidas
CREATE POLICY "Users can view all likes"
  ON likes
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy para permitir que usuários curtam posts
CREATE POLICY "Users can create likes"
  ON likes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy para permitir que usuários removam suas próprias curtidas
CREATE POLICY "Users can delete own likes"
  ON likes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);