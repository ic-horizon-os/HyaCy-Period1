import {
  Checkmark16Filled,
  Collections20Regular,
  LockClosed16Regular,
  PanelLeftContract20Regular,
  PanelLeftExpand20Regular,
} from '@fluentui/react-icons';
import { Button, Tooltip } from '@fluentui/react-components';
import type { Dispatch } from 'react';
import { cx } from '../../cx';
import { labs } from '../../data/labs';
import type { RangeAction, RangeState, View } from '../../state/rangeReducer';

interface NavViewProps {
  state: RangeState;
  dispatch: Dispatch<RangeAction>;
  expanded: boolean;
  onToggleExpanded: () => void;
}

export function NavView({ state, dispatch, expanded, onToggleExpanded }: NavViewProps) {
  const select = (view: View, mission?: number) => dispatch({ type: 'open', view, mission });

  return (
    <nav className={cx('nav', !expanded && 'collapsed')} aria-label="实验导航">
      <Tooltip relationship="label" content={expanded ? '折叠导航' : '展开导航'}>
        <Button
          className="btn btnSubtle navToggle"
          appearance="transparent"
          icon={expanded ? <PanelLeftContract20Regular /> : <PanelLeftExpand20Regular />}
          onClick={onToggleExpanded}
          aria-label={expanded ? '折叠导航' : '展开导航'}
          aria-expanded={expanded}
        />
      </Tooltip>

      <ul className="navList">
        <li>
          <Tooltip relationship="label" content="概念卡">
            <button
              type="button"
              className={cx('navItem', state.view === 'concepts' && 'selected')}
              aria-current={state.view === 'concepts' ? 'page' : undefined}
              onClick={() => select('concepts')}
            >
              <span className="navIndicator" aria-hidden />
              <Collections20Regular className="navIcon" />
              <span className="navText">
                <b>概念卡</b>
                <small className="mono">已读 {state.read.filter(Boolean).length}/8</small>
              </span>
            </button>
          </Tooltip>
        </li>

        {labs.map((lab, index) => {
          const locked = index > 0 && !state.done[index - 1] && !state.done[index];
          const active = state.view === 'mission' && state.current === index;
          return (
            <li key={lab.id}>
              <Tooltip relationship="label" content={lab.title}>
                <button
                  type="button"
                  className={cx('navItem', active && 'selected')}
                  aria-current={active ? 'page' : undefined}
                  aria-disabled={locked}
                  disabled={locked}
                  onClick={() => select('mission', index)}
                >
                  <span className="navIndicator" aria-hidden />
                  <lab.icon className="navIcon" />
                  <span className="navText">
                    <b>
                      <span className="mono navStep">0{index + 1}</span> {lab.short}
                    </b>
                    <small className="mono">{lab.code}</small>
                  </span>
                  <span className="navStatus">
                    {state.done[index] ? (
                      <Checkmark16Filled className="navDone" />
                    ) : (
                      !locked && <LockClosed16Regular className="navOpen" />
                    )}
                  </span>
                </button>
              </Tooltip>
            </li>
          );
        })}
      </ul>

      <div className="navScope">
        <b className="mono">实验边界</b>
        <p>全部在浏览器里模拟</p>
      </div>
    </nav>
  );
}
