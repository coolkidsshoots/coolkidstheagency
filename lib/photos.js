// Cloudinary photos, shown in this order. f_auto,q_auto:best,w_3840,c_limit = best format, high quality, up to 3840px wide (sharp on Retina screens).
const BASE = "https://res.cloudinary.com/jrdpzpzm/image/upload";
const T = "f_auto,q_auto:best,w_3840,c_limit";
const THUMB = "f_auto,q_auto:good,w_1200,c_limit";

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

// Camera numbers that sit close together are usually the same scene, so we sort by number
// and then step through the list in strides of 7 (coprime with 26) so look-alikes never sit side by side.
const num = (f) => parseInt(f.match(/DSC(\d+)/)[1], 10);
const sorted = [...FILES].sort((a, b) => num(a) - num(b));
const STRIDE = 7;
const SPREAD = sorted.map((_, k) => sorted[(k * STRIDE) % sorted.length]);

export const CLOUD_PHOTOS = SPREAD.map((f) => ({ src: `${BASE}/${T}/${f}`, thumb: `${BASE}/${THUMB}/${f}`, type: "image" }));

// Cloudinary videos, in the order they appear. The page plays a trimmed 8s clip (du_8 = duration, so_0 = start offset);
// tapping it opens the full-length video.
const VBASE = "https://res.cloudinary.com/jrdpzpzm/video/upload";
const VIDEOS = [
  { file: "v1793146282/story.mp4", start: 0 },
  { file: "v1793146268/WTB_8.mp4", start: 0 }, // uploaded as .mov; Cloudinary converts it to .mp4 so it plays everywhere
  { file: "v1793146266/ROCUP_POSTCARDS.mp4", start: 0 }, // uploaded as .mov; converted to .mp4 by Cloudinary
  { file: "v1793146265/PumaxRepresent.mp4", start: 0 }, // uploaded as .mov; converted to .mp4 by Cloudinary
];

export const CLOUD_VIDEOS = VIDEOS.map(({ file, start }) => ({
  src: `${VBASE}/so_${start},du_8,q_auto,w_1920,c_limit/${file}`,
  full: `${VBASE}/q_auto/${file}`,
  type: "video",
}));
