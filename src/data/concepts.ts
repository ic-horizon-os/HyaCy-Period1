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

export interface Concept {
  icon: FluentIcon;
  term: string;
  ask: string;
  analogy: string;
  explain: string;
  range: string;
}

export const concepts: Concept[] = [
  {
    icon: Fingerprint20Regular,
    term: '哈希',
    ask: '系统为什么不直接存你的密码？',
    analogy: '一份只能盖、不能拆的印章',
    explain: '哈希把任意内容变成固定长度的摘要。它只能单向计算，从摘要推不回原文。',
    range: '实验 01 和 02 里，你会看到几种常见哈希的样子。',
  },
  {
    icon: Key20Regular,
    term: '加盐',
    ask: '两个人用同一个密码，存下来的哈希会一样吗？',
    analogy: '每把锁配一把不同齿形的小钥匙',
    explain: '加盐是在哈希前拼上一段随机值。密码相同，盐不同，存下的哈希也不同。',
    range: '实验 02 末尾有一张对照表，对比加盐前后的结果。',
  },
  {
    icon: Code20Regular,
    term: 'SQL 注入',
    ask: '输入框里的文字，什么时候会变成程序的一部分？',
    analogy: '填空题里夹带了一句指令',
    explain: '把用户输入直接拼进 SQL 语句，输入就获得了改变语句的能力。',
    range: '实验 03 会实时显示你输入的内容被拼成了什么。',
  },
  {
    icon: NetworkCheck20Regular,
    term: '抓包分析',
    ask: '没加密的密码在网上传输时，是什么样子？',
    analogy: '没有封口的信在走廊里传递',
    explain: '明文协议会把账号和密码原样放进数据包。抓到包的人可以直接读到。',
    range: '实验 04 里有一段录好的流量，等你自己找出来。',
  },
  {
    icon: Bug20Regular,
    term: '漏洞利用框架',
    ask: '一次漏洞利用要经过哪几步？',
    analogy: '查目录、取工具、调参数、动手',
    explain: '利用流程有固定顺序：收集信息、找模块、加载、配参数、选 Payload、运行。',
    range: '实验 05 让你亲手把这些步骤排对、选对。',
  },
  {
    icon: Radar20Regular,
    term: '指纹与资产识别',
    ask: '动手之前，为什么要先弄清对方装了什么？',
    analogy: '先看门牌，再挑钥匙',
    explain: '指纹扫描能摸清系统、插件和它们的版本。版本号决定了有哪些已知漏洞可用。',
    range: '实验 06 模拟一次对 WordPress 站点的扫描。',
  },
  {
    icon: LockOpen20Regular,
    term: '越权访问',
    ask: '改了网址里的一个编号，为什么能看别人的数据？',
    analogy: '只报学号就能领别人的快递',
    explain: '系统只认编号、不核对身份，就发生了越权。这类问题也叫 IDOR。',
    range: '实验 07 的订单页就栽在这一处。',
  },
  {
    icon: Key20Regular,
    term: '字典攻击',
    ask: '为什么“111111”几毫秒就会被破解？',
    analogy: '按使用次数排好队去试',
    explain: '字典攻击拿常见口令列表逐个比对。越常见的口令，排得越靠前，越早被撞到。',
    range: '实验 02 会现场跑一次，你能看到第几个命中。',
  },
];
