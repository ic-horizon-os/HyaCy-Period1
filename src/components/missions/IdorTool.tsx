import { useState } from 'react';
import type { LabProps } from '../labProps';
import { ToolFrame } from '../ToolFrame';
import { Segmented } from '../common/Segmented';
import { IdorCard } from './IdorCard';
import { IdorOrder } from './IdorOrder';

const stories = [
  { id: 'card', label: '剧情 1：饭卡' },
  { id: 'order', label: '剧情 2：订单' },
];

const intros: Record<string, string> = {
  card: 'A 校有一套 NFC 饭卡系统。学生刷卡就能在食堂消费，这张卡同时是校内的身份凭据。',
  order: '商城的订单页只凭地址里的编号取数据，没有核对是谁在请求。',
};

export function IdorTool({ log, complete }: LabProps) {
  const [story, setStory] = useState('card');

  return (
    <ToolFrame title="越权复现台" caption="两个剧情，同一个漏洞">
      <Segmented items={stories} value={story} onChange={setStory} label="选择剧情" />
      <p className="storyIntro">{intros[story]}</p>
      {story === 'card' ? (
        <IdorCard
          onBreach={(detail) => {
            log(`越权成功：${detail}`);
            complete();
          }}
        />
      ) : (
        <IdorOrder
          onBreach={(detail) => {
            log(`越权成功：${detail}`);
            complete();
          }}
        />
      )}
    </ToolFrame>
  );
}
