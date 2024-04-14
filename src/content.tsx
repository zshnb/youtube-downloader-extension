import type {PlasmoCSConfig, PlasmoGetInlineAnchor, PlasmoGetShadowHostId, PlasmoMountShadowHost} from "plasmo";
import {Button, Flex, message} from "antd";
import useDownloadSubtitle from "~hooks/useDownloadSubtitle";
import {StyleProvider} from "@ant-design/cssinjs"
import antdResetCssText from "data-text:antd/dist/reset.css"
import useDownloadVideo from "~hooks/useDownloadVideo";
import useDownloadThumbnail from "~hooks/useDownloadThumbnail";
import {Captions, Image, Video} from "lucide-react";
import {Storage} from "@plasmohq/storage";
import {useEffect, useState} from "react";
import type {Setting} from "~types";

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*"]
}

export const getInlineAnchor: PlasmoGetInlineAnchor = async () =>
  document.querySelector("#player")

const HOST_ID = "engage-csui"

export const getShadowHostId: PlasmoGetShadowHostId = () => HOST_ID
export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = antdResetCssText
  return style
}

export const mountShadowHost: PlasmoMountShadowHost = ({
  shadowHost,
  anchor,
  mountState
}) => {
  anchor.element.appendChild(shadowHost)
  mountState.observer.disconnect() // OPTIONAL DEMO: stop the observer as needed
}

export default function Toolbar() {
  const [messageApi] = message.useMessage();
  const [showDownloadButton, setShowDownloadButton] = useState(true)
  const {loading: subtitleLoading, handleDownloadSubtitle} = useDownloadSubtitle({
    currentUrl: window.location.href,
    messageApi
  })

  const {loading: videoLoading, handleDownloadVideo} = useDownloadVideo({
    currentUrl: window.location.href,
    messageApi
  })

  const {loading: thumbnailLoading, handleDownloadThumbnail} = useDownloadThumbnail({
    currentUrl: window.location.href,
    messageApi
  })
  const storage = new Storage()
  useEffect(() => {
    storage.get<Setting>('setting').then(setting => {
      setShowDownloadButton(setting.showDownloadButton)
    })
  })
  return (
    <StyleProvider container={document.getElementById(HOST_ID).shadowRoot}>
      {
        showDownloadButton && (
          <Flex gap={'middle'}>
            <Button type={'text'} shape={'circle'} icon={<Video/>} onClick={() => handleDownloadVideo()} loading={videoLoading}/>
            <Button type={'text'} shape={'circle'} icon={<Image/>} onClick={handleDownloadThumbnail} loading={thumbnailLoading}/>
            <Button type={'text'} shape={'circle'} icon={<Captions/>} onClick={() => handleDownloadSubtitle('text')} loading={subtitleLoading}/>
          </Flex>
        )
      }
    </StyleProvider>
  )
}