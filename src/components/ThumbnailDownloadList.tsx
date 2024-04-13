import {Button, Flex, Image, Select, Typography} from "antd";
import {useRef} from "react";
import type {MessageInstance} from "antd/es/message/interface";
import useDownloadThumbnail from "~hooks/useDownloadThumbnail";

export type ThumbnailDownloadListProps = {
  thumbnailUrl: string;
  currentUrl: string
  messageApi: MessageInstance
}
export default function ThumbnailDownloadList({thumbnailUrl, currentUrl, messageApi}: ThumbnailDownloadListProps) {
  const resolutionRef = useRef('maxresdefault');
  const {loading, handleDownloadThumbnail} = useDownloadThumbnail({
    currentUrl, messageApi
  })

  return (
    <Flex vertical gap={'middle'} className={'items-center mt-10 px-4'}>
      <Image src={thumbnailUrl} width={'80%'}/>
      <Typography.Text className={'self-start'}>Select Resolution:</Typography.Text>
      <Select defaultValue={'maxresdefault'} options={[{
        label: 'Maximum Resolution',
        value: 'maxresdefault'
      }, {
        label: 'High Quality',
        value: 'hqdefault'
      }, {
        label: 'Medium Quality',
        value: 'mqdefault'
      }, {
        label: 'Standard Quality',
        value: 'sddefault'
      }]} className={'w-[70%] self-start'} onChange={(e) => resolutionRef.current = e}/>
      <Button loading={loading} className={'self-end'} type={'primary'} onClick={handleDownloadThumbnail}>Download</Button>
    </Flex>
  )
}