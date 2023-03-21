# Reproduction of a `fd_read_dir` problem in Node.js WASI environment

## Prerequisites

- [Cargo](https://doc.rust-lang.org/cargo/getting-started/installation.html)
- [cargo-wasi](https://github.com/bytecodealliance/cargo-wasi) (`cargo install cargo-wasi`)
- Node.js
- Deno (if you want to see expected behavior)

## Steps

1. `cargo wasi build` (generates WASM binary that calls `fd_read_dir`)
2. `./run-deno-wasi.ts` (requires Deno, should work correctly)
3. `./run-node-wasi.mjs` (falls in an infinite loop)