import type { JSX } from "preact";

interface Props {
    name: string;
    secondName?: string;
    darkMode: boolean;
}

/**
 * Character name shown to the right of the toolbar icons.
 * Left offset lines up with the right edge of the second icon column (dark-mode button).
 * The primary name sits on the first icon row; when a second character is added,
 * its name is shown on a line beneath (near the skin / add-second button row).
 */
export function CharNameOverlay({ name, secondName, darkMode }: Props): JSX.Element {
    const color = darkMode ? "text-white" : "text-black";
    return (
        <div
            class={`fadeable pointer-events-none absolute select-none flex flex-col justify-center ${color}`}
            style={{
                left: "120px", // 10 (gap) + 50 (col1) + 50 (col2) + 10 (margin)
                top: "35px", // vertical center of a 50px icon at top=10
                transform: "translateY(-50%)",
                minHeight: "50px",
                lineHeight: 1.15
            }}
        >
            <span class="text-xl md:text-2xl">{name}</span>
            {secondName && (
                <span class="text-base md:text-xl opacity-80">+ {secondName}</span>
            )}
        </div>
    );
}