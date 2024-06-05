const DEFAULT_PER_PAGE = 40;

const controls = {
  page: 1,
  per_page: DEFAULT_PER_PAGE,
  receivedHits: 0,
  searchQuery: null,
  isLoading: false,
  isScrollListenerAdded: false,
};

const selectors = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loader: document.querySelector('.loader'),
  submitButton: document.querySelector('[type="submit"]'),
};

const keys = {
  API_KEY: '44202133-14fac6110a8eccaaec992feaf',
  AXIOS_KEY:
    'live_nOdnL3Dj9jjF4zVLjteozldoqmiVUxxCRsrlPoRVyonLQDm4DFuaUNiaRzafsnXC',
};

const BASE_URL = 'https://pixabay.com/api/';

export { controls, selectors, keys, BASE_URL, DEFAULT_PER_PAGE };
