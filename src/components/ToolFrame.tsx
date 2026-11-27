import type { ReactNode } from 'react';

interface ToolFrameProps {
  title: string;
  caption: string;
  children: ReactNode;
}

export function ToolFrame({ title, caption, children }: ToolFrameProps) {
  return (
    <div className="tool">
      <div className="toolHead">
        <b>{title}</b>
        <span className="mono">{caption}</span>
      </div>
      {children}
    </div>
  );
}
