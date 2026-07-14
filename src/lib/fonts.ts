// Troika (troika-three-text, behind Threlte's <Text>) parses fonts with Typr,
// which only reads .ttf/.otf/plain-.woff — NOT the Brotli-compressed .woff2 that
// @fontsource-variable ships. So we bundle a static TTF (the latin, regular-weight
// instance of Google Sans Flex, decompressed + flattened from that woff2) for the
// 3D scene. The HTML/UI keeps using the woff2 face via app.css.
import googleSansTtf from "./fonts/google-sans-flex-latin.ttf?url";

/** Troika/Three.js font URL — same face as the UI sans stack. */
export const googleSansFontUrl = googleSansTtf;
