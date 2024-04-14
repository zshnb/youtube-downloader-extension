import {useState} from "react";
import {youtubeUtil} from "~util/youtubeUtil";
import {fetchSubtitle} from "~util/subtitleUtil";
import type {DownloadHooks, DownloadMessage, SubtitleType} from "~types";

export default function useDownloadSubtitle({currentUrl, messageApi}: DownloadHooks) {
  const [loading, setLoading] = useState(false)
  const {getYouTubeVideoId} = youtubeUtil(currentUrl)
  async function handleDownloadSubtitle(type: SubtitleType) {
    setLoading(true)
    try {
      const subtitle = await fetchSubtitle(getYouTubeVideoId(currentUrl), {
        type
      })
      await chrome.runtime.sendMessage({
        videoId: getYouTubeVideoId(currentUrl),
        target: 'subtitle',
        options: {
          content: subtitle,
          type
        }
      } as DownloadMessage)
    } catch (error) {
      console.error('download subtitle error', error)
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