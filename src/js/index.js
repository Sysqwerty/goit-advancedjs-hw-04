import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { fetchHits } from './api';
import { selectors, controls } from './constants';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

gallery.on('error.simplelightbox', function (e) {
  console.log(e);
});

selectors.form.addEventListener('submit', handlerSubmit);
window.addEventListener('scroll', onScroll);

function onScroll() {
  if (
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight - 50
  ) {
    handlerLoadMore();
  }
}

async function handlerSubmit(evt) {
  evt.preventDefault();
  selectors.gallery.textContent = '';

  const searchQuery = evt.target.elements.searchQuery.value;

  controls.searchQuery = searchQuery;

  if (!searchQuery) {
    showToast('Please enter a search query.', 'error');
    return;
  }

  controls.receivedHits = 0;
  controls.totalHits = 0;
  controls.page = 1;

  try {
    await loadData();
    controls.totalHits ??
      showToast(`Hooray! We found ${controls.totalHits} images.`, 'success');
    gallery.refresh();
  } catch (error) {
    showToast(
      'Sorry, there are no images matching your search query. Please try again.',
      'error'
    );
  } finally {
    evt.target.elements.searchQuery.value = '';
  }
}

async function loadData() {
  selectors.loader.classList.remove('hide');
  if (controls.isLoading) return;
  controls.isLoading = true;

  try {
    const { totalHits, hits } = await fetchHits(controls.searchQuery);
    controls.receivedHits += hits.length;
    controls.totalHits = totalHits;

    renderImages(hits);
    gallery.refresh();

    console.log('hits received: ', controls.receivedHits);
    console.log('total hits: ', totalHits);

    !controls.receivedHits
      ? showToast(
          'Sorry, there are no images matching your search query. Please try again.',
          'error'
        )
      : controls.receivedHits >= totalHits &&
        showToast(
          `We're sorry, but you've reached the end of search results.`,
          'info'
        );
  } catch (error) {
    showToast('Error fetching data. Please try again.', 'error');
  } finally {
    selectors.loader.classList.add('hide');
    controls.isLoading = false;
  }
}

async function handlerLoadMore() {
  controls.page += 1;
  await loadData();

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function renderImages(images) {
  const markup = images
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
      <div class="photo-card">
        <a href="${largeImageURL}" class="card-link">
          <img src="${webformatURL}" alt="${tags}" class="card-image" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item"><b>Likes</b> ${likes}</p>
          <p class="info-item"><b>Views</b> ${views}</p>
          <p class="info-item"><b>Comments</b> ${comments}</p>
          <p class="info-item"><b>Downloads</b> ${downloads}</p>
        </div>
      </div>
    `
    )
    .join('');

  selectors.gallery.insertAdjacentHTML('beforeend', markup);
}

function showToast(message, type = 'info') {
  iziToast[type]({
    message: message,
    position: 'topRight',
    timeout: 3000,
  });
}
