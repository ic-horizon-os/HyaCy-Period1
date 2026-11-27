import { ArrowReset20Regular, WeatherMoon20Regular, WeatherSunny20Regular } from '@fluentui/react-icons';
import { Button, Switch, Tooltip } from '@fluentui/react-components';
import { useState } from 'react';
import type { ThemeName } from '../../hooks/useTheme';
import { ResetDialog } from './ResetDialog';

import { LAB_COUNT } from '../../state/rangeReducer';

interface TitleBarProps {
  theme: ThemeName;
  onToggleTheme: () => void;
  onReset: () => void;
  score: number;
  doneCount: number;
  inRange: boolean;
}

export function TitleBar({ theme, onToggleTheme, onReset, score, doneCount, inRange }: TitleBarProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <header className="titlebar">
      <div className="brand">
        <span className="brandName">
          HYACY<span>//LAB</span>
        </span>
        <span className="brandTag mono">教育沙盒</span>
      </div>

      {inRange && (
        <dl className="stats">
          <div className="stat">
            <dt>得分</dt>
            <dd className="mono">{String(score).padStart(3, '0')}</dd>
          </div>
          <div className="stat">
            <dt>进度</dt>
            <dd className="mono">
              {doneCount}/{LAB_COUNT}
            </dd>
          </div>
        </dl>
      )}

      <div className="titlebarActions">
        <Switch
          checked={theme === 'dark'}
          onChange={onToggleTheme}
          label={
            <>
              {theme === 'dark' ? <WeatherMoon20Regular /> : <WeatherSunny20Regular />}
              <span>{theme === 'dark' ? '深色' : '浅色'}模式</span>
            </>
          }
          aria-label="切换深色模式"
        />
        <Tooltip relationship="label" content="重置进度">
          <Button
            className="btn btnSubtle"
            appearance="transparent"
            icon={<ArrowReset20Regular />}
            onClick={() => setConfirmOpen(true)}
            aria-label="重置进度"
          />
        </Tooltip>
      </div>

      <ResetDialog open={confirmOpen} onOpenChange={setConfirmOpen} onReset={onReset} />
    </header>
  );
}
