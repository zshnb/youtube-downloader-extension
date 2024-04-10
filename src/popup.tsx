import {useEffect, useState} from "react"
import {Button, Flex, message} from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import '~style.css'
import {DownloadOutlined} from "@ant-design/icons";
import type {DownloadMessage} from "~types";
import {youtubeUtil} from "~util/youtubeUtil";

function IndexPopup() {
  const [messageApi, contextHolder] = message.useMessage();
  const [currentUrl, setCurrentUrl] = useState("");
  useEffect(() => {
    chrome.tabs.query({
      currentWindow: true,
      active: true,
    }).then(res => {
      setCurrentUrl(res[0].url)
    })
  }, [])

  const {getYouTubeVideoId} = youtubeUtil(currentUrl)
  async function handleDownloadThumbnail() {
    const response = await chrome.runtime.sendMessage({
      videoId: getYouTubeVideoId(currentUrl),
      target: 'thumbnail'
    } as DownloadMessage)
    console.log(`download thumbnail response: ${response}`)
    if (!response) {
      messageApi.error({
        content: 'download thumbnail error, try later.'
      })
    }
  }

  async function handleDownloadVideo() {
    const response = await chrome.runtime.sendMessage({
      videoId: getYouTubeVideoId(currentUrl),
      target: 'video'
    } as DownloadMessage)
    console.log(`download video response: ${response}`)
    if (!response) {
      messageApi.error({
        content: 'download video error, try later.'
      })
    }
  }
  return (
    <>
      {contextHolder}
      <Flex gap='middle' className='min-w-[300px] min-h-[300px] p-4'>
        {
          /https:\/\/(www.)?youtube\.com\/.*/.test(currentUrl) ? (
            <>
              <Button className='flex items-center' onClick={handleDownloadVideo}><DownloadOutlined/> video</Button>
              <Button className='flex items-center' onClick={handleDownloadThumbnail}><DownloadOutlined/> thumbnail</Button>
              <Button className='flex items-center'><DownloadOutlined/> subtitle</Button>
            </>
          ) : (
            <Paragraph>No support download</Paragraph>
          )
        }
      </Flex>
    </>
  )
}

export default IndexPopup
