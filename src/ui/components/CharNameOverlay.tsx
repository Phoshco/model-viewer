import type { JSX } from "preact";

interface Props {
    name: string;
    darkMode: boolean;
}

/**
 * Character name shown to the right of the toolbar icons.
 * Left offset lines up with the right edge of the second icon column (dark-mode button).
 * Vertically centered against the first icon row.
 */
export function CharNameOverlay({ name, darkMode }: Props): JSX.Element {
    const color = darkMode ? "text-white" : "text-black";
    return (
        <div
            class={`fadeable pointer-events-none absolute select-none flex items-center ${color} text-xl md:text-2xl`}
            style={{
                left: "120px", // 10 (gap) + 50 (col1) + 50 (col2) + 10 (margin)
                top: "35px", // vertical center of a 50px icon at top=10
                transform: "translateY(-50%)",
                height: "50px",
                lineHeight: 1
            }}
        >
            {name}
        </div>
    );
}