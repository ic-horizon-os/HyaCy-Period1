import { useEffect, useState } from 'react';

interface SimOutputProps {
  lines: string[];
  active: boolean;
  label: string;
  idleText?: string;
  onDone?: () => void;
}

/** 逐行输出的模拟终端面板，active 置为 true 时从头播放 */
export function SimOutput({ lines, active, label, idleText = '等待运行…', onDone }: SimOutputProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    setCount(0);
    const timers = lines.map((_, index) =>
      setTimeout(() => {
        setCount(index + 1);
        if (index === lines.length - 1) onDone?.();
      }, 200 * (index + 1)),
    );
    return () => timers.forEach(clearTimeout);
  }, [active, lines]);

  return (
    <div className="simOutput" role="log" aria-label={label} aria-live="polite">
      <div className="simOutputHead mono">
        <span className="simDot" aria-hidden />
        {label}
      </div>
      <pre className="simOutputBody mono">
        {!active || count === 0 ? <span className="simDim">{idleText}</span> : lines.slice(0, count).join('\n')}
        {active && count > 0 && '\n'}
      </pre>
    </div>
  );
}
