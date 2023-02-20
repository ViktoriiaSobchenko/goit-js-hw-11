import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import getImages from './js/api';

const formRef = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const endGallery = document.querySelector('.end-search');

formRef.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', onClick);

let page = 1;
let searchTerm = '';
const perPage = 40;

btnHide();
endGallery.classList.add('hidden');

let lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionsDelay: 250,
});

async function onSubmit(evt) {
  evt.preventDefault();
  searchTerm = evt.currentTarget.elements.searchQuery.value.trim();

  if (searchTerm !== '') {
    page = 1;

    clearImagesGallery();
    endGallery.classList.add('hidden');

    try {
      const responce = await getImages(searchTerm, page);

      if (responce.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      if (responce.totalHits > perPage) {
        Notiflix.Notify.success(
          `Hooray! We found ${responce.totalHits} images.`
        );
        renderImageCard(responce.hits);
        btnShow();
        lightbox.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  }
}

async function onClick() {
  page += 1;
  endGallery.classList.add('hidden');

  try {
    const responce = await getImages(searchTerm, page);

    renderImageCard(responce.hits);
    btnShow();
    lightbox.refresh();

    const totalPage = Math.ceil(responce.totalHits / perPage);

    if (page >= totalPage) {
      btnHide();
      endGallery.classList.remove('hidden');
      Notiflix.Notify.failure(
        `We're sorry, but you've reached the end of search results.`
      );
    }
  } catch (err) {
    console.error(err);
  }
}

function renderImageCard(images) {
  const markup = images
    .map(image => {
      return `<a href='${image.largeImageURL}' class="link"> 
      <div class="photo-card">
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />  
        <div class="info">
          <p class="info-item">
            <b>Likes</b>${image.likes}
          </p>
          <p class="info-item">
            <b>Views</b>${image.views}
          </p>
          <p class="info-item">
            <b>Comments</b>${image.comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>${image.downloads}
          </p>
        </div>
      </div>
    </a>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}

function clearImagesGallery() {
  gallery.innerHTML = '';
}

function btnHide() {
  loadMoreBtn.classList.add('hidden');
}

function btnShow() {
  loadMoreBtn.classList.remove('hidden');
}
