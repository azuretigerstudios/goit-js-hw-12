import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import { fetchImages } from "./js/pixabay-api";

// Tüm UI fonksiyonlarını import ediyoruz
import {
  renderGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMore,
  hideLoadMore
} from "./js/render-functions";

// DOM Elementleri
const form = document.querySelector(".form");
const gallery = document.querySelector(".gallery");
const loader = document.querySelector(".loader");
const loadMoreBtn = document.querySelector(".load-more");

// Değişkenler
let query = "";
let page = 1;
let maxPage = 0;
const perPage = 15;

// Başlangıç Durumu
hideLoadMore(loadMoreBtn);

// --- FORM SUBMIT ---
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const searchQuery = event.target.elements.query.value.trim();

  if (!searchQuery) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search term!',
      position: 'topRight',
    });
    return;
  }

  query = searchQuery;
  page = 1;

  // UI Temizliği
  clearGallery(gallery);
  hideLoadMore(loadMoreBtn);
  showLoader(loader);

  try {
    const data = await fetchImages(query, page);

    if (data.hits.length === 0) {
      iziToast.error({
        title: 'Error',
        message: 'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
        backgroundColor: '#ef4040',
        messageColor: '#fff',
      });
      hideLoader(loader);
      return;
    }

    maxPage = Math.ceil(data.totalHits / perPage);

    // Render Fonksiyonunu Çağırıyoruz (isAppend = false)
    renderGallery(data.hits, gallery, false);

    iziToast.success({
      title: 'Success',
      message: `Hooray! We found ${data.totalHits} images.`,
      position: 'topRight',
    });

    if (maxPage > 1) {
      showLoadMore(loadMoreBtn);
    }

  } catch (error) {
    console.log(error);
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
    });
  } finally {
    hideLoader(loader);
  }
});

// --- LOAD MORE CLICK ---
loadMoreBtn.addEventListener("click", async () => {
  page += 1;

  hideLoadMore(loadMoreBtn); // Yüklenirken gizle
  showLoader(loader);

  try {
    const data = await fetchImages(query, page);

    // Render Fonksiyonunu Çağırıyoruz (isAppend = true)
    renderGallery(data.hits, gallery, true);

    scrollPage();

    if (page >= maxPage) {
      hideLoadMore(loadMoreBtn);
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    } else {
      showLoadMore(loadMoreBtn);
    }

  } catch (error) {
    iziToast.error({
        title: 'Error',
        message: 'Error fetching more images.',
    });
  } finally {
    hideLoader(loader);
  }
});

// Smooth Scroll (Bu main.js içinde kalabilir veya render'a taşınabilir ama genelde main'de durması sorun olmaz)
function scrollPage() {
  const firstCard = gallery.querySelector(".gallery-item");
  if (firstCard) {
    const { height: cardHeight } = firstCard.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: "smooth",
    });
  }
}