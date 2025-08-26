# Testes do Studio Alfa

Esta pasta contém arquivos para testar todas as funcionalidades do sistema Studio Alfa.

## 📁 Arquivos de Teste

### 🧪 Testes Automatizados
- `test-crud.html` - Testa operações CRUD de alunos e treinos
- `test-menu.html` - Testa todas as opções do menu
- `test-ui.html` - Testa interface e temas
- `test-db.html` - Testa funcionalidades do banco de dados

### 📊 Dados de Teste
- `dados-teste.sqlite` - Banco de dados com dados de exemplo
- `dados-teste.json` - Dados em formato JSON para importação

### 🔧 Utilitários
- `test-utils.js` - Funções auxiliares para testes
- `test-runner.html` - Executor principal de todos os testes

## 🚀 Como Usar

1. **Teste Individual**: Abra qualquer arquivo HTML no navegador
2. **Teste Completo**: Use `test-runner.html` para executar todos os testes
3. **Dados de Exemplo**: Use `dados-teste.sqlite` para testar com dados reais

## 📋 Funcionalidades Testadas

### CRUD de Alunos
- ✅ Criar novo aluno
- ✅ Ler/visualizar alunos
- ✅ Atualizar dados do aluno
- ✅ Excluir aluno
- ✅ Filtros e busca

### CRUD de Treinos
- ✅ Criar novo treino
- ✅ Editar treino existente
- ✅ Duplicar treino
- ✅ Renomear treino
- ✅ Excluir treino
- ✅ Aplicar modelos pré-definidos

### Menu e Configurações
- ✅ Trocar logo
- ✅ Importar banco SQLite
- ✅ Exportar banco SQLite
- ✅ Instalação PWA
- ✅ Temas (claro/escuro)

### Banco de Dados
- ✅ Persistência local
- ✅ Importação/Exportação
- ✅ Backup automático
- ✅ Status de planos

## 🎯 Objetivo dos Testes

Verificar se todas as funcionalidades estão funcionando corretamente:
- Interface responsiva
- Persistência de dados
- Funcionalidades offline
- PWA e service worker
- Temas e personalização


