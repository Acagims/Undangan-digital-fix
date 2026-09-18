'use strict';
(() => {
  const c = window.INVITATION;
  const $ = (id) => document.getElementById(id);
  const set = (id, value) => { $(id).textContent = value; };
  const date = new Date(c.date);
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {timeZone:'Asia/Jakarta', year:'numeric', month:'2-digit', day:'2-digit'}).formatToParts(date).map(p => [p.type,p.value]));
  const day = Number(parts.day), month = Number(parts.month)-1, year = Number(parts.year);
  const dateShort = `${parts.day} . ${parts.month} . ${parts.year}`;
  const dateFull = new Intl.DateTimeFormat('id-ID', {dateStyle:'full', timeZone:'Asia/Jakarta'}).format(date);
  const guest = (new URLSearchParams(location.search).get('to') || c.guestDefault).trim().slice(0,150);
  const audio = $('audio');
  let mode = 'demo', wishes = [], toastTimeout;
  let localCacheAvailable = true;
  const storageKey = `invitation:${c.storageKey}:wishes`;
  const el = (tag, className, content) => { const node = document.createElement(tag); if(className) node.className=className; if(content !== undefined) node.textContent=content; return node; };
  function toast(message) { set('toast', message); $('toast').classList.add('show'); clearTimeout(toastTimeout); toastTimeout=setTimeout(()=>$('toast').classList.remove('show'),3500); }
  const cleanPhone = String(c.whatsapp || '').replace(/\D/g,'');
  const hasPhone = /^\d{9,15}$/.test(cleanPhone);
  function whatsappURL(message) { return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`; }
  document.title = `${c.couple} — Wedding Invitation`;
  document.querySelector('meta[name="description"]').content = `Undangan pernikahan ${c.couple}, ${dateFull}, di ${c.venue}.`;
  document.querySelectorAll('[data-couple]').forEach(n=>n.textContent=c.couple);
  document.querySelectorAll('[data-date-short]').forEach(n=>n.textContent=dateShort);
  document.querySelectorAll('[data-cover]').forEach(n=>{n.src=c.coverPhoto;n.alt=`Foto bersama ${c.couple}`;});
  set('guest-name',guest);
  if(guest !== c.guestDefault) $('rsvp-name').value=guest.slice(0,80);
  audio.src=c.music;
  set('song-title',c.musicTitle);
  document.querySelector('.album img').src=c.albumPhoto || c.gallery[2] || c.coverPhoto;
  document.querySelector('.record-label').textContent=`${c.groom.name[0]} & ${c.bride.name[0]} ♥`;
  for (const text of c.story) $('story-copy').append(el('p','',text));
  (c.storyPhotos || c.gallery).slice(0,3).forEach((src,i)=>{ const img=el('img');img.src=src;img.alt=`Kenangan bersama ${i+1}`;img.loading='lazy';$('story-photos').append(img); });
  for(const [i,person] of [c.groom,c.bride].entries()) {
    const card=el('article','character-card');
    card.append(el('h3','script',i===0?'Here comes the Groom!':'Here comes the Bride!'));
    const dl=el('dl','profile-info');
    for(const [key,value] of [['NAME',person.fullName],['ABOUT',person.tagline],['DAD',person.father],['MOM',person.mother]]) { const row=el('div');row.append(el('dt','',key),el('dd','',value));dl.append(row); }
    const photo=el('div','profile-photo');const img=el('img');img.src=person.photo;img.alt=person.fullName;img.loading='lazy';const tape=el('span','tape');tape.ariaHidden='true';photo.append(img,tape);
    card.append(dl,el('p','bio',person.description),el('span','profile-name',person.name),photo);$('couple-cards').append(card);
  }
  set('calendar-year',year);
  set('calendar-month',new Intl.DateTimeFormat('id-ID',{month:'long',timeZone:'Asia/Jakarta'}).format(date).toUpperCase());
  const firstWeekday=(new Date(Date.UTC(year,month,1)).getUTCDay()+6)%7;
  for(let i=0;i<firstWeekday;i++)$('calendar-grid').append(el('span'));
  const lastDay=new Date(Date.UTC(year,month+1,0)).getUTCDate();
  for(let d=1;d<=lastDay;d++){ const cell=el('span',d===day?'selected':'',d);if(d===day)cell.setAttribute('aria-label',`${dateFull}, hari pernikahan`);$('calendar-grid').append(cell); }
  set('full-date',dateFull);set('event-label',c.eventLabel);set('event-time',c.timeLabel);set('venue',c.venue);set('address',c.address);
  $('maps-link').href=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.mapsQuery || c.address)}`;
  set('dress-code',c.dressCode);
  const swatch=$('dress-swatch');
  if(!c.dressColor || (c.dressCode && c.dressCode.toLowerCase().includes('bebas'))){
    if(swatch) swatch.style.display='none';
    const sub=swatch?swatch.previousElementSibling:null;
    if(sub && sub.tagName==='P'){sub.textContent='Pakaian bebas, rapi, dan sopan';sub.style.marginBottom='20px';}
  }else if(swatch){
    swatch.style.backgroundColor=c.dressColor;
  }
  set('hashtag',c.hashtag);
  function updateCountdown(){
    const seconds=Math.max(0,Math.floor((date-Date.now())/1000));
    $('countdown').replaceChildren();
    if(seconds===0){$('countdown').append(el('p','event-started',Date.now()<=new Date(c.endDate).getTime()?'Hari bahagia telah tiba! ♡':'Terima kasih atas doa dan cintanya. ♡'));return;}
    for(const [value,label] of [[Math.floor(seconds/86400),'HARI'],[Math.floor(seconds/3600)%24,'JAM'],[Math.floor(seconds/60)%60,'MENIT'],[seconds%60,'DETIK']]){const unit=el('div');unit.append(el('strong','',String(value).padStart(2,'0')),el('span','',label));$('countdown').append(unit);}
  }
  updateCountdown();setInterval(updateCountdown,1000);
  function syncMusic(){const playing=!audio.paused;['play-song','floating-music'].forEach(id=>{$(id).setAttribute('aria-pressed',String(playing));$(id).setAttribute('aria-label',playing?'Jeda musik':'Putar musik');});set('play-song',playing?'Ⅱ':'▶');$('record').classList.toggle('playing',playing);}
  async function toggleMusic(){if(audio.paused){try{await audio.play();}catch{toast('Musik belum dapat diputar. Coba tekan play lagi.');}}else audio.pause();syncMusic();}
  $('play-song').addEventListener('click',toggleMusic);$('floating-music').addEventListener('click',toggleMusic);
  $('restart-song').addEventListener('click',()=>{audio.currentTime=0;if(audio.paused)toggleMusic();});
  audio.addEventListener('play',syncMusic);audio.addEventListener('pause',syncMusic);audio.addEventListener('timeupdate',()=>{$('track-progress').style.width=`${audio.duration?audio.currentTime/audio.duration*100:0}%`;});
  $('open-invitation').addEventListener('click',async()=>{
    $('open-invitation').disabled=true;
    $('cover').classList.add('leaving');
    // Audio dimulai dari klik tamu, sesuai pembatasan autoplay browser.
    audio.play().catch(()=>{});
    setTimeout(()=>{$('cover').hidden=true;$('invitation').hidden=false;$('bottom-nav').hidden=false;document.body.classList.remove('is-locked');window.scrollTo(0,0);$('home').setAttribute('tabindex','-1');$('home').focus({preventScroll:true});initReveals();},window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:500);
  });
  function initReveals(){
    if(!('IntersectionObserver' in window))return;
    const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}});},{threshold:.08});
    document.querySelectorAll('.story-copy,.gallery-grid,.gift>p').forEach(node=>{node.classList.add('reveal');observer.observe(node);});
    const navObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){document.querySelectorAll('.bottom-nav a').forEach(link=>link.classList.toggle('active',link.hash===`#${entry.target.id}`));}});},{rootMargin:'-15% 0px -60% 0px'});
    ['home','couple','event','rsvp'].forEach(id=>navObserver.observe($(id)));
  }
  function escapeICS(value){return String(value).replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');}
  function foldICS(line){let out='',chunk='',bytes=0;for(const char of line){const size=new TextEncoder().encode(char).length;if(bytes+size>73){out+=chunk+'\r\n ';chunk='';bytes=1;}chunk+=char;bytes+=size;}return out+chunk;}
  $('save-calendar').addEventListener('click',()=>{
    const stamp=d=>new Date(d).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
    const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Little Love Story//Wedding//ID','CALSCALE:GREGORIAN','BEGIN:VEVENT',`UID:${encodeURIComponent(c.storageKey)}@wedding.local`,`DTSTAMP:${stamp(new Date())}`,`DTSTART:${stamp(c.date)}`,`DTEND:${stamp(c.endDate)}`,`SUMMARY:${escapeICS(`Pernikahan ${c.couple}`)}`,`LOCATION:${escapeICS(`${c.venue}, ${c.address}`)}`,`DESCRIPTION:${escapeICS('Kami menantikan kehadiranmu. '+c.timeLabel)}`,'END:VEVENT','END:VCALENDAR'];
    const url=URL.createObjectURL(new Blob([lines.map(foldICS).join('\r\n')+'\r\n'],{type:'text/calendar;charset=utf-8'}));const link=el('a');link.href=url;link.download='save-the-date.ics';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);
  });
  if(c.gift.account){$('bank-card').hidden=false;$('gift-default').hidden=true;set('bank-name',c.gift.bank);set('bank-number',c.gift.account);set('bank-holder',c.gift.holder);}
  $('copy-bank').addEventListener('click',async()=>{
    try{if(!navigator.clipboard)throw Error();await navigator.clipboard.writeText(String(c.gift.account));toast('Nomor rekening berhasil disalin.');}
    catch{const field=el('textarea');field.value=c.gift.account;field.style.position='fixed';field.style.opacity='0';document.body.append(field);field.select();const copied=document.execCommand('copy');field.remove();if(copied)toast('Nomor rekening berhasil disalin.');else toast(`Salin nomor ini: ${c.gift.account}`);}
  });
  if(hasPhone){$('gift-contact').hidden=false;$('whatsapp-link').href=whatsappURL(`Halo, saya ingin mengirim hadiah pernikahan untuk ${c.couple}. Boleh minta alamat pengiriman?`);}
  c.gallery.forEach((src,i)=>{const button=el('button','gallery-photo');button.type='button';button.setAttribute('aria-label',`Perbesar foto ${i+1}`);const img=el('img');img.src=src;img.alt=`Kenangan ${c.couple}, foto ${i+1}`;img.loading='lazy';button.append(img,el('span','photo-caption',['you & me.','always you.','my favourite.','forever, please.'][i%4]));button.addEventListener('click',()=>{$('lightbox-image').src=src;$('lightbox-image').alt=img.alt;$('lightbox').showModal();});$('gallery-grid').append(button);});
  document.querySelector('.close-lightbox').addEventListener('click',()=>$('lightbox').close());$('lightbox').addEventListener('click',e=>{if(e.target===$('lightbox'))$('lightbox').close();});
  for(let i=1;i<=c.maxGuests;i++){const option=el('option','',i);option.value=i;$('guest-count').append(option);}
  $('rsvp-form').addEventListener('change',()=>{const attending=new FormData($('rsvp-form')).get('attendance')==='yes';$('guest-count-label').hidden=!attending;$('guest-count').disabled=!attending;});
  function renderWishes(){
    $('guest-wall').replaceChildren();set('wish-count',`${wishes.length} ucapan`);
    if(!wishes.length){$('guest-wall').append(el('p','empty-wall','Jadilah yang pertama meninggalkan doa baik. ♡'));return;}
    for(const wish of wishes.slice(0,100)){const card=el('article','wish'),body=el('div');card.append(el('span','wish-avatar',wish.name.slice(0,2).toUpperCase()));body.append(el('h4','',wish.name),el('p','',wish.message || 'Mengirim doa terbaik untuk kedua mempelai. ♡'));if(wish.createdAt){const time=el('time','',new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'short',timeZone:'Asia/Jakarta'}).format(new Date(wish.createdAt)));time.dateTime=wish.createdAt;body.append(time);}card.append(body);$('guest-wall').append(card);}
  }
  function readLocal(){try{const saved=JSON.parse(localStorage.getItem(storageKey)||'[]');return Array.isArray(saved)?saved.filter(w=>typeof w.name==='string'&&typeof w.message==='string').slice(0,100):[];}catch{localCacheAvailable=false;return [];}}
  async function checkBackend(){
    $('submit-rsvp').disabled=true;
    try{
      if(!/^https?:$/.test(location.protocol))throw Error('local');
      const response=await fetch(c.rsvpEndpoint,{signal:AbortSignal.timeout(6000),headers:{Accept:'application/json'}});
      if(!response.ok)throw Error('offline');const result=await response.json();if(!Array.isArray(result.wishes))throw Error('invalid');
      mode='server';wishes=result.wishes;set('rsvp-mode','RSVP aktif. Konfirmasi dan ucapan akan diterima oleh tuan rumah.');set('submit-rsvp','Kirim RSVP ↗');
    }catch{
      mode=hasPhone?'whatsapp':'demo';wishes=readLocal();
      set('rsvp-mode',mode==='whatsapp'?'Konfirmasi melalui WhatsApp. Klik kirim, lalu kirim pesannya di WhatsApp. Buku tamu di bawah hanya tersimpan di perangkat ini.':'Mode pratinjau — konfirmasi belum dikirim ke mempelai. Ucapan hanya tersimpan di browser ini.');
      set('submit-rsvp',mode==='whatsapp'?'Lanjutkan ke WhatsApp ↗':'Simpan ucapan pratinjau');
    }
    renderWishes();$('submit-rsvp').disabled=false;
  }
  $('rsvp-form').addEventListener('submit',async e=>{
    e.preventDefault();const form=e.currentTarget;if(!form.reportValidity())return;
    const data=Object.fromEntries(new FormData(form));data.name=data.name.trim();data.message=data.message.trim();data.guests=data.attendance==='yes'?Number(data.guests):0;
    if(!data.name){set('form-status','Nama tidak boleh hanya berisi spasi.');return;}
    const button=$('submit-rsvp');button.disabled=true;
    try{
      if(mode==='server'){
        const response=await fetch(c.rsvpEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(12000)});
        const result=await response.json();if(!response.ok)throw Error(result.error||'Konfirmasi belum terkirim. Silakan coba lagi.');
        wishes.unshift(result.wish);set('form-status','Terima kasih! Konfirmasi dan ucapanmu sudah diterima. ♡');
      } else {
        const wish={name:data.name,message:data.message,createdAt:new Date().toISOString()};
        if(mode==='whatsapp'){
          const message=`RSVP Pernikahan ${c.couple}\nNama: ${data.name}\nKehadiran: ${data.attendance==='yes'?'Akan hadir':'Belum bisa hadir'}\nJumlah tamu: ${data.guests}\nUcapan: ${data.message}`;
          const link=el('a');link.href=whatsappURL(message);link.target='_blank';link.rel='noopener noreferrer';document.body.append(link);link.click();link.remove();set('form-status','Silakan tekan Kirim di WhatsApp agar konfirmasi diterima.');
        }else set('form-status','Ucapan pratinjau disimpan di browser ini; belum dikirim ke mempelai.');
        wishes.unshift(wish);
        try{localStorage.setItem(storageKey,JSON.stringify(wishes.slice(0,100)));}catch{localCacheAvailable=false;}
        if(!localCacheAvailable)set('form-status',mode==='whatsapp'?'Kirim pesan di WhatsApp. Salinan lokal tidak dapat disimpan.':'Ucapan hanya tampil selama halaman terbuka; penyimpanan browser tidak tersedia.');
      }
      renderWishes();form.querySelector('textarea').value='';
    }catch(error){set('form-status',error.name==='TimeoutError'?'Koneksi terputus. Muat ulang untuk memeriksa ucapan sebelum mencoba lagi.':error.message||'Gagal mengirim. Silakan coba lagi.');}
    finally{button.disabled=false;}
  });
  checkBackend();
})();
