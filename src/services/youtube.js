const YOUTUBE_API_KEY = 'AIzaSyCwJ2inzyVwn6iGcWcOQV0FrsAJInW_XSg';

const unescapeHtml = (text) => {
  if (!text) return '';
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#039;/g, "'");
};

export const searchYouTube = async (query) => {
  if (!query) return [];

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(query)}&type=video&key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Error de YouTube API (${response.status})`);
    }

    const data = await response.json();

    return data.items.map(item => ({
      id: item.id.videoId,
      title: unescapeHtml(item.snippet.title),
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
      author: unescapeHtml(item.snippet.channelTitle),
      lengthSeconds: 0 
    }));
  } catch (err) {
    console.error('Error al buscar en YouTube API:', err);
    throw new Error('No se pudo buscar en YouTube: ' + err.message);
  }
};
