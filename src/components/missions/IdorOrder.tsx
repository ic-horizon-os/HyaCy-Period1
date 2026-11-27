import { Button, Input, Switch } from '@fluentui/react-components';
import { useState } from 'react';
import { cx } from '../../cx';
import { MY_ORDER, ORDER_URL, orderAccounts } from '../../data/exploitData';

interface IdorOrderProps {
  onBreach: (detail: string) => void;
}

/** 剧情 2：订单页只认地址里的 id，不核对登录身份。 */
export function IdorOrder({ onBreach }: IdorOrderProps) {
  const [query, setQuery] = useState(String(MY_ORDER));
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState<{ id: number; denied: boolean } | null>(null);

  const order = orderAccounts.find((item) => item.id === result?.id) ?? null;

  const go = () => {
    const id = Number(query.trim());
    if (!Number.isInteger(id) || !orderAccounts.some((item) => item.id === id)) {
      setResult(null);
      return;
    }
    const denied = checked && id !== MY_ORDER;
    setResult({ id, denied });
    if (!denied && id !== MY_ORDER) onBreach(`打开了 ${orderAccounts.find((item) => item.id === id)?.name} 的订单`);
  };

  return (
    <div className="subPanel">
      <p className="caption">你已登录，账号是 {orderAccounts[0].name}。改一改地址栏里的编号再前往。</p>
      <div className="addressBar">
        <span className="mono">{ORDER_URL}</span>
        <Input
          className="idInput"
          aria-label="订单编号"
          value={query}
          onChange={(_, data) => setQuery(data.value)}
          onKeyDown={(event) => event.key === 'Enter' && go()}
        />
        <Button className="btn btnSecondary" appearance="secondary" onClick={go}>
          前往
        </Button>
      </div>
      <Switch
        checked={checked}
        onChange={(_, data) => setChecked(data.checked)}
        label="服务端校验属主（站到防御方）"
      />
      <div className="account" aria-live="polite">
        {result === null && <p className="caption">还没有请求。</p>}
        {result?.denied && <p className="optionExplain wrong">403 拒绝访问：这张订单不属于当前登录用户。</p>}
        {order && !result?.denied && (
          <>
            <div className="accountHead">
              <span className="mono">订单 #{order.id}</span>
              <b className={cx(order.id !== MY_ORDER && 'warnText')}>{order.name}</b>
            </div>
            <p>{order.item}</p>
            <p className="caption">配送至 {order.address}</p>
            {order.id !== MY_ORDER && <p className="optionExplain wrong">这不是你的订单，地址和购买记录都看到了。</p>}
          </>
        )}
        {result && !order && <p className="optionExplain wrong">404 订单不存在。</p>}
      </div>
    </div>
  );
}
