import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import { fetchImages } from "./js/pixabay-api";
import { createMarkup, clearGallery } from "./js/render-functions";

// DOM Elementleri
const form = document.querySelector(".search-form");
const gallery = document.querySelector(".gallery");
const loader = document.querySelector(".loader");
const loadMoreBtn = document.querySelector(".load-more");

// Değişkenler
let query = "";
let page = 1;
let maxPage = 0;
const perPage = 15; // API dosyasındaki per_page ile aynı olmalı

// Lightbox Başlatma
let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

// Başlangıçta Load More butonu gizli olsun
loadMoreBtn.classList.add("is-hidden");

// --- FORM SUBMIT OLAYI ---
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

  // Yeni arama için değişkenleri sıfırla
  query = searchQuery;
  page = 1;
  clearGallery(gallery);
  loadMoreBtn.classList.add("is-hidden"); // Yeni aramada butonu gizle

  showLoader();

  try {
    const data = await fetchImages(query, page);

    // Veri yoksa
    if (data.hits.length === 0) {
      iziToast.error({
        title: 'Error',
        message: 'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
        backgroundColor: '#ef4040',
        messageColor: '#fff',
      });
      hideLoader();
      return;
    }

    // Toplam sayfa sayısını hesapla
    maxPage = Math.ceil(data.totalHits / perPage);

    // İlk sayfayı render et
    const markup = createMarkup(data.hits);
    gallery.innerHTML = markup;
    lightbox.refresh();

    // Başarı mesajı
    iziToast.success({
      title: 'Success',
      message: `Hooray! We found ${data.totalHits} images.`,
      position: 'topRight',
    });

    // Eğer birden fazla sayfa varsa butonu göster
    if (maxPage > 1) {
      loadMoreBtn.classList.remove("is-hidden");
    }

  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
    });
  } finally {
    hideLoader();
  }
});

// --- LOAD MORE BUTON OLAYI ---
loadMoreBtn.addEventListener("click", async () => {
  page += 1; // Sayfayı artır
  showLoader();
  loadMoreBtn.classList.add("is-hidden"); // Yüklenirken butonu gizle (veya disable et)

  try {
    const data = await fetchImages(query, page);

    // Yeni verileri ekle
    const markup = createMarkup(data.hits);
    gallery.insertAdjacentHTML("beforeend", markup);
    lightbox.refresh();

    // Smooth Scroll (Yumuşak Kaydırma)
    scrollPage();

    // Son sayfaya geldik mi kontrolü
    if (page >= maxPage) {
      loadMoreBtn.classList.add("is-hidden");
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    } else {
      loadMoreBtn.classList.remove("is-hidden"); // Daha sayfa varsa butonu geri getir
    }

  } catch (error) {
    iziToast.error({
        title: 'Error',
        message: 'Error fetching more images.',
    });
  } finally {
    hideLoader();
  }
});

// --- YARDIMCI FONKSİYONLAR ---

function showLoader() {
  loader.style.display = "block";
}

function hideLoader() {
  loader.style.display = "none";
}


function scrollPage() {
  const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}