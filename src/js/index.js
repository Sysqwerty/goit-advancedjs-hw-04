import iziToast from 'izitoast';
import SimpleLightbox from 'simplelightbox';
import 'izitoast/dist/css/iziToast.min.css';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchHits } from './api';
import { selectors, controls, DEFAULT_PER_PAGE } from './constants';

const gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

gallery.on('error.simplelightbox', function (e) {
  console.log(e);
});

selectors.form.addEventListener('submit', onFormSubmit);

function onScroll() {
  if (
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight - 50
  ) {
    loadData();
  }
}

async function onFormSubmit(evt) {
  evt.preventDefault();

  if (!controls.isScrollListenerAdded) {
    window.addEventListener('scroll', onScroll);
    controls.isScrollListenerAdded = true;
  }

  const formData = new FormData(evt.currentTarget);
  controls.searchQuery = formData.get('searchQuery');

  if (!controls.searchQuery) {
    showToast('Please enter a search query.', 'error');
    selectors.loader.classList.add('hide');
    controls.isLoading = false;
    return;
  }

  controls.page = 1;
  controls.receivedHits = 0;
  controls.per_page = DEFAULT_PER_PAGE;

  selectors.gallery.innerHTML = '';
  selectors.loader.classList.remove('hide');
  selectors.form.reset();

  await loadData(true);
}

/**
 * Loads a data from an API call and renders images
 * @param {boolean} firstRender - is it the first call of the method
 */
async function loadData(firstRender = false) {
  if (controls.isLoading) return;
  controls.isLoading = true;

  selectors.loader.classList.remove('hide');
  selectors.submitButton.disabled = true;

  try {
    const { totalHits, hits } = await fetchHits();

    if (!totalHits || !hits?.length) {
      showToast(
        'Sorry, there are no images matching your search query. Please try again.',
        'error'
      );
      return;
    }

    renderImages(hits);
    gallery.refresh();

    controls.page++;
    controls.per_page = Math.min(
      totalHits - controls.receivedHits,
      DEFAULT_PER_PAGE
    );
    controls.receivedHits += hits.length;

    if (firstRender) {
      showToast(`Hooray! We found ${totalHits} images.`, 'success');
    } else {
      const { height: cardHeight } =
        selectors.gallery.firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }

    if (firstRender && controls.per_page >= totalHits) {
      window.removeEventListener('scroll', onScroll);
      controls.isScrollListenerAdded = false;
    }

    if (controls.receivedHits >= totalHits && !firstRender) {
      showToast(
        `We're sorry, but you've reached the end of search results.`,
        'info'
      );
      window.removeEventListener('scroll', onScroll);
      controls.isScrollListenerAdded = false;
    }
  } catch (error) {
    showToast('Error fetching data. Please try again.', 'error');
  } finally {
    selectors.loader.classList.add('hide');
    selectors.submitButton.disabled = false;
    controls.isLoading = false;
  }
}

/**
 * Renders images from the array
 * @param {Array} images
 */
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

/**
 * Shows toast with different types and dynamic message
 * @param {string} message    - toast message
 * @param {string} type       - error, success, info, warning etc.
 * @param {number} timeoutSec - error, success, info, warning etc.
 */
function showToast(message, type = 'info', timeoutSec = 3) {
  iziToast[type]({
    message: message,
    position: 'topRight',
    timeout: timeoutSec * 1000,
  });
}
