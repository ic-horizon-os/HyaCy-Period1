import { ArrowRotateClockwise20Regular } from '@fluentui/react-icons';
import { cx } from '../cx';
import type { Concept } from '../data/concepts';

interface KnowledgeCardProps {
  concept: Concept;
  index: number;
  flipped: boolean;
  onFlip: () => void;
}

export function KnowledgeCard({ concept, index, flipped, onFlip }: KnowledgeCardProps) {
  const Icon = concept.icon;

  return (
    <button
      type="button"
      className={cx('flipCard', flipped && 'flipped')}
      onClick={onFlip}
      aria-label={flipped ? '翻回问题面' : '翻到答案面'}
    >
      <span className="flipInner">
        <span className="flipFace cardFront">
          <span className="cardCode mono">概念卡 0{index + 1}</span>
          <span className="cardIcon">
            <Icon />
          </span>
          <span className="cardTag">基本概念</span>
          <span className="cardTerm">{concept.term}</span>
          <span className="cardAsk">{concept.ask}</span>
          <span className="cardHint">
            <ArrowRotateClockwise20Regular /> 点击卡片，翻面查看答案
          </span>
        </span>

        <span className="flipFace cardBack">
          <span className="cardCode mono">答案</span>
          <span className="cardTag">
            {concept.term} 相当于
          </span>
          <span className="cardAnalogy">{concept.analogy}</span>
          <span className="cardExplain">{concept.explain}</span>
          <span className="cardRange">
            <b>在实验里</b>
            <span>{concept.range}</span>
          </span>
          <span className="cardHint">
            <ArrowRotateClockwise20Regular /> 点击卡片，返回问题
          </span>
        </span>
      </span>
    </button>
  );
}
