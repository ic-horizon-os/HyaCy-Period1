export type Stage = 'briefing' | 'range';
export type View = 'concepts' | 'mission';
export type Tone = 'info' | 'ok' | 'warn';

export interface LogEvent {
  id: number;
  text: string;
  tone: Tone;
}

export interface RangeState {
  stage: Stage;
  view: View;
  concept: number;
  flipped: boolean;
  read: boolean[];
  current: number;
  done: boolean[];
  hinted: boolean[];
  notes: string[];
  events: LogEvent[];
  celebrated: boolean;
}

export const LAB_COUNT = 7;
export const LAB_POINTS = 100;
export const HINT_COST = 15;

export function calcScore(state: Pick<RangeState, 'done' | 'hinted'>): number {
  return state.done.filter(Boolean).length * LAB_POINTS - state.hinted.filter(Boolean).length * HINT_COST;
}

function push(events: LogEvent[], text: string, tone: Tone = 'info'): LogEvent[] {
  const id = (events[events.length - 1]?.id ?? 0) + 1;
  return [...events.slice(-11), { id, text, tone }];
}

const initialEvents = (): LogEvent[] =>
  (
    [
    ['教学沙盒已启动', 'info'],
    ['7 个实验，全部在本地模拟', 'info'],
    ['等待学员确认实验须知…', 'warn'],
    ] as Array<[string, Tone]>
  ).map(([text, tone], id) => ({ id, text, tone }));

export const initialRange = (): RangeState => ({
  stage: 'briefing',
  view: 'concepts',
  concept: 0,
  flipped: false,
  read: Array.from({ length: 8 }, () => false),
  current: 0,
  done: Array.from({ length: LAB_COUNT }, () => false),
  hinted: Array.from({ length: LAB_COUNT }, () => false),
  notes: [],
  events: initialEvents(),
  celebrated: false,
});

export type RangeAction =
  | { type: 'accept' }
  | { type: 'open'; view: View; mission?: number }
  | { type: 'flip' }
  | { type: 'card'; index: number }
  | { type: 'nextCard' }
  | { type: 'prevCard' }
  | { type: 'skipCards' }
  | { type: 'log'; text: string; tone?: Tone }
  | { type: 'hint' }
  | { type: 'complete'; note: string; log: string }
  | { type: 'celebrate' }
  | { type: 'reset' };

export function rangeReducer(state: RangeState, action: RangeAction): RangeState {
  switch (action.type) {
    case 'accept':
      return { ...state, stage: 'range', view: 'concepts', events: push(state.events, '实验须知已确认，开始学习', 'ok') };
    case 'open':
      return { ...state, view: action.view, current: action.mission ?? state.current };
    case 'flip': {
      if (state.flipped) return { ...state, flipped: false };
      const read = [...state.read];
      read[state.concept] = true;
      return { ...state, flipped: true, read };
    }
    case 'card':
      return { ...state, concept: action.index, flipped: false };
    case 'nextCard':
      return state.concept >= 7
        ? { ...state, view: 'mission' }
        : { ...state, concept: state.concept + 1, flipped: false };
    case 'prevCard':
      return state.concept > 0 ? { ...state, concept: state.concept - 1, flipped: false } : state;
    case 'skipCards':
      return { ...state, view: 'mission', events: push(state.events, '教师模式：已跳过概念卡', 'warn') };
    case 'log':
      return { ...state, events: push(state.events, action.text, action.tone ?? 'info') };
    case 'hint': {
      if (state.hinted[state.current]) return state;
      const hinted = [...state.hinted];
      hinted[state.current] = true;
      return { ...state, hinted };
    }
    case 'complete': {
      if (state.done[state.current]) return state;
      const done = [...state.done];
      done[state.current] = true;
      return { ...state, done, notes: [...state.notes, action.note], events: push(state.events, action.log, 'ok') };
    }
    case 'celebrate':
      return { ...state, celebrated: true };
    case 'reset':
      return initialRange();
  }
}
