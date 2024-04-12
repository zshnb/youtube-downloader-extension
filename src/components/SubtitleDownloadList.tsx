import {Button, Flex, Image, Select, Typography} from "antd";
import {useRef, useState} from "react";
import {youtubeUtil} from "~util/youtubeUtil";
import type {DownloadMessage} from "~types";
import type {MessageInstance} from "antd/es/message/interface";
import {fetchSubtitle} from "~util/subtitleUtil";

export type SubtitleDownloadListProps = {
  currentUrl: string
  messageApi: MessageInstance
}
export default function SubtitleDownloadList({currentUrl, messageApi}: SubtitleDownloadListProps) {

  const {getYouTubeVideoId} = youtubeUtil(currentUrl)
  async function handleDownloadSubtitle() {
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
    }
  }

  return (
    <Flex vertical gap={'middle'} className={'items-center mt-10 px-4'}>
      <Button className={'self-end'} type={'primary'} onClick={handleDownloadSubtitle}>Download</Button>
    </Flex>
  )
}