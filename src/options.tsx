import {ConfigProvider, Divider, Flex, Form, Radio, Switch, Typography} from "antd";
import FormItem from "antd/es/form/FormItem";
import '~style.css'
import type {FieldData} from "rc-field-form/lib/interface";
import {Storage} from "@plasmohq/storage";
import {useEffect} from "react";
import type {Setting} from "~types";

export default function OptionsIndex() {
  const storage = new Storage()
  const [form] = Form.useForm();
  useEffect(() => {
    storage.get<Setting>('setting').then(setting => {
      console.log('setting', setting)
      if (setting) {
        form.setFieldValue('showDownloadButton', setting.showDownloadButton)
        form.setFieldValue('videoFormat', setting.videoFormat)
      } else {
        form.setFieldValue('showDownloadButton', true)
        form.setFieldValue('videoFormat', 1)
      }
    })
  })

  function onFieldsChange(changedFields: FieldData[], allFields: FieldData[]) {
    const setting = allFields.map(it => {
      return {
        [`${it.name[0]}`]: it.value
      }
    }).reduce((previousValue: any, currentValue: any) => {
      Object.assign(previousValue, currentValue)
      return previousValue
    }, {})
    storage.set('setting', setting)
  }
  return (
    <ConfigProvider>
      <Flex className={'px-80'} vertical>
        <header>
          <Typography.Title level={1}>Setting</Typography.Title>
        </header>
        <Form form={form} onFieldsChange={onFieldsChange}>
          <FormItem label={'show download button on website'} name={'showDownloadButton'}>
            <Switch/>
          </FormItem>
          <Divider/>
          <Typography.Title level={3}>Download Setting</Typography.Title>
          <FormItem label={'Video format'} name={'videoFormat'}>
            <Radio.Group>
              <Radio value={1}>video and audio</Radio>
              <Radio value={2}>video only</Radio>
            </Radio.Group>
          </FormItem>
        </Form>
      </Flex>
    </ConfigProvider>
  )
}