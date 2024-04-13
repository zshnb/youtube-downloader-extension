import type {DownloadHooks, DownloadMessage} from "~types";
import {youtubeUtil} from "~util/youtubeUtil";
import {useState} from "react";

export default function useDownloadThumbnail({currentUrl, messageApi}: DownloadHooks) {
  const [loading, setLoading] = useState(false)
  const {getYouTubeVideoId} = youtubeUtil(currentUrl)
  async function handleDownloadThumbnail() {
    setLoading(true)
    const response = await chrome.runtime.sendMessage({
      videoId: getYouTubeVideoId(currentUrl),
      target: 'thumbnail',
      options: {
        resolution: 'maxresdefault'
      }
    } as DownloadMessage)
    console.log(`download thumbnail response: ${response}`)
    if (!response) {
      messageApi.error({
        content: 'download thumbnail error, try later.'
      })
    }
    setLoading(false)
  }

  return {
    loading,
    handleDownloadThumbnail
  }
}