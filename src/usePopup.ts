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
  const [thumbnailValue, setThumbnailValue] = useState('default')
  const onThumbnailOptionChange = (event: RadioChangeEvent) => {
    setThumbnailValue(event.target.value)
  }

  return {
    thumbnailValue,
    thumbnailResolutionOptions,
    onThumbnailOptionChange
  }
}