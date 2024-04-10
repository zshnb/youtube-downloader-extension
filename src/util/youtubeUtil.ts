export function youtubeUtil(youtubeUrl: string) {
  function getYouTubeVideoId(link: string): string {
    const url = new URL(link)
    if (url.hostname === 'youtu.be') {
      return url.pathname.slice(1)
    } else if (
      url.hostname.toLowerCase() === 'www.youtube.com' ||
      url.hostname.toLowerCase() === 'm.youtube.com' ||
      url.hostname.toLowerCase() === 'youtube.com'
    ) {
      // https://*/live/i2w3WsceKrll
      const pathParts = url.pathname.split('/')
      if (['live', 'shorts'].includes(pathParts[1])) {
        return pathParts[2]
      }

      // https://*/*?v=i2w3WsceKrll
      const searchParams = new URLSearchParams(url.search)
      const id = searchParams.get('v')
      if (id) return id
    }
    return ''
  }

  return {
    getYouTubeVideoId
  }
}