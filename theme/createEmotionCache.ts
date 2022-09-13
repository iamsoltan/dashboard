import rtlPlugin from "stylis-plugin-rtl";
import createCache from "@emotion/cache";

export function createEmotionCache() {
  return createCache({ key: "css" });
}
export function createEmotionCacheWithRtl() {
  return createCache({ key: "css", stylisPlugins: [rtlPlugin as any] });
}
