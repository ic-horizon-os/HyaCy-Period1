import { Play20Regular } from '@fluentui/react-icons';
import { Button, Checkbox } from '@fluentui/react-components';
import { useState } from 'react';
import { wpFixes, WP_HEADER, wpFindings, wpItems } from '../../data/exploitData';
import type { LabProps } from '../labProps';
import { ToolFrame } from '../ToolFrame';
import { OptionCards, type Verdict } from '../common/OptionCards';
import { SimOutput } from '../common/SimOutput';

export function WpscanTool({ log, complete }: LabProps) {
  const [picked, setPicked] = useState<string[]>([]);
  const [runId, setRunId] = useState(0);
  const [scanned, setScanned] = useState(false);
  const [finding, setFinding] = useState<string | null>(null);
  const [findingVerdict, setFindingVerdict] = useState<Verdict>('idle');
  const [fix, setFix] = useState<string | null>(null);
  const [fixVerdict, setFixVerdict] = useState<Verdict>('idle');

  const lines = [...WP_HEADER, ...wpItems.filter((item) => picked.includes(item.id)).flatMap((item) => item.lines)];
  // 判定题只列本次扫描枚举到的项，没扫到的组件无从判断
  const visibleFindings = wpFindings.filter((item) =>
    item.id === 'theme' ? picked.includes('themes') : picked.includes('plugins'),
  );

  const toggle = (id: string, checked: boolean) => {
    setPicked((current) => (checked ? [...current, id] : current.filter((item) => item !== id)));
    setRunId(0);
    setScanned(false);
    setFinding(null);
    setFindingVerdict('idle');
  };

  return (
    <ToolFrame title="指纹扫描器" caption="模拟对 WordPress 站点的扫描">
      <section className="subPanel">
        <b>第一步：选择要枚举的对象</b>
        <div className="checkRow">
          {wpItems.map((item) => (
            <Checkbox
              key={item.id}
              label={item.label}
              checked={picked.includes(item.id)}
              onChange={(_, data) => toggle(item.id, data.checked === true)}
            />
          ))}
        </div>
        <div className="inlineForm">
          <Button
            className="btn btnPrimary"
            appearance="primary"
            icon={<Play20Regular />}
            disabled={picked.length === 0}
            onClick={() => {
              setRunId((current) => current + 1);
              setScanned(false);
            }}
          >
            开始扫描
          </Button>
          {!picked.includes('plugins') && <span className="caption">提示：没勾“有漏洞的插件”的话，结果里不会出现插件版本。</span>}
        </div>
        <SimOutput
          key={runId}
          lines={lines}
          active={runId > 0}
          label="wpscan"
          idleText="选好枚举项后开始扫描…"
          onDone={() => setScanned(true)}
        />
      </section>

      {scanned && (
        <section className="subPanel">
          <b>第二步：哪一项要优先处理？</b>
          {visibleFindings.length === 0 && (
            <p className="optionExplain wrong">这次没有枚举任何组件，判定不了。回到第一步勾上“有漏洞的插件”重新扫描。</p>
          )}
          <OptionCards
            label="扫描结果判定"
            options={visibleFindings}
            value={finding}
            verdict={findingVerdict}
            onPick={(id) => {
              const ok = wpFindings.find((item) => item.id === id)?.ok ?? false;              setFinding(id);
              setFindingVerdict(ok ? 'right' : 'wrong');
              if (ok) {
                log('找出了带已知漏洞的插件：loginizer 1.6.0');
                complete();
              }
            }}
          />
        </section>
      )}

      {findingVerdict === 'right' && (
        <section className="subPanel">
          <b>第三步：怎么处置？</b>
          <OptionCards
            label="处置方式"
            options={wpFixes}
            value={fix}
            verdict={fixVerdict}
            onPick={(id) => {
              setFix(id);
              setFixVerdict(wpFixes.find((item) => item.id === id)?.ok ? 'right' : 'wrong');
            }}
          />
        </section>
      )}
    </ToolFrame>
  );
}
