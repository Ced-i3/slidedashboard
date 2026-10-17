const toast = document.querySelector('#toast');
let toastTimer;
function showToast(message){ clearTimeout(toastTimer); toast.textContent=message; toast.classList.add('show'); toastTimer=setTimeout(()=>toast.classList.remove('show'),2600); }

document.querySelector('#refreshButton').addEventListener('click',()=>{
  const now=new Date();
  document.querySelector('#lastUpdated').textContent=now.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'});
  showToast('Sensor readings refreshed.');
});
document.querySelector('#testAlertButton').addEventListener('click',()=>showToast('Test alert queued. No public SMS was sent.'));
document.querySelector('#protocolButton').addEventListener('click',()=>showToast('Watch protocol: verify readings, notify operators, and prepare local response teams.'));
document.querySelector('#settingsButton').addEventListener('click',()=>showToast('Settings panel is ready for backend integration.'));

document.querySelectorAll('.segmented button').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('.segmented button').forEach(item=>item.classList.remove('selected'));
  button.classList.add('selected');
  showToast(`${button.dataset.period} data range selected.`);
}));

const menuButton=document.querySelector('#menuButton');
const sidebar=document.querySelector('.sidebar');
const navScrim=document.querySelector('#navScrim');
const collapseButton=document.querySelector('#collapseButton');

function setDesktopCollapsed(collapsed){
  document.body.classList.toggle('nav-collapsed',collapsed);
  collapseButton.setAttribute('aria-expanded',String(!collapsed));
  collapseButton.setAttribute('aria-label',collapsed?'Expand navigation':'Collapse navigation');
  collapseButton.title=collapsed?'Expand navigation':'Collapse navigation';
  try{localStorage.setItem('slide-nav-collapsed',String(collapsed));}catch(error){}
}
try{setDesktopCollapsed(localStorage.getItem('slide-nav-collapsed')==='true');}catch(error){setDesktopCollapsed(false);}
collapseButton.addEventListener('click',()=>setDesktopCollapsed(!document.body.classList.contains('nav-collapsed')));

function setMobileMenu(open){
  sidebar.classList.toggle('open',open);
  navScrim.classList.toggle('show',open);
  document.body.classList.toggle('nav-open',open);
  menuButton.setAttribute('aria-expanded',String(open));
  menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation');
  if(open)sidebar.querySelector('.nav-item').focus();
}
menuButton.addEventListener('click',()=>{
  setMobileMenu(!sidebar.classList.contains('open'));
});
navScrim.addEventListener('click',()=>setMobileMenu(false));
sidebar.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',()=>{if(window.innerWidth<=760)setMobileMenu(false);}));
document.addEventListener('click',event=>{
  if(window.innerWidth<=760 && sidebar.classList.contains('open') && !sidebar.contains(event.target) && event.target!==menuButton){
    setMobileMenu(false);
  }
});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&sidebar.classList.contains('open')){setMobileMenu(false);menuButton.focus();}});
window.addEventListener('resize',()=>{if(window.innerWidth>760&&sidebar.classList.contains('open'))setMobileMenu(false);});
