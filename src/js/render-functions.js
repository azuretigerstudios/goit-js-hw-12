import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

// Lightbox örneğini burada tutuyoruz
let lightbox;

/**
 * 1. HTML Markup Oluşturma (İç Fonksiyon)
 */
function createMarkup(images) {
  return images
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
}

/**
 * 2. Galeriyi Ekrana Basma ve Lightbox Yönetimi (Dışa Aktarılır)
 */
export function renderGallery(images, galleryElement, isAppend = false) {
  const markup = createMarkup(images);

  if (isAppend) {
    galleryElement.insertAdjacentHTML("beforeend", markup);
  } else {
    galleryElement.innerHTML = markup;
  }

  // Lightbox Başlatma / Yenileme
  if (!lightbox) {
    lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
  } else {
    lightbox.refresh();
  }
}

/**
 * 3. Galeriyi Temizleme (Dışa Aktarılır)
 */
export function clearGallery(galleryElement) {
  galleryElement.innerHTML = "";
}

/**
 * 4. Loader Yönetimi (Dışa Aktarılır)
 */
export function showLoader(loaderElement) {
  loaderElement.style.display = "block";
}

export function hideLoader(loaderElement) {
  loaderElement.style.display = "none";
}

/**
 * 5. Load More Buton Yönetimi (Dışa Aktarılır)
 */
export function showLoadMore(btnElement) {
  btnElement.classList.remove("is-hidden");
}

export function hideLoadMore(btnElement) {
  btnElement.classList.add("is-hidden");
}