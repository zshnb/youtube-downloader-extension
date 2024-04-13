import type {PlasmoCSConfig, PlasmoGetInlineAnchor, PlasmoGetShadowHostId, PlasmoMountShadowHost} from "plasmo";
import {Button, Flex, message} from "antd";
import {FileWordOutlined, PictureOutlined, VideoCameraOutlined} from "@ant-design/icons";
import useDownloadSubtitle from "~hooks/useDownloadSubtitle";
import {StyleProvider} from "@ant-design/cssinjs"
import antdResetCssText from "data-text:antd/dist/reset.css"
import useDownloadVideo from "~hooks/useDownloadVideo";
import useDownloadThumbnail from "~hooks/useDownloadThumbnail";

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
  return (
    <StyleProvider container={document.getElementById(HOST_ID).shadowRoot}>
      <Flex gap={'middle'}>
        <Button type={'text'} shape={'circle'} icon={<VideoCameraOutlined/>} onClick={() => handleDownloadVideo()} loading={videoLoading}/>
        <Button type={'text'} shape={'circle'} icon={<PictureOutlined/>} onClick={handleDownloadThumbnail} loading={thumbnailLoading}/>
        <Button type={'text'} shape={'circle'} icon={<FileWordOutlined/>} onClick={handleDownloadSubtitle} loading={subtitleLoading}/>
      </Flex>
    </StyleProvider>
  )
}