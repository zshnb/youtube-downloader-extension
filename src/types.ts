export type DownloadMessage = {
  videoId: string
  target: 'video' | 'thumbnail' | 'subtitle'
  options?: DownloadThumbnailOptions | DownloadSubtitleOptions
}

export type DownloadThumbnailOptions = {
  resolution: string
}

export type DownloadSubtitleOptions = {
  content: string
}