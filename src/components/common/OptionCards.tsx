import { Checkmark16Filled, Dismiss16Filled } from '@fluentui/react-icons';
import { cx } from '../../cx';
import type { Option } from '../../data/hashData';

export type Verdict = 'idle' | 'right' | 'wrong';

interface OptionCardsProps {
  options: Option[];
  label: string;
  value: string | null;
  onPick: (id: string) => void;
  verdict: Verdict;
}

export function OptionCards({ options, label, value, onPick, verdict }: OptionCardsProps) {
  const selected = options.find((option) => option.id === value) ?? null;
  const answer = options.find((option) => option.ok);
  const explain = verdict === 'wrong' ? (selected?.why ?? '') + ' ' + answer?.why : selected?.why;

  return (
    <div className="optionGroup">
      <div className="optionGrid" role="radiogroup" aria-label={label}>
        {options.map((option) => {
          const isPicked = option.id === value;
          const isAnswer = verdict === 'wrong' && option.ok;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isPicked}
              className={cx('optionCard monoLabel', isPicked && 'selected', verdict !== 'idle' && isPicked && verdict, isAnswer && 'answer')}
              onClick={() => onPick(option.id)}
            >
              <span className="optionLabel">{option.label}</span>
              <span className="optionCaption">{option.caption}</span>
              {verdict !== 'idle' && isPicked && (
                <span className={cx('optionState', verdict)}>
                  {verdict === 'right' ? <Checkmark16Filled /> : <Dismiss16Filled />}
                  {verdict === 'right' ? '正确' : '不对'}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {verdict !== 'idle' && explain && <p className={cx('optionExplain', verdict)}>{explain.trim()}</p>}
    </div>
  );
}
