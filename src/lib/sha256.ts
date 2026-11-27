import { candidates, TARGET_HASH } from '../data/hashData';

/** 优先用 Web Crypto 现算，非安全上下文下退回到预计算表 */
export async function sha256(text: string): Promise<string> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) return candidates.find((item) => item.password === text)?.sha256 ?? '';
  const bytes = await subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(bytes))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export const looksLikeTarget = (digest: string) => digest === TARGET_HASH;
