import { Button, Select } from '@fluentui/react-components';
import { useState } from 'react';
import {
  hostChoices,
  LHOST_ANSWER,
  msfModules,
  msfPayloads,
  RHOSTS_ANSWER,
  TARGET,
} from '../../data/exploitData';
import { OptionCards, type Verdict } from '../common/OptionCards';

export interface SetupStatus {
  moduleOk: boolean;
  paramsOk: boolean;
  payloadOk: boolean;
}

const IDLE: SetupStatus = { moduleOk: false, paramsOk: false, payloadOk: false };

interface MsfSetupProps {
  status: SetupStatus;
  onChange: (status: SetupStatus) => void;
}

export function MsfSetup({ status, onChange }: MsfSetupProps) {
  const [module, setModule] = useState<string | null>(null);
  const [moduleVerdict, setModuleVerdict] = useState<Verdict>('idle');
  const [payload, setPayload] = useState<string | null>(null);
  const [payloadVerdict, setPayloadVerdict] = useState<Verdict>('idle');
  const [rhosts, setRhosts] = useState('');
  const [lhost, setLhost] = useState('');
  const [paramsVerdict, setParamsVerdict] = useState<Verdict>('idle');

  const pickModule = (id: string) => {
    const ok = msfModules.find((item) => item.id === id)?.ok ?? false;
    setModule(id);
    setModuleVerdict(ok ? 'right' : 'wrong');
    onChange({ ...status, moduleOk: ok });
  };

  const pickPayload = (id: string) => {
    const ok = msfPayloads.find((item) => item.id === id)?.ok ?? false;
    setPayload(id);
    setPayloadVerdict(ok ? 'right' : 'wrong');
    onChange({ ...status, payloadOk: ok });
  };

  const checkParams = () => {
    const ok = rhosts === RHOSTS_ANSWER && lhost === LHOST_ANSWER;
    setParamsVerdict(ok ? 'right' : 'wrong');
    onChange({ ...status, paramsOk: ok });
  };

  return (
    <>
      <div className="targetInfo">
        <b>目标信息</b>
        <span className="mono">
          {TARGET.ip} · {TARGET.os} · {TARGET.service}
        </span>
      </div>

      <h4 className="stepTitle">选择 exploit 模块</h4>
      <OptionCards label="exploit 模块" options={msfModules} value={module} verdict={moduleVerdict} onPick={pickModule} />

      <h4 className="stepTitle">配置参数</h4>
      <div className="paramGrid">
        <label className="paramRow">
          <span className="mono">RHOSTS（目标地址）</span>
          <Select className="pickSelect" value={rhosts} onChange={(_, data) => setRhosts(data.value)}>
            <option value="">选择</option>
            {hostChoices.map((ip) => (
              <option key={ip} value={ip}>
                {ip}
              </option>
            ))}
          </Select>
        </label>
        <label className="paramRow">
          <span className="mono">LHOST（回连地址）</span>
          <Select className="pickSelect" value={lhost} onChange={(_, data) => setLhost(data.value)}>
            <option value="">选择</option>
            {hostChoices.map((ip) => (
              <option key={ip} value={ip}>
                {ip}
              </option>
            ))}
          </Select>
        </label>
        <Button
          className="btn btnSecondary"
          appearance="secondary"
          disabled={!rhosts || !lhost}
          onClick={checkParams}
        >
          检查参数
        </Button>
      </div>
      {paramsVerdict === 'wrong' && <p className="optionExplain wrong">RHOSTS 填目标的地址，LHOST 填攻击机自己的地址。</p>}
      {paramsVerdict === 'right' && <p className="optionExplain right">参数正确。</p>}

      <h4 className="stepTitle">选择 Payload</h4>
      <OptionCards label="Payload" options={msfPayloads} value={payload} verdict={payloadVerdict} onPick={pickPayload} />
    </>
  );
}

export { IDLE };
