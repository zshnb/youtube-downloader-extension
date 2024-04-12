import {Flex, List, type ListProps, Typography} from "antd";
import type {DownloadMessage} from "~types";
import {youtubeUtil} from "~util/youtubeUtil";
import type {MessageInstance} from "antd/es/message/interface";

export interface VideoDownloadListProps extends ListProps<any> {
  currentUrl: string
  messageApi: MessageInstance
}
export default function VideoDownloadList({currentUrl, messageApi, ...props}: VideoDownloadListProps) {
  const items = ['720p', '1080p', '360p', '480p']
  const {getYouTubeVideoId} = youtubeUtil(currentUrl)
  async function handleDownloadVideo(quality: string) {
    const response = await chrome.runtime.sendMessage({
      videoId: getYouTubeVideoId(currentUrl),
      target: 'video',
      options: {
        quality
      }
    } as DownloadMessage)
    console.log(`download video response: ${response}`)
    if (!response) {
      messageApi.error({
        content: 'download video error, try later.'
      })
    }
  }
  return (
    <List
      {...props}
      dataSource={items}
      size={'large'}
      renderItem={it => {
        return (
          <List.Item onClick={() => handleDownloadVideo(it)} className={'cursor-pointer hover:bg-gray-100'}>
            <Flex className={'basis-full justify-around'}>
              <Typography.Text>MP4</Typography.Text>
              <Typography.Text>{it}</Typography.Text>
            </Flex>
          </List.Item>
        )
      }}
    />
  )
}