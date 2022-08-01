<img src="./images/fastify.svg" width="600" height="auto" />
<img src="./images/esbuild.svg" width="200" />

# A fastify boilerplate with typescript

## usage

### bootstrap

- Vscode Debug mode

```bash
-> F5
Pnpm Launch Program
```

- Docker mode

```bash
sh start.sh
```

- Hot reload mode

```bash
pnpm dev
```

- Preview mode

```bash
pnpm build
# start server
pnpm runner:local
```

## https

> maybe use mkcert, ref -> [mkcert](https://github.com/FiloSottile/mkcert)

```bash
# in chrome enable chrome://flags/#allow-insecure-localhost
brew install mkcert nss
mkcert localhost 127.0.0.1 ::1
mkcert -install

# open keychain access.app & trust
```
