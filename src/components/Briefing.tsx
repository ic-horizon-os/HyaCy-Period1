import { ArrowRight16Regular } from '@fluentui/react-icons';
import { Button, Checkbox } from '@fluentui/react-components';
import { useState } from 'react';
import { rules } from '../data/labs';

export function Briefing({ onAccept }: { onAccept: () => void }) {
  const [agreed, setAgreed] = useState(false);

  return (
    <section className="briefing">
      <div className="briefCard">
        <span className="kicker mono">网安初阶 / 7 个交互实验</span>
        <h1>
          网安初阶实验场
          <em>7 个实验，7 条防护</em>
        </h1>
        <p>
          这里是一个教学沙盒。哈希、数据包、终端输出都是预置的模拟材料，全部在浏览器里运行，不扫描、不连接任何真实目标。
        </p>

        <ul className="rules">
          {rules.map((rule, index) => (
            <li key={rule}>
              <span className="mono">0{index + 1}</span>
              {rule}
            </li>
          ))}
        </ul>

        <div className="briefActions">
          <Checkbox
            label="我已阅读并同意以上规则"
            checked={agreed}
            onChange={(_, data) => setAgreed(data.checked === true)}
          />
          <Button
            className="btn btnPrimary btnLarge"
            appearance="primary"
            disabled={!agreed}
            icon={<ArrowRight16Regular />}
            iconPosition="after"
            onClick={onAccept}
          >
            开始学习
          </Button>
        </div>

        <small className="caption">教学演示 · 浏览器本地运行 · 随时可重置</small>
      </div>
    </section>
  );
}
