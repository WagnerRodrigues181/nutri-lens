# NutriLens - Test Suite

## Estrutura de Testes

```
src/__tests__/
├── setup.ts              # Configuração global dos testes
├── mockData.ts           # Dados mock reutilizáveis
├── utils/                # Testes de funções utilitárias
├── services/             # Testes de serviços de negócio
├── hooks/                # Testes de custom hooks
├── store/                # Testes de Zustand stores
└── components/           # Testes de componentes React
```

## Comandos

```bash
# Rodar todos os testes
npm run test

# Rodar testes em modo watch
npm run test:watch

# Gerar relatório de coverage
npm run test:coverage

# Rodar testes de um arquivo específico
npm run test src/__tests__/utils/formatters.test.ts
```

## Coverage Target

- **Utils:** 100%
- **Services:** 90%
- **Hooks:** 85%
- **Store:** 90%
- **Components:** 70%
- **Total:** >80%

## Boas Práticas

1. **Arrange-Act-Assert (AAA)** - Organize os testes em 3 seções claras
2. **Dados mock** - Use os mocks em `mockData.ts` para consistência
3. **Descrições claras** - Use `describe` e `it` com mensagens descritivas
4. **Testes isolados** - Cada teste deve ser independente
5. **Setup/Teardown** - Use `beforeEach`/`afterEach` quando necessário

## Exemplo de Teste

```typescript
import { describe, it, expect } from "vitest";
import { formatCalories } from "@/utils/formatters";

describe("formatCalories", () => {
  it("should format calories with kcal suffix", () => {
    // Arrange
    const calories = 2000;

    // Act
    const result = formatCalories(calories);

    // Assert
    expect(result).toBe("2000 kcal");
  });
});
```
