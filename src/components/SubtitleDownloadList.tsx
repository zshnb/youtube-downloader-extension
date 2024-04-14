import {Button, Flex, Image, Radio, Select, Typography} from "antd";
import {useRef, useState} from "react";
import {youtubeUtil} from "~util/youtubeUtil";
import type {DownloadMessage, SubtitleType} from "~types";
import type {MessageInstance} from "antd/es/message/interface";
import {fetchSubtitle} from "~util/subtitleUtil";
import useDownloadSubtitle from "~hooks/useDownloadSubtitle";

export type SubtitleDownloadListProps = {
  currentUrl: string
  messageApi: MessageInstance
}
export default function SubtitleDownloadList({currentUrl, messageApi}: SubtitleDownloadListProps) {
  const [type, setType] = useState<SubtitleType>('text')
  const {loading, handleDownloadSubtitle} = useDownloadSubtitle({currentUrl, messageApi})
  return (
    <Flex vertical gap={'middle'} className={'items-start mt-10 px-4'}>
      <Typography.Text>Subtitle Type:</Typography.Text>
      <Radio.Group onChange={(e) => setType(e.target.value)} value={type}>
        <Radio value={'text'}>text</Radio>
        <Radio value={'srt'}>srt</Radio>
      </Radio.Group>
      <Button loading={loading} className={'self-end'} type={'primary'} onClick={() => handleDownloadSubtitle(type)}>Download</Button>
    </Flex>
  )
}