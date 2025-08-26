// src/js/db.js
export const DB_NAME = 'studio-alfa-db';
export const DB_FILE_KEY = 'db-file';
export const LOGO_KEY = 'logo-dataurl';

const idbOpen = () => new Promise((resolve, reject) => {
  const req = indexedDB.open(DB_NAME, 1);
  req.onupgradeneeded = () => {
    const db = req.result;
    if (!db.objectStoreNames.contains('files')) db.createObjectStore('files');
  };
  req.onsuccess = () => resolve(req.result);
  req.onerror = () => reject(req.error);
});

export async function idbGet(key){
  const db = await idbOpen();
  return new Promise((res, rej) => {
    const tx = db.transaction('files', 'readonly'); const st = tx.objectStore('files'); const rq = st.get(key);
    rq.onsuccess = () => res(rq.result); rq.onerror = () => rej(rq.error);
  });
}
export async function idbSet(key, value){
  const db = await idbOpen();
  return new Promise((res, rej) => {
    const tx = db.transaction('files', 'readwrite'); const st = tx.objectStore('files'); const rq = st.put(value, key);
    rq.onsuccess = () => res(); rq.onerror = () => rej(rq.error);
  });
}

let SQL; let db;
export async function initDB(){
  if (!SQL) {
    SQL = await initSqlJs({ locateFile: f => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${f}` });
  }
  const file = await idbGet(DB_FILE_KEY);
  if (file) db = new SQL.Database(new Uint8Array(file));
  else { db = new SQL.Database(); bootstrap(); await persist(); }
  return db;
}
function bootstrap(){
  db.exec(`
    PRAGMA journal_mode=MEMORY;
    CREATE TABLE IF NOT EXISTS aluno (
      id TEXT PRIMARY KEY, nome TEXT NOT NULL, data_nascimento TEXT NOT NULL, vencimento TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS treino (
      id TEXT PRIMARY KEY, aluno_id TEXT NOT NULL, titulo TEXT NOT NULL, texto TEXT NOT NULL,
      atualizado_em TEXT, FOREIGN KEY(aluno_id) REFERENCES aluno(id) ON DELETE CASCADE
    );
  `);
}
export async function persist(){ const data = db.export(); await idbSet(DB_FILE_KEY, data); }
export function run(sql, params=[]){ const st = db.prepare(sql); st.bind(params); st.step(); st.free(); }
export function query(sql, params=[]){ const st=db.prepare(sql); st.bind(params); const rows=[]; while(st.step()) rows.push(st.getAsObject()); st.free(); return rows; }
export async function exportSqlite(){
  const data = db.export(); const blob = new Blob([data], {type: 'application/octet-stream'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'studio-alfa.sqlite';
  document.body.appendChild(a); a.click(); a.remove();
}
export async function importSqlite(file){
  const buf = await file.arrayBuffer(); db?.close?.(); db = new SQL.Database(new Uint8Array(buf)); await persist();
}
export function statusPlano(venc){
  const hoje = new Date(); 
  const v = new Date(venc + 'T00:00:00'); 
  
  if (hoje > v) return 'VENCIDO';
  
  const diff = Math.ceil((v-hoje)/86400000); 
  
  if (diff <= 7) {
    return `VENCE_EM_${diff}_DIAS`;
  }
  
  return 'ATIVO';
}

export async function saveLogoDataURL(dataUrl){ await idbSet(LOGO_KEY, dataUrl); }
export async function loadLogoDataURL(){ return await idbGet(LOGO_KEY); }
