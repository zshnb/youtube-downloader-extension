import {useState} from "react";
import {youtubeUtil} from "~util/youtubeUtil";
import {fetchSubtitle} from "~util/subtitleUtil";
import type {DownloadHooks, DownloadMessage} from "~types";

export default function useDownloadSubtitle({currentUrl, messageApi}: DownloadHooks) {
  const [loading, setLoading] = useState(false)
  const {getYouTubeVideoId} = youtubeUtil(currentUrl)
  async function handleDownloadSubtitle() {
    setLoading(true)
    try {
      const subtitle = await fetchSubtitle(getYouTubeVideoId(currentUrl))
      await chrome.runtime.sendMessage({
        videoId: getYouTubeVideoId(currentUrl),
        target: 'subtitle',
        options: {
          content: subtitle
        }
      } as DownloadMessage)
    } catch (error) {
      messageApi.error({
        content: 'download subtitle error, try later.'
      })
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    handleDownloadSubtitle
  }
}