// src/js/alunos.js
import { query, run, persist, statusPlano } from './db.js';

const $ = (s) => document.querySelector(s);

export function renderAlunos(){
  const q = $('#busca').value.trim().toLowerCase();
  const st = $('#statusFilter').value;
  let alunos = query(`SELECT id, nome, data_nascimento, vencimento FROM aluno`)
    .map(a => ({...a, status: statusPlano(a.vencimento)}));
  if (q) alunos = alunos.filter(a => a.nome.toLowerCase().includes(q));
  if (st) alunos = alunos.filter(a => a.status === st);
  alunos.sort((a,b) => a.nome.localeCompare(b.nome));

  const ul = $('#listaAlunos'); ul.innerHTML = '';
  alunos.forEach(a => {
    const li = document.createElement('li');
    li.className = 'card';
    
    // Processar o status para exibição amigável
    let statusDisplay = a.status;
    if (a.status.startsWith('VENCE_EM_') && a.status.endsWith('_DIAS')) {
      const dias = a.status.replace('VENCE_EM_', '').replace('_DIAS', '');
      statusDisplay = `Vence em ${dias} dias`;
    } else if (a.status === 'VENCIDO') {
      statusDisplay = 'Vencido';
    } else if (a.status === 'ATIVO') {
      statusDisplay = 'Ativo';
    }
    
    li.innerHTML = `
      <div class="title">${a.nome}</div>
      <div class="card-info">
        <div class="dates-row">
          <span class="badgeDate dateNascimento">🎂 ${fmtBR(a.data_nascimento)}</span>
          <span class="badgeDate dateVenc">📅 ${fmtBR(a.vencimento)}</span>
        </div>
        <div class="status-row">
          <span class="badge ${a.status}">${statusDisplay}</span>
        </div>
      </div>
      <div class="itemActions">
        <button class="primary edit">Editar</button>
        <button class="danger del">Excluir</button>
        <button class="verTreinos">Ver treinos</button>
        <button class="addTreino">+ Treino</button>
      </div>
      <div class="small" id="t-${a.id}"></div>
    `;
    li.querySelector('.edit').onclick = () => openAlunoForm(a);
    li.querySelector('.del').onclick = async () => {
      if (!confirm('Excluir este aluno e seus treinos?')) return;
      run(`DELETE FROM treino WHERE aluno_id=?`, [a.id]); run(`DELETE FROM aluno WHERE id=?`, [a.id]);
      await persist(); renderAlunos();
    };
    li.querySelector('.verTreinos').onclick = () => {
      const ts = query(`SELECT id, aluno_id, titulo, texto, atualizado_em FROM treino WHERE aluno_id=? ORDER BY atualizado_em DESC, titulo`, [a.id]);
      const area = li.querySelector('#t-'+a.id); area.innerHTML='';
      ts.forEach(t => { const b = document.createElement('button'); b.textContent = t.titulo; b.onclick = () => openTab(t); area.appendChild(b); });
    };
    li.querySelector('.addTreino').onclick = async () => {
      const id = (crypto.randomUUID && crypto.randomUUID()) || Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
      run(`INSERT INTO treino (id, aluno_id, titulo, texto, atualizado_em) VALUES (?,?,?,?,datetime('now'))`, [id, a.id, 'Treino', '']);
      await persist();
      const t = query(`SELECT id, aluno_id, titulo, texto, atualizado_em FROM treino WHERE id=?`, [id])[0];
      openTab(t);
    };
    ul.appendChild(li);
  });
}

export function fmtBR(iso){ const [y,m,d] = iso.split('-'); return `${d}/${m}/${y}`; }

// modal API (wired by main.js)
export let openAlunoForm, openTab;
export function wireOpeners(o){ openAlunoForm = o.openAlunoForm; openTab = o.openTab; }
