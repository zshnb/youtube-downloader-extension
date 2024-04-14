import type {DownloadMessage, DownloadSubtitleOptions, DownloadThumbnailOptions, DownloadVideoOptions} from "~types";

const thumbnailResolutions = [{
  label: 'max',
  value: 'maxresdefault'
}, {
  label: 'hd',
  value: 'hqdefault'
}, {
  label: 'md',
  value: 'mqdefault'
}, {
  label: 'sd',
  value: 'sddefault'
}]
chrome.runtime.onMessage.addListener(async (message: DownloadMessage, sender, sendResponse) => {
  const {videoId, target} = message
  switch (target) {
    case "thumbnail": {
      const options = message.options as DownloadThumbnailOptions
      const downloadUrl = `https://i.ytimg.com/vi/${videoId}/${options.resolution}.jpg`
      await chrome.downloads.download({
        url: downloadUrl,
        filename: `thumbnail_${thumbnailResolutions.find(it => it.value === options.resolution).label}_${videoId}.jpg`
      })
      sendResponse('ok')
      break
    }
    case "video": {
      const {quality} = message.options as DownloadVideoOptions
      const response = await fetch('https://co.wuk.sh/api/json', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: encodeURI(`https://www.youtube.com/watch?v=${videoId}`),
          vQuality: quality ? quality.replace('p', '') : '720'
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
      const suffix = options.type === 'text' ? 'txt' : 'srt'
      const mime = options.type === 'text' ? 'text/plain' : 'text/srt'
      const blob = new Blob([options.content], {type: mime});
      const reader = new FileReader();

      reader.onload = function() {
        if(reader.result) {
          chrome.downloads.download({
            url: reader.result.toString(),
            filename: `${videoId}_subtitle.${suffix}`
          });
          sendResponse('ok')
        }
      };

      reader.readAsDataURL(blob);
      break
    }
  }
})

