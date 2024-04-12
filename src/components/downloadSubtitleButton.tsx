import {Button} from "antd";
import {DownloadOutlined, FileWordOutlined} from "@ant-design/icons";
import type {DownloadMessage} from "~types";
import {youtubeUtil} from "~util/youtubeUtil";
import {useState} from "react";
import type {MessageInstance} from "antd/es/message/interface";
import {fetchSubtitle} from "~util/subtitleUtil";

export type DownloadSubtitleProps = {
  currentUrl: string
  messageApi: MessageInstance
}
export default function DownloadSubtitleButton({currentUrl, messageApi}: DownloadSubtitleProps) {
  const {getYouTubeVideoId} = youtubeUtil(currentUrl)
  const [loading, setLoading] = useState<boolean>(false)

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

  return (
    <Button icon={<FileWordOutlined/>} onClick={handleDownloadSubtitle} loading={loading} shape={'circle'} type={'text'}></Button>
  )
}