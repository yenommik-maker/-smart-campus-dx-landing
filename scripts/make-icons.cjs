// Generates simple PWA icon PNGs (rounded blue square + white circle mark)
// without any external image dependencies, using only Node's zlib + crc.
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const PRIMARY = [0x25, 0x63, 0xeb]; // #2563EB
const WHITE = [0xff, 0xff, 0xff];

function crc32(buf) {
  let c;
  const table = crc32.table || (crc32.table = (() => {
    const t = [];
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c >>> 0;
    }
    return t;
  })());
  c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function makePng(size, radius) {
  const cx = size / 2;
  const cy = size / 2;
  const circleR = size * 0.28;
  const rows = [];
  for (let y = 0; y < size; y++) {
    const row = Buffer.alloc(1 + size * 4);
    row[0] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      // rounded-rect mask
      let inside = true;
      const nx = x < radius ? radius - x : x > size - radius ? x - (size - radius) : 0;
      const ny = y < radius ? radius - y : y > size - radius ? y - (size - radius) : 0;
      if (nx > 0 && ny > 0 && Math.sqrt(nx * nx + ny * ny) > radius) inside = false;

      let r, g, b, a;
      if (!inside) {
        r = g = b = 0;
        a = 0;
      } else {
        const dx = x - cx;
        const dy = y - cy;
        const inCircle = Math.sqrt(dx * dx + dy * dy) <= circleR;
        const [cr, cg, cb] = inCircle ? WHITE : PRIMARY;
        r = cr; g = cg; b = cb; a = 255;
      }
      const off = 1 + x * 4;
      row[off] = r; row[off + 1] = g; row[off + 2] = b; row[off + 3] = a;
    }
    rows.push(row);
  }
  const raw = Buffer.concat(rows);
  const idat = zlib.deflateSync(raw, { level: 9 });

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  return Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const outDir = path.join(__dirname, "..", "public");
fs.mkdirSync(outDir, { recursive: true });

const targets = [
  { name: "icon-512.png", size: 512, radius: 96 },
  { name: "icon-192.png", size: 192, radius: 36 },
  { name: "apple-touch-icon.png", size: 180, radius: 40 },
  { name: "favicon-32.png", size: 32, radius: 6 },
];

for (const t of targets) {
  fs.writeFileSync(path.join(outDir, t.name), makePng(t.size, t.radius));
  console.log("wrote", t.name);
}
