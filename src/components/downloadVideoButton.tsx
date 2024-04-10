import {Button} from "antd";
import {DownloadOutlined} from "@ant-design/icons";
import type {DownloadMessage} from "~types";
import {youtubeUtil} from "~util/youtubeUtil";
import {useState} from "react";
import type {MessageInstance} from "antd/es/message/interface";

export type DownloadButtonProps = {
  currentUrl: string
  messageApi: MessageInstance
}
export default function DownloadVideoButton({currentUrl, messageApi}: DownloadButtonProps) {
  const {getYouTubeVideoId} = youtubeUtil(currentUrl)
  const [loading, setLoading] = useState<boolean>(false)
  async function handleDownloadVideo() {
    setLoading(true)
    const response = await chrome.runtime.sendMessage({
      videoId: getYouTubeVideoId(currentUrl),
      target: 'video'
    } as DownloadMessage)
    console.log(`download video response: ${response}`)
    if (!response) {
      messageApi.error({
        content: 'download video error, try later.'
      })
    }
    setLoading(false)
  }
  return (
    <Button icon={<DownloadOutlined/>} onClick={handleDownloadVideo} loading={loading}>video</Button>
  )
}