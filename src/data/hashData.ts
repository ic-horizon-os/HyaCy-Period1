export interface HashSample {
  id: string;
  source: string;
  value: string;
  answer: string;
}

export const hashTypes = ['MD5', 'SHA-1', 'SHA-256', 'bcrypt', 'Base64'];

export const hashSamples: HashSample[] = [
  { id: 'md5', source: '旧版论坛用户表', value: '5f4dcc3b5aa765d61d8327deb882cf99', answer: 'MD5' },
  { id: 'sha1', source: '文件校验值', value: '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8', answer: 'SHA-1' },
  {
    id: 'sha256',
    source: '下载站校验值',
    value: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    answer: 'SHA-256',
  },
  { id: 'bcrypt', source: '新系统用户表', value: '$2b$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW', answer: 'bcrypt' },
  { id: 'base64', source: '配置文件片段', value: 'cGFzc3dvcmQ=', answer: 'Base64' },
];

export const lengthGuide = [
  ['32 位十六进制', 'MD5'],
  ['40 位十六进制', 'SHA-1'],
  ['64 位十六进制', 'SHA-256'],
  ['$2a$ / $2b$ 开头', 'bcrypt'],
  ['只有字母数字和 = 结尾', 'Base64，是编码，能直接还原'],
];

export interface Candidate {
  rank: number;
  password: string;
  sha256: string;
}

export const candidates: Candidate[] = [
  { rank: 1, password: '123456', sha256: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92' },
  { rank: 2, password: 'password', sha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8' },
  { rank: 3, password: 'sunshine', sha256: 'a941a4c4fd0c01cddef61b8be963bf4c1e2b0811c037ce3f1835fddf6ef6c223' },
  { rank: 4, password: 'qwerty', sha256: '65e84be33532fb784c48129675f9eff3a682b27168c0ea744b2cf58ee02337c5' },
  { rank: 5, password: 'admin', sha256: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918' },
  { rank: 6, password: 'iloveyou', sha256: 'e4ad93ca07acb8d908a3aa41e920ea4f4ef4f26e7f86cf8291c5db289780a5ae' },
];

export const TARGET_HASH = candidates[2].sha256;

export const saltRows = [
  { user: 'lin', salt: 'a1b2c3', hash: 'aa4be4de84742d5412cff8a46bd68344566b19864929309ee651da5adb1d8b4d' },
  { user: 'mo', salt: '9f8e7d', hash: '1fe1e9eb12ee5803d9888cab7c4edaa5a9c15c9e3bcb517e8797edbd63c4ff66' },
];

export const PLAIN_HASH = TARGET_HASH;

export interface Option {
  id: string;
  label: string;
  caption: string;
  ok: boolean;
  why: string;
}

export const networks: Option[] = [
  {
    id: 'wpa2',
    label: 'WPA2-PSK 四次握手',
    caption: '路由器与设备协商时交换的 4 个报文',
    ok: true,
    why: '握手里带有足够的数据，可以拿字典离线逐个验证。',
  },
  {
    id: 'wpa3',
    label: 'WPA3-SAE 握手',
    caption: '每次握手都带新的随机量',
    ok: false,
    why: 'SAE 每次协商都换了随机参数，抓到的报文没法离线验证口令。',
  },
];

export const SQL_USER = 'lin';
export const SQL_PASS = 'sunshine2026';
