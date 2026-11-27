import { cx } from '../../cx';

interface SegmentedProps {
  items: Array<{ id: string; label: string }>;
  value: string;
  onChange: (id: string) => void;
  label: string;
}

export function Segmented({ items, value, onChange, label }: SegmentedProps) {
  return (
    <div className="segment" role="tablist" aria-label={label}>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={item.id === value}
          className={cx('segmentItem', item.id === value && 'selected')}
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
