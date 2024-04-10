import type {DownloadMessage} from "~types";

chrome.runtime.onMessage.addListener(async (message: DownloadMessage, sender, sendResponse) => {
  const {videoId, target} = message
  switch (target) {
    case "thumbnail": {
      const downloadUrl = `https://i.ytimg.com/vi/${videoId}/hq720.jpg`
      await chrome.downloads.download({
        url: downloadUrl,
        filename: `thumbnail_hq720_${videoId}.jpg`
      })
      sendResponse('ok')
      break
    }
    case "video": {
      const response = await fetch('https://co.wuk.sh/api/json', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: encodeURI(`https://www.youtube.com/watch?v=${videoId}`),
        })
      })
      if (response.ok) {
        const json = await response.json()
        await chrome.windows.create({
          url: json.url
        })
        sendResponse('ok')
      } else {
        sendResponse(undefined)
      }
      break
    }
  }
})

