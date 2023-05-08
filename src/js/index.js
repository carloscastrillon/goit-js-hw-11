import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import GalleryApi from './gallery-fetch';
import { fetchImages } from './gallery-fetch';


const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let query = '';
let page = 1;
let simpleLightBox;
const perPage = 40;

searchForm.addEventListener('submit', onSearchForm);
loadMoreBtn.addEventListener('click', onLoadMoreBtn);

const galleryApi = new GalleryApi();

function onSearchForm(e) {
    e.preventDefault();
    window.scrollTo({ top: 0 });
    page = 1;
    query = e.currentTarget.searchQuery.value.trim();
    gallery.innerHTML = '';
    loadMoreBtn.classList.add('is-hidden');
    galleryApi.query = e.currentTarget.elements.searchQuery.value.trim();

    fetchImages(query, page, perPage)
    .then(({ data }) => {

        renderGallery(data.hits);
        simpleLightBox = new SimpleLightbox('.gallery a').refresh();
   

        if (data.totalHits > perPage) {
          loadMoreBtn.classList.remove('is-hidden');
        }
      
    })
    .catch(error => console.log(error))
    .finally(() => {
      searchForm.reset();
    });
}

function renderGallery(images) {
    const markup = images
      .map(image => {
        const { id, largeImageURL, webformatURL, tags, likes, views, comments, downloads } = image;
        return `
  
        
              <div class="photo-card">
                  <a class="photo-item" href="${largeImageURL}">
                      <img class="photo" src="${webformatURL}" alt="${tags}" />
                  </a>
                  <div class="info">
                      <p class="info-item"><b>Likes</b>${likes}</p>
                      <p class="info-item"><b>Views</b>${views}</p>
                      <p class="info-item"><b>Comments</b>${comments}</p>
                      <p class="info-item"><b>Downloads</b>${downloads}</p>
                  </div>
              </div>
              `;
      })
      .join('');
  
    gallery.insertAdjacentHTML('beforeend', markup);
  }

  function onLoadMoreBtn() {
    page += 1;
    simpleLightBox.destroy();
  
    fetchImages(query, page, perPage)
      .then(({ data }) => {
        renderGallery(data.hits);
        simpleLightBox = new SimpleLightbox('.gallery a').refresh();
  
        const totalPages = Math.ceil(data.totalHits / perPage);
  
        if (page > totalPages) {
          loadMoreBtn.classList.add('is-hidden');
          alertEndOfSearch();
        }
      })
      .catch(error => console.log(error));
  }