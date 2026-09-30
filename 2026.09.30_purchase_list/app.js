'use strict';

const lightbox = document.querySelector('#lightbox');
if (typeof lightbox.showModal === 'function') {
  document.querySelectorAll('a.preview').forEach(link => link.addEventListener('click', event => {
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
