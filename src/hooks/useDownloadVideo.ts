import type {DownloadHooks, DownloadMessage} from "~types";
import {youtubeUtil} from "~util/youtubeUtil";
import {useState} from "react";

export default function useDownloadVideo({currentUrl, messageApi}: DownloadHooks) {
  const [loading, setLoading] = useState(false)
  const {getYouTubeVideoId} = youtubeUtil(currentUrl)
  async function handleDownloadVideo(quality?: string) {
    setLoading(true)
    const response = await chrome.runtime.sendMessage({
      videoId: getYouTubeVideoId(currentUrl),
      target: 'video',
      options: {
        quality
      }
    } as DownloadMessage)
    console.log(`download video response: ${response}`)
    if (response) {
      await chrome.downloads.download({
        url: response,
        filename: `${getYouTubeVideoId(currentUrl)}_${quality}.mp4`
      })
    } else {
      messageApi.error({
        content: 'download video error, try later.'
      })
    }
    setLoading(false)
  }

  return {
    loading,
    handleDownloadVideo
  }
}