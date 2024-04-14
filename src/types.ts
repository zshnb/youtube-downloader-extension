import type {MessageInstance} from "antd/es/message/interface";

export type DownloadMessage = {
  videoId: string
  target: 'video' | 'thumbnail' | 'subtitle'
  options?: DownloadThumbnailOptions | DownloadSubtitleOptions | DownloadVideoOptions
}

export type DownloadVideoOptions = {
  quality?: string
}

export type DownloadThumbnailOptions = {
  resolution: string
}

export type DownloadSubtitleOptions = {
  content: string
}

export type DownloadHooks = {
  currentUrl: string;
  messageApi: MessageInstance;
}

export type Setting = {
  showDownloadButton: boolean
  videoFormat: number
}