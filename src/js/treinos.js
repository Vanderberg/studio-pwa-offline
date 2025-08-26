// src/js/treinos.js
import { run, persist, query } from './db.js';
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

const state = { tabs: [], active: null };

export function updateCounter(){ $('#contAbertos').textContent = `${state.tabs.length}/5`; $('#vazio').style.display = state.tabs.length ? 'none' : 'block'; }

export function openTab(t){
  if (state.tabs.length >= 5) { alert('Limite de 5 treinos abertos'); return; }
  if (state.tabs.find(x => x.id === t.id)) { setActive(t.id); return; }
  const tabs = $('#tabs'); let bar = tabs.querySelector('.tabBar'); if (!bar) { bar = document.createElement('div'); bar.className = 'tabBar'; tabs.appendChild(bar); }
  const tab = document.createElement('div'); tab.className = 'tab'; tab.textContent = t.titulo; const close = document.createElement('span'); close.className='close'; close.textContent='×'; tab.appendChild(close); bar.appendChild(tab);
  const content = document.createElement('div'); content.className='tabContent'; content.innerHTML = `
    <div class="itemActions">
      <input class="titulo" value="${t.titulo}" />
      <button class="fechar">Fechar</button>
      <span class="small saveInfo"></span>
    </div>
    <textarea class="texto" placeholder="Texto do treino..."></textarea>
  `;
  content.querySelector('.texto').value = t.texto || ''; tabs.appendChild(content);
  
  // Adicionar atributo de data para impressão
  content.setAttribute('data-print-date', new Date().toLocaleDateString('pt-BR'));
  
  const rec = { id: t.id, alunoId: t.aluno_id, titulo: t.titulo, texto: t.texto || '', elTab: tab, elContent: content, timer: null };
  state.tabs.push(rec); updateCounter(); setActive(rec.id);
  tab.onclick = () => setActive(rec.id); close.onclick = (e)=>{ e.stopPropagation(); closeTab(rec.id); };
  content.querySelector('.fechar').onclick = () => closeTab(rec.id);
  content.querySelector('.titulo').oninput = (e)=>{ rec.titulo = e.target.value; tab.childNodes[0].nodeValue = rec.titulo; debounceSave(rec); };
  content.querySelector('.texto').oninput = (e)=>{ rec.texto = e.target.value; debounceSave(rec); };
}

export function setActive(id){ state.active=id; $$('.tab').forEach(el=>el.classList.remove('active')); $$('.tabContent').forEach(el=>el.classList.remove('active')); const r = state.tabs.find(x=>x.id===id); if(!r) return; r.elTab.classList.add('active'); r.elContent.classList.add('active'); }
export function closeTab(id){ const i = state.tabs.findIndex(x=>x.id===id); if (i===-1) return; const r = state.tabs[i]; r.elTab.remove(); r.elContent.remove(); state.tabs.splice(i,1); updateCounter(); if(state.tabs.length) setActive(state.tabs[state.tabs.length-1].id); }

function debounceSave(rec){
  const info = rec.elContent.querySelector('.saveInfo'); info.textContent = 'Salvando...';
  if (rec.timer) clearTimeout(rec.timer);
  rec.timer = setTimeout(async () => {
    run(`UPDATE treino SET titulo=?, texto=?, atualizado_em=datetime('now') WHERE id=?`, [rec.titulo, rec.texto, rec.id]);
    await persist();
    const u = query(`SELECT atualizado_em FROM treino WHERE id=?`, [rec.id])[0];
    info.textContent = 'Salvo em: ' + (u?.atualizado_em || '');
  }, 700);
}

export function duplicar(){ const r = state.tabs.find(t=>t.id===state.active); if(!r) { alert('Abra um treino'); return; }
  const id = (crypto.randomUUID && crypto.randomUUID()) || Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2);
  run(`INSERT INTO treino (id, aluno_id, titulo, texto, atualizado_em) VALUES (?,?,?,?,datetime('now'))`, [id, r.alunoId, r.titulo + ' (cópia)', r.texto]);
  persist().then(()=>{ const t = query(`SELECT id, aluno_id, titulo, texto, atualizado_em FROM treino WHERE id=?`, [id])[0]; openTab(t); });
}
export function renomear(){ const r = state.tabs.find(t=>t.id===state.active); if(!r) { alert('Abra um treino'); return; } const nv = prompt('Novo título:', r.titulo); if (nv===null) return;
  r.titulo = nv.trim() || 'Treino'; run(`UPDATE treino SET titulo=?, atualizado_em=datetime('now') WHERE id=?`, [r.titulo, r.id]); persist().then(()=>{ r.elTab.childNodes[0].nodeValue = r.titulo; });
}
export function excluir(){ const r = state.tabs.find(t=>t.id===state.active); if(!r) { alert('Abra um treino'); return; } if (!confirm('Excluir este treino?')) return; run(`DELETE FROM treino WHERE id=?`, [r.id]); persist().then(()=> closeTab(r.id)); }

// Nova função para impressão inteligente
export function imprimirTreino(){
  const treinoAtivo = state.tabs.find(t => t.id === state.active);
  if (!treinoAtivo) {
    alert('Nenhum treino aberto para imprimir!');
    return;
  }

  // Criar uma nova janela para impressão
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  
  // Obter dados do aluno para o cabeçalho
  const aluno = query(`SELECT nome FROM aluno WHERE id=?`, [treinoAtivo.alunoId])[0];
  const nomeAluno = aluno ? aluno.nome : 'Aluno não encontrado';
  
  // HTML para impressão
  const printHTML = `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Treino - ${treinoAtivo.titulo}</title>
      <style>
        @media print {
          body { margin: 20px; font-family: Arial, sans-serif; }
          .no-print { display: none !important; }
          .print-header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #24b9a8; padding-bottom: 20px; }
          .print-header h1 { color: #24b9a8; margin: 0; font-size: 28px; }
          .print-header .aluno-info { color: #666; margin: 10px 0; font-size: 16px; }
          .print-header .data { color: #999; font-size: 14px; }
          .treino-content { margin-top: 30px; }
          .treino-content h2 { color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
          .treino-texto { white-space: pre-line; line-height: 1.6; font-size: 14px; }
          .footer { margin-top: 50px; text-align: center; color: #999; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; }
          @page { margin: 1.5cm; }
        }
        
        /* Estilos para visualização na tela */
        body { margin: 20px; font-family: Arial, sans-serif; background: #f5f5f5; }
        .print-container { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 800px; margin: 0 auto; }
        .print-header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #24b9a8; padding-bottom: 20px; }
        .print-header h1 { color: #24b9a8; margin: 0; font-size: 28px; }
        .print-header .aluno-info { color: #666; margin: 10px 0; font-size: 16px; }
        .print-header .data { color: #999; font-size: 14px; }
        .treino-content { margin-top: 30px; }
        .treino-content h2 { color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
        .treino-texto { white-space: pre-line; line-height: 1.6; font-size: 14px; }
        .footer { margin-top: 50px; text-align: center; color: #999; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; }
        .print-actions { text-align: center; margin: 20px 0; }
        .print-btn { background: #24b9a8; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 16px; margin: 0 10px; }
        .print-btn:hover { background: #1ea895; }
        .close-btn { background: #6c757d; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 16px; margin: 0 10px; }
        .close-btn:hover { background: #5a6268; }
      </style>
    </head>
    <body>
      <div class="print-container">
        <div class="print-header">
          <h1>Studio Alfa</h1>
          <div class="aluno-info">Aluno: ${nomeAluno}</div>
          <div class="data">Data: ${new Date().toLocaleDateString('pt-BR')}</div>
        </div>
        
        <div class="treino-content">
          <h2>${treinoAtivo.titulo}</h2>
          <div class="treino-texto">${treinoAtivo.texto || 'Nenhum conteúdo do treino disponível.'}</div>
        </div>
        
        <div class="footer">
          <p>Studio Alfa - Sistema de Gestão de Treinos</p>
          <p>Impresso em: ${new Date().toLocaleString('pt-BR')}</p>
        </div>
        
        <div class="print-actions no-print">
          <button class="print-btn" onclick="window.print()">🖨️ Imprimir</button>
          <button class="close-btn" onclick="window.close()">❌ Fechar</button>
        </div>
      </div>
    </body>
    </html>
  `;
  
  printWindow.document.write(printHTML);
  printWindow.document.close();
  
  // Focar na nova janela
  printWindow.focus();
}

export function modelos(key){
  if (key==='fullbody') return `FULL BODY (iniciante)
A) Agachamento livre 3x10
B) Supino reto 3x10
C) Remada baixa 3x12
D) Desenvolvimento 3x12
E) Prancha 3x30s`;
  if (key==='abc') return `TREINO ABC (intermediário)
A) Peito/Tríceps
B) Costas/Bíceps
C) Pernas/Ombros`;
  if (key==='hiit') return `HIIT 20 MIN
- 1 min corrida forte / 1 min caminhada (x10)`;
  return '';
}
export function aplicarModelo(){
  const r = state.tabs.find(t=>t.id===state.active); if(!r){ alert('Abra um treino'); return; }
  const sel = document.querySelector('#modelos'); const key = sel.value; if (!key) return;
  const txt = modelos(key); const ta = r.elContent.querySelector('.texto'); ta.value = (ta.value ? (ta.value + '\n\n') : '') + txt; r.texto = ta.value;
  sel.value = ''; const evt = new Event('input'); ta.dispatchEvent(evt);
}
