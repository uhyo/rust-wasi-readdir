# Reproduction of a `fs::read_dir` problem in Node.js WASI environment

Issue link: https://github.com/rust-lang/rust/issues/109264

## Prerequisites

- [cargo-wasi](https://github.com/bytecodealliance/cargo-wasi) (`cargo install cargo-wasi`)
- Node.js (v16.19.0, v18.15.0, v19.8.1)
- [wasmtime](https://wasmtime.dev/)

## Steps

1. `cargo wasi build`
2. `./run-wasmtime-wasi.sh` (should work correctly)
3. `./run-node-wasi.mjs` (should fall in an infinite loop)