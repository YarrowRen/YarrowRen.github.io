// // src/scripts/gallery-init.js

// import lightGallery from 'lightgallery';
// import 'lightgallery/css/lightgallery-bundle.css'; // 包含所有核心 + 插件样式 ✅

// import lgThumbnail from 'lightgallery/plugins/thumbnail';
// import lgZoom from 'lightgallery/plugins/zoom';
// import lgFullscreen from 'lightgallery/plugins/fullscreen';
// import lgAutoplay from 'lightgallery/plugins/autoplay';

// export function initGallery() {
//   const el = document.getElementById('gallery');
//   if (el) {
//     lightGallery(el, {
//       selector: 'a',
//       speed: 300,
//       plugins: [lgThumbnail, lgZoom, lgFullscreen, lgAutoplay],
//       thumbnail: true,
//       zoom: true,
//       fullscreen: true,
//       autoplay: false,
//     });
//   }
// }


// public/scripts/gallery-init.js
import lightGallery from "https://cdn.jsdelivr.net/npm/lightgallery@2.7.1/+esm";
import "https://cdn.jsdelivr.net/npm/lightgallery@2.7.1/css/lightgallery-bundle.min.css";

document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("gallery");
  if (el) {
    lightGallery(el, {
      selector: "a",
      download: false
    });
  }
});
