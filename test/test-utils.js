// test-utils.js - Utilitários para testes do Studio Alfa

/**
 * Classe utilitária para testes
 */
class TestUtils {
    constructor() {
        this.testResults = [];
        this.startTime = null;
    }
    
    /**
     * Inicia um teste
     * @param {string} testName - Nome do teste
     */
    startTest(testName) {
        this.startTime = Date.now();
        console.log(`🧪 Iniciando teste: ${testName}`);
        return {
            name: testName,
            startTime: this.startTime
        };
    }
    
    /**
     * Finaliza um teste
     * @param {string} testName - Nome do teste
     * @param {boolean} success - Se o teste foi bem-sucedido
     * @param {string} message - Mensagem adicional
     */
    endTest(testName, success, message = '') {
        const endTime = Date.now();
        const duration = endTime - this.startTime;
        
        const result = {
            name: testName,
            success,
            message,
            duration,
            timestamp: new Date().toISOString()
        };
        
        this.testResults.push(result);
        
        const status = success ? '✅' : '❌';
        console.log(`${status} Teste ${testName} finalizado em ${duration}ms - ${message}`);
        
        return result;
    }
    
    /**
     * Executa uma função de teste com tratamento de erro
     * @param {string} testName - Nome do teste
     * @param {Function} testFunction - Função de teste
     * @returns {Promise<Object>} - Resultado do teste
     */
    async runTest(testName, testFunction) {
        const test = this.startTest(testName);
        
        try {
            await testFunction();
            return this.endTest(testName, true, 'Executado com sucesso');
        } catch (error) {
            return this.endTest(testName, false, `Erro: ${error.message}`);
        }
    }
    
    /**
     * Verifica se uma condição é verdadeira
     * @param {boolean} condition - Condição a ser verificada
     * @param {string} message - Mensagem de erro
     */
    assert(condition, message = 'Assertion failed') {
        if (!condition) {
            throw new Error(message);
        }
    }
    
    /**
     * Verifica se dois valores são iguais
     * @param {*} actual - Valor atual
     * @param {*} expected - Valor esperado
     * @param {string} message - Mensagem de erro
     */
    assertEquals(actual, expected, message = '') {
        const actualStr = JSON.stringify(actual);
        const expectedStr = JSON.stringify(expected);
        
        if (actualStr !== expectedStr) {
            throw new Error(`${message} - Esperado: ${expectedStr}, Atual: ${actualStr}`);
        }
    }
    
    /**
     * Verifica se um valor é nulo ou indefinido
     * @param {*} value - Valor a ser verificado
     * @param {string} message - Mensagem de erro
     */
    assertNotNull(value, message = 'Valor não pode ser nulo') {
        if (value === null || value === undefined) {
            throw new Error(message);
        }
    }
    
    /**
     * Verifica se uma string contém um texto específico
     * @param {string} text - Texto completo
     * @param {string} substring - Subtexto a ser encontrado
     * @param {string} message - Mensagem de erro
     */
    assertContains(text, substring, message = '') {
        if (!text.includes(substring)) {
            throw new Error(`${message} - Texto "${text}" não contém "${substring}"`);
        }
    }
    
    /**
     * Simula um delay
     * @param {number} ms - Milissegundos para aguardar
     */
    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * Gera dados de teste para alunos
     * @param {number} count - Quantidade de alunos
     * @returns {Array} - Array de alunos de teste
     */
    generateTestAlunos(count = 5) {
        const nomes = ['João Silva', 'Maria Santos', 'Pedro Costa', 'Ana Oliveira', 'Carlos Lima'];
        const alunos = [];
        
        for (let i = 0; i < count; i++) {
            const hoje = new Date();
            const nascimento = new Date(hoje.getFullYear() - 25 - i, i, 15 + i);
            const vencimento = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 15 + i);
            
            alunos.push({
                id: `aluno_${i + 1}`,
                nome: nomes[i] || `Aluno ${i + 1}`,
                data_nascimento: nascimento.toISOString().split('T')[0],
                vencimento: vencimento.toISOString().split('T')[0]
            });
        }
        
        return alunos;
    }
    
    /**
     * Gera dados de teste para treinos
     * @param {Array} alunos - Array de alunos
     * @param {number} count - Quantidade de treinos por aluno
     * @returns {Array} - Array de treinos de teste
     */
    generateTestTreinos(alunos, count = 3) {
        const tiposTreino = ['Full Body', 'ABC', 'HIIT', 'Força', 'Cardio'];
        const treinos = [];
        
        alunos.forEach((aluno, alunoIndex) => {
            for (let i = 0; i < count; i++) {
                const hoje = new Date();
                const atualizado = new Date(hoje.getTime() - (i * 24 * 60 * 60 * 1000));
                
                treinos.push({
                    id: `treino_${alunoIndex}_${i}`,
                    aluno_id: aluno.id,
                    titulo: `${tiposTreino[i % tiposTreino.length]} - ${aluno.nome}`,
                    texto: `Treino ${i + 1} para ${aluno.nome}\n\nA) Exercício 1 3x10\nB) Exercício 2 3x12\nC) Exercício 3 3x15`,
                    atualizado_em: atualizado.toISOString()
                });
            }
        });
        
        return treinos;
    }
    
    /**
     * Calcula o status do plano baseado na data de vencimento
     * @param {string} vencimento - Data de vencimento (YYYY-MM-DD)
     * @returns {string} - Status do plano
     */
    calcularStatusPlano(vencimento) {
        const hoje = new Date();
        const venc = new Date(vencimento + 'T00:00:00');
        
        if (hoje > venc) return 'VENCIDO';
        
        const diff = Math.ceil((venc - hoje) / (1000 * 60 * 60 * 24));
        return diff <= 7 ? 'VENCE_EM_7' : 'ATIVO';
    }
    
    /**
     * Formata data para formato brasileiro
     * @param {string} isoDate - Data em formato ISO (YYYY-MM-DD)
     * @returns {string} - Data formatada (DD/MM/YYYY)
     */
    formatarDataBR(isoDate) {
        const [year, month, day] = isoDate.split('-');
        return `${day}/${month}/${year}`;
    }
    
    /**
     * Simula operações de banco de dados
     */
    createMockDatabase() {
        const db = {
            alunos: [],
            treinos: [],
            
            // Operações de alunos
            inserirAluno: function(aluno) {
                aluno.id = aluno.id || `aluno_${Date.now()}`;
                this.alunos.push(aluno);
                return aluno;
            },
            
            buscarAlunos: function(filtro = '') {
                if (!filtro) return this.alunos;
                return this.alunos.filter(a => 
                    a.nome.toLowerCase().includes(filtro.toLowerCase())
                );
            },
            
            atualizarAluno: function(id, dados) {
                const index = this.alunos.findIndex(a => a.id === id);
                if (index !== -1) {
                    this.alunos[index] = { ...this.alunos[index], ...dados };
                    return this.alunos[index];
                }
                return null;
            },
            
            excluirAluno: function(id) {
                const index = this.alunos.findIndex(a => a.id === id);
                if (index !== -1) {
                    const aluno = this.alunos.splice(index, 1)[0];
                    // Excluir treinos relacionados
                    this.treinos = this.treinos.filter(t => t.aluno_id !== id);
                    return aluno;
                }
                return null;
            },
            
            // Operações de treinos
            inserirTreino: function(treino) {
                treino.id = treino.id || `treino_${Date.now()}`;
                treino.atualizado_em = new Date().toISOString();
                this.treinos.push(treino);
                return treino;
            },
            
            buscarTreinos: function(alunoId = null) {
                if (!alunoId) return this.treinos;
                return this.treinos.filter(t => t.aluno_id === alunoId);
            },
            
            atualizarTreino: function(id, dados) {
                const index = this.treinos.findIndex(t => t.id === id);
                if (index !== -1) {
                    this.treinos[index] = { 
                        ...this.treinos[index], 
                        ...dados,
                        atualizado_em: new Date().toISOString()
                    };
                    return this.treinos[index];
                }
                return null;
            },
            
            excluirTreino: function(id) {
                const index = this.treinos.findIndex(t => t.id === id);
                if (index !== -1) {
                    return this.treinos.splice(index, 1)[0];
                }
                return null;
            },
            
            // Estatísticas
            getEstatisticas: function() {
                const hoje = new Date();
                const alunosAtivos = this.alunos.filter(a => {
                    const venc = new Date(a.vencimento + 'T00:00:00');
                    return venc > hoje;
                }).length;
                
                return {
                    totalAlunos: this.alunos.length,
                    alunosAtivos,
                    alunosVencidos: this.alunos.length - alunosAtivos,
                    totalTreinos: this.treinos.length,
                    mediaTreinosPorAluno: this.alunos.length > 0 ? 
                        (this.treinos.length / this.alunos.length).toFixed(1) : 0
                };
            }
        };
        
        return db;
    }
    
    /**
     * Gera relatório de testes
     * @returns {Object} - Relatório completo
     */
    generateReport() {
        const total = this.testResults.length;
        const sucessos = this.testResults.filter(r => r.success).length;
        const falhas = total - sucessos;
        const tempoTotal = this.testResults.reduce((sum, r) => sum + r.duration, 0);
        
        return {
            total,
            sucessos,
            falhas,
            tempoTotal,
            tempoMedio: total > 0 ? tempoTotal / total : 0,
            taxaSucesso: total > 0 ? (sucessos / total) * 100 : 0,
            resultados: this.testResults,
            timestamp: new Date().toISOString()
        };
    }
    
    /**
     * Exporta relatório para JSON
     * @param {string} filename - Nome do arquivo
     */
    exportReport(filename = 'test-report.json') {
        const report = this.generateReport();
        const blob = new Blob([JSON.stringify(report, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log(`📊 Relatório exportado: ${filename}`);
    }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.TestUtils = TestUtils;
}

// Exportar para módulos ES6
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TestUtils;
}

// Exemplo de uso:
/*
const utils = new TestUtils();

// Executar teste
utils.runTest('Teste de Alunos', async () => {
    const db = utils.createMockDatabase();
    
    // Inserir aluno
    const aluno = utils.generateTestAlunos(1)[0];
    const resultado = db.inserirAluno(aluno);
    
    utils.assertNotNull(resultado, 'Aluno deve ser inserido');
    utils.assertEquals(resultado.nome, aluno.nome, 'Nome deve ser igual');
    
    // Verificar se foi inserido
    const alunos = db.buscarAlunos();
    utils.assertEquals(alunos.length, 1, 'Deve ter 1 aluno');
});

// Gerar relatório
const report = utils.generateReport();
console.log('Relatório:', report);
*/


