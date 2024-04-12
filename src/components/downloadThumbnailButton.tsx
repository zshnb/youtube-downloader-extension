import {Button} from "antd";
import {PictureOutlined} from "@ant-design/icons";
import type {DownloadMessage} from "~types";
import {youtubeUtil} from "~util/youtubeUtil";
import {useState} from "react";
import type {MessageInstance} from "antd/es/message/interface";

export type DownloadThumbnailProps = {
  currentUrl: string
  messageApi: MessageInstance
  resolution: string
}
export default function DownloadThumbnailButton({currentUrl, messageApi, resolution}: DownloadThumbnailProps) {
  const {getYouTubeVideoId} = youtubeUtil(currentUrl)
  const [loading, setLoading] = useState<boolean>(false)
  async function handleDownloadThumbnail() {
    setLoading(true)
    const response = await chrome.runtime.sendMessage({
      videoId: getYouTubeVideoId(currentUrl),
      target: 'thumbnail',
      options: {
        resolution: resolution
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
  return (
    <Button icon={<PictureOutlined/>} onClick={handleDownloadThumbnail} loading={loading} shape={'circle'} type={'text'}></Button>
  )
}