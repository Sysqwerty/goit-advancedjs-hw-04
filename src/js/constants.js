export const controls = {
  page: 1,
  per_page: 40,
  totalHits: 0,
  receivedHits: 0,
  totalPages: 0,
  searchQuery: null,
  isLoading: false,
};

export const selectors = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loader: document.querySelector('.loader'),
};
