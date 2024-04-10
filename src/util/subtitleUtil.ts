import {Dom, parseFromString} from "dom-parser";

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36,gzip(gfe)';

export class YoutubeTranscriptError extends Error {
  constructor(message: string) {
    super(`[YoutubeTranscript] ${message}`);
  }
}

export async function fetchSubtitle(videoId: string, config: { lang?: string } = {}) {
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
      .then((html) => {
        console.log(html)
        return parseTranscriptEndpoint(html, lang)
      });

    if (!transcriptUrl) throw new Error('Failed to locate a transcript for this video!');

    const transcriptXML = await fetch(transcriptUrl)
      .then((res) => res.text())
      .then((xml) => domParser.parseFromString(xml, 'text/xml'));

    let transcript = '';
    const chunks = transcriptXML.getElementsByTagName('text');
    for (const chunk of chunks) {
      transcript += chunk.textContent + ' ';
    }

    return transcript.trim().replaceAll('&#39;', '\'');
  } catch (e) {
    throw new YoutubeTranscriptError(e.message);
  }
}

function parseTranscriptEndpoint(document: any, langCode: string | null = null) {
  console.log(document)
  try {
    const scripts = [...document.getElementsByTagName('script') as HTMLCollection]
    console.log('scripts', scripts)
    const playerScript = scripts.find((script: any) =>
      script.textContent.includes('var ytInitialPlayerResponse = {')
    );

    console.log('playerScript', playerScript);
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