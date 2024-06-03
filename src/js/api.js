import axios from 'axios';
import { controls } from './constants';

axios.defaults.headers.common['x-api-key'] =
  'live_nOdnL3Dj9jjF4zVLjteozldoqmiVUxxCRsrlPoRVyonLQDm4DFuaUNiaRzafsnXC';
axios.defaults.headers = ['Access-Control-Allow-Origin'];

export async function fetchHits(searchQuery) {
  const queryParams = new URLSearchParams({
    key: '44202133-14fac6110a8eccaaec992feaf',
    q: searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: controls.per_page,
    page: controls.page,
  });

  const response = await axios.get(
    `https://pixabay.com/api/?${queryParams.toString()}`
  );

  const data = await response.data;
  console.log('data:\n', data);
  return data;
}
