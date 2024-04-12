import {Button} from "antd";
import {DownloadOutlined, VideoCameraOutlined} from "@ant-design/icons";
import type {DownloadMessage} from "~types";
import {youtubeUtil} from "~util/youtubeUtil";
import {useState} from "react";
import type {MessageInstance} from "antd/es/message/interface";

export type DownloadButtonProps = {
  currentUrl: string
  messageApi: MessageInstance
  quality: string
}
export default function DownloadVideoButton({currentUrl, messageApi, quality}: DownloadButtonProps) {
  return (
    <Button icon={<VideoCameraOutlined/>} shape={'circle'} type={'text'}></Button>
  )
}