const gallery = document.getElementById("gallery");
let currentImages = [];
let currentIndex = 0;

const UNSPLASH_ACCESS_KEY = "QCceuU-6Y9eem8501neirjnNvtnTloWpYkUcTJJ85uA";

async function loadImages(query, isRandom = false) {
  gallery.innerHTML = "<p>Loading...</p>";
  currentImages = [];

  let url;
  if (isRandom) {
    url = `https://api.unsplash.com/photos/random?count=30&client_id=${UNSPLASH_ACCESS_KEY}`;
  } else {
    url = `https://api.unsplash.com/search/photos?query=${query}&per_page=30&client_id=${UNSPLASH_ACCESS_KEY}`;
  }

  const res = await fetch(url);
  const data = await res.json();
  const images = isRandom ? data : data.results;

  gallery.innerHTML = "";

  images.forEach((imgObj, index) => {
    const img = document.createElement("img");
    img.src = imgObj.urls.small;
    img.alt = imgObj.alt_description || query;
    img.onclick = () => openLightbox(index);

    const container = document.createElement("div");
    container.className = "gallery-item";
    container.appendChild(img);
    gallery.appendChild(container);
  });

  currentImages = images;
}

function openLightbox(index) {
  currentIndex = index;
  const imgData = currentImages[index];

  document.getElementById("lightbox-img").src = imgData.urls.regular;
  document.getElementById("lightbox").style.display = "flex";

  const infoBox = document.getElementById("lightbox-info");
  const title = imgData.alt_description || imgData.description || "Untitled";
  const photographer = imgData.user.name || "Unknown Photographer";
  const bio = imgData.user.bio || "";
  const desc = imgData.description || "";

  infoBox.innerHTML = `
    <h3>${title}</h3>
    <p><strong>By:</strong> ${photographer}</p>
    ${bio ? `<p><em>${bio}</em></p>` : ""}
    ${desc && desc !== title ? `<p>${desc}</p>` : ""}
  `;
}

function closeLightbox() {
  document.getElementById("lightbox").style.display = "none";
}

function navigate(direction) {
  currentIndex =
    (currentIndex + direction + currentImages.length) % currentImages.length;
  openLightbox(currentIndex);
}

window.onload = () => {
  loadImages("", true); // true = load random images
};
