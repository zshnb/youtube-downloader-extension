import {useEffect, useMemo, useState} from "react"
import {Flex, message, Typography, Spin, Button, Image} from "antd";
import '~style.css'
import VideoDownloadList from "~components/VideoDownloadList";
import ThumbnailDownloadList from "~components/ThumbnailDownloadList";
import SubtitleDownloadList from "~components/SubtitleDownloadList";
import {Captions, Video} from "lucide-react";

type Metadata = {
  title: string
  author_name: string
  thumbnail_url: string
}

type DownloadType = 'video' | 'thumbnail' | 'subtitle'

function IndexPopup() {
  const [messageApi, contextHolder] = message.useMessage();
  const [currentUrl, setCurrentUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [downloadType, setDownloadType] = useState<DownloadType>('video')
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
    if (currentUrl && isCurrentYoutubeWebsite) {
      fetch(`https://www.youtube.com/oembed?url=${currentUrl}&format=json`)
        .then(res => res.json())
        .then(res => {
          console.log(res)
          setMetadata(res as Metadata)
        })
    }
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [currentUrl]);

  const isCurrentYoutubeWebsite = useMemo(() => {
    return /https:\/\/(www.)?youtube\.com\/.*/.test(currentUrl)
  }, [currentUrl])

  const downloadList = useMemo(() => {
    switch (downloadType) {
      case "subtitle":
        return <SubtitleDownloadList currentUrl={currentUrl} messageApi={messageApi}/>
      case "thumbnail":
        return <ThumbnailDownloadList thumbnailUrl={metadata.thumbnail_url} currentUrl={currentUrl}
                                      messageApi={messageApi}/>
      case "video":
        return <VideoDownloadList className={'mt-4'} currentUrl={currentUrl} messageApi={messageApi}/>
    }
  }, [downloadType, currentUrl])

  return (
    <>
      {contextHolder}
      <Flex vertical className={'min-w-[400px] min-h-[400px] justify-center'}>
        {
          metadata && (
            <>
              <Flex vertical className={`relative p-12 bg-[50%] rounded-b-xl`}
                    style={{backgroundImage: `url(${metadata.thumbnail_url && metadata.thumbnail_url})`}}>
                <div className={'w-full h-full bg-[rgb(0,0,0,0.45)] absolute top-0 left-0 z-10 rounded-b-xl'}></div>
                <Typography.Text className={'text-white z-20'}>{metadata.author_name}</Typography.Text>
                <Typography.Text
                  className={'font-bold text-white text-2xl overflow-x-hidden text-ellipsis z-20'}>{metadata.title}</Typography.Text>
                <Flex
                  className='justify-center items-center absolute bottom-[-15px] bg-white rounded-2xl left-[10%] shadow w-[80%] p-1 z-20'
                  gap='middle'
                >
                  <Button icon={<Video/>} shape={'circle'} type={'text'}
                          onClick={() => setDownloadType('video')}></Button>
                  <Button icon={<Image/>} shape={'circle'} type={'text'}
                          onClick={() => setDownloadType('thumbnail')}></Button>
                  <Button icon={<Captions/>} shape={'circle'} type={'text'}
                          onClick={() => setDownloadType('subtitle')}></Button>
                </Flex>
              </Flex>
              {downloadList}
            </>
          )
        }
        {
          !isCurrentYoutubeWebsite && (
            <Typography.Text className={'text-center'}>This page isn't YouTube</Typography.Text>
          )
        }
      </Flex>
      <Spin fullscreen spinning={loading}/>
    </>
  )
}

export default IndexPopup
