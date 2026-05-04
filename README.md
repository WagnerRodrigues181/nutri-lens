# NutriLens 🥗📊

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Zustand](https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=react&logoColor=white) ![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)

**Rastreador nutricional completo com análise de macros, visualização de dados e alta cobertura de testes.**

• [Ver Demo](https://nutrilens-pearl.vercel.app/) • 

</div>

---

### 📸 Dashboard Principal

<div align="center">
  <img src="https://github.com/user-attachments/assets/86d94e6c-ba34-467f-ace8-ed2d3e1f6372" alt="Dashboard NutriLens" width="100%">
</div>

---

## 🎯 Sobre o Projeto

NutriLens é um tracker nutricional moderno focado em precisão, análise de dados e experiência do usuário. Desenvolvido com arquitetura escalável, type-safety completo e testes abrangentes.

### O Problema
Dificuldade em manter controle consistente de metas nutricionais com ferramentas que sejam rápidas, confiáveis e forneçam insights acionáveis.

### A Solução
Dashboard interativo com tracking em tempo real, múltiplas visualizações de dados, sistema de insights automáticos e gamificação através de streaks e conquistas.

---

## ✨ Features Principais

**📊 Dashboard Inteligente**
- Visão geral diária com progresso circular de macros
- Streak tracking com gamificação (badges e conquistas)
- Cards de métricas com indicadores visuais de progresso

**🍽️ Gestão de Refeições**
- CRUD completo com categorização (café, almoço, jantar, snacks)
- Templates reutilizáveis para refeições frequentes
- Histórico navegável por calendário

**📈 Visualização de Dados**
- 4 tipos de gráficos interativos (linha, pizza, barras, área)
- Análise estatística (médias, tendências, melhor/pior dia)
- Sistema de insights automáticos baseado em padrões

**💾 Portabilidade**
- Export/Import em CSV e JSON
- Relatórios semanais personalizados
- Backup completo de dados e metas

**🎨 Experiência do Usuário**
- Dark mode com persistência
- Animações fluidas (Framer Motion)
- Interface responsiva e acessível

<div align="center">
  <img src="https://github.com/user-attachments/assets/fe6cea59-2ee3-49e6-b2d3-99d96b9bee90" alt="Templates de refeições favoritas" width="90%">
  <p><em>Sistema de templates reutilizáveis para refeições frequentes</em></p>
</div>

---

## 🛠️ Stack Técnica

**Core**
- React 19 + TypeScript 5
- Vite (build tool)
- Zustand (state management)
- Tailwind CSS + shadcn/ui

**Qualidade & Testes**
- Vitest + React Testing Library
- Zod (validação runtime)
- **96% de cobertura de testes**

**Visualização**
- Recharts (gráficos)
- Framer Motion (animações)
- date-fns (manipulação de datas)

---

## 🏗️ Arquitetura

```
src/
├── components/      # Componentes organizados por feature
│   ├── dashboard/   # Métricas, progresso, insights
│   ├── meals/       # CRUD de refeições e templates
│   ├── charts/      # Visualizações de dados
│   └── common/      # Componentes compartilhados
│
├── store/           # Zustand stores (nutrition, settings)
├── services/        # Lógica de negócio isolada
├── hooks/           # Custom hooks reutilizáveis
├── utils/           # Funções utilitárias puras
├── types/           # TypeScript definitions
└── __tests__/       # Suite completa de testes
```

**Padrões Implementados**
- Arquitetura em camadas (UI → Logic → State)
- Type-safety em runtime com Zod
- Funções puras e testáveis
- Memoization estratégica

<div align="center">
  <img src="https://github.com/user-attachments/assets/ecfbd4b1-71ce-4247-b404-388c0fe67242" alt="Visualização de dados com múltiplos gráficos" width="90%">
  <p><em>4 tipos de gráficos interativos: evolução de calorias, distribuição de macros, comparação semanal e evolução quinzenal</em></p>
</div>

---

## 📊 Cobertura de Testes

```
Utils       ████████████████████ 100%
Services    ████████████████████  99%
Hooks       ████████████████████ 100%
Store       ████████████████████  92%
Components  ████████████████████ 100%
───────────────────────────────────────
Total       ████████████████████  96%
```

**Estratégia de Testes**
- Unit tests para utils e services
- Integration tests para hooks e stores
- Component tests com React Testing Library
- Validação de edge cases e error handling

<div align="center">
  <img src="https://github.com/user-attachments/assets/cb1a0504-b9a8-4b2e-9988-f2312a878534" alt="Sistema de insights e conquistas" width="90%">
  <p><em>Insights automáticos baseados em padrões e sistema de gamificação com badges desbloqueáveis</em></p>
</div>

---

## 🚀 Instalação e Uso

```bash
# Clone o repositório
git clone https://github.com/WagnerRodrigues181/nutri-lens.git

# Instale dependências
cd nutri-lens
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

### Scripts Disponíveis

```bash
npm run dev           # Servidor de desenvolvimento
npm run build         # Build de produção
npm run preview       # Preview do build
npm run test          # Executar testes
npm run test:ui       # Interface de testes
npm run test:coverage # Relatório de cobertura
```

---

## 🎓 Destaques Técnicos

**Type-Safety Completo**
- TypeScript em 100% do código
- Validação runtime com Zod
- Type inference automática

**Performance**
- React.memo em componentes pesados
- Lazy loading de rotas
- Debouncing em inputs

**Qualidade de Código**
- ESLint + Prettier
- Conventional commits
- 96% test coverage

**Acessibilidade**
- Semantic HTML
- Keyboard navigation
- ARIA labels

---

## 💡 Decisões de Design

**Zustand vs Redux**
- Escolhido pela simplicidade e menor boilerplate
- Performance superior em apps de média escala
- API mais intuitiva

**Recharts vs Chart.js**
- Melhor integração com React
- Componentes declarativos
- Customização mais simples

**Vitest vs Jest**
- Compatibilidade nativa com Vite
- Velocidade de execução superior
- API similar ao Jest

<div align="center">
  <img src="https://github.com/user-attachments/assets/c5c6f8f1-f26e-4713-aa3c-904b6f2d72b3" alt="Sistema de import e export de dados" width="90%">
  <p><em>Portabilidade completa: import/export em CSV e JSON, relatórios semanais personalizados</em></p>
</div>

---

## 📬 Contato

Gostou do projeto? Vamos conversar!

**Wagner Rodrigues**
- 💼 [LinkedIn](https://linkedin.com/in/wagner-rodrigues-monteiro)
- 📧 [Email](mailto:rodrigueswagner181@gmail.com)
- 🐙 [GitHub](https://github.com/WagnerRodrigues181)

---

<div align="center">

**Desenvolvido com 💚 e disciplina**

Se este projeto foi útil, considere dar uma ⭐

</div>
