export type DownloadMessage = {
  videoId: string
  target: 'video' | 'thumbnail' | 'subtitle'
  options?: DownloadThumbnailOptions | DownloadSubtitleOptions | DownloadVideoOptions
}

export type DownloadVideoOptions = {
  quality: string
}

export type DownloadThumbnailOptions = {
  resolution: string
}

export type DownloadSubtitleOptions = {
  content: string
}