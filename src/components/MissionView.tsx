import {
  ArrowRight16Regular,
  Checkmark16Filled,
  Lightbulb20Regular,
  ShieldCheckmark20Regular,
} from '@fluentui/react-icons';
import { Button, Popover, PopoverSurface, PopoverTrigger } from '@fluentui/react-components';
import { useCallback, useEffect, useState, type Dispatch } from 'react';
import { HINT_COST, LAB_COUNT, type RangeAction, type RangeState, type Tone } from '../state/rangeReducer';
import { labs } from '../data/labs';
import { cx } from '../cx';
import type { LabProps } from './labProps';
import { CaptureTool } from './missions/CaptureTool';
import { HashCrackTool } from './missions/HashCrackTool';
import { HashIdTool } from './missions/HashIdTool';
import { IdorTool } from './missions/IdorTool';
import { MsfTool } from './missions/MsfTool';
import { SqlInjectTool } from './missions/SqlInjectTool';
import { WpscanTool } from './missions/WpscanTool';

export interface RangeProps {
  state: RangeState;
  dispatch: Dispatch<RangeAction>;
}

function LabTool({ id, ...props }: LabProps & { id: number }) {
  switch (id) {
    case 0:
      return <HashIdTool {...props} />;
    case 1:
      return <HashCrackTool {...props} />;
    case 2:
      return <SqlInjectTool {...props} />;
    case 3:
      return <CaptureTool {...props} />;
    case 4:
      return <MsfTool {...props} />;
    case 5:
      return <WpscanTool {...props} />;
    default:
      return <IdorTool {...props} />;
  }
}

function Difficulty({ level }: { level: number }) {
  return (
    <div className="difficulty" aria-label={`难度 ${level} / 3`}>
      <small className="mono">难度</small>
      <span className="bars" aria-hidden>
        {[1, 2, 3].map((step) => (
          <i key={step} className={cx(step <= level && 'on')} />
        ))}
      </span>
    </div>
  );
}

export function MissionView({ state, dispatch }: RangeProps) {
  const lab = labs[state.current];
  const done = state.done[state.current];
  const last = state.current === LAB_COUNT - 1;
  const [hintOpen, setHintOpen] = useState(false);
  const number = `0${state.current + 1}`;

  const advance = useCallback(() => {
    if (state.done[state.current] && state.current < LAB_COUNT - 1) {
      dispatch({ type: 'open', view: 'mission', mission: state.current + 1 });
    }
  }, [state.done, state.current, dispatch]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const editing = (event.target as HTMLElement | null)?.closest('input, textarea, [contenteditable="true"]');
      if (event.key === 'Enter' && !editing && !document.querySelector('.fui-DialogSurface')) advance();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [advance]);

  const openHint = (open: boolean) => {
    setHintOpen(open);
    if (open) dispatch({ type: 'hint' });
  };

  const log = useCallback(
    (text: string, tone: Tone = 'info') => dispatch({ type: 'log', text, tone }),
    [dispatch],
  );

  return (
    <section className="mission" aria-label={`实验 ${number}`}>
      <div className="missionHead">
        <div>
          <span className="kicker mono">
            实验 {number} / 0{LAB_COUNT} · {lab.code}
          </span>
          <h2>{lab.title}</h2>
        </div>
        <Difficulty level={lab.difficulty} />
      </div>

      <LabTool
        id={state.current}
        log={log}
        complete={() =>
          dispatch({ type: 'complete', note: `${number} ${lab.note}`, log: `实验 ${number} 通过：${lab.title}` })
        }
      />

      {done && (
        <div className="labDone" role="status">
          <Checkmark16Filled />
          <span>
            <b>实验已通过。</b>这条结论已记进知识笔记：{lab.note}
          </span>
        </div>
      )}

      <div className="missionFoot">
        <div className="footActions">
          <Popover open={hintOpen} onOpenChange={(_, data) => openHint(data.open)} trapFocus positioning="below-start">
            <PopoverTrigger disableButtonEnhancement>
              <Button
                className="btn btnOutline"
                appearance="outline"
                icon={<Lightbulb20Regular />}
                onClick={() => openHint(!hintOpen)}
              >
                {state.hinted[state.current] ? '查看提示' : `请求提示（-${HINT_COST} 分）`}
              </Button>
            </PopoverTrigger>
            <PopoverSurface className="flyout">
              <p>{lab.hint}</p>
            </PopoverSurface>
          </Popover>

          {done && !last && (
            <div className="advance">
              <Button
                className="btn btnPrimary"
                appearance="primary"
                icon={<ArrowRight16Regular />}
                iconPosition="after"
                onClick={advance}
              >
                进入实验 0{state.current + 2}
              </Button>
              <small className="caption">先看看防护建议。按 Enter 继续。</small>
            </div>
          )}
        </div>

        {done && (
          <div className="defenseNote">
            <ShieldCheckmark20Regular />
            <div>
              <b>如何防护</b>
              <span>{lab.defense}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
