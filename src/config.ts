export const baseUrl = "https://phoshco.github.io/";
// export const baseUrl = "http://127.0.0.1:8080/";
/**
 * Resolves a bundled asset path (like "res/assets/menu.png") to a URL that works
 * regardless of the current page's pathname or the site's subpath deployment.
 *
 * - localhost dev: prefix is "/"
 * - LAN IP dev: prefix is "/"
 * - phoshco.github.io (deployed): prefix is "/model-viewer/"
 */
export function resUrl(path: string): string {
    const clean = path.replace(/^\/+/, "");
    if (typeof window === "undefined") return "/" + clean;
    const isGithubPages = window.location.hostname.includes("github.io");
    return (isGithubPages ? "/model-viewer/" : "/") + clean;
}

/**
 * Base path used when writing URL slugs via history.replaceState.
 * Only prepend the "/model-viewer" segment on the github.io deployment.
 */
export function urlBasePath(): string {
    if (typeof window === "undefined") return "";
    return window.location.hostname.includes("github.io") ? "/model-viewer" : "";
}