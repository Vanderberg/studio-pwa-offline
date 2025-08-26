// src/js/ui.js
export function applyTheme(theme){
  const el = document.documentElement;
  if (theme === 'dark') el.classList.add('dark'), el.classList.remove('light');
  else el.classList.add('light'), el.classList.remove('dark');
  localStorage.setItem('theme', theme);
}
export function initTheme(selectEl){
  const saved = localStorage.getItem('theme') || 'light';
  selectEl.value = saved;
  applyTheme(saved);
  selectEl.onchange = () => applyTheme(selectEl.value);
}
export function computeLogoSizeVar(){
  const vw = Math.max(320, Math.min(window.innerWidth, 1920));
  const dpr = Math.min(2.5, window.devicePixelRatio || 1);
  const px = Math.round(Math.min(220, Math.max(96, (vw * 0.12) * (dpr / 1.0))));
  document.documentElement.style.setProperty('--logo-size', px + 'px');
}
export function initResponsiveLogo(){
  computeLogoSizeVar();
  window.addEventListener('resize', computeLogoSizeVar);
}
