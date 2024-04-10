import type {DownloadMessage, DownloadSubtitleOptions, DownloadThumbnailOptions} from "~types";
import {YoutubeTranscript} from "youtube-transcript";
import {fetchSubtitle} from "~util/subtitleUtil";

chrome.runtime.onMessage.addListener(async (message: DownloadMessage, sender, sendResponse) => {
  const {videoId, target} = message
  switch (target) {
    case "thumbnail": {
      const options = message.options as DownloadThumbnailOptions
      const downloadUrl = `https://i.ytimg.com/vi/${videoId}/${options.resolution}.jpg`
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
    case "subtitle": {
      const options = message.options as DownloadSubtitleOptions
      const blob = new Blob([options.content], {type: 'text/plain'});
      const reader = new FileReader();

      reader.onload = function() {
        if(reader.result) {
          chrome.downloads.download({
            url: reader.result.toString(),
            filename: `${videoId}_subtitle.txt`
          });
          sendResponse('ok')
        }
      };

      reader.readAsDataURL(blob);
      break
    }
  }
})

