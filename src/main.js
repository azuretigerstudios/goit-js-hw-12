import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// API ve Render importları
import { fetchImages } from "./js/pixabay-api";
// renderImages fonksiyonunu import ediyoruz, createMarkup'ı kaldırdık çünkü renderImages içinde kullanılıyor
import { renderImages, clearGallery } from "./js/render-functions";

// DOM Elementleri
const form = document.querySelector(".form");
const gallery = document.querySelector(".gallery");
const loader = document.querySelector(".loader"); // span.loader
const loadMoreBtn = document.querySelector(".load-more");

// Değişkenler
let query = "";
let page = 1;
let maxPage = 0;
const perPage = 15;

// Başlangıçta Load More butonu gizli
loadMoreBtn.classList.add("is-hidden");

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

  // Galeriyi temizle ve butonu gizle
  clearGallery(gallery);
  loadMoreBtn.classList.add("is-hidden");

  showLoader();

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
      hideLoader();
      return;
    }

    maxPage = Math.ceil(data.totalHits / perPage);

    // --- DÜZELTME BURADA ---
    // Artık HTML oluşturma, ekleme ve Lightbox yenileme işlemini tek satırda yapıyoruz.
    // 3. parametre (isAppend) vermiyoruz, varsayılan false (yani temizleyip yazar).
    renderImages(data.hits, gallery);

    iziToast.success({
      title: 'Success',
      message: `Hooray! We found ${data.totalHits} images.`,
      position: 'topRight',
    });

    if (maxPage > 1) {
      loadMoreBtn.classList.remove("is-hidden");
    }

  } catch (error) {
    console.log(error);
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
    });
  } finally {
    hideLoader();
  }
});

// --- LOAD MORE CLICK ---
loadMoreBtn.addEventListener("click", async () => {
  page += 1;
  showLoader();
  loadMoreBtn.classList.add("is-hidden");

  try {
    const data = await fetchImages(query, page);

    // --- DÜZELTME BURADA ---
    // 3. parametreyi TRUE gönderiyoruz. Bu "ekleme yap" (append) demektir.
    // Lightbox.refresh() komutu renderImages içinde otomatik çalışır.
    renderImages(data.hits, gallery, true);

    scrollPage();

    if (page >= maxPage) {
      loadMoreBtn.classList.add("is-hidden");
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    } else {
      loadMoreBtn.classList.remove("is-hidden");
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
  // span elementi olduğu için display: block yapılmalı (CSS'te none idi)
  loader.style.display = "block";
}

function hideLoader() {
  loader.style.display = "none";
}

function scrollPage() {
  // İlk kartın yüksekliğini al
  const firstCard = gallery.querySelector(".gallery-item");
  if (firstCard) {
    const { height: cardHeight } = firstCard.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: "smooth",
    });
  }
}