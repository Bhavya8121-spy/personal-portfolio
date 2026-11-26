/** sessionStorage key: the cinematic intro plays once per browser session. */
export const INTRO_SEEN_KEY = "intro-seen";

/** Fired on window when the intro starts handing off to the live hero. */
export const INTRO_REVEAL_EVENT = "intro:reveal";

/** Fired on window once the intro has landed and been removed. */
export const INTRO_DONE_EVENT = "intro:done";

/** The hero's cube video carries this attribute so the intro can land on it. */
export const HERO_CUBE_ATTR = "data-hero-cube";

/**
 * Runs in <head> before first paint. Marks <html data-intro="skip"> when the
 * intro should not play, so CSS hides the overlay without a black flash.
 */
export const introGateScript = `try{if(sessionStorage.getItem("${INTRO_SEEN_KEY}")||matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.dataset.intro="skip"}}catch(e){document.documentElement.dataset.intro="skip"}`;

/** True when the cinematic intro is (or is about to be) covering the page. Client only. */
export function introWillPlay() {
  return typeof document !== "undefined" && document.documentElement.dataset.intro !== "skip";
}
