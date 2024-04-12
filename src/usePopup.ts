import type {CheckboxOptionType, RadioChangeEvent} from "antd";
import {useState} from "react";

export default function usePopup() {
  const thumbnailResolutionOptions: CheckboxOptionType[] = [
    {
      label: 'default',
      value: 'default'
    },
    {
      label: 'hq',
      value: 'hqdefault'
    },
    {
      label: 'super hq',
      value: 'maxresdefault'
    }
  ]
  const [thumbnailResolution, setThumbnailResolution] = useState('default')
  const onThumbnailOptionChange = (event: RadioChangeEvent) => {
    setThumbnailResolution(event.target.value)
  }

  return {
    thumbnailResolution,
    thumbnailResolutionOptions,
    onThumbnailOptionChange
  }
}