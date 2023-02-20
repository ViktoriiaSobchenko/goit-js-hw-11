import axios from 'axios';

const URL = 'https://pixabay.com/api';
const API_KEY = '33689374-5e252b18d226d63d09d1d18ce';

async function getImages(searchTerm, page) {
  const responce = await axios.get(
    `${URL}/?key=${API_KEY}&q=${searchTerm}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
  );
  return responce.data;
}
export default getImages;
