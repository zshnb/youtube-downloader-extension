import {Button, Flex, Image, Select, Typography} from "antd";
import {useRef, useState} from "react";
import {youtubeUtil} from "~util/youtubeUtil";
import type {DownloadMessage} from "~types";
import type {MessageInstance} from "antd/es/message/interface";
import {fetchSubtitle} from "~util/subtitleUtil";
import useDownloadSubtitle from "~hooks/useDownloadSubtitle";

export type SubtitleDownloadListProps = {
  currentUrl: string
  messageApi: MessageInstance
}
export default function SubtitleDownloadList({currentUrl, messageApi}: SubtitleDownloadListProps) {
  const {loading, handleDownloadSubtitle} = useDownloadSubtitle({currentUrl, messageApi})

  return (
    <Flex vertical gap={'middle'} className={'items-center mt-10 px-4'}>
      <Button loading={loading} className={'self-end'} type={'primary'} onClick={handleDownloadSubtitle}>Download</Button>
    </Flex>
  )
}