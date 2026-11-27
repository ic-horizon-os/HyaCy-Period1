import { ArrowDown16Regular, ArrowUp16Regular } from '@fluentui/react-icons';
import { Button } from '@fluentui/react-components';
import { cx } from '../../cx';
import { msfSteps } from '../../data/exploitData';
import type { Verdict } from '../common/OptionCards';

interface MsfOrderProps {
  order: number[];
  verdict: Verdict;
  onChange: (order: number[]) => void;
  onCheck: () => void;
}

const move = (order: number[], from: number, to: number) => {
  const next = [...order];
  [next[from], next[to]] = [next[to], next[from]];
  return next;
};

export function MsfOrder({ order, verdict, onChange, onCheck }: MsfOrderProps) {
  const textOf = (id: number) => msfSteps.find((step) => step.id === id)?.text ?? '';
  const correctAt = (id: number, index: number) => id === index + 1;

  return (
    <>
      <p className="caption">用上下箭头把六步排成正确顺序。</p>
      <ol className="orderList">
        {order.map((id, index) => (
          <li key={id} className={cx('orderRow', verdict !== 'idle' && (correctAt(id, index) ? 'right' : 'wrong'))}>
            <span className="mono orderIndex">{index + 1}</span>
            <span className="orderText">{textOf(id)}</span>
            <span className="orderActions">
              <Button
                className="btn btnSubtle btnSmall"
                appearance="transparent"
                size="small"
                icon={<ArrowUp16Regular />}
                disabled={index === 0}
                aria-label={`上移：${textOf(id)}`}
                onClick={() => onChange(move(order, index, index - 1))}
              />
              <Button
                className="btn btnSubtle btnSmall"
                appearance="transparent"
                size="small"
                icon={<ArrowDown16Regular />}
                disabled={index === order.length - 1}
                aria-label={`下移：${textOf(id)}`}
                onClick={() => onChange(move(order, index, index + 1))}
              />
            </span>
          </li>
        ))}
      </ol>
      <Button className="btn btnSecondary" appearance="secondary" onClick={onCheck}>
        检查顺序
      </Button>
    </>
  );
}
