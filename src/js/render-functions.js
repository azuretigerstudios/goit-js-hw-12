// Lightbox'ı BURADA import ediyoruz (main.js'ten sildik)
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

// Lightbox örneğini bu modül içinde saklayacağız
let lightbox;

/**
 * HTML oluşturur, sayfaya ekler ve Lightbox'ı yönetir.
 * @param {Array} images - API'den gelen görsel dizisi
 * @param {HTMLElement} galleryElement - Galerinin DOM elemanı
 * @param {Boolean} isAppend - True ise ekleme yapar (Load More), False ise üzerine yazar (Yeni Arama)
 */
export function renderImages(images, galleryElement, isAppend = false) {
  const markup = images
    .map(
      ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
      <li class="gallery-item">
        <a class="gallery-link" href="${largeImageURL}">
          <img class="gallery-image" src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item"><b>Likes</b>${likes}</p>
          <p class="info-item"><b>Views</b>${views}</p>
          <p class="info-item"><b>Comments</b>${comments}</p>
          <p class="info-item"><b>Downloads</b>${downloads}</p>
        </div>
      </li>`
    )
    .join("");

  // Ekleme mi yapacağız, yoksa sıfırdan mı yazacağız?
  if (isAppend) {
    galleryElement.insertAdjacentHTML("beforeend", markup);
  } else {
    galleryElement.innerHTML = markup;
  }

  // Lightbox Mantığı (Kapsüllenmiş - Encapsulated)
  if (!lightbox) {
    // İlk kez çalışıyorsa başlat
    lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
  } else {
    // Zaten varsa yenile
    lightbox.refresh();
  }
}

// Galeriyi temizlemek için basit bir yardımcı (Gerekirse)
export function clearGallery(element) {
  element.innerHTML = "";
}