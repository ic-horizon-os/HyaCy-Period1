import type { Tone } from '../state/rangeReducer';

export interface LabProps {
  log: (text: string, tone?: Tone) => void;
  complete: () => void;
}
