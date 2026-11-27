import { Checkmark16Filled, LockClosed20Regular } from '@fluentui/react-icons';
import { Button, Field, Input, Switch } from '@fluentui/react-components';
import { useState } from 'react';
import { cx } from '../../cx';
import { SQL_PASS, SQL_USER } from '../../data/hashData';
import type { LabProps } from '../labProps';
import { ToolFrame } from '../ToolFrame';

type Result = 'idle' | 'fail' | 'ok' | 'admin';

export function SqlInjectTool({ log, complete }: LabProps) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [safe, setSafe] = useState(false);
  const [result, setResult] = useState<Result>('idle');

  // 压掉空白后匹配「单引号 + OR 1=1」
  const injected = /'or1=1/.test(user.toLowerCase().replace(/\s+/g, ''));
  const exact = user === SQL_USER && pass === SQL_PASS;

  const login = () => {
    const next: Result = safe ? (exact ? 'ok' : 'fail') : injected ? 'admin' : exact ? 'ok' : 'fail';
    setResult(next);
    if (next === 'admin') {
      log('注入成功：以 administrator 身份登录');
      complete();
    } else if (next === 'ok') {
      log('账号密码正确，正常登录');
    } else {
      log('登录被拒绝', 'warn');
    }
  };

  return (
    <ToolFrame title="模拟登录框" caption="下方的 SQL 预览随输入实时变化">
      <div className="twoCol">
        <div className="subPanel">
          <Field label="用户名">
            <Input value={user} placeholder="输入用户名" onChange={(_, data) => setUser(data.value)} />
          </Field>
          <Field label="密码">
            <Input
              type="password"
              value={pass}
              placeholder="输入密码"
              onChange={(_, data) => setPass(data.value)}
              onKeyDown={(event) => event.key === 'Enter' && login()}
            />
          </Field>
          <div className="inlineForm">
            <Button className="btn btnPrimary" appearance="primary" onClick={login}>
              登录
            </Button>
            <Switch
              checked={safe}
              onChange={(_, data) => setSafe(data.checked)}
              label="启用参数化查询（站到防御方）"
            />
          </div>
          <div className={cx('loginResult', result)} aria-live="polite">
            {result === 'idle' && <span className="caption">还没有提交。</span>}
            {result === 'fail' && <span>用户名或密码错误。</span>}
            {result === 'ok' && (
              <span>
                <Checkmark16Filled /> 欢迎，{SQL_USER}。
              </span>
            )}
            {result === 'admin' && (
              <span>
                <LockClosed20Regular /> 欢迎，administrator。你绕过了密码。
              </span>
            )}
          </div>
        </div>

        <div className="subPanel">
          <b>服务端执行的 SQL</b>
          <pre className="codeBlock sqlPreview">
            <code>
              {safe ? (
                <>
                  SELECT * FROM users{'\n'}  WHERE name = ? AND pass = ?{'\n'}
                  <span className="sqlParam">参数：[{user}]，[{'*'.repeat(pass.length)}]</span>
                </>
              ) : (
                <>
                  SELECT * FROM users{'\n'}  WHERE name = '
                  <span className="sqlUser">{user}</span>' AND pass = '
                  <span className="sqlUser">{pass}</span>'
                </>
              )}
            </code>
          </pre>
          <p className="caption">
            {safe
              ? '输入只作为参数传入，不会被当成 SQL 的一部分。再试一次刚才的注入。'
              : '橙色部分是你输入的内容。它被直接拼进了语句，所以能改变查询的条件。'}
          </p>
        </div>
      </div>
    </ToolFrame>
  );
}
