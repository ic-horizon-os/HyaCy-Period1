import { Button, Field, Input } from '@fluentui/react-components';
import { useState } from 'react';
import { cx } from '../../cx';
import { applyFilter, detailLines, filterPresets, FTP_ANSWER, FTP_STREAM, ftpStream, packets } from '../../data/captureData';
import type { LabProps } from '../labProps';
import { ToolFrame } from '../ToolFrame';

export function CaptureTool({ log, complete }: LabProps) {
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState<number | null>(null);
  const [streamOpen, setStreamOpen] = useState(false);
  const [answer, setAnswer] = useState('');
  const [tried, setTried] = useState(false);

  const { rows, valid } = applyFilter(filter);
  const packet = selected === null ? null : packets[selected - 1];

  const submit = () => {
    if (answer === FTP_ANSWER) {
      log('从 FTP 流里找到了明文密码');
      complete();
    } else {
      setTried(true);
      log('密码不对，再看看 PASS 那一行', 'warn');
    }
  };

  return (
    <ToolFrame title="流量分析器" caption="12 个数据包 · 显示过滤器可实时筛选">
      <div className="captureBar">
        <span className="mono caption">显示过滤器</span>
        <Input
          className="filterInput"
          value={filter}
          placeholder="例如：ftp 或 tcp.port == 21"
          aria-label="显示过滤器"
          onChange={(_, data) => setFilter(data.value)}
        />
        {!valid && <span className="filterError">这个写法不支持，试试预设条件。</span>}
      </div>
      <div className="presets">
        {filterPresets.map((preset) => (
          <button key={preset} type="button" className={cx('preset mono', filter === preset && 'active')} onClick={() => setFilter(preset)}>
            {preset}
          </button>
        ))}
        <span className="caption">匹配到 {valid ? rows.length : 0} 个包</span>
      </div>

      <div className="captureBody">
        <div className="captureList" role="listbox" aria-label="数据包列表">
          <div className="captureRow captureHead mono">
            <span>No.</span>
            <span>时间</span>
            <span>源地址</span>
            <span>目的地址</span>
            <span>协议</span>
            <span>信息</span>
          </div>
          {rows.map((item) => (
            <button
              key={item.no}
              type="button"
              role="option"
              aria-selected={selected === Number(item.no)}
              className={cx('captureRow mono', selected === Number(item.no) && 'selected')}
              onClick={() => {
                setSelected(Number(item.no));
                setStreamOpen(false);
              }}
            >
              <span>{item.no}</span>
              <span>{item.time}</span>
              <span>{item.src}</span>
              <span>{item.dst}</span>
              <span className={cx('protoTag', item.sport === 21 || item.dport === 21 ? 'warn' : item.proto === 'UDP' ? 'alt' : '')}>{item.proto}</span>
              <span className="captureInfo">{item.summary}</span>
            </button>
          ))}
        </div>

        <div className="captureDetail">
          {packet === null ? (
            <p className="caption">选一个数据包查看分层详情。</p>
          ) : (
            <>
              <pre className="codeBlock mono small">{detailLines(packet).join('\n')}</pre>
              {packet.stream === FTP_STREAM ? (
                <Button className="btn btnSecondary" appearance="secondary" onClick={() => setStreamOpen(true)}>
                  追踪 TCP 流（#{FTP_STREAM}）
                </Button>
              ) : (
                <p className="caption">这个包属于 TLS 加密流量，读不出内容。</p>
              )}
            </>
          )}
          {streamOpen && (
            <>
              <pre className="codeBlock mono small stream">
                {ftpStream.map((line) => (
                  <span key={line} className={cx('streamLine', /^(USER|PASS|RETR)/.test(line) && 'client')}>
                    {line}
                  </span>
                ))}
              </pre>
              <Field
                label="流里的密码是什么？"
                validationState={tried ? 'error' : 'none'}
                validationMessage={tried ? '不对，注意 PASS 后面的内容。' : undefined}
              >
                <div className="inlineForm">
                  <Input
                    className="answerInput"
                    value={answer}
                    placeholder="输入密码"
                    onChange={(_, data) => setAnswer(data.value)}
                    onKeyDown={(event) => event.key === 'Enter' && submit()}
                  />
                  <Button className="btn btnPrimary" appearance="primary" disabled={!answer.trim()} onClick={submit}>
                    提交
                  </Button>
                </div>
              </Field>
            </>
          )}
        </div>
      </div>
    </ToolFrame>
  );
}
