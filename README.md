# Studio Alfa - PWA Offline

## 🎯 **VISÃO GERAL**

O **Studio Alfa** é uma **Progressive Web App (PWA)** desenvolvida para gestão de academias e estúdios de fitness. É uma aplicação web que funciona **completamente offline**, permitindo que instrutores gerenciem alunos e treinos mesmo sem conexão com a internet.

## 🏗️ **ARQUITETURA TÉCNICA**

### **Frontend**
- **HTML5** com interface responsiva
- **CSS3** com sistema de temas (claro/escuro)
- **JavaScript ES6+** modular com imports/exports
- **PWA** com manifest.json e service worker

### **Backend Local**
- **SQLite** em memória usando sql.js
- **IndexedDB** para persistência local
- **Service Worker** para cache offline
- **Local Storage** para configurações

### **Tecnologias Externas**
- **sql.js** (CDN) para banco SQLite no navegador
- **Service Worker API** para funcionalidade offline

## 🎨 **INTERFACE E UX**

### **Layout Principal**
- **Header**: Logo personalizável, seletor de tema, menu dropdown
- **Painel Esquerdo**: Gestão de alunos com busca e filtros
- **Painel Direito**: Editor de treinos com sistema de abas

### **Temas**
- **Tema Claro**: Fundo branco, texto escuro
- **Tema Escuro**: Fundo escuro, texto claro
- **Cores**: Verde azulado (#24b9a8) como cor principal

### **Responsividade**
- Logo adaptativo baseado no tamanho da tela
- Layout em grid que se adapta a diferentes resoluções
- Interface otimizada para mobile e desktop

## 👥 **GESTÃO DE ALUNOS**

### **Funcionalidades**
- ✅ **CRUD completo**: Criar, ler, atualizar, excluir
- ✅ **Busca em tempo real** por nome
- ✅ **Filtros por status** do plano
- ✅ **Validação de datas** (nascimento e vencimento)

### **Status dos Planos**
- 🟢 **ATIVO**: Plano válido
- 🟡 **VENCE_EM_X_DIAS**: Vencimento próximo (≤7 dias)
- 🔴 **VENCIDO**: Plano expirado

### **Campos dos Alunos**
- Nome completo
- Data de nascimento
- Data de vencimento do plano

## 💪 **GESTÃO DE TREINOS**

### **Sistema de Abas**
- Máximo de **5 treinos abertos** simultaneamente
- **Aba ativa** destacada visualmente
- **Fechamento individual** de treinos

### **Editor de Treinos**
- **Título editável** em tempo real
- **Área de texto** para conteúdo do treino
- **Auto-save** com debounce de 700ms
- **Timestamp** de última atualização

### **Modelos Pré-definidos**
- **Full Body** (iniciante)
- **ABC** (intermediário)
- **HIIT 20'** (cardio)

### **Operações**
- ✅ **Duplicar** treino existente
- ✅ **Renomear** treino
- ✅ **Excluir** treino
- ✅ **Imprimir** treino formatado

## 🗄️ **BANCO DE DADOS**

### **Estrutura SQLite**
```sql
-- Tabela de Alunos
CREATE TABLE aluno (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  data_nascimento TEXT NOT NULL,
  vencimento TEXT NOT NULL
);

-- Tabela de Treinos
CREATE TABLE treino (
  id TEXT PRIMARY KEY,
  aluno_id TEXT NOT NULL,
  titulo TEXT NOT NULL,
  texto TEXT NOT NULL,
  atualizado_em TEXT,
  FOREIGN KEY(aluno_id) REFERENCES aluno(id) ON DELETE CASCADE
);
```

### **Persistência**
- **IndexedDB** para armazenamento local
- **Backup automático** no navegador
- **Importação/Exportação** de arquivos .sqlite
- **Sincronização** automática de dados

## 🔧 **FUNCIONALIDADES AVANÇADAS**

### **PWA (Progressive Web App)**
- **Instalação** como app nativo
- **Service Worker** para cache offline
- **Manifest** com ícones e metadados
- **Funcionalidade offline** completa

### **Personalização**
- **Logo customizável** (suporte a imagens)
- **Favicon dinâmico** baseado na logo
- **Temas** persistidos no localStorage
- **Interface responsiva** adaptativa

### **Importação/Exportação**
- **Backup** do banco em formato .sqlite
- **Restauração** de dados de backup
- **Portabilidade** entre dispositivos
- **Migração** de dados

## 🧪 **SISTEMA DE TESTES**

### **Arquivos de Teste**
- **test-crud.html**: Operações CRUD
- **test-ui.html**: Interface e temas
- **test-db.html**: Banco de dados
- **test-menu.html**: Menu e configurações
- **test-impressao.html**: Sistema de impressão
- **test-runner.html**: Executor de todos os testes

### **Dados de Teste**
- **dados-teste.json**: Dados de exemplo
- **dados-teste.sqlite**: Banco com dados reais

## 🚀 **INSTALAÇÃO E EXECUÇÃO**

### **Pré-requisitos**
- Python 3.x
- Navegador moderno (Chrome, Firefox, Safari, Edge)

### **Execução Local**
```bash
# Linux/Mac
./RUN.sh [porta]

# Windows
RUN.bat [porta]

# Porta padrão: 8000
```

### **Acesso**
- Abra o navegador em: `http://localhost:8000`
- A aplicação abrirá automaticamente

## 📱 **COMPATIBILIDADE**

- **Navegadores modernos** (Chrome, Firefox, Safari, Edge)
- **Dispositivos móveis** (Android, iOS)
- **Desktop** (Windows, macOS, Linux)
- **Funcionamento offline** completo
- **Instalação como app** nativo

## 🎯 **CASOS DE USO**

### **Academias**
- Gestão de alunos e planos
- Criação de treinos personalizados
- Controle de vencimentos
- Sistema offline para uso em campo

### **Personal Trainers**
- Cadastro de clientes
- Planejamento de treinos
- Acompanhamento de progresso
- Portabilidade entre dispositivos

### **Estúdios de Fitness**
- Administração de membros
- Programação de aulas
- Controle de assinaturas
- Backup e sincronização de dados

## 🔒 **CARACTERÍSTICAS DE SEGURANÇA**

- **Dados locais** (não enviados para servidores)
- **Backup automático** no navegador
- **Validação** de entrada de dados
- **Sanitização** de conteúdo HTML
- **Controle de acesso** local

## 🎯 **PONTOS FORTES**

1. **100% Offline** - Funciona sem internet
2. **PWA Nativo** - Instala como app
3. **Interface Intuitiva** - Fácil de usar
4. **Dados Portáveis** - Importação/exportação
5. **Responsivo** - Adapta-se a qualquer tela
6. **Temas** - Claro/escuro
7. **Backup Automático** - Dados sempre seguros
8. **Sistema de Testes** - Qualidade garantida

## 📁 **ESTRUTURA DO PROJETO**

```
studio-pwa-offline/
├── assets/icons/          # Ícones da aplicação
├── src/
│   ├── css/              # Estilos CSS
│   └── js/               # Código JavaScript
├── test/                  # Sistema de testes
├── index.html            # Página principal
├── manifest.json         # Configuração PWA
├── sw.js                # Service Worker
├── RUN.sh               # Script de execução (Linux/Mac)
└── RUN.bat              # Script de execução (Windows)
```

## 🤝 **CONTRIBUIÇÃO**

Este projeto está em desenvolvimento ativo. Contribuições são bem-vindas!

### **Como Contribuir**
1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Faça commit das suas mudanças
4. Abra um Pull Request

## 📄 **LICENÇA**

Este projeto é distribuído sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 📞 **SUPORTE**

Para suporte ou dúvidas, abra uma issue no repositório GitHub.

---

**Studio Alfa** - Sistema de Gestão de Treinos Offline 🏋️‍♂️💪
