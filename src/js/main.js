// src/js/main.js
import { initDB, persist, exportSqlite, importSqlite } from './db.js';
import { initTheme, initResponsiveLogo } from './ui.js';
import { loadLogoInto, saveLogo, readAsDataURL } from './logo.js';
import { renderAlunos, wireOpeners } from './alunos.js';
import * as Treinos from './treinos.js';

const $ = (s) => document.querySelector(s);
let deferredPrompt = null;

async function setupSW(){
  if ('serviceWorker' in navigator) {
    try { await navigator.serviceWorker.register('./sw.js'); } catch {}
  }
}

function closeMenu(){ const d = $('#menuDropdown'); if (!d.hasAttribute('hidden')) d.setAttribute('hidden',''); $('#menuToggle').setAttribute('aria-expanded','false'); }
function openMenu(){ const d=$('#menuDropdown'); d.removeAttribute('hidden'); $('#menuToggle').setAttribute('aria-expanded','true'); }

function initInstallPrompt(){
  const item = $('#menuInstall');
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    item.disabled = false;
  });
  item.onclick = async () => {
    if (!deferredPrompt) { alert('O navegador ainda não liberou a instalação.'); return; }
    const e = deferredPrompt; deferredPrompt = null;
    await e.prompt();
    item.disabled = true;
    closeMenu();
  };
}

function initMenu(){
  const toggle = $('#menuToggle');
  const dropdown = $('#menuDropdown');
  toggle.onclick = (ev) => {
    ev.stopPropagation();
    const hidden = dropdown.hasAttribute('hidden');
    hidden ? openMenu() : closeMenu();
  };
  document.addEventListener('click', (ev) => {
    if (!dropdown.contains(ev.target) && ev.target !== toggle) closeMenu();
  });
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') closeMenu();
  });

  // Ações do menu
  $('#menuLogo').onclick = () => { $('#logoInput').click(); };
  $('#menuImport').onclick = () => { $('#dbImport').click(); closeMenu(); };
  $('#menuExport').onclick = () => { exportSqlite(); closeMenu(); };
}

function initLogo(){
  const img = $('#logoImg'); const ico = $('#favicon');
  loadLogoInto(img, ico);
  $('#logoInput').onchange = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    const dataUrl = await readAsDataURL(f);
    await saveLogo(dataUrl, img, ico);
  };
}

function initAlunoModal(){
  const backdrop = $('#modalBackdrop'); const form = $('#alunoForm');
  const cancelar = $('#btnCancelarAluno'); const titulo = $('#modalTitle');
  const fNome = $('#fNome'), fNasc = $('#fNasc'), fVenc = $('#fVenc');
  let editingId = null;

  function openAlunoForm(a){
    editingId = a ? a.id : null;
    titulo.textContent = a ? 'Editar aluno' : 'Novo aluno';
    fNome.value = a?.nome || '';
    fNasc.value = a?.data_nascimento || '';
    fVenc.value = a?.vencimento || '';
    backdrop.classList.remove('hidden');
    setTimeout(()=>fNome.focus(),0);
  }
  function close(){ backdrop.classList.add('hidden'); form.reset(); editingId = null; }
  cancelar.onclick = close;
  backdrop.addEventListener('click', (ev) => { if (ev.target === backdrop) close(); });
  document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') close(); });

  form.onsubmit = async (ev) => {
    ev.preventDefault();
    const nome = fNome.value.trim(), nasc = fNasc.value, venc = fVenc.value;
    if (!nome || !/\d{4}-\d{2}-\d{2}/.test(nasc) || !/\d{4}-\d{2}-\d{2}/.test(venc)) { alert('Preencha corretamente.'); return; }
    if (editingId) {
      const { run } = await import('./db.js'); run(`UPDATE aluno SET nome=?, data_nascimento=?, vencimento=? WHERE id=?`, [nome, nasc, venc, editingId]);
    } else {
      const { run } = await import('./db.js');
      const id = (crypto.randomUUID && crypto.randomUUID()) || Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2);
      run(`INSERT INTO aluno (id, nome, data_nascimento, vencimento) VALUES (?,?,?,?)`, [id, nome, nasc, venc]);
    }
    await persist(); close(); renderAlunos();
  };

  return openAlunoForm;
}

async function main(){
  initTheme($('#themeSelect'));
  initResponsiveLogo();
  initMenu();
  initLogo();
  initInstallPrompt();
  await setupSW();

  $('#appStatus').textContent = 'Carregando banco...';
  await initDB();
  $('#appStatus').textContent = 'OK (offline pronto)';

  const openAlunoForm = initAlunoModal();
  wireOpeners({ openAlunoForm, openTab: Treinos.openTab });

  $('#busca').oninput = renderAlunos;
  $('#statusFilter').onchange = renderAlunos;
  $('#novoAluno').onclick = () => openAlunoForm(null);
  $('#backupNow').onclick = persist;

  $('#dbImport').onchange = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    $('#appStatus').textContent = 'Importando banco...';
    await importSqlite(f);
    $('#appStatus').textContent = 'Importado ✔'; setTimeout(()=>$('#appStatus').textContent='OK (offline pronto)', 1000);
    renderAlunos();
  };

  document.querySelector('#btnDuplicar').onclick = Treinos.duplicar;
  document.querySelector('#btnRenomear').onclick = Treinos.renomear;
  document.querySelector('#btnExcluirTreino').onclick = Treinos.excluir;
  document.querySelector('#modelos').onchange = Treinos.aplicarModelo;
  document.querySelector('#btnImprimir').onclick = Treinos.imprimirTreino;

  renderAlunos();
}

main();
