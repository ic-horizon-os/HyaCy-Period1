import {
  ArrowLeft16Regular,
  ArrowRight16Regular,
  ArrowStepOver20Regular,
} from '@fluentui/react-icons';
import { Button, ProgressBar } from '@fluentui/react-components';
import { cx } from '../cx';
import { concepts } from '../data/concepts';
import { KnowledgeCard } from './KnowledgeCard';

interface KnowledgeDeckProps {
  concept: number;
  flipped: boolean;
  read: boolean[];
  reviewing: boolean;
  onFlip: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  onDot: (index: number) => void;
}

export function KnowledgeDeck({
  concept,
  flipped,
  read,
  reviewing,
  onFlip,
  onNext,
  onPrev,
  onSkip,
  onDot,
}: KnowledgeDeckProps) {
  const last = concept >= concepts.length - 1;

  return (
    <section className="deck" aria-label="概念卡">
      <div className="deckHead">
        <div>
          <span className="kicker mono">开始之前 / 约 8 分钟</span>
          <h2>开始前的 8 张概念卡</h2>
        </div>
        {!reviewing && (
          <Button
            className="btn btnSubtle"
            appearance="transparent"
            icon={<ArrowStepOver20Regular />}
            onClick={onSkip}
          >
            跳过预习
          </Button>
        )}
      </div>

      <ProgressBar
        className="deckProgress"
        value={(concept + 1) / concepts.length}
        aria-label={`第 ${concept + 1} 张，共 ${concepts.length} 张`}
      />
      <p className="caption deckCount mono">
        卡片 0{concept + 1} / 0{concepts.length}
      </p>

      <KnowledgeCard
        concept={concepts[concept]}
        index={concept}
        flipped={flipped}
        onFlip={onFlip}
      />

      <div className="deckActions">
        <Button
          className="btn btnSecondary"
          appearance="secondary"
          icon={<ArrowLeft16Regular />}
          disabled={concept === 0}
          onClick={onPrev}
        >
          上一张
        </Button>

        <div className="deckDots" role="tablist" aria-label="选择概念卡">
          {concepts.map((item, index) => (
            <button
              key={item.term}
              type="button"
              role="tab"
              aria-selected={index === concept}
              aria-label={`第 ${index + 1} 张：${item.term}`}
              className={cx('dot', index === concept && 'active', read[index] && 'done')}
              onClick={() => onDot(index)}
            />
          ))}
        </div>

        <Button
          className="btn btnPrimary"
          appearance="primary"
          disabled={!flipped}
          icon={<ArrowRight16Regular />}
          iconPosition="after"
          onClick={onNext}
        >
          {last ? (reviewing ? '返回实验' : '进入第一个实验') : '下一张'}
        </Button>
      </div>

      <p className="teacherTip">
        <b>课堂用法：</b>先让学生举手猜答案，再翻面。每张卡一分钟左右。
      </p>
    </section>
  );
}
