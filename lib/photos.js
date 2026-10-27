// Cloudinary photos, shown in this order. f_auto,q_auto:best,w_3840,c_limit = best format, high quality, up to 3840px wide (sharp on Retina screens).
const BASE = "https://res.cloudinary.com/jrdpzpzm/image/upload";
const T = "f_auto,q_auto:best,w_3840,c_limit";

const FILES = [
  "v1793059274/DSC09545.jpg",
  "v1793059275/DSC09769.jpg",
  "v1793059275/DSC09422.jpg",
  "v1793059274/DSC09515.jpg",
  "v1793059281/DSC01364.jpg",
  "v1793059278/DSC08631.jpg",
  "v1793059277/DSC08763.jpg",
  "v1793059281/DSC00318.jpg",
  "v1793059279/DSC09867.jpg",
  "v1793059279/DSC06634.jpg",
  "v1793059281/DSC01337.jpg",
  "v1793059278/DSC06609.jpg",
  "v1793059274/DSC05739.jpg",
  "v1793059279/DSC06398.jpg",
  "v1793059277/DSC06947.jpg",
  "v1793059277/DSC09764.jpg",
  "v1793059276/DSC09432-2.jpg",
  "v1793059279/DSC06624-2.jpg",
  "v1793059274/DSC06591-2.jpg",
  "v1793059280/DSC06480.jpg",
  "v1793059276/DSC00462.jpg",
  "v1793059277/DSC00446.jpg",
  "v1793059275/DSC00407.jpg",
  "v1793059274/DSC07346.jpg",
  "v1793059279/DSC05799.jpg",
  "v1793059277/DSC00279.jpg",
];

export const CLOUD_PHOTOS = FILES.map((f) => ({ src: `${BASE}/${T}/${f}`, type: "image" }));
