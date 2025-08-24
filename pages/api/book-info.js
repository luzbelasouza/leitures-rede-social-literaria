export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { query } = req.body;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query é obrigatória' });
  }

  try {
    const isbn = extractISBN(query) || query.trim();
    console.log('[book-info] query =', query);
    console.log('[book-info] isbn/query usado =', isbn);

    const bookData = await fetchBookData(isbn);
    console.log('[book-info] source =', bookData?.source, 'ok =', !!bookData);

    if (!bookData) {
      return res.status(404).json({
        error: 'Livro não encontrado',
        message: 'Não foi possível encontrar informações para este livro.'
      });
    }

    return res.status(200).json(bookData);
  } catch (error) {
    console.error('[book-info] ERRO:', error);
    return res.status(500).json({ error: 'FETCH_FAILED', details: String(error) });
  }
}

function extractISBN(text) {
  // Regex robusta para extrair ISBN de URLs da Amazon ou texto
  const isbnRegex = /(?:ISBN(?:-1[03])?:?\s*)?((?:97[89][-\s]?)?\d{1,5}[-\s]?\d{1,7}[-\s]?\d{1,7}[-\s]?[\dX])/i;
  const m = text.match(isbnRegex);
  if (!m) return null;
  return m[1].replace(/[-\s]/g, '');
}

async function fetchBookData(query) {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  const baseUrl = 'https://www.googleapis.com/books/v1/volumes';
  const isISBN = /^\d{10}(\d{3})?$/.test(query.replace(/[-\s]/g, ''));
  const searchQuery = isISBN ? `isbn:${query}` : query;

  // Log de diagnóstico
  console.log('[book-info] tem GOOGLE_BOOKS_API_KEY ?', !!apiKey);
  
  if (!apiKey) {
    console.log('[book-info] GOOGLE_BOOKS_API_KEY ausente, usando fallback Open Library');
    if (isISBN) {
      return await fetchFromOpenLibrary(query);
    }
    return null;
  }

  try {
    const url = `${baseUrl}?q=${encodeURIComponent(searchQuery)}&key=${apiKey}`;
    console.log('[book-info] URL Google Books:', url);

    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('[book-info] Google Books status:', response.status);
      throw new Error(`Google Books status ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      console.log('[book-info] Google Books sem resultados, tentando Open Library');
      if (isISBN) {
        return await fetchFromOpenLibrary(query);
      }
      return null;
    }

    const book = data.items[0].volumeInfo;
    
    // Garantir HTTPS nas imagens
    const imageHttps = 
      book.imageLinks?.thumbnail?.replace('http:', 'https:') ||
      book.imageLinks?.smallThumbnail?.replace('http:', 'https:') ||
      null;

    return {
      title: book.title || 'Título não disponível',
      authors: book.authors || ['Autor não disponível'],
      description: book.description || '',
      imageUrl: imageHttps,
      publisher: book.publisher || '',
      publishedDate: book.publishedDate || '',
      averageRating: book.averageRating || null,
      ratingsCount: book.ratingsCount || null,
      pageCount: book.pageCount || null,
      categories: book.categories || [],
      isMock: false,
      source: 'google-books'
    };

  } catch (error) {
    console.error('[book-info] Google Books ERRO:', error);
    
    // Fallback para Open Library se for ISBN
    if (isISBN) {
      console.log('[book-info] Tentando fallback Open Library');
      return await fetchFromOpenLibrary(query);
    }
    
    return null;
  }
}

async function fetchFromOpenLibrary(isbn) {
  try {
    const cleanIsbn = isbn.replace(/[-\s]/g, '');
    const metaUrl = `https://openlibrary.org/isbn/${cleanIsbn}.json`;
    
    console.log('[book-info] URL Open Library:', metaUrl);
    
    const metaResponse = await fetch(metaUrl);
    
    if (!metaResponse.ok) {
      console.error('[book-info] Open Library status:', metaResponse.status);
      return null;
    }

    const meta = await metaResponse.json();
    
    // Buscar informações de autores se disponível
    let authors = ['Autor não disponível'];
    if (meta.authors && meta.authors.length > 0) {
      try {
        const authorPromises = meta.authors.slice(0, 3).map(async (author) => {
          const authorResponse = await fetch(`https://openlibrary.org${author.key}.json`);
          if (authorResponse.ok) {
            const authorData = await authorResponse.json();
            return authorData.name || 'Autor não disponível';
          }
          return 'Autor não disponível';
        });
        
        const resolvedAuthors = await Promise.all(authorPromises);
        authors = resolvedAuthors.filter(name => name !== 'Autor não disponível');
        if (authors.length === 0) authors = ['Autor não disponível'];
      } catch (e) {
        console.error('[book-info] Erro ao buscar autores:', e);
      }
    }

    return {
      title: meta.title || 'Título não disponível',
      authors: authors,
      description: typeof meta.description === 'string' 
        ? meta.description 
        : (meta.description?.value || ''),
      imageUrl: `https://covers.openlibrary.org/b/isbn/${cleanIsbn}-L.jpg`,
      publisher: meta.publishers?.[0] || '',
      publishedDate: meta.publish_date || '',
      averageRating: null,
      ratingsCount: null,
      pageCount: meta.number_of_pages || null,
      categories: meta.subjects?.slice(0, 3) || [],
      isMock: false,
      source: 'open-library'
    };

  } catch (error) {
    console.error('[book-info] Open Library ERRO:', error);
    return null;
  }
}