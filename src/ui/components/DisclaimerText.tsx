import type { JSX } from "preact";

export function DisclaimerText(_props: { darkMode: boolean }): JSX.Element {
    // Grey on every background, small on mobile, larger on desktop.
    return (
        <div class="fadeable pointer-events-none absolute top-2 right-3 text-gray-400 text-xs sm:text-base md:text-lg select-none">
            Double click / tap to change camera mode.
        </div>
    );
}
