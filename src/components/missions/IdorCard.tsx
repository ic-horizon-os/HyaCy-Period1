import { Payment20Regular } from '@fluentui/react-icons';
import { Button, Input, Switch } from '@fluentui/react-components';
import { useState } from 'react';
import { cx } from '../../cx';
import { cardAccounts, MY_CARD } from '../../data/exploitData';

interface IdorCardProps {
  onBreach: (detail: string) => void;
}

/** 剧情 1：A 校 NFC 饭卡。刷卡即可在食堂消费，也用作校内身份识别。 */
export function IdorCard({ onBreach }: IdorCardProps) {
  const [uid, setUid] = useState(MY_CARD);
  const [verified, setVerified] = useState(false);
  const [shown, setShown] = useState<string | null>(null);
  const [rejected, setRejected] = useState(false);
  const [spent, setSpent] = useState(false);

  const account = cardAccounts.find((item) => item.uid === shown) ?? null;

  const read = () => {
    setSpent(false);
    const known = cardAccounts.find((item) => item.uid === uid.trim().toUpperCase());
    if (!known) {
      setShown(null);
      setRejected(true);
      return;
    }
    if (verified && known.uid !== MY_CARD) {
      setShown(null);
      setRejected(true);
      return;
    }
    setRejected(false);
    setShown(known.uid);
    if (known.uid !== MY_CARD) onBreach(`读到了 ${known.name} 的饭卡余额`);
  };

  return (
    <div className="twoCol">
      <div className="subPanel">
        <b>最近刷卡记录</b>
        <p className="caption">点一条记录，把终端要读的卡号换成它。</p>
        <ul className="sampleList">
          {cardAccounts.map((item, index) => (
            <li key={item.uid} className={cx('sampleRow', 'clickable', uid === item.uid && 'picked')}>
              <button type="button" className="rowButton" onClick={() => setUid(item.uid)}>
                <span className="mono">{item.uid}</span>
                <span>{item.name}</span>
                <small className="mono">{['12:04', '12:07', '12:11'][index]}</small>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="subPanel">
        <b>食堂终端</b>
        <div className="reader">
          <span className="readerIcon" aria-hidden>
            <Payment20Regular />
          </span>
          <Input
            className="monoInput"
            aria-label="卡号"
            value={uid}
            onChange={(_, data) => setUid(data.value)}
          />
          <Button className="btn btnPrimary" appearance="primary" onClick={read}>
            读卡
          </Button>
        </div>
        <Switch
          checked={verified}
          onChange={(_, data) => setVerified(data.checked)}
          label="校验卡内密钥（一卡一密）"
        />
        <div className="account" aria-live="polite">
          {rejected && <p className="optionExplain wrong">{verified ? '密钥校验失败：这张卡是复制的。' : '卡号不存在。'}</p>}
          {account && (
            <>
              <div className="accountHead">
                <span className="mono">{account.uid}</span>
                <b>{account.name}</b>
              </div>
              <p className="balance mono">¥ {spent ? (account.balance - 15).toFixed(2) : account.balance.toFixed(2)}</p>
              {account.uid !== MY_CARD ? (
                <>
                  <Button className="btn btnSecondary" appearance="secondary" disabled={spent} onClick={() => setSpent(true)}>
                    消费 ¥15.00
                  </Button>
                  {spent && <p className="optionExplain wrong">扣款成功。你花的是别人的钱。</p>}
                </>
              ) : (
                <p className="caption">这是你自己的卡。</p>
              )}
            </>
          )}
          {!rejected && !account && <p className="caption">还没读卡。</p>}
        </div>
      </div>
    </div>
  );
}
