import {useEffect, useState} from "react"
import {Button, Flex} from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import '~style.css'
import {DownloadOutlined} from "@ant-design/icons";

function IndexPopup() {
  const [currentUrl, setCurrentUrl] = useState("");
  useEffect(() => {
    chrome.tabs.query({
      currentWindow: true,
      active: true,
    }).then(res => {
      setCurrentUrl(res[0].url)
      console.log(res)
    })
  }, [])
  return (
    <>
      <Flex gap='middle' className='min-w-[300px] min-h-[300px] p-4'>
        {
          /https:\/\/(www.)?youtube\.com\/.*/.test(currentUrl) ? (
            <>
              <Button className='flex items-center'><DownloadOutlined/> video</Button>
              <Button className='flex items-center'><DownloadOutlined/> thumbnail</Button>
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
