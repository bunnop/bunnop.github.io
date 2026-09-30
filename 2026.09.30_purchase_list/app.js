'use strict';
const groups = [...document.querySelectorAll('.equipment-group')];
const filterButtons = [...document.querySelectorAll('[data-filter]')];
const sort = document.querySelector('#sort');
const groupContainer = document.querySelector('#groups');
const collator = new Intl.Collator('zh-Hant-TW-u-co-stroke');
let filter = 'all';

function updateInventory() {
  let count = 0;
  let quantity = 0;
  groups.forEach(group => {
    group.hidden = filter !== 'all' && group.dataset.group !== filter;
    const cards = [...group.querySelectorAll('.card')];
    cards.sort((a, b) => {
      if (sort.value === 'quantity') return Number(b.dataset.quantity) - Number(a.dataset.quantity) || Number(a.dataset.order) - Number(b.dataset.order);
      if (sort.value === 'name') return collator.compare(a.dataset.name, b.dataset.name);
      return Number(a.dataset.order) - Number(b.dataset.order);
    });
    cards.forEach(card => group.querySelector('.cards').append(card));
    if (!group.hidden) {
      count += cards.length;
      quantity += cards.reduce((sum, card) => sum + Number(card.dataset.quantity), 0);
    }
  });
  // Preserve categories while sorting both their order and the items within them.
  const orderedGroups = [...groups].sort((a, b) => {
    if (sort.value === 'quantity') {
      const total = group => [...group.querySelectorAll('.card')].reduce((sum, card) => sum + Number(card.dataset.quantity), 0);
      return total(b) - total(a) || groups.indexOf(a) - groups.indexOf(b);
    }
    if (sort.value === 'name') return collator.compare(a.querySelector('.card').dataset.name, b.querySelector('.card').dataset.name);
    return groups.indexOf(a) - groups.indexOf(b);
  });
  orderedGroups.forEach(group => groupContainer.append(group));
  document.querySelector('.result-count').textContent = `顯示 ${count} 種品項，共 ${quantity} 件設備`;
}

filterButtons.forEach(button => button.addEventListener('click', () => {
  filter = button.dataset.filter;
  filterButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  updateInventory();
}));
sort.addEventListener('change', updateInventory);
document.querySelector('.toolbar').hidden = false;

const lightbox = document.querySelector('#lightbox');
if (typeof lightbox.showModal === 'function') {
  document.querySelectorAll('.preview').forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const source = link.querySelector('img');
    const image = lightbox.querySelector('img');
    image.src = source.src;
    image.alt = source.alt;
    document.querySelector('#lightbox-title').textContent = source.alt;
    lightbox.showModal();
    document.body.classList.add('modal-open');
  }));
  function closePreview() {
    lightbox.close();
    document.body.classList.remove('modal-open');
  }
  lightbox.querySelector('.close').addEventListener('click', closePreview);
  lightbox.addEventListener('cancel', () => document.body.classList.remove('modal-open'));
  lightbox.addEventListener('click', event => {
    const rect = lightbox.getBoundingClientRect();
    if (event.target === lightbox && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) closePreview();
  });
  lightbox.addEventListener('close', () => document.body.classList.remove('modal-open'));
}
