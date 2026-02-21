# 📦 Como Usar o Arquivo do Código

## 📥 Arquivo Disponível

**Nome:** `cacapreco-pro-codigo-completo.tar.gz`
**Tamanho:** ~18MB
**Localização:** `/home/user/vite-template/cacapreco-pro-codigo-completo.tar.gz`

## 🔓 Como Extrair

### No Linux/Mac:

```bash
# Extrair o arquivo
tar -xzf cacapreco-pro-codigo-completo.tar.gz

# Entrar na pasta
cd vite-template

# Instalar dependências
npm install

# Validar código
npm run check:safe
```

### No Windows:

**Opção 1: 7-Zip (Recomendado)**
1. Baixe e instale o [7-Zip](https://www.7-zip.org/)
2. Clique com botão direito no arquivo `.tar.gz`
3. Selecione "7-Zip" → "Extract Here"
4. Extraia novamente o arquivo `.tar` gerado

**Opção 2: WinRAR**
1. Baixe e instale o [WinRAR](https://www.winrar.com/)
2. Clique com botão direito no arquivo
3. Selecione "Extract Here"

**Opção 3: Prompt de Comando (Windows 10+)**
```cmd
tar -xzf cacapreco-pro-codigo-completo.tar.gz
```

## 📋 O que está incluído:

```
vite-template/
├── src/                    # Código fonte
│   ├── components/ui/     # 40+ componentes shadcn/ui
│   ├── routes/            # Rotas da aplicação
│   ├── services/          # Serviços (live-search)
│   ├── sdk/               # Platform SDK e MCP
│   ├── hooks/             # React hooks
│   └── lib/               # Utilitários
├── config/                # Configurações
├── spec/                  # Schemas MCP
├── package.json           # Dependências
├── tsconfig.json          # Config TypeScript
├── vite.config.ts         # Config Vite
├── index.html             # HTML principal
├── README-CACAPRECO.md    # Documentação completa
└── COMO-USAR-O-ZIP.md     # Este arquivo
```

## ⚠️ O que NÃO está incluído (propositalmente):

- ❌ `node_modules/` - Instale com `npm install`
- ❌ `dist/` - Gerado pelo build
- ❌ `.git/` - Histórico git
- ❌ `.cache/` - Cache temporário

## 🚀 Primeiros Passos Após Extrair

### 1. Instalar Dependências
```bash
npm install
```

**Tempo estimado:** 2-5 minutos
**Tamanho final:** ~500MB (com node_modules)

### 2. Validar Instalação
```bash
npm run check:safe
```

**Deve retornar:**
```
✅ TypeScript: 0 erros
✅ ESLint: 0 warnings
✅ Biome: Formatação OK
```

### 3. Explorar o Código

**Arquivo principal:**
```
src/routes/index.tsx
```
- ~2600 linhas
- Aplicação completa
- Todas as funcionalidades

**Serviço de busca:**
```
src/services/live-search.ts
```
- Sistema de 4 camadas
- Integração Firecrawl
- Parser de preços

## 📖 Documentação

Leia o arquivo completo:
```
README-CACAPRECO.md
```

Contém:
- ✅ Visão geral completa
- ✅ Todas as funcionalidades
- ✅ Estrutura do projeto
- ✅ Como usar cada recurso
- ✅ Debugging e logs
- ✅ Performance e otimizações

## 🔧 Comandos Disponíveis

```bash
# Validar código (TypeScript + ESLint + Biome)
npm run check:safe

# Apenas TypeScript
npm run typecheck

# Apenas ESLint
npm run lint

# Apenas Biome
npm run format

# Build (gera dist/)
npm run build
```

## ⚠️ IMPORTANTE: E2B Sandbox

Este projeto foi desenvolvido em um **E2B Sandbox** que:

❌ **NÃO suporta:**
- `npm run dev` (servidor de desenvolvimento)
- `npm start`
- Hot reload

✅ **Suporta:**
- `npm install`
- `npm run check:safe`
- `npm run build`

**Para rodar localmente:**
Use qualquer outro ambiente (sua máquina local, CodeSandbox, StackBlitz, etc.)

## 📁 Estrutura de Pastas Detalhada

```
src/
├── components/
│   └── ui/                 # shadcn/ui components
│       ├── accordion.tsx
│       ├── alert.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── checkbox.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       ├── slider.tsx
│       ├── tabs.tsx
│       ├── tooltip.tsx
│       └── ... (40+ componentes)
│
├── routes/
│   ├── __root.tsx         # Layout root (navegação)
│   └── index.tsx          # App principal (2600 linhas)
│
├── services/
│   └── live-search.ts     # Busca ao vivo Firecrawl
│
├── sdk/
│   ├── core/
│   │   ├── auth.ts        # Autenticação JWT
│   │   ├── global.ts      # Config global
│   │   ├── mcp-client.ts  # Cliente MCP
│   │   └── request.ts     # HTTP requests
│   │
│   ├── mcp-clients/
│   │   └── 68f0a290f81ae7b79782adc9/
│   │       └── FIRECRAWL_SEARCH.ts
│   │
│   └── constants/
│       └── mcp-server.ts  # Constantes MCP
│
├── hooks/                 # React hooks customizados
│
└── lib/
    └── utils.ts          # Utilitários (cn, etc)
```

## 🎯 Principais Arquivos para Entender

### 1. **src/routes/index.tsx** (Principal)
```typescript
// Componente App com todas as funcionalidades
function App() {
  // Estados
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("home");
  const [theme, setTheme] = useState("light");
  // ... 50+ estados

  // Funções principais
  const handleLiveSearch = async () => { ... }
  const handleSearch = () => { ... }

  // Render
  return (
    <TooltipProvider>
      <Header />
      <Tabs>
        <TabsContent value="home"> ... </TabsContent>
        <TabsContent value="search"> ... </TabsContent>
        <TabsContent value="alerts"> ... </TabsContent>
        <TabsContent value="lists"> ... </TabsContent>
        <TabsContent value="submit"> ... </TabsContent>
      </Tabs>
      <Footer />
    </TooltipProvider>
  );
}
```

### 2. **src/services/live-search.ts** (Busca ao Vivo)
```typescript
// Sistema de 4 camadas
export async function searchLive(options) {
  // Estratégia 1: Busca simples
  // Estratégia 2: Marketplaces específicos
  // Estratégia 3: Busca genérica
  // Estratégia 4: Ultra-ampla

  return results;
}
```

### 3. **src/sdk/core/mcp-client.ts** (MCP Client)
```typescript
// Cliente para comunicação MCP
export async function callMCPTool<T>(
  mcpId: string,
  toolName: string,
  args: any
): Promise<T> {
  // Faz chamada MCP
  // Trata resposta
  return result;
}
```

## 🐛 Troubleshooting

### Problema: "Module not found"
**Solução:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Problema: Erros TypeScript
**Solução:**
```bash
npm run check:safe
# Veja os erros específicos
```

### Problema: "Cannot find package"
**Solução:**
Certifique-se de estar na pasta correta:
```bash
pwd  # Deve mostrar: .../vite-template
ls package.json  # Deve existir
```

## 📊 Tamanhos Aproximados

- **Arquivo .tar.gz:** 18MB
- **Extraído (sem node_modules):** 50MB
- **Com node_modules:** 550MB
- **Build (dist/):** 2MB

## 🔍 Buscar no Código

### Encontrar algo específico:
```bash
# Buscar por "searchLive"
grep -r "searchLive" src/

# Buscar por componente
find src/components/ui -name "*.tsx"

# Ver estrutura de pastas
tree src/  # (se tree estiver instalado)
# ou
ls -R src/
```

## 📝 Próximos Passos

1. ✅ Extrair arquivo
2. ✅ Instalar dependências (`npm install`)
3. ✅ Validar (`npm run check:safe`)
4. 📖 Ler `README-CACAPRECO.md`
5. 🔍 Explorar `src/routes/index.tsx`
6. 🧪 Testar funcionalidades
7. 🎨 Personalizar se desejar

## 💡 Dicas

- Use **VSCode** para melhor experiência
- Instale extensões:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript Hero
- Ative **TypeScript strict mode**
- Use **Console (F12)** para ver logs da busca

## 🆘 Suporte

Se tiver problemas:
1. Verifique `README-CACAPRECO.md`
2. Veja logs do console
3. Execute `npm run check:safe`
4. Verifique versão do Node (recomendado: 18+)

---

**Desenvolvido com ❤️**
**Pronto para uso! 🚀**
