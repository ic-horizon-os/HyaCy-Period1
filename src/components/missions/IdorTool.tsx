import type { LabProps } from '../labProps';
import { ToolFrame } from '../ToolFrame';
import { IdorOrder } from './IdorOrder';

export function IdorTool({ log, complete }: LabProps) {
  return (
    <ToolFrame title="越权复现台" caption="订单页只认编号，不认人">
      <IdorOrder
        onBreach={(detail) => {
          log(`越权成功：${detail}`);
          complete();
        }}
      />
    </ToolFrame>
  );
}
