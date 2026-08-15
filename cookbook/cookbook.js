  
let pages=[];

fetch('pages.html')
  .then(response => response.text())
  .then(html => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const sourcePages = [...doc.querySelectorAll('.page')];

    const container = document.getElementById('recipePages');

    sourcePages.forEach((page, pageIndex) => {
      const number = page.querySelector('.temp-page-number-value');
      if(number){
        number.textContent = pageIndex + 1;
      }
      container.appendChild(page);
    });

    pages = [...container.querySelectorAll('.page')];

    render(0,"",false);
  });





const notebook=document.querySelector('.notebook');
const prev=document.getElementById('prev');
const next=document.getElementById('next');
const bookPrev=document.getElementById('bookPrev');
const bookNext=document.getElementById('bookNext');
const status=document.getElementById('status');
const fontSize=document.getElementById('fontSize');
const book=document.getElementById('book');

let index=0;
let animationTimer=null;

function desktop(){
  return window.innerWidth>780;
}

function spreadStart(pageIndex){
  return desktop() ? Math.floor(pageIndex/2)*2 : pageIndex;
}

function render(pageIndex, direction="", animate=true){
  const target=Math.max(0,Math.min(pageIndex,pages.length-1));
  index=target;
  const startPage=spreadStart(target);

  pages.forEach(p=>p.classList.remove(
    'active','flip-in-next','flip-in-prev'
  ));

  pages[startPage]?.classList.add('active');
  if(desktop() && pages[startPage+1]){
    pages[startPage+1].classList.add('active');
  }

  const endPage=desktop()
    ? Math.min(startPage+2,pages.length)
    : startPage+1;

  status.textContent=`Pages ${startPage+1}–${endPage} of ${pages.length}`;

  const atBeginning=startPage===0;
  const atEnd=endPage>=pages.length;

  prev.disabled=atBeginning;
  next.disabled=atEnd;
  bookPrev.disabled=atBeginning;
  bookNext.disabled=atEnd;

  document.querySelectorAll('.toc-item').forEach(btn=>{
    const jump=Number(btn.dataset.jump);
    btn.classList.toggle('selected',
      jump===target || (jump>=startPage && jump<endPage)
    );
  });

  if(animate && direction && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    notebook.classList.remove('flip-next','flip-prev');
    void notebook.offsetWidth;
    notebook.classList.add(direction==='next' ? 'flip-next' : 'flip-prev');

    pages[startPage]?.classList.add(
      direction==='next' ? 'flip-in-next' : 'flip-in-prev'
    );
    if(desktop() && pages[startPage+1]){
      pages[startPage+1].classList.add(
        direction==='next' ? 'flip-in-next' : 'flip-in-prev'
      );
    }

    clearTimeout(animationTimer);
    animationTimer=setTimeout(()=>{
      notebook.classList.remove('flip-next','flip-prev');
      pages.forEach(p=>p.classList.remove('flip-in-next','flip-in-prev'));
    },540);
  }

  book.setAttribute('aria-label',
    `BBN recipe pages ${startPage+1} through ${endPage}`
  );
}

function goNext(){
  const target=desktop()
    ? Math.min(index + 2,pages.length-1)
    : Math.min(index + 1,pages.length-1);
  render(target,'next');
}

function goPrev(){
  const target=desktop()
    ? Math.max(spreadStart(index)-2,0)
    : Math.max(index-1,0);
  render(target,'prev');
}

prev.addEventListener('click',goPrev);
next.addEventListener('click',goNext);
bookPrev.addEventListener('click',goPrev);
bookNext.addEventListener('click',goNext);

document.querySelectorAll('.toc-item').forEach(btn=>{
  btn.addEventListener('click',()=>{
    render(Number(btn.dataset.jump));
    book.focus({preventScroll:true});
  });
});

if(fontSize){
  fontSize.addEventListener('change',e=>{
    document.documentElement.style.setProperty('--font-scale',e.target.value);
  });
}

const printButton=document.getElementById('print');
if(printButton){
  printButton.addEventListener('click',e=>{
    e.preventDefault();
    window.print();
  });
}

/* More / burger menu */
const moreMenu=document.getElementById('moreMenu');
const moreTrigger=document.querySelector('.more-menu > a');

if(moreMenu && moreTrigger){
  moreTrigger.addEventListener('click',e=>{
    e.preventDefault();
    const isOpen=!moreMenu.hasAttribute('hidden');

    if(isOpen){
      moreMenu.setAttribute('hidden','');
      moreTrigger.setAttribute('aria-expanded','false');
    }else{
      moreMenu.removeAttribute('hidden');
      moreTrigger.setAttribute('aria-expanded','true');
    }
  });

  document.addEventListener('click',e=>{
    if(!e.target.closest('.more-menu')){
      moreMenu.setAttribute('hidden','');
      moreTrigger.setAttribute('aria-expanded','false');
    }
  });

  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){
      moreMenu.setAttribute('hidden','');
      moreTrigger.setAttribute('aria-expanded','false');
    }
  });
}

window.addEventListener('resize',()=>{
  render(index,"",false);
});

window.addEventListener('keydown',e=>{
  if(e.target.matches('select,button,input,textarea')) return;

  if(e.key==='ArrowRight'){
    e.preventDefault();
    goNext();
  }else if(e.key==='ArrowLeft'){
    e.preventDefault();
    goPrev();
  }
});

render(0,"",false);