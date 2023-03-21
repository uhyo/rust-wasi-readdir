# Reproduction of a `fd_read_dir` problem in Node.js WASI environment

Node.js issue: https://github.com/nodejs/node/issues/47193

## Prerequisites

- [Cargo](https://doc.rust-lang.org/cargo/getting-started/installation.html)
- [cargo-wasi](https://github.com/bytecodealliance/cargo-wasi) (`cargo install cargo-wasi`)
- Node.js
- Deno (if you want to see expected behavior)

## Steps

1. `cargo wasi build` (generates WASM binary that calls `fd_read_dir`)
2. `./run-deno-wasi.ts` (requires Deno, should work correctly)
3. `./run-node-wasi.mjs` (falls in an infinite loop)

## Expected behavior (Deno output)

The WASM binary repeatedly calls `fd_readdir` with different `cookie`s. The `fd_readdir` function respects given cookie and can iterate over the whole directory entries.

```
Calling fs::read_dir
fd_readdir(4,1065696,128,0,1047548) = 0
offset = 0 { d_next: 1n, d_ino: 18955445n, d_namlen: 17, d_type: 4, name: "run-node-wasi.mjs" }
offset = 41 { d_next: 2n, d_ino: 18241635n, d_namlen: 10, d_type: 4, name: "Cargo.toml" }
offset = 75 { d_next: 3n, d_ino: 18242480n, d_namlen: 20, d_type: 4, name: "run-wasmtime-wasi.sh" }
(offset = 119)
Entry /run-node-wasi.mjs
Entry /Cargo.toml
Entry /run-wasmtime-wasi.sh
fd_readdir(4,1065696,128,3,1047548) = 0
offset = 0 { d_next: 4n, d_ino: 18955444n, d_namlen: 16, d_type: 4, name: "run-deno-wasi.ts" }
offset = 40 { d_next: 5n, d_ino: 18241749n, d_namlen: 6, d_type: 4, name: "target" }
offset = 70 { d_next: 6n, d_ino: 18241743n, d_namlen: 10, d_type: 4, name: "Cargo.lock" }
(offset = 104)
Entry /run-deno-wasi.ts
Entry /target
Entry /Cargo.lock
fd_readdir(4,1065696,128,6,1047548) = 0
offset = 0 { d_next: 7n, d_ino: 18242511n, d_namlen: 9, d_type: 4, name: "README.md" }
offset = 33 { d_next: 8n, d_ino: 18241634n, d_namlen: 10, d_type: 4, name: ".gitignore" }
offset = 67 { d_next: 9n, d_ino: 18241609n, d_namlen: 4, d_type: 4, name: ".git" }
offset = 95 { d_next: 10n, d_ino: 18241636n, d_namlen: 3, d_type: 4, name: "src" }
(offset = 122)
Entry /README.md
Entry /.gitignore
Entry /.git
Entry /src
fd_readdir(4,1065696,128,10,1047548) = 0
offset = 0 { d_next: 7n, d_ino: 18242511n, d_namlen: 9, d_type: 4, name: "README.md" }
offset = 33 { d_next: 8n, d_ino: 18241634n, d_namlen: 10, d_type: 4, name: ".gitignore" }
offset = 67 { d_next: 9n, d_ino: 18241609n, d_namlen: 4, d_type: 4, name: ".git" }
offset = 95 { d_next: 10n, d_ino: 18241636n, d_namlen: 3, d_type: 4, name: "src" }
(offset = 122)
```

## Actual behavior (Node.js output)

Regardless of passed `cookie`, the `fd_readdir` function always returns the same set of entries.

```
(node:40683) ExperimentalWarning: WASI is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
Calling fs::read_dir
fd_readdir(4,1065824,128,0,1047548) = 0
offset = 0 {
  d_next: 0n,
  d_ino: 0n,
  d_namlen: 17,
  d_type: 4,
  name: 'run-node-wasi.mjs'
}
offset = 41 { d_next: 1n, d_ino: 0n, d_namlen: 10, d_type: 4, name: 'Cargo.toml' }
offset = 75 {
  d_next: 2n,
  d_ino: 0n,
  d_namlen: 20,
  d_type: 4,
  name: 'run-wasmtime-wasi.sh'
}
(offset = 119)
Entry /run-node-wasi.mjs
Entry /Cargo.toml
Entry /run-wasmtime-wasi.sh
fd_readdir(4,1065824,128,2,1047548) = 0
offset = 0 {
  d_next: 0n,
  d_ino: 0n,
  d_namlen: 17,
  d_type: 4,
  name: 'run-node-wasi.mjs'
}
offset = 41 { d_next: 1n, d_ino: 0n, d_namlen: 10, d_type: 4, name: 'Cargo.toml' }
offset = 75 {
  d_next: 2n,
  d_ino: 0n,
  d_namlen: 20,
  d_type: 4,
  name: 'run-wasmtime-wasi.sh'
}
(offset = 119)
Entry /run-node-wasi.mjs
Entry /Cargo.toml
Entry /run-wasmtime-wasi.sh
fd_readdir(4,1065824,128,2,1047548) = 0
offset = 0 {
  d_next: 0n,
  d_ino: 0n,
  d_namlen: 17,
  d_type: 4,
  name: 'run-node-wasi.mjs'
}
offset = 41 { d_next: 1n, d_ino: 0n, d_namlen: 10, d_type: 4, name: 'Cargo.toml' }
offset = 75 {
  d_next: 2n,
  d_ino: 0n,
  d_namlen: 20,
  d_type: 4,
  name: 'run-wasmtime-wasi.sh'
}
(offset = 119)
Entry /run-node-wasi.mjs
Entry /Cargo.toml
Entry /run-wasmtime-wasi.sh
fd_readdir(4,1065824,128,2,1047548) = 0
offset = 0 {
  d_next: 0n,
  d_ino: 0n,
  d_namlen: 17,
  d_type: 4,
  name: 'run-node-wasi.mjs'
}
offset = 41 { d_next: 1n, d_ino: 0n, d_namlen: 10, d_type: 4, name: 'Cargo.toml' }
offset = 75 {
  d_next: 2n,
  d_ino: 0n,
  d_namlen: 20,
  d_type: 4,
  name: 'run-wasmtime-wasi.sh'
}
(offset = 119)
Entry /run-node-wasi.mjs
Entry /Cargo.toml
Entry /run-wasmtime-wasi.sh
fd_readdir(4,1065824,128,2,1047548) = 0
offset = 0 {
  d_next: 0n,
  d_ino: 0n,
  d_namlen: 17,
  d_type: 4,
  name: 'run-node-wasi.mjs'
}
offset = 41 { d_next: 1n, d_ino: 0n, d_namlen: 10, d_type: 4, name: 'Cargo.toml' }
offset = 75 {
  d_next: 2n,
  d_ino: 0n,
  d_namlen: 20,
  d_type: 4,
  name: 'run-wasmtime-wasi.sh'
}
(offset = 119)
```