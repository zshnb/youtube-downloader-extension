import {useEffect, useMemo, useState} from "react"
import {Flex, Radio, message, Typography} from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import '~style.css'
import usePopup from "~usePopup";
import DownloadVideoButton from "~components/downloadVideoButton";
import DownloadThumbnailButton from "~components/downloadThumbnailButton";
import DownloadSubtitleButton from "~components/downloadSubtitleButton";

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

  const isCurrentYoutubeWebsite = useMemo(() => {
    return /https:\/\/(www.)?youtube\.com\/.*/.test(currentUrl)
  }, [currentUrl])


  const {thumbnailValue, thumbnailResolutionOptions, onThumbnailOptionChange} = usePopup()
  return (
    <>
      {contextHolder}
      <Flex gap='middle' className='min-w-[400px] min-h-[300px] p-4' vertical>
        {
          isCurrentYoutubeWebsite && (
            <Flex gap='middle' vertical>
              <Flex gap='small' className='items-center'>
                <Typography.Text>Thumbnail resolution: </Typography.Text>
                <Radio.Group options={thumbnailResolutionOptions} onChange={onThumbnailOptionChange} value={thumbnailValue} optionType="button" />
              </Flex>
            </Flex>
          )
        }
        <Flex gap='middle'>
          {
            isCurrentYoutubeWebsite ? (
              <>
                <DownloadVideoButton currentUrl={currentUrl} messageApi={messageApi}/>
                <DownloadThumbnailButton currentUrl={currentUrl} messageApi={messageApi} thumbnailValue={thumbnailValue}/>
                <DownloadSubtitleButton currentUrl={currentUrl} messageApi={messageApi}/>
              </>
            ) : (
              <Paragraph>No support download</Paragraph>
            )
          }
        </Flex>
      </Flex>
    </>
  )
}

export default IndexPopup
