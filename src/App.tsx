import { FluentProvider } from '@fluentui/react-components';
import { useCallback, useEffect, useReducer, useState, type Dispatch } from 'react';
import { Briefing } from './components/Briefing';
import { CompleteDialog } from './components/CompleteDialog';
import { KnowledgeDeck } from './components/KnowledgeDeck';
import { MissionView } from './components/MissionView';
import { IntelPanel } from './components/layout/IntelPanel';
import { NavView } from './components/layout/NavView';
import { TitleBar } from './components/layout/TitleBar';
import { useTheme } from './hooks/useTheme';
import {
  calcScore,
  LAB_COUNT,
  initialRange,
  rangeReducer,
  type RangeAction,
  type RangeState,
} from './state/rangeReducer';
import { themes } from './theme';

const NAV_STORAGE_KEY = 'hyacy-nav';
const NARROW = 760;

function initialExpanded(): boolean {
  return window.innerWidth > NARROW && localStorage.getItem(NAV_STORAGE_KEY) !== '0';
}

function Deck({ state, dispatch }: { state: RangeState; dispatch: Dispatch<RangeAction> }) {
  return (
    <KnowledgeDeck
      concept={state.concept}
      flipped={state.flipped}
      read={state.read}
      reviewing={state.read.some(Boolean) && state.done.some(Boolean)}
      onFlip={() => dispatch({ type: 'flip' })}
      onNext={() => dispatch({ type: 'nextCard' })}
      onPrev={() => dispatch({ type: 'prevCard' })}
      onSkip={() => dispatch({ type: 'skipCards' })}
      onDot={(index) => dispatch({ type: 'card', index })}
    />
  );
}

export default function App() {
  const [theme, toggleTheme] = useTheme();
  const [state, dispatch] = useReducer(rangeReducer, undefined, initialRange);
  const [expanded, setExpanded] = useState(initialExpanded);
  const score = calcScore(state);
  const doneCount = state.done.filter(Boolean).length;
  const inRange = state.stage === 'range';

  useEffect(() => {
    if (window.innerWidth > NARROW) return;
    const onResize = () => setExpanded(window.innerWidth > NARROW);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const toggleExpanded = useCallback(() => {
    setExpanded((current) => {
      try {
        localStorage.setItem(NAV_STORAGE_KEY, current ? '0' : '1');
      } catch {
        /* 忽略存储失败 */
      }
      return !current;
    });
  }, []);

  return (
    <>
      <div className="wallpaper" aria-hidden />
      <FluentProvider theme={themes[theme]} className="win">
        <div className="window">
          <TitleBar
            theme={theme}
            onToggleTheme={toggleTheme}
            onReset={() => dispatch({ type: 'reset' })}
            score={score}
            doneCount={doneCount}
            inRange={inRange}
          />

          {!inRange ? (
            <Briefing onAccept={() => dispatch({ type: 'accept' })} />
          ) : (
            <div className="body">
              <NavView
                state={state}
                dispatch={dispatch}
                expanded={expanded}
                onToggleExpanded={toggleExpanded}
              />
              <div className="stage">
                <main className="stageMain">
                  {state.view === 'concepts' ? (
                    <Deck state={state} dispatch={dispatch} />
                  ) : (
                    <MissionView state={state} dispatch={dispatch} />
                  )}
                </main>
                <IntelPanel done={state.done} notes={state.notes} events={state.events} />
              </div>
            </div>
          )}
        </div>

        <CompleteDialog
          open={state.done[LAB_COUNT - 1] && !state.celebrated}
          score={score}
          onClose={() => dispatch({ type: 'celebrate' })}
        />
      </FluentProvider>
    </>
  );
}
