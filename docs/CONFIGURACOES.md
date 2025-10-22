# Configurações Centralizadas do Monorepo

Este documento descreve como as configurações são centralizadas no monorepo TurboRepo.

## Estrutura de Configurações

### 📦 Packages de Configuração

#### `@repo/prettier-config`
Configuração centralizada do Prettier para formatação de código.

**Uso nos apps:**
```javascript
// prettier.config.js ou .prettierrc.mjs
import config from '@repo/prettier-config'
export default config
```

**Configurações incluídas:**
- Semi: false
- Single quotes: true
- Trailing comma: all
- Tab width: 2
- Print width: 80
- Overrides específicos para JSON e Markdown

#### `@repo/eslint-config`
Configurações do ESLint com diferentes presets.

**Exports disponíveis:**
- `@repo/eslint-config/base` - Configuração base
- `@repo/eslint-config/nest` - Específico para NestJS
- `@repo/eslint-config/react-internal` - Específico para React

**Uso nos apps NestJS:**
```javascript
// eslint.config.mjs
import { nestJsConfig } from '@repo/eslint-config/nest'

export default [
  ...nestJsConfig,
  {
    ignores: ['.prettierrc.mjs', 'eslint.config.mjs'],
  },
]
```

#### `@repo/typescript-config`
Configurações do TypeScript para diferentes tipos de projetos.

**Exports disponíveis:**
- `nestjs.json` - Para projetos NestJS
- `react.json` - Para projetos React
- `base.json` - Configuração base

**Uso nos apps:**
```json
{
  "extends": "@repo/typescript-config/nestjs.json"
}
```

## Como Adicionar Configurações aos Apps

### Para Apps NestJS

1. **package.json** - Adicione as dependências:
```json
{
  "devDependencies": {
    "@repo/eslint-config": "workspace:*",
    "@repo/prettier-config": "workspace:*",
    "@repo/typescript-config": "workspace:*"
  }
}
```

2. **tsconfig.json** - Estenda a configuração:
```json
{
  "extends": "@repo/typescript-config/nestjs.json"
}
```

3. **eslint.config.mjs** - Use a configuração do NestJS:
```javascript
import { nestJsConfig } from '@repo/eslint-config/nest'

export default [
  ...nestJsConfig,
  {
    ignores: ['.prettierrc.mjs', 'eslint.config.mjs'],
  },
]
```

4. **.prettierrc.mjs** - Use a configuração centralizada:
```javascript
import config from '@repo/prettier-config'
export default config
```

### Para Apps React

1. **package.json** - Adicione as dependências:
```json
{
  "devDependencies": {
    "@repo/prettier-config": "workspace:*",
    "@repo/typescript-config": "workspace:*"
  }
}
```

2. **tsconfig.json** - Estenda a configuração:
```json
{
  "extends": "@repo/typescript-config/react.json"
}
```

3. **prettier.config.js** - Use a configuração centralizada:
```javascript
import config from '@repo/prettier-config'
export default config
```

## Scripts Recomendados

### No package.json raiz:
```json
{
  "scripts": {
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "lint": "turbo run lint",
    "type-check": "turbo run check-types"
  }
}
```

### No turbo.json:
```json
{
  "tasks": {
    "lint": {
      "dependsOn": ["^build"],
      "cache": true
    },
    "format": {
      "cache": true
    },
    "check-types": {
      "cache": true
    }
  }
}
```

## Benefícios

1. **Consistência**: Todas as aplicações seguem as mesmas regras
2. **Manutenibilidade**: Mudanças centralizadas afetam todo o monorepo
3. **Onboarding**: Novos projetos herdam automaticamente as configurações
4. **Performance**: Configurações são cacheadas pelo Turbo
5. **Versionamento**: Configurações versionadas junto com o código

## Personalização por App

Se um app específico precisar de configurações diferentes:

```javascript
// eslint.config.mjs
import { nestJsConfig } from '@repo/eslint-config/nest'

export default [
  ...nestJsConfig,
  {
    // Regras específicas para este app
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
]
```

## Path Mappings para NestJS

A configuração do TypeScript para NestJS inclui path mappings úteis:

```json
{
  "paths": {
    "@/*": ["./src/*"],
    "@modules/*": ["./src/modules/*"],
    "@common/*": ["./src/common/*"],
    "@config/*": ["./src/config/*"],
    "@shared/*": ["./src/shared/*"],
    "@utils/*": ["./src/utils/*"],
    "@guards/*": ["./src/guards/*"],
    "@interceptors/*": ["./src/interceptors/*"],
    "@decorators/*": ["./src/decorators/*"],
    "@dto/*": ["./src/dto/*"],
    "@entities/*": ["./src/entities/*"]
  }
}
```