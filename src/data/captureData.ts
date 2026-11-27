export interface Packet {
  no: string;
  time: string;
  src: string;
  dst: string;
  proto: 'TCP' | 'UDP';
  sport: number;
  dport: number;
  summary: string;
  stream: number;
}

const HOST = '10.10.10.5';
const ME = '10.10.10.14';

export const packets: Packet[] = [
  { no: '1', time: '0.000', src: HOST, dst: ME, proto: 'TCP', sport: 443, dport: 51234, summary: '443 → 51234 [SYN, ACK]', stream: 0 },
  { no: '2', time: '0.021', src: '10.10.10.14', dst: HOST, proto: 'UDP', sport: 5353, dport: 5353, summary: 'Standard query 0x8f2a A lab.test', stream: -1 },
  { no: '3', time: '0.040', src: '10.10.10.14', dst: HOST, proto: 'TCP', sport: 51234, dport: 443, summary: 'Client Hello (TLS 1.3)', stream: 0 },
  { no: '4', time: '0.302', src: HOST, dst: ME, proto: 'TCP', sport: 21, dport: 51888, summary: '21 → 51888 [SYN, ACK]', stream: 3 },
  { no: '5', time: '0.319', src: HOST, dst: ME, proto: 'TCP', sport: 51888, dport: 21, summary: 'FTP 61 Response: 220 (vsFTPd 3.0.5)', stream: 3 },
  { no: '6', time: '0.325', src: '10.10.10.14', dst: HOST, proto: 'TCP', sport: 51888, dport: 21, summary: 'FTP 74 Request: USER backup', stream: 3 },
  { no: '7', time: '0.331', src: '10.10.10.14', dst: HOST, proto: 'TCP', sport: 51888, dport: 21, summary: 'FTP 66 Request: PASS Summer2026!', stream: 3 },
  { no: '8', time: '0.338', src: HOST, dst: ME, proto: 'TCP', sport: 51888, dport: 21, summary: 'FTP 62 Response: 230 Login successful', stream: 3 },
  { no: '9', time: '0.512', src: HOST, dst: ME, proto: 'UDP', sport: 5353, dport: 5353, summary: 'Standard query response A 10.10.10.5', stream: -1 },
  { no: '10', time: '0.640', src: '10.10.10.14', dst: HOST, proto: 'TCP', sport: 51234, dport: 443, summary: 'Application Data 512 bytes', stream: 0 },
  { no: '11', time: '0.702', src: '10.10.10.14', dst: HOST, proto: 'TCP', sport: 51888, dport: 21, summary: 'FTP 78 Request: RETR payroll_2026.csv', stream: 3 },
  { no: '12', time: '0.930', src: '10.10.10.14', dst: HOST, proto: 'TCP', sport: 51234, dport: 443, summary: 'Application Data 1024 bytes', stream: 0 },
];

export const FTP_STREAM = 3;
export const FTP_ANSWER = 'Summer2026!';

export const ftpStream = [
  '220 (vsFTPd 3.0.5)',
  'USER backup',
  '331 Please specify the password.',
  'PASS Summer2026!',
  '230 Login successful.',
  'RETR payroll_2026.csv',
];

export const filterPresets = ['ftp', 'tcp.port == 21', 'dns', 'tcp.port == 443'];

const named: Record<string, string> = { ftp: 'tcp.port == 21', ssh: 'tcp.port == 22', dns: 'udp.port == 53', https: 'tcp.port == 443' };

function parseCondition(raw: string): ((p: Packet) => boolean) | null {
  const text = raw.trim().toLowerCase();
  if (!text) return () => true;
  const condition = named[text] ?? text;
  const m = /^(tcp|udp)\.(port|dstport|srcport)\s*(==|eq)\s*(\d+)$/.exec(condition);
  if (m) {
    const [, proto, field, , portText] = m;
    const port = Number(portText);
    return (p) => p.proto === proto.toUpperCase() && (field === 'port' ? p.sport === port || p.dport === port : field === 'dstport' ? p.dport === port : p.sport === port);
  }
  if (condition === 'tcp' || condition === 'udp') return (p) => p.proto === condition.toUpperCase();
  const addr = /^ip\.addr\s*(==|eq)\s*([\d.]+)$/.exec(condition);
  if (addr) return (p) => p.src === addr[2] || p.dst === addr[2];
  const stream = /^tcp\.stream\s*(==|eq)\s*(\d+)$/.exec(condition);
  if (stream) return (p) => p.proto === 'TCP' && p.stream === Number(stream[2]);
  return null;
}

export function applyFilter(filter: string): { rows: Packet[]; valid: boolean } {
  const parts = filter.toLowerCase().split(/\s+or\s+|\s*\|\|\s*/).map(parseCondition);
  if (parts.some((part) => part === null)) return { rows: [], valid: false };
  const checks = parts as Array<(p: Packet) => boolean>;
  return { rows: packets.filter((packet) => checks.some((check) => check(packet))), valid: true };
}

export function detailLines(packet: Packet): string[] {
  return [
    `Frame ${packet.no}: 74 bytes on wire`,
    `Ethernet II, Src: aa:bb:cc:dd:ee:01`,
    `Internet Protocol Version 4, Src: ${packet.src}, Dst: ${packet.dst}`,
    `${packet.proto === 'TCP' ? 'Transmission Control' : 'User Datagram'} Protocol, Src Port: ${packet.sport}, Dst Port: ${packet.dport}`,
    `[Payload] ${packet.summary}`,
  ];
}
