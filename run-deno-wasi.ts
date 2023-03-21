#! /usr/bin/env deno run --allow-read --allow-env

import WASI from "https://deno.land/std@0.179.0/wasi/snapshot_preview1.ts";

const wasi = new WASI({
  args: Deno.args,
  env: Deno.env.toObject(),
  preopens: {
    ".": Deno.cwd(),
  },
});

const importObject = { wasi_snapshot_preview1: wasi.exports };

const fd_readdir = wasi.exports.fd_readdir;
const decoder = new TextDecoder();
let count = 0;
wasi.exports.fd_readdir = (fd, buf, buf_len, cookie, bufused_ptr) => {
  const ret = fd_readdir(fd, buf, buf_len, cookie, bufused_ptr);
  const args = [fd, buf, buf_len, cookie, bufused_ptr];
  console.log(`fd_readdir(${args}) = ${ret}`);
  const resultBuf = instance.exports.memory.buffer.slice(buf, buf + buf_len);
  let offset = 0;
  while (offset < buf_len - 24) {
    const dirent = parseDirent(resultBuf.slice(offset));
    const name = decoder.decode(new Uint8Array(resultBuf, offset + 24, dirent.d_namlen));
    console.log(
      "offset =", offset,
      {
        ...dirent,
        name
      }
    );
    offset += 24 + dirent.d_namlen;
  }
  if (offset < buf_len) {
    console.log(`(offset = ${offset})`)
  }
  if (++count >= 5) {
    process.exit(0);
  }

  /** https://github.com/WebAssembly/WASI/blob/main/legacy/preview1/docs.md#dirent */
  function parseDirent(buf) {
    const dv = new DataView(buf);
    const d_next = dv.getBigUint64(0, true);
    const d_ino = dv.getBigUint64(8, true);
    const d_namlen = dv.getUint32(16, true);
    const d_type = dv.getUint32(20, true);
    return {
      d_next,
      d_ino,
      d_namlen,
      d_type
    }
  }
};

const wasm = await WebAssembly.compile(
  await Deno.readFile('./target/wasm32-wasi/debug/rust-wasi-readdir.wasi.wasm')
);
const instance = await WebAssembly.instantiate(wasm, importObject);

wasi.start(instance);