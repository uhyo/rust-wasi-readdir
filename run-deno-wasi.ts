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

const wasm = await WebAssembly.compile(
  await Deno.readFile('./target/wasm32-wasi/debug/rust-wasi-readdir.wasi.wasm')
);
const instance = await WebAssembly.instantiate(wasm, importObject);

wasi.start(instance);