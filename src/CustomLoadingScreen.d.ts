import type { ILoadingScreen } from "@babylonjs/core";
/**
 * Class used for the default loading screen
 * @see https://doc.babylonjs.com/features/featuresDeepDive/scene/customLoadingScreen
 */
export declare class CustomLoadingScreen implements ILoadingScreen {
    private _renderingCanvas;
    private _loadingText;
    private _loadingDivBackgroundColor;
    private _loadingDiv;
    public loadingTextDiv:HTMLDivElement;
    private _style;
    /** Gets or sets the logo url to use for the default loading screen */
    static DefaultLogoUrl: string;
    /** Gets or sets the spinner url to use for the default loading screen */
    static DefaultSpinnerUrl: string;
    /**
     * Creates a new default loading screen
     * @param _renderingCanvas defines the canvas used to render the scene
     * @param _loadingText defines the default text to display
     * @param _loadingDivBackgroundColor defines the default background color
     */
    constructor(_renderingCanvas: HTMLCanvasElement, _loadingText?: string, _loadingDivBackgroundColor?: string);
    /**
     * Function called to display the loading screen
     */
    displayLoadingUI(): void;
    /**
     * Function called to hide the loading screen
     */
    hideLoadingUI(): void;
    /**
     * Sets the accent color used by the spinner + progress bar. Accepts an
     * element name (e.g. "Pyro", "HSR") or a raw CSS color ("#rrggbb").
     */
    setAccentColor(elementOrColor: string): void;
    /**
     * Updates the progress panel: a step label + a determinate progress bar.
     * @param label text shown above the bar
     * @param percent 0..100 fill amount
     */
    setProgress(label: string, percent: number): void;
    /**
     * Gets or sets the text to display while loading
     */
    set loadingUIText(text: string);
    get loadingUIText(): string;
    /**
     * Gets or sets the color to use for the background
     */
    get loadingUIBackgroundColor(): string;
    set loadingUIBackgroundColor(color: string);
    private _resizeLoadingUI;
}
