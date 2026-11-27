import { Play20Regular } from '@fluentui/react-icons';
import { Button } from '@fluentui/react-components';
import { useState } from 'react';
import { msfOutput, SHUFFLED_STEPS, TARGET, ATTACKER } from '../../data/exploitData';
import type { LabProps } from '../labProps';
import { ToolFrame } from '../ToolFrame';
import { SimOutput } from '../common/SimOutput';
import type { Verdict } from '../common/OptionCards';
import { MsfOrder } from './MsfOrder';
import { IDLE, MsfSetup, type SetupStatus } from './MsfSetup';

export function MsfTool({ log, complete }: LabProps) {
  const [order, setOrder] = useState<number[]>(SHUFFLED_STEPS);
  const [orderVerdict, setOrderVerdict] = useState<Verdict>('idle');
  const [status, setStatus] = useState<SetupStatus>(IDLE);
  const [runId, setRunId] = useState(0);
  const ready = orderVerdict === 'right' && status.moduleOk && status.paramsOk && status.payloadOk;

  return (
    <ToolFrame title="漏洞利用编排器" caption="模拟环境 · 不连接任何目标">
      <section className="subPanel">
        <b>第一步：给利用流程排序</b>
        <MsfOrder
          order={order}
          verdict={orderVerdict}
          onChange={(next) => {
            setOrder(next);
            setOrderVerdict('idle');
          }}
          onCheck={() => {
            const ok = order.every((id, index) => id === index + 1);
            setOrderVerdict(ok ? 'right' : 'wrong');
            log(ok ? '利用流程排序正确' : '流程顺序不对，红色标记的位置放错了', ok ? 'ok' : 'warn');
          }}
        />
      </section>

      <section className="subPanel">
        <b>第二步：选模块、配参数、选载荷</b>
        <MsfSetup
          status={status}
          onChange={(next) => {
            setStatus(next);
            setRunId(0);
          }}
        />
      </section>

      <section className="subPanel">
        <b>第三步：运行</b>
        <p className="caption">
          目标 {TARGET.ip}，回连到 {ATTACKER}:4444。三处全部选对后才能运行。
        </p>
        <div className="inlineForm">
          <Button
            className="btn btnPrimary"
            appearance="primary"
            icon={<Play20Regular />}
            disabled={!ready}
            onClick={() => setRunId((current) => current + 1)}
          >
            运行 exploit
          </Button>
        </div>
        <SimOutput
          key={runId}
          lines={msfOutput}
          active={runId > 0}
          label="msfconsole"
          onDone={() => {
            log('拿到 Meterpreter 会话，sysinfo 执行成功');
            complete();
          }}
        />
      </section>
    </ToolFrame>
  );
}
