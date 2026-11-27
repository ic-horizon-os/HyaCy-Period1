import { Checkmark16Filled, Dismiss16Filled } from '@fluentui/react-icons';
import { Button, Select } from '@fluentui/react-components';
import { useState } from 'react';
import { cx } from '../../cx';
import { hashSamples, hashTypes, lengthGuide } from '../../data/hashData';
import type { LabProps } from '../labProps';
import { ToolFrame } from '../ToolFrame';

export function HashIdTool({ log, complete }: LabProps) {
  const [picks, setPicks] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const allPicked = hashSamples.every((sample) => picks[sample.id]);

  const check = () => {
    setChecked(true);
    const correct = hashSamples.filter((sample) => picks[sample.id] === sample.answer).length;
    if (correct === hashSamples.length) {
      log(`${hashSamples.length} 条样本全部识别正确`);
      complete();
    } else {
      log(`${correct}/${hashSamples.length} 正确，对照右侧的长度表`, 'warn');
    }
  };

  return (
    <ToolFrame title="哈希识别器" caption="5 条样本 · 只看格式，不计算">
      <div className="twoCol">
        <ul className="sampleList">
          {hashSamples.map((sample) => {
            const state = checked ? (picks[sample.id] === sample.answer ? 'right' : 'wrong') : 'idle';
            return (
              <li key={sample.id} className={cx('sampleRow', state !== 'idle' && state)}>
                <div className="sampleText">
                  <small>{sample.source}</small>
                  <code className="mono">{sample.value}</code>
                </div>
                <Select
                  className="pickSelect"
                  aria-label={`${sample.source} 的哈希类型`}
                  value={picks[sample.id] ?? ''}
                  onChange={(_, data) => {
                    setPicks((current) => ({ ...current, [sample.id]: data.value }));
                    setChecked(false);
                  }}
                >
                  <option value="">选择类型</option>
                  {hashTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Select>
                <span className={cx('sampleState', state)}>
                  {state === 'right' ? <Checkmark16Filled /> : state === 'wrong' ? <Dismiss16Filled /> : null}
                </span>
              </li>
            );
          })}
        </ul>

        <aside className="subPanel">
          <b>长度对照表</b>
          <table className="compareTable">
            <tbody>
              {lengthGuide.map(([pattern, type]) => (
                <tr key={pattern}>
                  <td className="mono">{pattern}</td>
                  <td>{type}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button className="btn btnPrimary" appearance="primary" disabled={!allPicked} onClick={check}>
            检查答案
          </Button>
        </aside>
      </div>
    </ToolFrame>
  );
}
