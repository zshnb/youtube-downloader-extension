import type {SubtitleType} from "~types";
import srtParser from 'srt-parser-2'

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36,gzip(gfe)';

export class YoutubeTranscriptError extends Error {
  constructor(message: string) {
    super(`[YoutubeTranscript] ${message}`);
  }
}

export async function fetchSubtitle(videoId: string, config: { type: SubtitleType, lang?: string }) {
  const domParser = new DOMParser()
  const lang = config?.lang ?? 'en';
  try {
    const transcriptUrl = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent': USER_AGENT,
      },
    })
      .then((res) => res.text())
      .then((html) => domParser.parseFromString(html, "text/html"))
      .then((html) => parseTranscriptEndpoint(html, lang));

    if (!transcriptUrl) throw new Error('Failed to locate a transcript for this video!');

    const transcriptXML = await fetch(transcriptUrl)
      .then((res) => res.text())
      .then((xml) => domParser.parseFromString(xml, 'text/xml'));

    switch (config.type) {
      case "text": {
        let transcript = '';
        const chunks = transcriptXML.getElementsByTagName('text');
        for (const chunk of chunks) {
          transcript += chunk.textContent + ' ';
        }

        return transcript.trim().replaceAll('&#39;', '\'');
      }
      case "srt": {
        const parser = new srtParser()
        const texts = transcriptXML.getElementsByTagName('text')
        const lines = []
        let i = 1
        for (const it of texts) {
          const start = parseInt(it.getAttribute('start'))
          const duration = parseInt(it.getAttribute('dur'))
          lines.push({
            id: i.toString(),
            startTime: srtTimestamp(start),
            endTime: srtTimestamp((start + duration)),
            startSeconds: 0,
            endSeconds: 0,
            text: it.textContent
          })
          i += 1
        }
        return parser.toSrt(lines)
      }
    }
  } catch (e) {
    throw new YoutubeTranscriptError(e.message);
  }
}

function parseTranscriptEndpoint(document: any, langCode: string | null = null) {
  console.log(document)
  try {
    const scripts = [...document.getElementsByTagName('script') as HTMLCollection]
    const playerScript = scripts.find((script: any) =>
      script.textContent.includes('var ytInitialPlayerResponse = {')
    );

    const dataString = playerScript.textContent?.split('var ytInitialPlayerResponse = ')?.[1]?.split('};')?.[0] + '}';

    const data = JSON.parse(dataString.trim());
    const availableCaptions = data?.captions?.playerCaptionsTracklistRenderer?.captionTracks || [];

    let captionTrack = availableCaptions?.[0];
    if (langCode) {
      captionTrack =
        availableCaptions.find((track: any) => track.languageCode.includes(langCode)) ?? availableCaptions?.[0];
    }

    return captionTrack?.baseUrl;
  } catch (e) {
    console.error(`YoutubeTranscript.#parseTranscriptEndpoint ${e.message}`);
    return null;
  }
}

function srtTimestamp(seconds: number) {
  let $milliseconds = seconds * 1000;

  let $seconds = Math.floor($milliseconds / 1000);
  let $minutes = Math.floor($seconds / 60);
  const $hours = Math.floor($minutes / 60);
  $milliseconds = $milliseconds % 1000;
  $seconds = $seconds % 60;
  $minutes = $minutes % 60;
  return ($hours < 10 ? '0' : '') + $hours + ':'
    + ($minutes < 10 ? '0' : '') + $minutes + ':'
    + ($seconds < 10 ? '0' : '') + $seconds + ','
    + ($milliseconds < 100 ? '0' : '') + ($milliseconds < 10 ? '0' : '') + $milliseconds;
}