import type { JSX } from "preact";
import { memo } from "preact/compat";
import { baseUrl, resUrl } from "../../config";
import type { BaseCharData } from "../../sceneBuilder.types";
import { findCharByName } from "../../sceneBuilder.utils";

interface GridProps {
    displayList: BaseCharData[];
    allSkins: BaseCharData[];
    skinNames: Set<string>;
    extras: { name: string; image: string } | undefined;
    onCharClick: (char: BaseCharData) => void | Promise<void>;
    onExtraClick: (name: string) => void | Promise<void>;
    setHoverName: (n: string) => void;
}

/**
 * Memoized grid of character portrait buttons.
 *
 * Wrapped in preact/compat's `memo` so that changes to the parent's local hover-name
 * state don't re-render the grid. Without this, every mouseenter/leave on a character
 * would re-render 100+ buttons and cause the scroll container to reset to top.
 */
function CharacterGridInner({
    displayList, allSkins, skinNames, extras, onCharClick, onExtraClick, setHoverName
}: GridProps): JSX.Element {
    return (
        <div class="flex-1 overflow-y-auto p-2">
            <div class="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {displayList.map((char): JSX.Element => {
                    let bg = "rgb(123,92,144)";
                    if (char.rarity === 5) bg = "rgb(146,109,69)";
                    else if (char.rarity === 6) bg = "rgb(192,79,85)";
                    const hasSkin = findCharByName(allSkins, char.name) !== undefined || skinNames.has(char.name);
                    return (
                        <button
                            key={char.id}
                            class="relative rounded-lg overflow-hidden aspect-square"
                            style={{ background: bg }}
                            onClick={async (): Promise<void> => await onCharClick(char)}
                            onMouseEnter={(): void => setHoverName(char.name)}
                            onMouseLeave={(): void => setHoverName("")}
                            title={char.name}
                        >
                            <img src={`${baseUrl}${char.image}`} class="w-full h-full object-cover" />
                            {hasSkin && (
                                <img
                                    src={resUrl("res/assets/skin_icon.png")}
                                    class="absolute top-1 right-1 w-5 h-5"
                                />
                            )}
                        </button>
                    );
                })}
                {extras && (
                    <button
                        class="relative rounded-lg overflow-hidden aspect-square bg-[rgb(64,68,70)]"
                        onClick={async (): Promise<void> => await onExtraClick(extras.name)}
                        onMouseEnter={(): void => setHoverName(extras.name)}
                        onMouseLeave={(): void => setHoverName("")}
                        title={extras.name}
                    >
                        <img src={extras.image} class="w-full h-full object-cover" />
                    </button>
                )}
            </div>
        </div>
    );
}

/**
 * Custom comparator: only re-render if the actual displayed data changed,
 * NOT when the hover-name setter changes (parent creates a new function each render).
 */
export const CharacterGrid = memo(CharacterGridInner, (prev, next) => {
    // Same displayList reference (parent's useMemo returns stable ref) → no re-render.
    return prev.displayList === next.displayList
        && prev.allSkins === next.allSkins
        && prev.skinNames === next.skinNames
        && prev.extras?.name === next.extras?.name;
});