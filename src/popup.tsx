import {useEffect, useMemo, useState} from "react"
import {Flex, message, Typography, Spin} from "antd";
import '~style.css'
import usePopup from "~usePopup";
import DownloadVideoButton from "~components/downloadVideoButton";
import DownloadThumbnailButton from "~components/downloadThumbnailButton";
import DownloadSubtitleButton from "~components/downloadSubtitleButton";
import VideoDownloadList from "~components/VideoDownloadList";

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
  // {
  //   "title": "What is NVM? How to set up NVM for dummies",
  //   "author_name": "Codemify",
  //   "author_url": "https://www.youtube.com/@Codemify",
  //   "type": "video",
  //   "height": 113,
  //   "width": 200,
  //   "version": "1.0",
  //   "provider_name": "YouTube",
  //   "provider_url": "https://www.youtube.com/",
  //   "thumbnail_height": 360,
  //   "thumbnail_width": 480,
  //   "thumbnail_url": "https://i.ytimg.com/vi/EiVHnmW7OK0/hqdefault.jpg",
  //   "html": "<iframe width=\"200\" height=\"113\" src=\"https://www.youtube.com/embed/EiVHnmW7OK0?feature=oembed\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen title=\"What is NVM? How to set up NVM for dummies\"></iframe>"
  // }
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

  const {thumbnailResolution, thumbnailResolutionOptions, onThumbnailOptionChange} = usePopup()
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
                  <DownloadThumbnailButton currentUrl={currentUrl} messageApi={messageApi}
                                           resolution={thumbnailResolution}/>
                  <DownloadSubtitleButton currentUrl={currentUrl} messageApi={messageApi}/>
                </Flex>
              </Flex>
              <VideoDownloadList className={'mt-4'} currentUrl={currentUrl} messageApi={messageApi}/>
            </>
          )
        }
      </Flex>
      <Spin fullscreen spinning={loading}/>
    </>
  )
}

export default IndexPopup
