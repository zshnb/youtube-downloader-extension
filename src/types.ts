export type DownloadMessage = {
  videoId: string
  target: 'video' | 'thumbnail' | 'subtitle'
}