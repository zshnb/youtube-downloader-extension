import {useEffect, useMemo, useState} from "react"
import {Flex, message, Typography, Spin, Button} from "antd";
import '~style.css'
import DownloadVideoButton from "~components/downloadVideoButton";
import DownloadSubtitleButton from "~components/downloadSubtitleButton";
import VideoDownloadList from "~components/VideoDownloadList";
import ThumbnailDownloadList from "~components/ThumbnailDownloadList";
import {PictureOutlined} from "@ant-design/icons";

type Metadata = {
  title: string
  author_name: string
  thumbnail_url: string
}

function IndexPopup() {
  const [messageApi, contextHolder] = message.useMessage();
  const [currentUrl, setCurrentUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [quality, setQuality] = useState("");
  const [metadata, setMetadata] = useState<Metadata>(undefined);
  useEffect(() => {
    chrome.tabs.query({
      currentWindow: true,
      active: true,
    }).then(res => {
      setCurrentUrl(res[0].url)
    })
  }, [])

  useEffect(() => {
    if (currentUrl) {
      fetch(`https://www.youtube.com/oembed?url=${currentUrl}&format=json`)
        .then(res => res.json())
        .then(res => {
          console.log(res)
          setMetadata(res as Metadata)
        })
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }
  }, [currentUrl]);

  const isCurrentYoutubeWebsite = useMemo(() => {
    // return /https:\/\/(www.)?youtube\.com\/.*/.test(currentUrl)
    return true
  }, [currentUrl])

  return (
    <>
      {contextHolder}
      <Flex vertical className={'min-w-[400px] min-h-[400px]'}>
        {
          metadata && (
            <>
              <Flex vertical className={`relative p-12 bg-[50%] rounded-b-xl`}
                    style={{backgroundImage: `url(${metadata.thumbnail_url && metadata.thumbnail_url})`}}>
                <Typography.Text className={'text-white'}>{metadata.author_name}</Typography.Text>
                <Typography.Text
                  className={'font-bold text-white text-2xl overflow-x-hidden text-ellipsis'}>{metadata.title}</Typography.Text>
                <Flex
                  className='justify-center items-center absolute bottom-[-15px] bg-white rounded-2xl left-[10%] shadow w-[80%] p-1'
                  gap='middle'>
                  <DownloadVideoButton currentUrl={currentUrl} messageApi={messageApi} quality={quality}/>
                  <Button icon={<PictureOutlined/>} shape={'circle'} type={'text'}></Button>
                  <DownloadSubtitleButton currentUrl={currentUrl} messageApi={messageApi}/>
                </Flex>
              </Flex>
              {/*<VideoDownloadList className={'mt-4'} currentUrl={currentUrl} messageApi={messageApi}/>*/}
              <ThumbnailDownloadList thumbnailUrl={metadata.thumbnail_url} currentUrl={currentUrl} messageApi={messageApi}/>
            </>
          )
        }
      </Flex>
      <Spin fullscreen spinning={loading}/>
    </>
  )
}

export default IndexPopup
