import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

/** Writes a solid-color square PNG. */
function writeSolidPng(path: string, size: number, rgb: [number, number, number]): void {
  const row = Buffer.alloc(1 + size * 3);
  const raw = Buffer.alloc((1 + size * 3) * size);
  row[0] = 0;
  for (let x = 0; x < size; x += 1) {
    const offset = 1 + x * 3;
    row[offset] = rgb[0];
    row[offset + 1] = rgb[1];
    row[offset + 2] = rgb[2];
  }
  for (let y = 0; y < size; y += 1) {
    row.copy(raw, y * row.length);
  }

  const compressed = deflateSync(raw);
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(25);
  ihdr.writeUInt32BE(13, 0);
  ihdr.write('IHDR', 4);
  ihdr.writeUInt32BE(size, 8);
  ihdr.writeUInt32BE(size, 12);
  ihdr[16] = 8;
  ihdr[17] = 2;
  ihdr[18] = 0;
  ihdr[19] = 0;
  ihdr[20] = 0;
  const ihdrCrc = crc32(Buffer.concat([Buffer.from('IHDR'), ihdr.subarray(8, 21)]));
  ihdr.writeUInt32BE(ihdrCrc, 21);

  const idat = Buffer.alloc(compressed.length + 12);
  idat.writeUInt32BE(compressed.length, 0);
  idat.write('IDAT', 4);
  compressed.copy(idat, 8);
  const idatCrc = crc32(Buffer.concat([Buffer.from('IDAT'), compressed]));
  idat.writeUInt32BE(idatCrc, compressed.length + 8);

  const iend = Buffer.from([0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]);
  writeFileSync(path, Buffer.concat([signature, ihdr, idat, iend]));
}

/** Writes a branded OG image PNG (1200x630). */
function writeOgImage(path: string): void {
  const width = 1200;
  const height = 630;
  const row = Buffer.alloc(1 + width * 3);
  const raw = Buffer.alloc((1 + width * 3) * height);

  for (let y = 0; y < height; y += 1) {
    row[0] = 0;
    for (let x = 0; x < width; x += 1) {
      const offset = 1 + x * 3;
      const t = y / height;
      row[offset] = Math.round(9 + (255 - 9) * (1 - t) * 0.04);
      row[offset + 1] = Math.round(9 + (90 - 9) * (1 - t) * 0.2);
      row[offset + 2] = Math.round(11 + (31 - 11) * (1 - t) * 0.2);
      if (x > 80 && x < 520 && y > 180 && y < 460) {
        row[offset] = 255;
        row[offset + 1] = 90;
        row[offset + 2] = 31;
      }
    }
    row.copy(raw, y * row.length);
  }

  const compressed = deflateSync(raw);
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(25);
  ihdr.writeUInt32BE(13, 0);
  ihdr.write('IHDR', 4);
  ihdr.writeUInt32BE(width, 8);
  ihdr.writeUInt32BE(height, 12);
  ihdr[16] = 8;
  ihdr[17] = 2;
  ihdr[18] = 0;
  ihdr[19] = 0;
  ihdr[20] = 0;
  const ihdrCrc = crc32(Buffer.concat([Buffer.from('IHDR'), ihdr.subarray(8, 21)]));
  ihdr.writeUInt32BE(ihdrCrc, 21);

  const idat = Buffer.alloc(compressed.length + 12);
  idat.writeUInt32BE(compressed.length, 0);
  idat.write('IDAT', 4);
  compressed.copy(idat, 8);
  const idatCrc = crc32(Buffer.concat([Buffer.from('IDAT'), compressed]));
  idat.writeUInt32BE(idatCrc, compressed.length + 8);

  const iend = Buffer.from([0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]);
  writeFileSync(path, Buffer.concat([signature, ihdr, idat, iend]));
}

function crc32(buf: Buffer): number {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i += 1) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j += 1) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

mkdirSync('public', { recursive: true });
const accent: [number, number, number] = [255, 90, 31];
writeSolidPng('public/favicon-32x32.png', 32, accent);
writeSolidPng('public/apple-touch-icon.png', 180, accent);
writeFileSync('public/favicon.ico', readFileSync('public/favicon-32x32.png'));
writeOgImage('public/og-image.png');
console.log('Generated public favicon and OG image assets.');
