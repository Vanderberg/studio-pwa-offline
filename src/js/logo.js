// src/js/logo.js
import { saveLogoDataURL, loadLogoDataURL } from './db.js';

export async function readAsDataURL(file){
  return await new Promise((res, rej) => {
    const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(file);
  });
}

export async function loadLogoInto(imgEl, faviconEl){
  const dataUrl = await loadLogoDataURL();
  if (dataUrl) {
    imgEl.src = dataUrl;
    if (faviconEl) faviconEl.href = dataUrl;
  }
}

export async function saveLogo(dataUrl, imgEl, faviconEl){
  await saveLogoDataURL(dataUrl);
  if (imgEl) imgEl.src = dataUrl;
  if (faviconEl) faviconEl.href = dataUrl;
}
