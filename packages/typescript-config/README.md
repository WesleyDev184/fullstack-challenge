# TypeScript Configuration

Este package fornece configurações TypeScript compartilhadas para o monorepo.

## Configurações Base

### `base.json`

Configuração base com opções essenciais do TypeScript.

### `nestjs.json`

Configuração específica para aplicações NestJS com:

- CommonJS modules
- Decorators habilitados
- Paths aliases para estrutura NestJS

### `react.json`

Configuração específica para aplicações React com:

- ESNext modules
- JSX configurado
- Bundler module resolution
- Vite support

## Como Usar

### Para Apps NestJS

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "@repo/typescript-config/nestjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*", "test/**/*"],
  "exclude": ["node_modules", "dist", "**/*.spec.ts", "**/*.test.ts"]
}
```

### Para Apps React/Vite

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "@repo/typescript-config/react.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "src/**/*",
    "index.html",
    "vite.config.ts",
    "**/*.ts",
    "**/*.tsx"
  ],
  "exclude": ["node_modules", "dist"]
}
```

## Importante

- Cada app deve definir seus próprios `include` e `exclude`
- O `baseUrl` deve ser "." para resolver paths corretamente
- Os aliases de path (`@/*`) devem ser definidos no app local
- Não defina `include`/`exclude` nos arquivos base - isso causa problemas com paths relativos

## Templates

Veja os arquivos na pasta `templates/` para exemplos completos.
