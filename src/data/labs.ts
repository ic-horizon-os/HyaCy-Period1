import type { FluentIcon } from '@fluentui/react-icons';
import {
  Bug20Regular,
  Code20Regular,
  Fingerprint20Regular,
  Key20Regular,
  LockOpen20Regular,
  NetworkCheck20Regular,
  Radar20Regular,
} from '@fluentui/react-icons';

export interface Lab {
  id: number;
  code: string;
  short: string;
  title: string;
  difficulty: 1 | 2 | 3;
  defense: string;
  hint: string;
  note: string;
  icon: FluentIcon;
}

export const labs: Lab[] = [
  {
    id: 0,
    code: 'T1110',
    short: '哈希识别',
    title: '认出哈希的类型',
    difficulty: 1,
    defense: '口令要用 bcrypt、scrypt 或 Argon2 这类慢哈希加盐存储。MD5 和 SHA 系列算得太快，不适合存口令。',
    hint: '看长度：32 位十六进制是 MD5，40 位是 SHA-1，64 位是 SHA-256，以 $2 开头的是 bcrypt。',
    note: '哈希推不回原文，但长度和格式会暴露算法。识别类型是破解的第一步。',
    icon: Fingerprint20Regular,
  },
  {
    id: 1,
    code: 'T1110',
    short: '口令破解',
    title: '跑一次字典破解',
    difficulty: 1,
    defense: '口令长度优先于复杂度。登录要限速并启用 MFA，无线网络改用 WPA3。',
    hint: '常见口令排在字典最前面。点“开始比对”，然后到网络题里选 WPA2。',
    note: '弱口令在字典里排在前列，几毫秒就能撞上。WPA2 握手可以离线跑字典，WPA3 不行。',
    icon: Key20Regular,
  },
  {
    id: 2,
    code: 'T1190',
    short: 'SQL 注入',
    title: 'SQL 注入：拼出来的登录',
    difficulty: 2,
    defense: '所有查询都用参数化查询或预编译语句。输入只当作数据，不拼进 SQL。',
    hint: '在用户名框里让条件恒真：一个单引号、OR、1=1，再用 -- 注释掉后面的内容。',
    note: '把输入拼进 SQL，输入就成了语句的一部分。参数化查询让它只配当数据。',
    icon: Code20Regular,
  },
  {
    id: 3,
    code: 'T1040',
    short: '抓包分析',
    title: '从流量里找出密码',
    difficulty: 2,
    defense: '把明文协议换成加密版本：HTTPS、FTPS、SFTP。敏感字段不走明文。',
    hint: '在过滤器里输入 ftp，选中一条数据包后点“追踪 TCP 流”，找 PASS 那一行。',
    note: '明文协议里的账号密码会原样出现在流量里。过滤器加追踪流能很快定位。',
    icon: NetworkCheck20Regular,
  },
  {
    id: 4,
    code: 'T1190',
    short: '漏洞利用',
    title: '走通一次利用流程',
    difficulty: 3,
    defense: '及时打补丁，关闭不用的服务，按最小暴露面配置边界。',
    hint: '先看目标系统，再选服务对得上的 exploit 模块。Payload 的系统要和目标一致。',
    note: '利用流程固定：信息收集、找模块、加载、配参数、选 Payload、运行。模块和 Payload 都要匹配目标。',
    icon: Bug20Regular,
  },
  {
    id: 5,
    code: 'T1595',
    short: '指纹扫描',
    title: '扫描站点指纹',
    difficulty: 2,
    defense: '及时更新插件和主题，删除不用的组件，关闭不需要的用户枚举入口。',
    hint: '先勾上“有漏洞的插件”再扫描。结果里带漏洞标记的那一项就是答案。',
    note: '指纹扫描先把版本号摸清。带已知漏洞的旧版本插件是首选入口。',
    icon: Radar20Regular,
  },
  {
    id: 6,
    code: 'TA0008',
    short: '越权访问',
    title: '地址栏里的订单',
    difficulty: 2,
    defense: '每次请求都在服务端校验“当前用户有没有权访问这条数据”。',
    hint: '地址栏里的订单编号可以改。改成 1002 或 1003 再前往。',
    note: '只凭一个 ID 就放行，等于把钥匙交给了 ID 本身。属主校验必须在服务端做。',
    icon: LockOpen20Regular,
  },
];

export const rules = ['只在模拟环境里操作', '不输入真实信息', '每过一个实验，学一条防护'];