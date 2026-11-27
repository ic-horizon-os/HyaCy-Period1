import { Checkmark16Filled } from '@fluentui/react-icons';
import { Button } from '@fluentui/react-components';
import { useEffect, useState } from 'react';
import { cx } from '../../cx';
import { candidates, networks, PLAIN_HASH, saltRows, TARGET_HASH } from '../../data/hashData';
import { looksLikeTarget, sha256 } from '../../lib/sha256';
import type { LabProps } from '../labProps';
import { ToolFrame } from '../ToolFrame';
import { OptionCards, type Verdict } from '../common/OptionCards';

interface Progress {
  done: number;
  hit: number | null;
}

export function HashCrackTool({ log, complete }: LabProps) {
  const [progress, setProgress] = useState<Progress>({ done: 0, hit: null });
  const [running, setRunning] = useState(false);
  const [network, setNetwork] = useState<string | null>(null);
  const [verdict, setVerdict] = useState<Verdict>('idle');

  useEffect(() => {
    if (!running) return;
    if (progress.hit !== null || progress.done >= candidates.length) {
      setRunning(false);
      return;
    }
    const timer = setTimeout(async () => {
      const candidate = candidates[progress.done];
      const matched = looksLikeTarget(await sha256(candidate.password));
      if (matched) {
        setProgress((current) => ({ ...current, hit: candidate.rank - 1 }));
        log(`第 ${candidate.rank} 次比对命中：${candidate.password}`);
        complete();
      } else {
        setProgress((current) => ({ ...current, done: current.done + 1 }));
      }
    }, 450);
    return () => clearTimeout(timer);
  }, [running, progress]);

  const restart = () => {
    setProgress({ done: 0, hit: null });
    setRunning(true);
  };

  return (
    <ToolFrame title="字典比对器" caption="6 个候选口令 · 浏览器本地计算 SHA-256">
      <div className="subPanel">
        <b>第一步：比对字典</b>
        <p className="caption">库里只存着这串摘要。把字典里的每个口令算一遍哈希，和它相同的那个就是原口令。</p>
        <code className="monoBox">{TARGET_HASH}</code>
        <ul className="sampleList">
          {candidates.map((candidate) => {
            const tried = candidate.rank - 1 < progress.done;
            const hit = progress.hit === candidate.rank - 1;
            const pending = running && candidate.rank - 1 === progress.done;
            return (
              <li key={candidate.password} className={cx('sampleRow', hit && 'right', tried && 'miss')}>
                <span className="mono rank">#{candidate.rank}</span>
                <code className="mono sampleHash">{tried || hit ? candidate.sha256 : '•'.repeat(64)}</code>
                <span className={cx('sampleState', hit ? 'right' : pending ? 'pending' : 'idle')}>
                  {hit ? (
                    <>
                      <Checkmark16Filled /> 命中 {candidate.password}
                    </>
                  ) : (
                    (pending ? '计算中' : tried ? '不匹配' : '等待')
                  )}
                </span>
              </li>
            );
          })}
        </ul>
        <div className="inlineForm">
          <Button className="btn btnPrimary" appearance="primary" disabled={running} onClick={restart}>
            {progress.done > 0 || progress.hit !== null ? '重新比对' : '开始比对'}
          </Button>
          {progress.hit !== null && <span className="caption">共比对 {progress.hit + 1} 次，耗时不到一秒。</span>}
        </div>
      </div>

      <div className="subPanel">
        <b>第二步：看看加盐之后</b>
        <p className="caption">lin 和 mo 用的是同一个口令。加了各自的盐，存下来的摘要就不再相同。</p>
        <table className="compareTable">
          <thead>
            <tr>
              <th>用户</th>
              <th>盐</th>
              <th>SHA-256(盐 + 口令)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>不加盐</td>
              <td className="mono">-</td>
              <td className="mono">{PLAIN_HASH.slice(0, 24)}…</td>
            </tr>
            {saltRows.map((row) => (
              <tr key={row.user}>
                <td>{row.user}</td>
                <td className="mono">{row.salt}</td>
                <td className="mono">{row.hash.slice(0, 24)}…</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="subPanel">
        <b>第三步：哪种握手能离线跑字典？</b>
        <OptionCards
          label="无线网络握手"
          options={networks}
          value={network}
          verdict={verdict}
          onPick={(id) => {
            setNetwork(id);
            setVerdict(networks.find((item) => item.id === id)?.ok ? 'right' : 'wrong');
          }}
        />
      </div>
    </ToolFrame>
  );
}
