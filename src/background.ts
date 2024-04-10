import type {DownloadMessage} from "~types";

chrome.runtime.onMessage.addListener((message: DownloadMessage) => {
  const {videoId, target} = message
  switch (target) {
    case "thumbnail": {
      const downloadUrl = `https://i.ytimg.com/vi/${videoId}/hq720.jpg`
      chrome.downloads.download({
        url: downloadUrl,
        filename: `thumbnail_hq720_${videoId}.jpg`
      })
    }
  }
})

