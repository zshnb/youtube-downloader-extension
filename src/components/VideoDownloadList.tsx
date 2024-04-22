import {Flex, List, type ListProps, Typography} from "antd";
import type {MessageInstance} from "antd/es/message/interface";
import useDownloadVideo from "~hooks/useDownloadVideo";

export interface VideoDownloadListProps extends ListProps<any> {
  currentUrl: string
  messageApi: MessageInstance
}
export default function VideoDownloadList({currentUrl, messageApi, ...props}: VideoDownloadListProps) {
  const items = ['720p', '1080p', '360p', '480p']
  const {handleDownloadVideo} = useDownloadVideo({
    currentUrl, messageApi
  })
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