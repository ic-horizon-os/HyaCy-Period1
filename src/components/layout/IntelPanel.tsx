import {
  Checkmark16Regular,
  Desktop20Regular,
  ErrorCircle16Regular,
  Info16Regular,
  Payment20Regular,
  Server20Regular,
  Wifi120Regular,
} from '@fluentui/react-icons';
import { cx } from '../../cx';
import type { LogEvent } from '../../state/rangeReducer';

const nodes = [
  { label: 'KALI', icon: Desktop20Regular, on: 4 },
  { label: 'WEB', icon: Server20Regular, on: 2 },
  { label: 'WIFI', icon: Wifi120Regular, on: 1 },
  { label: 'NFC', icon: Payment20Regular, on: 6 },
];
const linkOn = [4, 2, 1];

function EnvMap({ done }: { done: boolean[] }) {
  return (
    <div className="netMap" role="img" aria-label="实验环境：KALI 攻击机、WEB 服务器、无线网络、饭卡终端">
      {nodes.map((node, index) => (
        <div className="netCell" key={node.label}>
          {index > 0 && <span className={cx('netLink', done[linkOn[index - 1]] && 'on')} />}
          <span className={cx('netNode', done[node.on] && 'on')}>
            <node.icon />
          </span>
          <small className="mono">{node.label}</small>
        </div>
      ))}
    </div>
  );
}

const toneIcon = { info: Info16Regular, ok: Checkmark16Regular, warn: ErrorCircle16Regular };

function EventStream({ events }: { events: LogEvent[] }) {
  return (
    <div className="panel">
      <p className="panelTitle mono">事件流</p>
      <ol className="eventList" aria-live="polite">
        {events.map((event) => {
          const Icon = toneIcon[event.tone];
          return (
            <li key={event.id} className={cx('eventItem', event.tone)}>
              <Icon />
              <span>{event.text}</span>
            </li>
          );
        })}
      </ol>
      <span className="eventCursor mono" aria-hidden>
        _
      </span>
    </div>
  );
}

function Notes({ notes }: { notes: string[] }) {
  return (
    <div className="panel">
      <p className="panelTitle mono">知识笔记 {notes.length}</p>
      {notes.length === 0 ? (
        <p className="caption">通过实验后，每个实验的一句话结论会记在这里。</p>
      ) : (
        <ol className="clueList">
          {notes.map((note) => (
            <li key={note} className="clueItem noteItem">
              {note}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export function IntelPanel({ done, notes, events }: { done: boolean[]; notes: string[]; events: LogEvent[] }) {
  return (
    <aside className="intel" aria-label="学习面板">
      <div className="panel">
        <p className="panelTitle mono">实验环境</p>
        <EnvMap done={done} />
      </div>
      <Notes notes={notes} />
      <EventStream events={events} />
    </aside>
  );
}
