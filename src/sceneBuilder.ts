const baseUrl = "https://phoshco.github.io/"; //"http://127.0.0.1:8080/";
// for use loading screen, we need to import following module.
import "@babylonjs/core/Loading/loadingScreen";
// for cast shadow, we need to import following module.
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
// for use WebXR we need to import following two modules.
import "@babylonjs/core/Helpers/sceneHelpers";
import "@babylonjs/core/Materials/Node/Blocks";
// if your model has .tga texture, uncomment following line.
import "@babylonjs/core/Materials/Textures/Loaders/tgaTextureLoader";
// for load .bpmx file, we need to import following module.
import "babylon-mmd/esm/Loader/Optimized/bpmxLoader";
// if you want to use .pmx file, uncomment following line.
import "babylon-mmd/esm/Loader/pmxLoader";
// if you want to use .pmd file, uncomment following line.
// import "babylon-mmd/esm/Loader/pmdLoader";
import "babylon-mmd/esm/Loader/mmdOutlineRenderer";
// for play `MmdAnimation` we need to import following two modules.
import "babylon-mmd/esm/Runtime/Animation/mmdRuntimeCameraAnimation";
import "babylon-mmd/esm/Runtime/Animation/mmdRuntimeModelAnimation";
import "babylon-mmd/esm/Runtime/Optimized/Animation/mmdWasmRuntimeModelAnimation";
import "@babylonjs/core/Rendering/depthRendererSceneComponent";
import "babylon-mmd/esm/Loader/Shaders/textureAlphaChecker.fragment";
import "babylon-mmd/esm/Loader/Shaders/textureAlphaChecker.vertex";

import type { IPointerEvent } from "@babylonjs/core";
// import { CubeTexture } from "@babylonjs/core";
// import { VideoTexture } from "@babylonjs/core";
import { MirrorTexture, ParticleSystem, Plane } from "@babylonjs/core";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import type { AbstractEngine } from "@babylonjs/core/Engines/abstractEngine";
import { Layer } from "@babylonjs/core/Layers";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
// import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { LoadAssetContainerAsync } from "@babylonjs/core/Loading/sceneLoader";
import { ImageProcessingConfiguration } from "@babylonjs/core/Materials/imageProcessingConfiguration";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Texture } from "@babylonjs/core/Materials/Textures/texture.js";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { Matrix, Vector3 } from "@babylonjs/core/Maths/math.vector";
// import { MeshBuilder } from "@babylonjs/core/Meshes";
import { CreateGround } from "@babylonjs/core/Meshes/Builders/groundBuilder";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
// import { DepthOfFieldEffectBlurLevel } from "@babylonjs/core/PostProcesses";
import { DefaultRenderingPipeline } from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/defaultRenderingPipeline";
import { Scene } from "@babylonjs/core/scene";
// import * as gui from "@babylonjs/gui";
import { AdvancedDynamicTexture } from "@babylonjs/gui/2D/advancedDynamicTexture";
import { TextBlock, Control, Button, Rectangle, StackPanel, InputText, ScrollViewer, Grid, Image } from "@babylonjs/gui";
// import { Inspector } from "@babylonjs/inspector";
import { ShadowOnlyMaterial } from "@babylonjs/materials/shadowOnly/shadowOnlyMaterial";
import type { MmdAnimation } from "babylon-mmd/esm/Loader/Animation/mmdAnimation";
// import type { MmdModelLoader } from "babylon-mmd/esm/Loader/mmdModelLoader";

import { MmdStandardMaterialBuilder } from "babylon-mmd/esm/Loader/mmdStandardMaterialBuilder";
// import type { BpmxLoader } from "babylon-mmd/esm/Loader/Optimized/bpmxLoader";
import { BvmdLoader } from "babylon-mmd/esm/Loader/Optimized/bvmdLoader";
import { RegisterDxBmpTextureLoader } from "babylon-mmd/esm/Loader/registerDxBmpTextureLoader";
import { SdefInjector } from "babylon-mmd/esm/Loader/sdefInjector";
// import { VmdLoader } from "babylon-mmd/esm/Loader/vmdLoader";
import { StreamAudioPlayer } from "babylon-mmd/esm/Runtime/Audio/streamAudioPlayer";
import { MmdCamera } from "babylon-mmd/esm/Runtime/mmdCamera";
import type { MmdMesh } from "babylon-mmd/esm/Runtime/mmdMesh";
import { MmdRuntime } from "babylon-mmd/esm/Runtime/mmdRuntime";
import { MmdWasmRuntime } from "babylon-mmd/esm/Runtime/Optimized/mmdWasmRuntime";
import { MmdWasmPhysics } from "babylon-mmd/esm/Runtime/Optimized/Physics/mmdWasmPhysics";
import { MmdWasmAnimation } from "babylon-mmd/esm/Runtime/Optimized/Animation/mmdWasmAnimation";
// import { MmdWasmInstanceTypeMPR } from "babylon-mmd/esm/Runtime/Optimized/InstanceType/multiPhysicsRelease";
import { MmdWasmInstanceTypeSPR } from "babylon-mmd/esm/Runtime/Optimized/InstanceType/singlePhysicsRelease";
import { GetMmdWasmInstance } from "babylon-mmd/esm/Runtime/Optimized/mmdWasmInstance";
import miniSearch from "minisearch";

import extraCharDatas from "../res/assets/extras.json";
import motionConfig from "../res/cam_motion/motion.json";
import type { ISceneBuilder } from "./baseRuntime";
import { CustomLoadingScreen } from "./CustomLoadingScreen";
import { FirebaseInstance } from "./fb";
// import { MmdPlayerControl } from "babylon-mmd/esm/Runtime/Util/mmdPlayerControl";
import { mobileMmdPlayerControl } from "./mobileMmdPlayerControl";
import type { BaseCharData, GenshinCharData, HSRCharData, ZZZCharData, WuwaCharData, HNACharData, NTECharData, ExtraCharData } from "./sceneBuilder.types";
import { normalize, getFirstDigit, findCharByName, findCharById, findAllCharsByName, filterBy, sortBy } from "./sceneBuilder.utils";
import { afterBuildSingleMaterialDefault, afterBuildSingleMaterialSt } from "./sceneBuilder.materials";
import { createGenshinUI } from "./ui/genshinUI";
import { createZzzUI } from "./ui/zzzUI";
import { createNteUI } from "./ui/nteUI";
import { createWuwaUI } from "./ui/wuwaUI";
import { createHsrUI } from "./ui/hsrUI";
import { createHnaUI } from "./ui/hnaUI";

export class SceneBuilder implements ISceneBuilder {
    public async build(canvas: HTMLCanvasElement, engine: AbstractEngine, item: string): Promise<Scene> {
        // for apply SDEF on shadow, outline, depth rendering
        SdefInjector.OverrideEngineCreateEffect(engine);
        const isLocal = window.location.hostname.includes("localhost");
        const firebase = FirebaseInstance.GetInstance();

        // If you want to load json data dynamically, uncomment following lines and comment out above import lines.
        const genshinCharDatas = await (await fetch(`${baseUrl}gi/genshin.json`)).json();
        const genshinSkinCharDatas = await (await fetch(`${baseUrl}gi/skins.json`)).json();
        const hsrCharDatas = await (await fetch(`${baseUrl}hsr/hsr.json`)).json();
        const hsrSkinCharDatas = await (await fetch(`${baseUrl}hsr/skins.json`)).json();
        const zzzCharDatas = await (await fetch(`${baseUrl}zzz/zzz.json`)).json();
        const zzzSkinCharDatas = await (await fetch(`${baseUrl}zzz/skins.json`)).json();
        const wuwaCharDatas = await (await fetch(`${baseUrl}ww/wuwa.json`)).json();
        const wuwaSkinCharDatas = await (await fetch(`${baseUrl}ww/skins.json`)).json();
        const hnaCharDatas = await (await fetch(`${baseUrl}hna/hna.json`)).json();
        const hnaSkinCharDatas = await (await fetch(`${baseUrl}hna/skins.json`)).json();
        const nteCharDatas = await (await fetch(`${baseUrl}nte/nte.json`)).json();
        const nteSkinCharDatas = await (await fetch(`${baseUrl}nte/skins.json`)).json();

        // character json types moved to `./sceneBuilder.types.ts`

        // const counter = new CounterAPI();
        const extraDataArray = extraCharDatas as ExtraCharData[];
        const charDataArray = genshinCharDatas as GenshinCharData[];
        const genshinSkinDataArray = genshinSkinCharDatas as GenshinCharData[];
        const hsrCharDataArray = hsrCharDatas as HSRCharData[];
        const hsrSkinDataArray = hsrSkinCharDatas as HSRCharData[];
        const zzzCharDataArray = zzzCharDatas as ZZZCharData[];
        const zzzSkinDataArray = zzzSkinCharDatas as ZZZCharData[];
        const wuwaCharDataArray = wuwaCharDatas as WuwaCharData[];
        const wuwaSkinDataArray = wuwaSkinCharDatas as WuwaCharData[];
        const hnaCharDataArray = hnaCharDatas as HNACharData[];
        const hnaSkinDataArray = hnaSkinCharDatas as HNACharData[];
        const nteCharDataArray = nteCharDatas as NTECharData[];
        const nteSkinDataArray = nteSkinCharDatas as NTECharData[];
        charDataArray.sort((a, b) => b.id - a.id);
        genshinSkinDataArray.sort((a, b) => b.id - a.id);
        hsrSkinDataArray.sort((a, b) => b.id - a.id);
        zzzSkinDataArray.sort((a, b) => b.id - a.id);
        wuwaSkinDataArray.sort((a, b) => b.id - a.id);
        hsrCharDataArray.sort((a, b) => b.id - a.id);
        zzzCharDataArray.sort((a, b) => b.id - a.id);
        wuwaCharDataArray.sort((a, b) => b.id - a.id);
        hnaCharDataArray.sort((a, b) => b.id - a.id);
        hnaSkinDataArray.sort((a, b) => b.id - a.id);
        nteCharDataArray.sort((a, b) => b.id - a.id);
        nteSkinDataArray.sort((a, b) => b.id - a.id);

        // findCharByName moved to `./sceneBuilder.utils.ts`

        type AllCharData = GenshinCharData | HSRCharData | ZZZCharData | WuwaCharData | NTECharData;
        const allCharDataArray: AllCharData[] = [
            ...charDataArray,
            ...hsrCharDataArray,
            ...zzzCharDataArray,
            ...wuwaCharDataArray,
            ...hnaCharDataArray,
            ...nteCharDataArray
        ];
        const allSkinCharDataArray:  AllCharData[] = [
            ...genshinSkinDataArray,
            ...hsrSkinDataArray,
            ...zzzSkinDataArray,
            ...wuwaSkinDataArray,
            ...hnaSkinDataArray,
            ...nteSkinDataArray
        ];
        const miniSearchInstance = new miniSearch({
            fields: ["name"], // fields to index for full-text search
            storeFields: ["id", "name"], // fields to return with search results
            searchOptions: {
                fuzzy: 0.2,
                prefix: true
            }
        });
        miniSearchInstance.addAll(allCharDataArray);

        // normalize & getFirstDigit moved to `./sceneBuilder.utils.ts`

        const findFirstCharByName = (
            nameToFind: string
        ): [BaseCharData | undefined, string] => {

            const normalizedTarget = normalize(nameToFind);
            const results = miniSearchInstance.search(normalizedTarget);
            console.log(results);
            let fallbackItem: BaseCharData | undefined;
            let tabMode: string;
            if (results.length > 0) {
                const tabById = getFirstDigit(results[0].id);
                if (tabById == 1) {
                    fallbackItem = findCharByName(charDataArray, results[0].name);
                    tabMode = "Genshin";
                } else if (tabById == 2) {
                    fallbackItem = findCharByName(hsrCharDataArray, results[0].name);
                    tabMode = "HSR";
                } else if (tabById == 3) {
                    fallbackItem = findCharByName(zzzCharDataArray, results[0].name);
                    tabMode = "ZZZ";
                } else if (tabById == 4) {
                    fallbackItem = findCharByName(wuwaCharDataArray, results[0].name);
                    tabMode = "WuWa";
                } else if (tabById == 5) {
                    fallbackItem = findCharByName(hnaCharDataArray, results[0].name);
                    tabMode = "HNA";
                } else {
                    fallbackItem = findCharByName(nteCharDataArray, results[0].name);
                    tabMode = "NTE";
                }
                if (!isLocal) {

                    try {
                        // Call without awaiting
                        void firebase.countUp("phoshco", fallbackItem!.name.replace(/\./g, "")).catch((error) => {
                            console.error("Failed count: ", error);
                        });
                    } catch (error) {
                        console.error("Unexpected error during count: ", error);
                    }

                }
            } else {
                fallbackItem = findCharByName(charDataArray, "Hu Tao");
                tabMode = "Genshin";
            }
            return [fallbackItem, tabMode];
        };

        const searchCharFunction = (
            nameToFind: string
        ): BaseCharData[] => {
            const normalizedTarget = normalize(nameToFind);
            const results = miniSearchInstance.search(normalizedTarget);
            // console.log(results);
            const fallbackItem: BaseCharData[] = [];
            for (let i = 0; i < results.length; i++) {
                const tabById = getFirstDigit(results[i].id);
                if (tabById == 1) {
                    fallbackItem.push(findCharByName(charDataArray, results[i].name)!);
                } else if (tabById == 2) {
                    fallbackItem.push(findCharByName(hsrCharDataArray, results[i].name)!);
                } else if (tabById == 3) {
                    fallbackItem.push(findCharByName(zzzCharDataArray, results[i].name)!);
                } else if (tabById == 4) {
                    fallbackItem.push(findCharByName(wuwaCharDataArray, results[i].name)!);
                } else if (tabById == 5) {
                    fallbackItem.push(findCharByName(hnaCharDataArray, results[i].name)!);
                } else {
                    fallbackItem.push(findCharByName(nteCharDataArray, results[i].name)!);
                }
            }
            // console.log(fallbackItem);
            return fallbackItem;
        };

        // findCharById, findAllCharsByName, filterBy, sortBy moved to `./sceneBuilder.utils.ts`

        const isMobile: boolean = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        ///////////////
    RegisterDxBmpTextureLoader();
        const materialBuilder = new MmdStandardMaterialBuilder();
        
        materialBuilder.afterBuildSingleMaterial = afterBuildSingleMaterialDefault;

        const materialBuilderSt = new MmdStandardMaterialBuilder();
        
        materialBuilderSt.afterBuildSingleMaterial = afterBuildSingleMaterialSt;

        // if you need outline rendering, comment out following line.
        // materialBuilder.loadOutlineRenderingProperties = (): void => { /* do nothing */ };

        const scene = new Scene(engine);
        let bg_bool = true;
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            bg_bool = true;
            scene.clearColor = new Color4(0.001, 0.001, 0.001, 1.0);
        } else {
            scene.clearColor = new Color4(1, 1, 1, 1.0);
        }

        const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        advancedTexture.layer!.layerMask = 0x10000000;
        advancedTexture.idealWidth = 1000;
        advancedTexture.idealHeight = 1000;
        advancedTexture.useSmallestIdeal = true;

        // scaling for WebXR
        const worldScale = 1;

        const mmdRoot = new TransformNode("mmdRoot", scene);
        mmdRoot.scaling.scaleInPlace(worldScale);
        mmdRoot.position.z = 0;

        const mmdCameraRoot = new TransformNode("mmdRoot", scene);
        mmdCameraRoot.scaling.scaleInPlace(worldScale);
        mmdCameraRoot.position.z = 0;

        // mmd camera for play mmd camera animation
        const mmdCamera = new MmdCamera("mmdCamera", new Vector3(0, 0, 0), scene);
        mmdCamera.maxZ = 5000;
        mmdCamera.minZ = 0.1;
        // mmdCamera.parent = mmdCameraRoot;
        mmdCamera.layerMask = 1;

        const defCamPos = new Vector3(0, 10, -30).scaleInPlace(worldScale);
        const camera = new ArcRotateCamera("arcRotateCamera", 0, 0, 30 * worldScale, new Vector3(0, 10, 0), scene);
        camera.maxZ = 5000;
        // camera.minZ = 0;
        camera.setPosition(defCamPos);
        camera.attachControl(canvas, false);
        camera.inertia = 0.8;
        camera.speed = 0.5 * worldScale;
        camera.panningSensibility = 500;
        camera.zoomToMouseLocation = true;
        camera.wheelDeltaPercentage = 0.1;
        camera.upperRadiusLimit = 100 * worldScale;
        camera.lowerRadiusLimit = 1 * worldScale;
        if (isMobile) {
            camera.pinchDeltaPercentage = 0.002;
        }
        camera.layerMask = 1;

        const stillCamera = new ArcRotateCamera("stillCamera", 0, 0, 30 * worldScale, new Vector3(0, 10, 0), scene);
        stillCamera.maxZ = 5000;
        // stillCamera.minZ = 0;
        stillCamera.setPosition(defCamPos);
        stillCamera.attachControl(canvas, false);
        stillCamera.inertia = 0.8;
        stillCamera.speed = 0.5 * worldScale;
        stillCamera.panningSensibility = 500;
        stillCamera.zoomToMouseLocation = true;
        stillCamera.wheelDeltaPercentage = 0.1;
        stillCamera.upperRadiusLimit = 100 * worldScale;
        stillCamera.lowerRadiusLimit = 1 * worldScale;
        if (isMobile) {
            stillCamera.pinchDeltaPercentage = 0.002;
        }
        stillCamera.layerMask = 1;

        // const guiCam = new ArcRotateCamera("guiCamera", 0, 0, 25 * worldScale, new Vector3(0, 10 * worldScale, 1), scene);
        const guiCam = new ArcRotateCamera("guiCamera", Math.PI / 2 + Math.PI / 7, Math.PI / 2, 100, new Vector3(0, 20, 0), scene);
        guiCam.layerMask = 0x10000000;

        const hemisphericLight = new HemisphericLight("HemisphericLight", new Vector3(0, 1, 0), scene);
        hemisphericLight.intensity = 0.4;
        hemisphericLight.specular = new Color3(0, 0, 0);
        hemisphericLight.groundColor = new Color3(1, 1, 1);

        const directionalLight = new DirectionalLight("DirectionalLight", new Vector3(0.5, -1, 1), scene);
        directionalLight.intensity = 0.8;
        // set frustum size manually for optimize shadow rendering
        directionalLight.autoCalcShadowZBounds = false;
        directionalLight.autoUpdateExtends = false;
        directionalLight.shadowMaxZ = 20 * worldScale;
        directionalLight.shadowMinZ = -15 * worldScale;
        directionalLight.orthoTop = 18 * worldScale;
        directionalLight.orthoBottom = -3 * worldScale;
        directionalLight.orthoLeft = -10 * worldScale;
        directionalLight.orthoRight = 10 * worldScale;
        directionalLight.shadowOrthoScale = 0;

        const shadowGenerator = new ShadowGenerator(1024, directionalLight, true);
        shadowGenerator.usePercentageCloserFiltering = true;
        shadowGenerator.forceBackFacesOnly = true;
        shadowGenerator.filteringQuality = ShadowGenerator.QUALITY_MEDIUM;
        shadowGenerator.frustumEdgeFalloff = 0.1;

        // Create a particle system
        const particleSystem = new ParticleSystem("particles", 2000, scene);
        //Texture of each particle
        particleSystem.particleTexture = new Texture("res/assets/flare.png", scene);
        // Where the particles come from
        particleSystem.emitter = Vector3.Zero(); // the starting position
        particleSystem.minEmitBox = new Vector3(-25, -15, -25); // Bottom Left Front
        particleSystem.maxEmitBox = new Vector3(25, 10, 25); // Top Right Back
        // Colors of all particles
        particleSystem.color1 = new Color4(1.0, 1.0, 1.0, 0.9);
        particleSystem.color2 = new Color4(0.5, 0.5, 0.5, 0.9);
        particleSystem.colorDead = new Color4(0.1, 0.1, 0.1, 0.0);
        // Size of each particle (random between...
        particleSystem.minSize = 0.1;
        particleSystem.maxSize = 0.4;
        // Life time of each particle (random between...
        particleSystem.minLifeTime = 0.3;
        particleSystem.maxLifeTime = 1.5;
        // Emission rate
        particleSystem.emitRate = 40;
        // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE;
        // Set the gravity of all particles
        particleSystem.gravity = new Vector3(0, -9.81, 0);
        // Direction of each particle after it has been emitted
        particleSystem.direction1 = new Vector3(-7, 8, 3);
        particleSystem.direction2 = new Vector3(7, 8, -3);
        // Angular speed, in radians
        particleSystem.minAngularSpeed = 0;
        particleSystem.maxAngularSpeed = Math.PI;
        // Speed
        particleSystem.minEmitPower = 1;
        particleSystem.maxEmitPower = 3;
        particleSystem.updateSpeed = 0.005;

        particleSystem.renderingGroupId = 1;

        // create mmd runtime with physics (initialized later after audio player using updated wasm/physics APIs)
        let mmdRuntime: MmdRuntime | any;
        // let physicsRuntime: MultiPhysicsRuntime | undefined;

        // physics toggle: enable/disable physics via URL param `?physics=1` or set default here
        //const getUrlFlag = (name: string): string | null => new URLSearchParams(window.location.search).get(name);
        let physicsModeOn = false;

        // Randomly pick name from the list from motionConfig json
        let motionName = motionConfig[Math.floor(Math.random() * motionConfig.length)].name;
        let audioPlayerFile = motionConfig.find((item) => item.name === motionName)!.audioPlayerFile;
        let camMotionFile = motionConfig.find((item) => item.name === motionName)!.camMotionFile;
        let modelMotionFile = motionConfig.find((item) => item.name === motionName)!.modelMotionFile;

        // set audio player
        let audioPlayer = new StreamAudioPlayer(scene);
        audioPlayer.preservesPitch = false;
        // song
        audioPlayer.source = audioPlayerFile;
        // initialize wasm + physics + mmd runtime (updated babylon-mmd APIs)
        let wasmInstance: any | undefined;
        if (physicsModeOn) {
            wasmInstance = await GetMmdWasmInstance(new MmdWasmInstanceTypeSPR());

            mmdRuntime = new MmdWasmRuntime(wasmInstance, scene, new MmdWasmPhysics(scene)); // use Bullet physics for rigid body simulation
            mmdRuntime.loggingEnabled = true;
            mmdRuntime.register(scene);
            mmdRuntime.setAudioPlayer(audioPlayer);
            // mmdRuntime.playAnimation();
        } else {
            // create runtime without physics
            mmdRuntime = new MmdRuntime(scene);
            mmdRuntime.loggingEnabled = true;
            mmdRuntime.register(scene);
            mmdRuntime.setAudioPlayer(audioPlayer);
        }

        // create youtube like player control
        let mmdPlayerControl = new mobileMmdPlayerControl(scene, mmdRuntime, audioPlayer, isMobile);
        mmdPlayerControl.showPlayerControl();

        // show loading screen
        const customLoadingScreen = new CustomLoadingScreen(canvas);
        engine.loadingScreen = customLoadingScreen;
        engine.displayLoadingUI();

        let loadingTexts: string[] = [];
        const updateLoadingText = (updateIndex: number, text: string): void => {
            loadingTexts[updateIndex] = text;
            customLoadingScreen.loadingTextDiv.innerHTML = "<br/><br/><br/><br/>" + loadingTexts.join("<br/><br/>");
        };

        let promises: Promise<any>[] = [];

        // for load .bvmd file, we use BvmdLoader. if you want to load .vmd or .vpd file, use VmdLoader / VpdLoader
        const bvmdLoader = new BvmdLoader(scene);
        bvmdLoader.loggingEnabled = true;

        // camera motion (gracefully handle unsupported BVMD versions)
        const safeLoadBvmd = async (type: string, url: string, onProgress?: any) => {
            try {
                return await bvmdLoader.loadAsync(type, url, onProgress);
            } catch (e: any) {
                // if BVMD version unsupported, log and return undefined so caller can fallback
                console.warn("BVMD load failed, continuing without motion:", e?.message || e);
                return undefined;
            }
        };

        promises.push(safeLoadBvmd("motion", camMotionFile, (event: any) => updateLoadingText(0, `Loading camera... ${event.loaded}/${event.total} (${Math.floor(event.loaded * 100 / event.total)}%)`)));

        // model motion
        promises.push(safeLoadBvmd("motion", modelMotionFile, (event: any) => updateLoadingText(1, `Loading motion... ${event.loaded}/${event.total} (${Math.floor(event.loaded * 100 / event.total)}%)`)));

        let charScreenMode = true;
        let charScreenElement = "Pyro";
        // model
        let prevCharName: string;
        let prevCharId: number;
        let chosenCharName = item;
        let chosenChar: BaseCharData | undefined;
        let tabMode = "Genshin";
        let firstTabMode = tabMode;
        [chosenChar, firstTabMode] = findFirstCharByName(chosenCharName);
        chosenCharName = chosenChar!.name;
        prevCharId = chosenChar!.id;
        charScreenElement = chosenChar!.element;
        if (firstTabMode == "HSR") {
            charScreenElement = "HSR";
        } else if (firstTabMode != "Genshin") {
            charScreenElement = "Universal";
        }

        if (chosenChar && chosenChar.directory && chosenChar.pmx) {
            promises.push(LoadAssetContainerAsync(
                baseUrl + chosenChar.directory + "/" + chosenChar.pmx,
                scene,
                {
                    onProgress: (event) => updateLoadingText(2, `Loading model... ${event.loaded}/${event.total} (${Math.floor(event.loaded * 100 / event.total)}%)`),
                    pluginOptions: {
                        mmdmodel: {
                            loggingEnabled: true,
                            materialBuilder: materialBuilder
                        }
                    }
                }
            )
            );
        } else {
            throw new Error("Chosen character or its properties are undefined");
        }

        // physics
        promises.push((async(): Promise<void> => {
            updateLoadingText(3, "Loading physics engine...");
            // const physicsInstance = await havokPhysics();
            // const physicsPlugin = new HavokPlugin(true, physicsInstance);
            // physicsPlugin;
            // const physicsInstance = await ammoPhysics();
            // const physicsPlugin = new MmdAmmoJSPlugin(true, physicsInstance);
            // scene.enablePhysics(new Vector3(0, -98, 0), physicsPlugin);
            updateLoadingText(3, "Loading physics engine... Done");
        })());

        // stage
        if (charScreenMode) {
            if (!isMobile) {
                particleSystem.start();
            }
            promises.push(LoadAssetContainerAsync(
                "res/stages/GenshinCharacterSphere" + "/" + "CharacterSphere_" + charScreenElement + "V.pmx",
                scene,
                {
                    onProgress: (event) => updateLoadingText(4, `Loading stage... ${event.loaded}/${event.total} (${Math.floor(event.loaded * 100 / event.total)}%)`),
                    pluginOptions: {
                        mmdmodel: {
                            loggingEnabled: true,
                            materialBuilder: materialBuilderSt,
                            buildSkeleton: false,
                            buildMorph: false,
                        }
                    }
                }
            )
            );
        }

        // wait for all promises. parallel loading is faster than sequential loading.
        let loadResults = await Promise.all(promises);

        // hide loading screen
        scene.onAfterRenderObservable.addOnce(() => engine.hideLoadingUI());
        scene.activeCameras = [stillCamera, guiCam];

        let theDiff = 1.85;
        let theHeight = 1.85;
        let boneWorldMatrixCam = new Matrix();

        let characterModelPromiseRes = loadResults[2];
        characterModelPromiseRes.addAllToScene();
        let modelMesh = characterModelPromiseRes.rootNodes[0] as MmdMesh;
        modelMesh.parent = mmdRoot;

        let modelMeshSt: MmdMesh;
        if (charScreenMode) {
            const characterModelPromiseResSt = loadResults[4];
            characterModelPromiseResSt.addAllToScene();
            modelMeshSt = characterModelPromiseResSt.rootNodes[0] as MmdMesh;
            modelMeshSt.parent = mmdRoot;
        }

        shadowGenerator.addShadowCaster(modelMesh);
        // modelMesh.receiveShadows = true;
        for (const mesh of modelMesh.metadata.meshes) mesh.receiveShadows = true;

        const ground = CreateGround("ground1", { width: 50, height: 50, subdivisions: 2, updatable: false }, scene);

        ground.receiveShadows = true;
        const groundMaterial = new StandardMaterial("GroundMaterial", scene);
        groundMaterial.diffuseColor = new Color3(0.14, 0.14, 0.14);
        groundMaterial.specularPower = 128;
        const groundReflectionTexture = groundMaterial.reflectionTexture = new MirrorTexture("MirrorTexture", 50, scene, true);
        groundReflectionTexture.mirrorPlane = Plane.FromPositionAndNormal(ground.position, ground.getFacetNormal(0).scale(-1));
        groundReflectionTexture.renderList = [...modelMesh.metadata.meshes];
        groundReflectionTexture.level = 0.45;
        groundReflectionTexture.adaptiveBlurKernel = 16;
        // ground.material = groundMaterial;

        const shadowOnlyMaterial = new ShadowOnlyMaterial("shadowOnly", scene);
        shadowOnlyMaterial.activeLight = directionalLight;
        shadowOnlyMaterial.alpha = 0.4;
        ground.material = shadowOnlyMaterial;

        ground.receiveShadows = true;
        ground.parent = mmdRoot;

        let mmdModel = mmdRuntime.createMmdModel(modelMesh);
        // const theCharAnimation = physicsModeOn
        //     ? new MmdWasmAnimation(loadResults[1], wasmInstance!, scene)
        //     : (loadResults[1] as MmdAnimation);
        let theCharAnimation = loadResults[1] as MmdAnimation | MmdWasmAnimation | undefined;

        // for scaling camera to model height
        let headBone = mmdModel.runtimeBones.find((bone: any) => bone.name === "頭");

        // make sure directional light follow the model
        let bodyBone = mmdModel.runtimeBones.find((bone: any) => bone.name === "センター");
        let boneWorldMatrix = new Matrix();

        if (headBone != undefined && bodyBone != undefined) {
            // create and set runtime animation handle for the model (updated API)
            if (theCharAnimation) {
                if (physicsModeOn) {
                    theCharAnimation = new MmdWasmAnimation(theCharAnimation as any, wasmInstance, scene);
                }
                const modelAnimationHandle = mmdModel.createRuntimeAnimation(theCharAnimation as any);
                mmdModel.setRuntimeAnimation(modelAnimationHandle);
            }
            scene.onBeforeDrawPhaseObservable.addOnce(() => {
                headBone!.getWorldMatrixToRef(boneWorldMatrixCam).multiplyToRef(modelMesh.getWorldMatrix(), boneWorldMatrixCam);
                boneWorldMatrixCam.getTranslationToRef(mmdCameraRoot.position);
                mmdCameraRoot.position.z = 10;
                mmdCameraRoot.position.x = 0;
                // boneWorldMatrixCam.getTranslationToRef(mmdCameraRoot.position);
                theDiff = theDiff - mmdCameraRoot.position.y / 10;
                theHeight = mmdCameraRoot.position.y / 10;
            });

            scene.onBeforeRenderObservable.addOnce(() => {
                bodyBone!.getWorldMatrixToRef(boneWorldMatrix).multiplyToRef(modelMesh.getWorldMatrix(), boneWorldMatrix);
                // bodyBone!.getFinalMatrix()!.multiplyToRef(modelMesh.getWorldMatrix(), boneWorldMatrix);
                boneWorldMatrix.getTranslationToRef(directionalLight.position);
                directionalLight.position.y -= 10 * worldScale;
            });
        }

        // create and set runtime animation handle for the camera (updated API)
        let cameraAnimationHandle: any;
        
        if (loadResults[0]) {
            cameraAnimationHandle = mmdCamera.createRuntimeAnimation(loadResults[0] as any);
            mmdCamera.setRuntimeAnimation(cameraAnimationHandle);
        }
        mmdCamera.storeState();
        // attempt to register camera with runtime if available
        // if (typeof (mmdRuntime as any).setCamera === "function") {
        //     try { (mmdRuntime as any).setCamera(mmdCamera); } catch { /* ignore */ }
        // }
        mmdRuntime.addAnimatable(mmdCamera);

        // optimize scene when all assets are loaded
        scene.onAfterRenderObservable.addOnce(() => {
            scene.freezeMaterials();

            if (skinButton != undefined) {
                skinButton.isEnabled = true;
            }

            const meshes = scene.meshes;
            for (let i = 0, len = meshes.length; i < len; ++i) {
                const mesh = meshes[i];
                mesh.freezeWorldMatrix();
                mesh.doNotSyncBoundingInfo = true;
                mesh.isPickable = false;
                mesh.doNotSyncBoundingInfo = true;
                mesh.alwaysSelectAsActiveMesh = true;
            }

            scene.skipPointerMovePicking = true;
            scene.skipPointerDownPicking = true;
            scene.skipPointerUpPicking = true;
            scene.skipFrustumClipping = true;
            scene.blockMaterialDirtyMechanism = true;
            audioPlayer.mute();
            if (!isLocal) {

                try {
                    // Call without awaiting
                    void firebase.countUp("phoshco", "hoyo").catch((error) => {
                        console.error("Failed count: ", error);
                    });
                } catch (error) {
                    console.error("Unexpected error during count: ", error);
                }
            }
        });

        // if you want ground collision, uncomment following lines.
        // const groundRigidBody = new PhysicsBody(ground, PhysicsMotionType.STATIC, true, scene);
        // groundRigidBody.shape = new PhysicsShapeBox(
        //     new Vector3(0, -1, 0),
        //     new Quaternion(),
        //     new Vector3(100, 2, 100), scene);

        // create ground rigid body for physics runtime (if available)
        // if (physicsRuntime) {
        //     const info = new RigidBodyConstructionInfo((physicsRuntime as any).wasmInstance);
        //     info.motionType = MotionType.Static;
        //     info.shape = new PhysicsStaticPlaneShape(physicsRuntime, new Vector3(0, 1, 0), 0);
        //     const groundBody = new RigidBody(physicsRuntime, info);
        //     physicsRuntime.addRigidBodyToGlobal(groundBody);
        // }

        const defaultPipeline = new DefaultRenderingPipeline("default", true, scene, [mmdCamera, camera, stillCamera]);
        defaultPipeline.samples = 4;
        // defaultPipeline.bloomEnabled = true; (Fucker is the culprit slowing everything down)
        // defaultPipeline.bloomScale = 10;
        defaultPipeline.chromaticAberrationEnabled = true;
        defaultPipeline.chromaticAberration.aberrationAmount = 1;
        // defaultPipeline.depthOfFieldEnabled = true;
        // defaultPipeline.depthOfField.focusDistance = scene.activeCamera.position.z;
        // defaultPipeline.depthOfField.focalLength = 50;

        defaultPipeline.fxaaEnabled = true;
        defaultPipeline.imageProcessing.toneMappingEnabled = false;
        defaultPipeline.imageProcessing.toneMappingType = ImageProcessingConfiguration.TONEMAPPING_ACES;
        defaultPipeline.imageProcessing.vignetteWeight = 0.5;
        defaultPipeline.imageProcessing.vignetteStretch = 0.5;
        defaultPipeline.imageProcessing.vignetteColor = new Color4(0, 0, 0, 0);
        defaultPipeline.imageProcessing.vignetteEnabled = true;

        defaultPipeline.depthOfFieldEnabled = false;
        // defaultPipeline.depthOfFieldBlurLevel = DepthOfFieldEffectBlurLevel.Medium;
        // defaultPipeline.depthOfField.fStop = 0.05;
        // defaultPipeline.depthOfField.focalLength = 20;

        let cameraPos = 69;

        const layer = new Layer("", "res/stages/hoyo.png", scene, true, new Color4(1, 1, 1, 1));
        // layer.layerMask = 0x10000000;
        const light_bg = new Texture("res/stages/hoyo.png", scene, true);
        const dark_bg = new Texture("res/stages/hoyo_dark.png", scene, true);
        if (bg_bool) {
            layer.texture = dark_bg;
        }

        const resizeObserver = new ResizeObserver(() => {
            const canvasAspectRatio = canvas.width / canvas.height;
            if (canvasAspectRatio > 1) {
                layer.scale.y = canvasAspectRatio;
                layer.scale.x = 1;

                light_bg.uScale = 1;
                light_bg.vScale = 1 / layer.scale.y;
                light_bg.uOffset = 0;
                light_bg.vOffset = (1 - light_bg.vScale) * 0.5;

                dark_bg.uScale = 1;
                dark_bg.vScale = 1 / layer.scale.y;
                dark_bg.uOffset = 0;
                dark_bg.vOffset = (1 - dark_bg.vScale) * 0.5;
            } else {
                layer.scale.y = 1;
                layer.scale.x = 1 / canvasAspectRatio;

                light_bg.uScale = 1 / layer.scale.x;
                light_bg.vScale = 1;
                light_bg.uOffset = (1 - light_bg.uScale) * 0.5;
                light_bg.vOffset = 0;

                dark_bg.uScale = 1 / layer.scale.x;
                dark_bg.vScale = 1;
                dark_bg.uOffset = (1 - dark_bg.uScale) * 0.5;
                dark_bg.vOffset = 0;
            }
        });
        resizeObserver.observe(canvas);
        layer.render;

        // GUI

        const debugblock = new TextBlock();
        debugblock.widthInPixels = 100;
        debugblock.heightInPixels = 100;
        debugblock.left = 0;
        debugblock.text = "lol"; // `${mmdCameraRoot.position.y}`;
        debugblock.fontSize = 16;
        debugblock.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        debugblock.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        debugblock.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        debugblock.color = "black";
        advancedTexture.addControl(debugblock);
        debugblock.isVisible = false;

        const textblock = new TextBlock();
        textblock.widthInPixels = 100;
        textblock.heightInPixels = 50;
        textblock.left = 0;
        textblock.text = `${scene.activeCameras[0].name}`;
        textblock.fontSize = 16;
        textblock.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        textblock.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        textblock.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        textblock.color = "black";
        advancedTexture.addControl(textblock);
        textblock.isVisible = false;
        
        const iconWidthHeight = isMobile ? "100px" : "50px";

        const disclaimerText = new TextBlock();
        disclaimerText.resizeToFit = true;
        disclaimerText.left = 0;
        disclaimerText.top = 0;
        disclaimerText.paddingTop = 10;
        disclaimerText.paddingRight = 10;
        disclaimerText.text = "Double click / tap to change camera mode.";
        disclaimerText.fontSize = isMobile ? 25 : 16;
        disclaimerText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        disclaimerText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        disclaimerText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        if (bg_bool) {
            disclaimerText.color = "white";
        } else {
            disclaimerText.color = "black";
        }
        advancedTexture.addControl(disclaimerText);
        disclaimerText.isVisible = true;

        const supportButton = Button.CreateImageOnlyButton("but", "res/assets/support.png");
        supportButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        supportButton.left = -10;
        supportButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        supportButton.top = isMobile ? "50px" : "30px";
        supportButton.width = iconWidthHeight;
        supportButton.height = iconWidthHeight;
        supportButton.thickness = 0;
        advancedTexture.addControl(supportButton);
        supportButton.onPointerClickObservable.add(function() {
            window.open("https://ko-fi.com/phoshco", "_blank");
        });

        const showButton = Button.CreateImageOnlyButton("but", "res/assets/menu.png");
        showButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        showButton.left = "10px";
        showButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        showButton.top = "10px";
        showButton.width = iconWidthHeight;
        showButton.height = iconWidthHeight;
        showButton.thickness = 0;
        advancedTexture.addControl(showButton);

        showButton.onPointerClickObservable.add(function() {
            charPanel.isVisible = !charPanel.isVisible;
            if (showButton.isVisible) {
                mmdPlayerControl.hidePlayerControl();
            }
        });

        let skinButton: Button;
        function createSkinButton(visibility: boolean = false, nextSkinMode?: boolean, name?: string): void {
            if (skinButton != undefined) {
                skinButton.dispose();
            }
            skinButton = new Button();
            skinButton = Button.CreateImageOnlyButton("but", "res/assets/alter.png");
            if (bg_bool) {
                skinButton.image!.source = "res/assets/alter_light.png";
            }
            skinButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
            skinButton.left = isMobile ? "110px" : "60px";
            skinButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
            skinButton.top = isMobile ? "110px" : "60px";
            skinButton.width = iconWidthHeight;
            skinButton.height = iconWidthHeight;
            skinButton.thickness = 0;
            advancedTexture.addControl(skinButton);
            skinButton.isVisible = visibility;

            if (nextSkinMode != undefined && name) {
                skinButton.isEnabled = false;
                skinButton.onPointerClickObservable.addOnce(async function() {
                    changeCharacter(name);
                    skinMode = nextSkinMode;
                    if (charPanel.isVisible) {
                        charPanel.isVisible = false;
                    }
                });
            }
        }
        let skinMode = false;

        const darkButton = Button.CreateImageOnlyButton("but", "res/assets/dark_mode.png");
        if (bg_bool) {
            darkButton.image!.source = "res/assets/light_mode.png";
        }
        darkButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        darkButton.left = isMobile ? "110px" : "60px";
        darkButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        darkButton.top = "10px";
        darkButton.width = iconWidthHeight;
        darkButton.height = iconWidthHeight;
        darkButton.thickness = 0;
        if (charScreenMode) {
            darkButton.isEnabled = false;
        };
        advancedTexture.addControl(darkButton);
        function changeDarkMode(): void {
            if (bg_bool) {
                scene.clearColor = new Color4(1, 1, 1, 1.0);
                layer.texture = light_bg;
                darkButton.image!.source = "res/assets/dark_mode.png";
                motionButton.image!.source = "res/assets/note.png";
                physicsButton.image!.source = "res/assets/physics.png";
                if (skinButton != undefined) {
                    skinButton.image!.source = "res/assets/alter.png";
                }
                charNameText.color = "black";
                disclaimerText.color = "black";
            } else {
                layer.texture = dark_bg;
                darkButton.image!.source = "res/assets/light_mode.png";
                motionButton.image!.source = "res/assets/note_light.png";
                physicsButton.image!.source = "res/assets/physics_light.png";
                if (skinButton != undefined) {
                    skinButton.image!.source = "res/assets/alter_light.png";
                }
                charNameText.color = "white";
                disclaimerText.color = "white";
            }
            layer.render;
            bg_bool = !bg_bool;
        }
        darkButton.onPointerClickObservable.add(changeDarkMode);

        const charScreenModeButton = Button.CreateImageOnlyButton("but", "res/assets/paimon.png");
        charScreenModeButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        charScreenModeButton.left = "10px";
        charScreenModeButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        charScreenModeButton.top = isMobile ? "110px" : "60px";
        charScreenModeButton.width = iconWidthHeight;
        charScreenModeButton.height = iconWidthHeight;
        charScreenModeButton.thickness = 0;
        advancedTexture.addControl(charScreenModeButton);
        if (firstTabMode == "WuWa" || firstTabMode == "NTE") {
            charScreenModeButton.isVisible = false;
        }
        charScreenModeButton.onPointerClickObservable.add(function() {
            if (charScreenMode) {
                modelMeshSt.setEnabled(false);
                if (!isMobile) {
                    particleSystem.stop();
                }
                darkButton.isEnabled = true;
            } else if ((tabMode == "Genshin" || tabMode == "HSR" || tabMode == "ZZZ" || tabMode == "HNA") && !charScreenMode) {
                modelMeshSt.setEnabled(true);
                if (!isMobile) {
                    particleSystem.start();
                }
                darkButton.isEnabled = false;
                if (!bg_bool) {
                    changeDarkMode();
                }
            }
            charScreenMode = !charScreenMode;
        });

        const motionButton = Button.CreateImageOnlyButton("but", "res/assets/note.png");
        motionButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        motionButton.left = "10px";
        motionButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        motionButton.top = isMobile ? "210px" : "110px";
        motionButton.width = iconWidthHeight;
        motionButton.height = iconWidthHeight;
        motionButton.thickness = 0;
        advancedTexture.addControl(motionButton);
        if (bg_bool) {
            motionButton.image!.source = "res/assets/note_light.png";
        }
        motionButton.onPointerClickObservable.add(function() {
            // choose the next name in the motionConfig list using the current motionName as the starting point
            const currentIndex = motionConfig.findIndex((item) => item.name === motionName);
            const nextIndex = (currentIndex + 1) % motionConfig.length;
            motionName = motionConfig[nextIndex].name;
            audioPlayerFile = motionConfig.find((item) => item.name === motionName)!.audioPlayerFile;
            camMotionFile = motionConfig.find((item) => item.name === motionName)!.camMotionFile;
            modelMotionFile = motionConfig.find((item) => item.name === motionName)!.modelMotionFile;
            changeMotion();
        });

        const physicsButton = Button.CreateImageOnlyButton("but", "res/assets/physics.png");
        physicsButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        physicsButton.left = "10px";
        physicsButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        physicsButton.top = isMobile ? "310px" : "160px";
        physicsButton.width = iconWidthHeight;
        physicsButton.height = iconWidthHeight;
        physicsButton.thickness = 0;
        physicsButton.cornerRadius = 10;
        advancedTexture.addControl(physicsButton);
        if (bg_bool) {
            physicsButton.image!.source = "res/assets/physics_light.png";
        }
        physicsButton.onPointerClickObservable.add(function() {
            changePhysics();
        });

        const charNameText = new TextBlock();
        // charNameText.widthInPixels = 100;
        charNameText.heightInPixels = isMobile ? 100 : 50;
        charNameText.left = isMobile ? "220px" : "120px";
        charNameText.top = "10px";
        charNameText.text = chosenCharName;
        charNameText.fontSize = isMobile ? 40 : 20;
        charNameText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        charNameText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        charNameText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        if (bg_bool) {
            charNameText.color = "white";
        } else {
            charNameText.color = "black";
        }
        advancedTexture.addControl(charNameText);
        charNameText.isVisible = true;

        let isMouseInPanel = false;
        const charPanel = new Rectangle("charPanel");
        charPanel.width = "720px";
        charPanel.height = "920px";
        charPanel.background = "rgb(44,48,50)";
        charPanel.cornerRadius = 20;
        charPanel.thickness = 3;
        charPanel.color = "black";
        advancedTexture.addControl(charPanel);
        charPanel.isVisible = false;
        charPanel.onIsVisibleChangedObservable.add(()=>{
            if (!charPanel.isVisible) {
                isMouseInPanel = false;
                stillCamera.attachControl(canvas, false);
                camera.attachControl(canvas, false);
            }
        });
        charPanel.onPointerEnterObservable.add(function() {
            stillCamera.detachControl();
            camera.detachControl();
            isMouseInPanel = true;
        });
        charPanel.onPointerOutObservable.add(function() {
            stillCamera.attachControl(canvas, false);
            camera.attachControl(canvas, false);
            isMouseInPanel = false;
        });

        // Code for click outside charPanel behaviour
        let charPanelDown = false;
        charPanel.onPointerDownObservable.add(()=>{
            charPanelDown = true;
        });
        charPanel.onPointerUpObservable.add(()=>{
            setTimeout(() => {
                charPanelDown = false;
            }, 100);
        });
        // Variable to keep track of click timeout timer
        let clickStartTimer: number | undefined = undefined;
        // Bool to determine if click will delete or not
        let isAbleToDelete = true;
        // If the user clicks, start a timer.  If the timer finishes, prevent user from able to close panel
        function scenePointerDownCharPanel(): void {
            if (!charPanelDown) {
                clickStartTimer = window.setTimeout(() => {
                    isAbleToDelete = false;
                }, 100); // Wait 100 ms before considering this a click
            }
        }
        // When user let's go of mouse button, clear the timer, if it never finished, close panel
        function scenePointerUpCharPanel(): void {
            if (!charPanelDown) {
                window.clearTimeout(clickStartTimer);
                if (isAbleToDelete) {
                    charPanel.isVisible = false;
                }
                isAbleToDelete = true;
            }
        }

        const containStack = new Rectangle();
        containStack.width = "700px";
        containStack.height = "900px";
        containStack.thickness = 0;
        containStack.cornerRadius = 15;
        containStack.background = charPanel.background;
        charPanel.addControl(containStack);

        const panel = new StackPanel();
        panel.width = "700px";
        panel.height = "900px";
        containStack.addControl(panel);

        const topBar = new Rectangle();
        topBar.width = "700px";
        topBar.height = "150px";
        topBar.thickness = 0;
        panel.addControl(topBar);

        const genshinButton = Button.CreateSimpleButton("but", "Genshin Impact");
        genshinButton.fontSize = 10;
        genshinButton.width = "175px";
        genshinButton.height = "50px";
        genshinButton.color = "white";
        genshinButton.background = "rgb(64,68,70)";
        genshinButton.disabledColor = charPanel.background;
        genshinButton.thickness = 0;
        genshinButton.left = -262.5;
        genshinButton.top = -50;
        genshinButton.cornerRadiusX = genshinButton.cornerRadiusY = 15;
        topBar.addControl(genshinButton);

        const hsrButton = Button.CreateSimpleButton("but", "Honkai: Star Rail");
        hsrButton.fontSize = 10;
        hsrButton.width = "175px";
        hsrButton.height = "50px";
        hsrButton.color = "white";
        hsrButton.background = charPanel.background;
        hsrButton.disabledColor = charPanel.background;
        hsrButton.thickness = 0;
        hsrButton.left = -87.5;
        hsrButton.top = -50;
        hsrButton.cornerRadiusX = hsrButton.cornerRadiusY = 15;
        topBar.addControl(hsrButton);

        const zzzButton = Button.CreateSimpleButton("but", "Zenless Zone Zero");
        zzzButton.fontSize = 10;
        zzzButton.width = "175px";
        zzzButton.height = "50px";
        zzzButton.color = "white";
        zzzButton.background = charPanel.background;
        zzzButton.disabledColor = charPanel.background;
        zzzButton.thickness = 0;
        zzzButton.left = 87.5;
        zzzButton.top = -50;
        zzzButton.cornerRadiusX = zzzButton.cornerRadiusY = 15;
        topBar.addControl(zzzButton);

        const hnaButton = Button.CreateSimpleButton("but", "Honkai: Nexus Anima");
        hnaButton.fontSize = 10;
        hnaButton.width = "175px";
        hnaButton.height = "50px";
        hnaButton.color = "white";
        hnaButton.background = charPanel.background;
        hnaButton.disabledColor = charPanel.background;
        hnaButton.thickness = 0;
        hnaButton.left = 262.5;
        hnaButton.top = -50;
        hnaButton.cornerRadiusX = hnaButton.cornerRadiusY = 15;
        topBar.addControl(hnaButton);

        // CURRENT STATE
        let sortModeAscending = false;
        let sortModeKey: keyof BaseCharData;

        const genshinFilter: { key: keyof GenshinCharData; value: string }[] = [
            { key: "id", value: "1000" }
        ];
        const hsrFilter: { key: keyof HSRCharData; value: string }[] = [
            { key: "id", value: "2000" }
        ];
        const zzzFilter: { key: keyof ZZZCharData; value: string }[] = [
            { key: "id", value: "3000" }
        ];
        const wuwaFilter: { key: keyof WuwaCharData; value: string }[] = [
            { key: "id", value: "4000" }
        ];
        const hnaFilter: { key: keyof HNACharData; value: string }[] = [
            { key: "id", value: "5000" }
        ];
        const nteFilter: { key: keyof NTECharData; value: string }[] = [
            { key: "id", value: "6000" }
        ];
        let filteredArray: BaseCharData[];
        filteredArray = filterBy(charDataArray, genshinFilter);
        sortModeKey = "id";

        function handleGenshinTabSwitch(): void {
            if (tabMode != "Genshin") {
                genshinButton.background = "rgb(64,68,70)";
                if (tabMode == "HSR") {
                    hsrButton.background = charPanel.background;
                    hsrUI.hide();
                } else if (tabMode == "ZZZ") {
                    zzzButton.background = charPanel.background;
                    zzzUI.hide();
                } else if (tabMode == "WuWa") {
                    tacetImage.background = "rgb(64,68,70)";
                    wuwaUI.hide();
                } else if (tabMode == "HNA") {
                    hnaButton.background = charPanel.background;
                    hnaUI.hide();
                } else if (tabMode == "NTE") {
                    nteImage.background = "rgb(64,68,70)";
                    nteUI.hide();
                }
                tabMode = "Genshin";
                filteredArray = filterBy(charDataArray, genshinFilter);
                filteredArray = sortBy(filteredArray, sortModeKey, sortModeAscending);
                genshinUI.showAll();
                generateGrid(filteredArray);
            }
        }
        genshinButton.onPointerClickObservable.add(function() {
            handleGenshinTabSwitch();
        });

        function handleHSRTabSwitch(): void {
            if (tabMode != "HSR") {
                hsrButton.background = "rgb(64,68,70)";
                if (tabMode == "Genshin") {
                    genshinButton.background = charPanel.background;
                    genshinUI.hide();
                } else if (tabMode == "ZZZ") {
                    zzzButton.background = charPanel.background;
                    zzzUI.hide();
                } else if (tabMode == "WuWa") {
                    tacetImage.background = "rgb(64,68,70)";
                    wuwaUI.hide();
                } else if (tabMode == "NTE") {
                    nteImage.background = "rgb(64,68,70)";
                    nteUI.hide();
                } else {
                    hnaButton.background = charPanel.background;
                    hnaUI.hide();
                }
                tabMode = "HSR";
                if (sortModeKey == "id") {
                    hsrUI.setSortModeSource("res/assets/release.png");
                } else if (sortModeKey == "name") {
                    hsrUI.setSortModeSource("res/assets/alphabet.png");
                }
                filteredArray = filterBy(hsrCharDataArray, hsrFilter);
                filteredArray = sortBy(filteredArray, sortModeKey, sortModeAscending);
                hsrUI.showAll();
                generateGrid(filteredArray);
            }
        }
        hsrButton.onPointerClickObservable.add(function() {
            handleHSRTabSwitch();
        });

        function handleZZZTabSwitch(): void {
            if (tabMode != "ZZZ") {
                zzzButton.background = "rgb(64,68,70)";
                if (tabMode == "Genshin") {
                    genshinButton.background = charPanel.background;
                    genshinUI.hide();
                } else if (tabMode == "HSR") {
                    hsrUI.hide();
                    hsrButton.background = charPanel.background;
                } else if (tabMode == "WuWa") {
                    tacetImage.background = "rgb(64,68,70)";
                    wuwaUI.hide();
                } else if (tabMode == "NTE") {
                    nteImage.background = "rgb(64,68,70)";
                    nteUI.hide();
                } else {
                    hnaButton.background = charPanel.background;
                    hnaUI.hide();
                }
                tabMode = "ZZZ";
                filteredArray = filterBy(zzzCharDataArray, zzzFilter);
                filteredArray = sortBy(filteredArray, sortModeKey, sortModeAscending);
                zzzUI.showAll();
                generateGrid(filteredArray);
            }
        }
        zzzButton.onPointerClickObservable.add(function() {
            handleZZZTabSwitch();
        });

        function handleHNATabSwitch(): void {
            if (tabMode != "HNA") {
                hnaButton.background = "rgb(64,68,70)";
                if (tabMode == "Genshin") {
                    genshinButton.background = charPanel.background;
                    genshinUI.hide();
                } else if (tabMode == "HSR") {
                    hsrUI.hide();
                    hsrButton.background = charPanel.background;
                } else if (tabMode == "ZZZ") {
                    zzzButton.background = charPanel.background;
                    zzzUI.hide();
                } else if (tabMode == "WuWa") {
                    tacetImage.background = "rgb(64,68,70)";
                    wuwaUI.hide();
                } else if (tabMode == "NTE") {
                    nteImage.background = "rgb(64,68,70)";
                    nteUI.hide();
                }
                tabMode = "HNA";
                filteredArray = filterBy(hnaCharDataArray, hnaFilter);
                filteredArray = sortBy(filteredArray, sortModeKey, sortModeAscending);
                hnaUI.showAll();
                generateGrid(filteredArray);
            }
        }
        hnaButton.onPointerClickObservable.add(function() {
            handleHNATabSwitch();
        });

        const filterBar = new Rectangle();
        filterBar.width = "700px";
        filterBar.height = "50px";
        filterBar.thickness = 0;
        filterBar.top = 0;
        filterBar.background = "rgb(64,68,70)";
        topBar.addControl(filterBar);

        const filterBar2 = new Rectangle();
        filterBar2.width = "700px";
        filterBar2.height = "50px";
        filterBar2.thickness = 0;
        filterBar2.top = 50;
        filterBar2.background = "rgb(64,68,70)";
        filterBar2.cornerRadiusW = filterBar2.cornerRadiusZ = 15;
        topBar.addControl(filterBar2);

        const hoverCharName = new TextBlock();
        hoverCharName.width = "150px";
        hoverCharName.height = "40px";
        hoverCharName.color = "white";
        hoverCharName.left = -48;
        hoverCharName.text = "";
        hoverCharName.fontSize = 16;
        hoverCharName.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        hoverCharName.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        // hoverCharName.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        filterBar.addControl(hoverCharName);

        const searchBar = new Rectangle();
        searchBar.width = "220px";
        searchBar.height = "40px";
        searchBar.background = charPanel.background;
        searchBar.cornerRadius = 15;
        searchBar.left = -150;
        searchBar.thickness = 0;
        filterBar2.addControl(searchBar);

        const tacetImage = Button.CreateImageOnlyButton("but", "res/assets/tacet.png");
        tacetImage.height = "40px";
        tacetImage.width = "40px";
        tacetImage.left = -328;
        tacetImage.thickness = 0;
        tacetImage.cornerRadius = 5;
        filterBar2.addControl(tacetImage);

        const nteImage = Button.CreateImageOnlyButton("but", "res/assets/nte.png");
        nteImage.height = "40px";
        nteImage.width = "40px";
        nteImage.left = -288;
        nteImage.thickness = 0;
        nteImage.cornerRadius = 5;
        filterBar2.addControl(nteImage);

        function handleWuwaTabSwitch(): void {
            if (tabMode != "WuWa") {
                tacetImage.background = charPanel.background;
                if (tabMode == "Genshin") {
                    genshinButton.background = charPanel.background;
                    genshinUI.hide();
                } else if (tabMode == "HSR") {
                    hsrUI.hide();
                    hsrButton.background = charPanel.background;
                } else if (tabMode == "ZZZ") {
                    zzzButton.background = charPanel.background;
                    zzzUI.hide();
                } else if (tabMode == "HNA") {
                    hnaButton.background = charPanel.background;
                    hnaUI.hide();
                } else if (tabMode == "NTE") {
                    nteImage.background = "rgb(64,68,70)";
                    nteUI.hide();
                }
                tabMode = "WuWa";
                filteredArray = filterBy(wuwaCharDataArray, wuwaFilter);
                filteredArray = sortBy(filteredArray, sortModeKey, sortModeAscending);
                wuwaUI.showAll();
                generateGrid(filteredArray);
            }
        }

        function handleNTETabSwitch(): void {
            if (tabMode != "NTE") {
                nteImage.background = charPanel.background;
                if (tabMode == "Genshin") {
                    genshinButton.background = charPanel.background;
                    genshinUI.hide();
                } else if (tabMode == "HSR") {
                    hsrUI.hide();
                    hsrButton.background = charPanel.background;
                } else if (tabMode == "ZZZ") {
                    zzzButton.background = charPanel.background;
                    zzzUI.hide();
                } else if (tabMode == "HNA") {
                    hnaButton.background = charPanel.background;
                    hnaUI.hide();
                } else if (tabMode == "WuWa") {
                    tacetImage.background = "rgb(64,68,70)";
                    wuwaUI.hide();
                }
                tabMode = "NTE";
                filteredArray = filterBy(nteCharDataArray, nteFilter);
                filteredArray = sortBy(filteredArray, sortModeKey, sortModeAscending);
                nteUI.showAll();
                generateGrid(filteredArray);
            }
        }

        tacetImage.onPointerClickObservable.add(function() {
            handleWuwaTabSwitch();
        });
        
        nteImage.onPointerClickObservable.add(function() {
            handleNTETabSwitch();
        });

        tacetImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Wuthering Waves";
        });
        tacetImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });
        nteImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Neverness To Everness";
        });
        nteImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const searchTextbox = new InputText();
        searchTextbox.placeholderText = "Find character...";
        searchTextbox.placeholderColor = "rgb(64,68,70)";
        searchTextbox.thickness = 0;
        searchTextbox.background = searchBar.background;
        searchTextbox.width = "160px";
        searchTextbox.color = "white";
        searchTextbox.focusedBackground = searchTextbox.background;
        searchTextbox.promptMessage = "Search for character:";
        searchBar.addControl(searchTextbox);
        let searchTextboxPrevTab = "None";
        let searchCharArray: BaseCharData[];
        searchTextbox.onTextChangedObservable.add(function() {
            if (searchTextbox.text == "") {
                genshinButton.isEnabled = true;
                hsrButton.isEnabled = true;
                zzzButton.isEnabled = true;
                hnaButton.isEnabled = true;
                tacetImage.isVisible = true;
                nteImage.isVisible = true;
                sortImage.isVisible = true;
                if (searchTextboxPrevTab == "Genshin") {
                    handleGenshinTabSwitch();
                } else if (searchTextboxPrevTab == "HSR") {
                    handleHSRTabSwitch();
                } else if (searchTextboxPrevTab == "ZZZ") {
                    handleZZZTabSwitch();
                } else if (searchTextboxPrevTab == "WuWa") {
                    handleWuwaTabSwitch();
                } else if (searchTextboxPrevTab == "HNA") {
                    handleHNATabSwitch();
                } else if (searchTextboxPrevTab == "NTE") {
                    handleNTETabSwitch();
                }
                searchTextboxPrevTab = "None";
            } else {
                if (searchTextboxPrevTab == "None") {
                    searchTextboxPrevTab = tabMode;
                    sortImage.isVisible = false;
                    genshinButton.background = charPanel.background;
                    genshinButton.isEnabled = false;
                    hsrButton.background = charPanel.background;
                    hsrButton.isEnabled = false;
                    zzzButton.background = charPanel.background;
                    zzzButton.isEnabled = false;
                    hnaButton.background = charPanel.background;
                    hnaButton.isEnabled = false;
                    tacetImage.isVisible = false;
                    nteImage.isVisible = false;
                    genshinUI.hide();
                    hsrUI.hide();
                    zzzUI.hide();
                    wuwaUI.hide();
                    hnaUI.hide();
                    nteUI.hide();
                }
                tabMode = "None";
                searchCharArray = searchCharFunction(searchTextbox.text);
                generateGrid(searchCharArray);
            }
        });

        const searchImage = Button.CreateImageOnlyButton("but", "res/assets/search.png");
        searchImage.height = "40px";
        searchImage.width = "40px";
        searchImage.left = -90;
        searchImage.thickness = 0;
        searchImage.cornerRadius = 5;
        searchBar.addControl(searchImage);

        const clearTextImage = Button.CreateImageOnlyButton("but", "res/assets/clear.png");
        clearTextImage.height = "40px";
        clearTextImage.width = "40px";
        clearTextImage.left = 90;
        clearTextImage.thickness = 0;
        clearTextImage.cornerRadius = 5;
        searchBar.addControl(clearTextImage);
        clearTextImage.onPointerClickObservable.add(function() {
            searchTextbox.text = "";
        });

        const sortImage = Button.CreateImageOnlyButton("but", "res/assets/descending.png");
        sortImage.height = "40px";
        sortImage.width = "40px";
        sortImage.left = -328;
        sortImage.thickness = 0;
        filterBar.addControl(sortImage);
        sortImage.onPointerClickObservable.add(() => {
            if (!sortModeAscending) {
                sortImage.image!.source = "res/assets/ascending.png";
                filteredArray = sortBy(filteredArray, sortModeKey, true);
                generateGrid(filteredArray);
            } else {
                sortImage.image!.source = "res/assets/descending.png";
                filteredArray = sortBy(filteredArray, sortModeKey, false);
                generateGrid(filteredArray);
            }
            sortModeAscending = !sortModeAscending;
        });

        const sortModeChanger = Button.CreateSimpleButton("but", " Release ");
        sortModeChanger.height = "40px";
        sortModeChanger.width = "90px";
        sortModeChanger.left = -258;
        sortModeChanger.background = charPanel.background;
        sortModeChanger.color = "white";
        sortModeChanger.cornerRadius = 15;
        sortModeChanger.thickness = 0;
        filterBar.addControl(sortModeChanger);
        sortModeChanger.onPointerClickObservable.add(() => {
            if (sortModeChanger.textBlock != null) {
                if (sortModeKey == "id") {
                    sortModeKey = "name";
                    sortModeChanger.textBlock.text = " Name ";
                    if (tabMode === "HSR") {
                        hsrUI.setSortModeSource("res/assets/alphabet.png");
                    }
                } else {
                    sortModeKey = "id";
                    sortModeChanger.textBlock.text = " Release ";
                    if (tabMode === "HSR") {
                        hsrUI.setSortModeSource("res/assets/release.png");
                    }
                }
                filteredArray = sortBy(filteredArray, sortModeKey, sortModeAscending);
                generateGrid(filteredArray);
            }
        });

        const genshinUI = createGenshinUI({
            filterBar,
            filterBar2,
            hoverCharName,
            charPanel,
            sortModeChanger,
            filterArray: genshinFilter,
            applyFilter: () => {
                filteredArray = filterBy(charDataArray, genshinFilter);
                filteredArray = sortBy(filteredArray, sortModeKey, sortModeAscending);
                generateGrid(filteredArray);
            }
        });

        const hsrUI = createHsrUI({
            filterBar,
            filterBar2,
            hoverCharName,
            charPanel,
            sortModeChanger,
            filterArray: hsrFilter,
            applyFilter: () => {
                filteredArray = filterBy(hsrCharDataArray, hsrFilter);
                filteredArray = sortBy(filteredArray, sortModeKey, sortModeAscending);
                generateGrid(filteredArray);
            },
            onSortModeChange: () => {
                if (sortModeKey == "id") {
                    sortModeKey = "name";
                    if (sortModeChanger.textBlock) {
                        sortModeChanger.textBlock.text = " Name ";
                    }
                } else {
                    sortModeKey = "id";
                    if (sortModeChanger.textBlock) {
                        sortModeChanger.textBlock.text = " Release ";
                    }
                }
                filteredArray = sortBy(filteredArray, sortModeKey, sortModeAscending);
                generateGrid(filteredArray);
            }
        });
        hsrUI.hide();

        const zzzUI = createZzzUI({
            filterBar,
            filterBar2,
            hoverCharName,
            charPanel,
            sortModeChanger,
            filterArray: zzzFilter,
            applyFilter: () => {
                filteredArray = filterBy(zzzCharDataArray, zzzFilter);
                filteredArray = sortBy(filteredArray, sortModeKey, sortModeAscending);
                generateGrid(filteredArray);
            }
        });
        zzzUI.hide();

        const hnaUI = createHnaUI({
            filterBar,
            filterBar2,
            hoverCharName,
            charPanel,
            sortModeChanger,
            filterArray: hnaFilter,
            applyFilter: () => {
                filteredArray = filterBy(hnaCharDataArray, hnaFilter);
                filteredArray = sortBy(filteredArray, sortModeKey, sortModeAscending);
                generateGrid(filteredArray);
            }
        });
        hnaUI.hide();

        const wuwaUI = createWuwaUI({
            filterBar,
            filterBar2,
            hoverCharName,
            charPanel,
            sortModeChanger,
            filterArray: wuwaFilter,
            applyFilter: () => {
                filteredArray = filterBy(wuwaCharDataArray, wuwaFilter);
                filteredArray = sortBy(filteredArray, sortModeKey, sortModeAscending);
                generateGrid(filteredArray);
            }
        });
        wuwaUI.hide();

        const nteUI = createNteUI({
            filterBar,
            filterBar2,
            hoverCharName,
            charPanel,
            sortModeChanger,
            filterArray: nteFilter,
            applyFilter: () => {
                filteredArray = filterBy(nteCharDataArray, nteFilter);
                filteredArray = sortBy(filteredArray, sortModeKey, sortModeAscending);
                generateGrid(filteredArray);
            }
        });
        nteUI.hide();
        sortModeChanger.isVisible = true;

        const myScrollViewer = new ScrollViewer("scrollName");
        myScrollViewer.cornerRadiusX = 15;
        myScrollViewer.cornerRadiusY = 15;
        myScrollViewer.thickness = 0;
        panel.addControl(myScrollViewer);
        // For mobile scrolling
        let allow_pointer_events_be_captured_by_scroll_viewer = false;
        myScrollViewer.onPointerDownObservable.add(() => {
            allow_pointer_events_be_captured_by_scroll_viewer = true;
        });
        myScrollViewer.onPointerUpObservable.add(() => {
            allow_pointer_events_be_captured_by_scroll_viewer = false;
        });

        let y_down: number | undefined = undefined;
        let vertical_scroll_start: number | undefined = undefined;
        function onPointerDownSroll(evt: IPointerEvent): void {
            if (!allow_pointer_events_be_captured_by_scroll_viewer) return;
            y_down = evt.offsetY;
            vertical_scroll_start = myScrollViewer.verticalBar.value;
        }

        function onPointerMoveScroll(evt: IPointerEvent): void {
            if (!allow_pointer_events_be_captured_by_scroll_viewer) return;
            if (y_down === undefined) return;
            if (vertical_scroll_start === undefined) return;
            let y_diff = evt.offsetY - y_down;
            if (isMobile) {
                y_diff = y_diff * 3;
            }
            const y_ratio = y_diff / (grid.heightInPixels - myScrollViewer.heightInPixels);
            myScrollViewer.verticalBar.value = vertical_scroll_start - y_ratio;
        }

        function onPointerUpScroll(): void {
            if (!allow_pointer_events_be_captured_by_scroll_viewer) return;
            y_down = undefined;
        }

        let grid = new Grid();
        let rows = 10;

        function generateGrid<T extends {id: number, name: string, rarity: number, image: string}>(
            dataArray: T[]
        ): void {
            grid.dispose();
            grid = new Grid();
            rows = Math.ceil(dataArray.length / 5) + 1;
            grid.removeRowDefinition;

            grid.color = "black";
            grid.width = "680px";
            grid.heightInPixels = rows * grid.widthInPixels / 5;
            grid.addColumnDefinition(0.2);
            grid.addColumnDefinition(0.2);
            grid.addColumnDefinition(0.2);
            grid.addColumnDefinition(0.2);
            grid.addColumnDefinition(0.2);

            for (let i = 0; i < rows; i++) {
                grid.addRowDefinition(1 / rows);
            }
            myScrollViewer.addControl(grid);

            let charIndex = 0;
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < 5; j++) {
                    if (charIndex > dataArray.length - 1) {
                        let charButton: Button;
                        extraDataArray;
                        if (tabMode == "Genshin" || tabMode == "None") {
                            charButton = Button.CreateImageOnlyButton("but", baseUrl + "gi/Genshin/Paimon.png");
                            charButton.onPointerEnterObservable.add(function() {
                                hoverCharName.text = "Paimon";
                            });
                            charButton.onPointerClickObservable.add(async function() {
                                charPanel.isVisible = !charPanel.isVisible;
                                if (chosenCharName != "Paimon") {
                                    await changeCharacter("Paimon");
                                }
                            });
                        } else if (tabMode == "HSR") {
                            charButton = Button.CreateImageOnlyButton("but", baseUrl + "hsr/HSR/Pom-Pom.png");
                            charButton.onPointerEnterObservable.add(function() {
                                hoverCharName.text = "Pom-Pom";
                            });
                            charButton.onPointerClickObservable.add(async function() {
                                charPanel.isVisible = !charPanel.isVisible;
                                if (chosenCharName != "Pom-Pom") {
                                    await changeCharacter("Pom-Pom");
                                }
                            });
                        } else if (tabMode == "ZZZ") {
                            charButton = Button.CreateImageOnlyButton("but", baseUrl + "zzz/ZZZ/Bangboo.png");
                            charButton.onPointerEnterObservable.add(function() {
                                hoverCharName.text = "Bangboo";
                            });
                            charButton.onPointerClickObservable.add(async function() {
                                charPanel.isVisible = !charPanel.isVisible;
                                if (chosenCharName != "Bangboo") {
                                    await changeCharacter("Bangboo");
                                }
                            });
                        } else if (tabMode == "WuWa") {
                            charButton = Button.CreateImageOnlyButton("but", baseUrl + "ww/WuWa/Abby.png");
                            charButton.onPointerEnterObservable.add(function() {
                                hoverCharName.text = "Abby";
                            });
                            charButton.onPointerClickObservable.add(async function() {
                                charPanel.isVisible = !charPanel.isVisible;
                                if (chosenCharName != "Abby") {
                                    await changeCharacter("Abby");
                                }
                            });
                        } else if (tabMode == "HNA") {
                            charButton = Button.CreateImageOnlyButton("but", "res/assets/HNA/Puddlipup.png");
                            charButton.onPointerEnterObservable.add(function() {
                                hoverCharName.text = "Puddlipup";
                            });
                            charButton.onPointerClickObservable.add(async function() {
                                // charPanel.isVisible = !charPanel.isVisible;
                                // if (chosenCharName != "Puddlipup") {
                                //     await changeCharacter("Puddlipup");
                                // }
                            });
                        } else {
                            charButton = Button.CreateImageOnlyButton("but", "res/assets/NTE/Taygedo.png");
                            charButton.onPointerEnterObservable.add(function() {
                                hoverCharName.text = "Taygedo";
                            });
                            charButton.onPointerClickObservable.add(async function() {
                                // charPanel.isVisible = !charPanel.isVisible;
                                // if (chosenCharName != "Taygedo") {
                                //     await changeCharacter("Taygedo");
                                // }
                            });
                        }
                        charButton.onPointerOutObservable.add(function() {
                            hoverCharName.text = "";
                        });
                        charButton.thickness = 0;
                        charButton.paddingBottom = charButton.paddingLeft = charButton.paddingRight = charButton.paddingTop = 5;
                        charButton.cornerRadius = 10;
                        grid.addControl(charButton, i, j);
                    } else {
                        const selChar = dataArray[charIndex];
                        const theBG = new Rectangle();
                        theBG.cornerRadius = 10;
                        theBG.thickness = 0;
                        theBG.paddingBottom = theBG.paddingTop = theBG.paddingRight = theBG.paddingLeft = 5;
                        theBG.background = "rgb(123,92,144)";
                        if (selChar.rarity == 5) {
                            theBG.background = "rgb(146,109,69)";
                        } else if (selChar.rarity == 6) {
                            theBG.background = "rgb(192,79,85)";
                        }
                        grid.addControl(theBG, i, j);
                        const charButton = Button.CreateImageOnlyButton("but", `${baseUrl}/${selChar.image}`);
                        charButton.thickness = 0;
                        charButton.cornerRadius = 10;
                        charButton.paddingBottom = charButton.paddingTop = charButton.paddingRight = charButton.paddingLeft = 5;
                        grid.addControl(charButton, i, j);
                        charButton.onPointerEnterObservable.add(function() {
                            hoverCharName.text = selChar.name;
                        });
                        charButton.onPointerOutObservable.add(function() {
                            hoverCharName.text = "";
                        });
                        charButton.onPointerClickObservable.add(async function() {
                            charPanel.isVisible = !charPanel.isVisible;
                            if (chosenCharName != selChar.name) {
                                await changeCharacter(selChar.name, selChar.id);
                            } else if (prevCharId != selChar.id && skinMode != true) {
                                await changeCharacter(selChar.name, selChar.id);
                            }
                        });
                        if (findCharByName(allSkinCharDataArray, selChar.name)) {
                            const skinCharButton = new Image("but", "res/assets/skin_icon.png");
                            skinCharButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
                            skinCharButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
                            // skinCharButton.leftInPixels = grid.widthInPixels / 18;
                            // skinCharButton.topInPixels = -grid.widthInPixels / 18;
                            skinCharButton.paddingRight = skinCharButton.paddingTop = 10;
                            skinCharButton.widthInPixels = skinCharButton.heightInPixels = grid.widthInPixels / 30;
                            grid.addControl(skinCharButton, i, j);
                        }
                        charIndex += 1;
                    }
                }
            }
        }

        generateGrid(filteredArray);

        const previousModelState = {
            wasAnimationPlaying: false,
            previousSeekTimeFrame: 0,
            wasMuted: false
        };

        // function to change the audio, camMotion and modelMotion
        async function changeMotion(): Promise<void> {
            mmdRuntime.pauseAnimation();
            mmdCamera.storeState();
            mmdRuntime.seekAnimation(0, true);
            const oldVolume = audioPlayer.volume;
            audioPlayer.dispose();

            // set audio player
            audioPlayer = new StreamAudioPlayer(scene);
            audioPlayer.preservesPitch = false;
            // song
            audioPlayer.source = audioPlayerFile;
            mmdRuntime.setAudioPlayer(audioPlayer);
            // create youtube like player control
            mmdPlayerControl.dispose();
            audioPlayer.volume = oldVolume;
            mmdPlayerControl = new mobileMmdPlayerControl(scene, mmdRuntime, audioPlayer, isMobile);
            mmdPlayerControl.showPlayerControl();

            loadingTexts = [];
            engine.displayLoadingUI();
            promises = [];

            // camera motion
            promises.push(safeLoadBvmd("motion", camMotionFile, (event: any) => updateLoadingText(0, `Loading camera... ${event.loaded}/${event.total} (${Math.floor(event.loaded * 100 / event.total)}%)`)));

            // model motion
            promises.push(safeLoadBvmd("motion", modelMotionFile, (event: any) => updateLoadingText(1, `Loading motion... ${event.loaded}/${event.total} (${Math.floor(event.loaded * 100 / event.total)}%)`)));

            loadResults = await Promise.all(promises);
            theCharAnimation = loadResults[1] as MmdAnimation | undefined;
            // updated API: create runtime animation for model and set it (if available)
            if (theCharAnimation) {
                if (physicsModeOn) {
                    theCharAnimation = new MmdWasmAnimation(theCharAnimation as any, wasmInstance, scene);
                }
                const modelAnimationHandle = mmdModel.createRuntimeAnimation(theCharAnimation as any);
                mmdModel.setRuntimeAnimation(modelAnimationHandle);
            }

            // updated API: create runtime animation for camera and set it
            if (loadResults[0]) {
                cameraAnimationHandle = mmdCamera.createRuntimeAnimation(loadResults[0] as any);
                mmdCamera.setRuntimeAnimation(cameraAnimationHandle);
            }
            mmdCamera.restoreState();
            mmdCamera.position.addToRef(
                Vector3.TransformCoordinatesFromFloatsToRef(0, 0, mmdCamera.distance, rotationMatrix, cameraEyePosition),
                cameraEyePosition
            );
            // attempt to register camera with runtime if available
            // if (typeof (mmdRuntime as any).setCamera === "function") {
            //     try { (mmdRuntime as any).setCamera(mmdCamera); } catch { /* ignore */ }
            // }
            mmdRuntime.addAnimatable(mmdCamera);

            engine.hideLoadingUI();
        }

        async function changePhysics(): Promise<void> {
            // Toggle the physics runtime mode and recreate the character runtime so the physics state is applied.
            physicsModeOn = !physicsModeOn;
            physicsButton.background = physicsModeOn ? "rgba(119, 119, 119, 0.5)" : "rgba(0,0,0,0)";

            // Ensure wasm instance is ready when turning physics on.
            if (physicsModeOn && !wasmInstance) {
                wasmInstance = await GetMmdWasmInstance(new MmdWasmInstanceTypeSPR());
            }

            // Force a reload of the current character so the runtime is recreated for the new physics mode.
            // Temporarily break the "same character" check inside changeCharacter so it doesn't try to switch skins.
            const currentCharName = chosenCharName;
            const currentCharId = chosenChar?.id ?? prevCharId;
            prevCharName = "";
            prevCharId = -1;

            await changeCharacter(currentCharName, currentCharId, true);
        }

        let firstDigitGlobal = 0;

        async function changeCharacter(nextCharacter?: string, nextId?: number, same?: boolean): Promise<void> {
            if (!nextCharacter) {
                return;
            }
            if (mmdRuntime.isAnimationPlaying) {
                previousModelState.wasAnimationPlaying = true;
            }
            mmdRuntime.pauseAnimation();
            // audioPlayer.dispose();
            previousModelState.previousSeekTimeFrame = mmdRuntime.currentFrameTime;
            prevCharName = chosenCharName;
            chosenCharName = nextCharacter;
            charNameText.text = chosenCharName;
            if (skinButton != undefined) {
                skinButton.isVisible = false;
            }
            // mmdRuntime.destroyMmdModel(mmdModel);
            if (!isMobile) {
                particleSystem.stop();
            }
            modelMesh.dispose(false, true);
            if (modelMeshSt) {
                modelMeshSt.dispose(false, true);
            }
            mmdPlayerControl.dispose();
            // mmdCamera.removeAnimation(0);
            mmdCamera.restoreState();
            mmdRuntime.unregister(scene);

            // recreate mmd runtime according to physics toggle. reuse existing physicsRuntime when possible
            if (physicsModeOn) {
                mmdRuntime = new MmdWasmRuntime(wasmInstance, scene, new MmdWasmPhysics(scene)); // use Bullet physics for rigid body simulation
                mmdRuntime.loggingEnabled = true;
                mmdRuntime.register(scene);
                mmdRuntime.setAudioPlayer(audioPlayer);
            } else {
                mmdRuntime = new MmdRuntime(scene);
                mmdRuntime.loggingEnabled = true;
                mmdRuntime.register(scene);
                mmdRuntime.setAudioPlayer(audioPlayer);
            }

            mmdRuntime.setAudioPlayer(audioPlayer);

            mmdPlayerControl = new mobileMmdPlayerControl(scene, mmdRuntime, audioPlayer, isMobile);
            mmdPlayerControl.showPlayerControl();

            let firstDigit = 0;
            firstDigit = getFirstDigit(nextId!);
            if (tabMode == "None") {
                firstDigitGlobal = firstDigit;
            }

            if (same) {
                let skinChars: BaseCharData[] | undefined;
                if (firstDigit === 1 || tabMode === "Genshin") {
                    skinChars = findAllCharsByName(genshinSkinDataArray, chosenChar!.name);
                } else if (firstDigit === 2 || tabMode === "HSR") {
                    skinChars = findAllCharsByName(hsrSkinDataArray, chosenChar!.name);
                } else if (firstDigit === 3 || tabMode === "ZZZ") {
                    skinChars = findAllCharsByName(zzzSkinDataArray, chosenChar!.name);
                } else if (firstDigit === 4 || tabMode === "WuWa") {
                    skinChars = findAllCharsByName(wuwaSkinDataArray, chosenChar!.name);
                } else if (firstDigit === 5 || tabMode === "HNA") {
                    skinChars = findAllCharsByName(hnaSkinDataArray, chosenChar!.name);
                } else if (firstDigit === 6 || tabMode === "NTE") {
                    skinChars = findAllCharsByName(nteSkinDataArray, chosenChar!.name);
                }
                if (skinChars && skinChars.length > 0) {
                    createSkinButton(true, true, chosenChar!.name);
                }
                await createCharacter(chosenChar!);
            }
            else if (chosenCharName == "Paimon" || chosenCharName == "Pom-Pom" || chosenCharName == "Bangboo" || chosenCharName == "Abby") {
                skinMode = false;
                chosenChar = findCharByName(extraDataArray, chosenCharName);
                await createCharacter(chosenChar);
            } else if (firstDigit == 1 || tabMode == "Genshin") {
                tabMode = "Genshin";
                const skinChars = findAllCharsByName(genshinSkinDataArray, chosenCharName);
                if (prevCharName == chosenCharName) {
                    if (skinChars!.length > 0 && !skinMode) { // normal to skin (button is to change back to normal)
                        chosenChar = skinChars![0];
                        skinMode = true;
                        await createCharacter(chosenChar);

                        let isNextSkin = false;
                        if (skinChars!.length > 1) {
                            isNextSkin = true;
                        }
                        createSkinButton(true, isNextSkin, chosenChar!.name);
                    } else if (skinChars!.length > 0 && skinMode && skinChars!.length > 1) { // skin to skin if more than 1 skin
                        let isNextSkin = true;
                        let prevI: number = 0;
                        for (let i = 0; i < skinChars!.length; i++) {
                            if (chosenChar!.id === skinChars![i].id) {
                                prevI = i;
                            }
                        }
                        const temp = (prevI + 1) % skinChars!.length;
                        if (temp == skinChars!.length - 1) {
                            isNextSkin = false;
                        }
                        if (prevI == skinChars!.length - 1) {
                            chosenChar = findCharByName(charDataArray, chosenCharName);
                            skinMode = false;
                        } else {
                            chosenChar = skinChars![temp];
                            skinMode = true;
                        }
                        await createCharacter(chosenChar);
                        createSkinButton(true, isNextSkin, chosenChar!.name);
                    } else if (skinChars!.length > 0 && skinMode) { // skin to normal (button to change to skin)
                        skinMode = false;
                        chosenChar = findCharByName(charDataArray, chosenCharName);
                        await createCharacter(chosenChar);
                        createSkinButton(true, true, chosenChar!.name);
                    }
                } else {
                    skinMode = false;
                    chosenChar = findCharByName(charDataArray, chosenCharName);
                    await createCharacter(chosenChar);
                    if (skinChars!.length > 0) {
                        createSkinButton(true, true, chosenChar!.name);
                    }
                }
            } else if (firstDigit == 2 || tabMode == "HSR") {
                tabMode = "HSR";
                const skinChars = findAllCharsByName(hsrSkinDataArray, chosenCharName);
                if (prevCharName == chosenCharName && prevCharId == chosenChar?.id) {
                    if (skinChars!.length > 0 && !skinMode) { // normal to skin (button is to change back to normal)
                        chosenChar = skinChars![0];
                        skinMode = true;
                        await createCharacter(chosenChar);

                        let isNextSkin = false;
                        if (skinChars!.length > 1) {
                            isNextSkin = true;
                        }
                        createSkinButton(true, isNextSkin, chosenChar!.name);
                    } else if (skinChars!.length > 0 && skinMode && skinChars!.length > 1) { // skin to skin if more than 1 skin
                        let isNextSkin = true;
                        let prevI: number = 0;
                        for (let i = 0; i < skinChars!.length; i++) {
                            if (chosenChar!.id === skinChars![i].id) {
                                prevI = i;
                            }
                        }
                        const temp = (prevI + 1) % skinChars!.length;
                        if (temp == skinChars!.length - 1) {
                            isNextSkin = false;
                        }
                        if (prevI == skinChars!.length - 1) {
                            chosenChar = findCharByName(hsrCharDataArray, chosenCharName);
                            skinMode = false;
                        } else {
                            chosenChar = skinChars![temp];
                            skinMode = true;
                        }
                        await createCharacter(chosenChar);
                        createSkinButton(true, isNextSkin, chosenChar!.name);
                    } else if (skinChars!.length > 0 && skinMode) { // skin to normal (button to change to skin)
                        skinMode = false;
                        chosenChar = findCharByName(hsrCharDataArray, chosenCharName);
                        await createCharacter(chosenChar);
                        createSkinButton(true, true, chosenChar!.name);
                    }
                } else {
                    skinMode = false;
                    chosenChar = findCharById(hsrCharDataArray, nextId!);
                    await createCharacter(chosenChar);
                    if (skinChars!.length > 0) {
                        createSkinButton(true, true, chosenChar!.name);
                    }
                }
            } else if (firstDigit == 3 || tabMode == "ZZZ") {
                tabMode = "ZZZ";
                console.log("ZZZ character selected");
                const skinChars = findAllCharsByName(zzzSkinDataArray, chosenCharName);
                if (prevCharName == chosenCharName && prevCharId == chosenChar?.id) {
                    if (skinChars!.length > 0 && !skinMode) { // normal to skin (button is to change back to normal)
                        chosenChar = skinChars![0];
                        skinMode = true;
                        await createCharacter(chosenChar);

                        let isNextSkin = false;
                        if (skinChars!.length > 1) {
                            isNextSkin = true;
                        }
                        createSkinButton(true, isNextSkin, chosenChar!.name);
                    } else if (skinChars!.length > 0 && skinMode && skinChars!.length > 1) { // skin to skin if more than 1 skin
                        let isNextSkin = true;
                        let prevI: number = 0;
                        for (let i = 0; i < skinChars!.length; i++) {
                            if (chosenChar!.id === skinChars![i].id) {
                                prevI = i;
                            }
                        }
                        const temp = (prevI + 1) % skinChars!.length;
                        if (temp == skinChars!.length - 1) {
                            isNextSkin = false;
                        }
                        if (prevI == skinChars!.length - 1) {
                            chosenChar = findCharByName(zzzCharDataArray, chosenCharName);
                            skinMode = false;
                        } else {
                            chosenChar = skinChars![temp];
                            skinMode = true;
                        }
                        await createCharacter(chosenChar);
                        createSkinButton(true, isNextSkin, chosenChar!.name);
                    } else if (skinChars!.length > 0 && skinMode) { // skin to normal (button to change to skin)
                        skinMode = false;
                        chosenChar = findCharByName(zzzCharDataArray, chosenCharName);
                        await createCharacter(chosenChar);
                        createSkinButton(true, true, chosenChar!.name);
                    }
                } else {
                    skinMode = false;
                    chosenChar = findCharById(zzzCharDataArray, nextId!);
                    await createCharacter(chosenChar);
                    if (skinChars!.length > 0) {
                        createSkinButton(true, true, chosenChar!.name);
                    }
                }
            } else if (firstDigit == 4 || tabMode == "WuWa") {
                tabMode = "WuWa";
                const skinChars = findAllCharsByName(wuwaSkinDataArray, chosenCharName);
                if (prevCharName == chosenCharName && prevCharId == chosenChar?.id) {
                    if (skinChars!.length > 0 && !skinMode) { // normal to skin (button is to change back to normal)
                        chosenChar = skinChars![0];
                        skinMode = true;
                        await createCharacter(chosenChar);

                        let isNextSkin = false;
                        if (skinChars!.length > 1) {
                            isNextSkin = true;
                        }
                        createSkinButton(true, isNextSkin, chosenChar!.name);
                    } else if (skinChars!.length > 0 && skinMode && skinChars!.length > 1) { // skin to skin if more than 1 skin
                        let isNextSkin = true;
                        let prevI: number = 0;
                        for (let i = 0; i < skinChars!.length; i++) {
                            if (chosenChar!.id === skinChars![i].id) {
                                prevI = i;
                            }
                        }
                        const temp = (prevI + 1) % skinChars!.length;
                        if (temp == skinChars!.length - 1) {
                            isNextSkin = false;
                        }
                        if (prevI == skinChars!.length - 1) {
                            chosenChar = findCharByName(wuwaCharDataArray, chosenCharName);
                            skinMode = false;
                        } else {
                            chosenChar = skinChars![temp];
                            skinMode = true;
                        }
                        await createCharacter(chosenChar);
                        createSkinButton(true, isNextSkin, chosenChar!.name);
                    } else if (skinChars!.length > 0 && skinMode) { // skin to normal (button to change to skin)
                        skinMode = false;
                        chosenChar = findCharByName(wuwaCharDataArray, chosenCharName);
                        await createCharacter(chosenChar);
                        createSkinButton(true, true, chosenChar!.name);
                    }
                } else {
                    skinMode = false;
                    chosenChar = findCharById(wuwaCharDataArray, nextId!);
                    await createCharacter(chosenChar);
                    if (skinChars!.length > 0) {
                        createSkinButton(true, true, chosenChar!.name);
                    }
                }
            } else if (firstDigit == 5 || tabMode == "HNA") {
                tabMode = "HNA";
                const skinChars = findAllCharsByName(hnaSkinDataArray, chosenCharName);
                if (prevCharName == chosenCharName && prevCharId == chosenChar?.id) {
                    if (skinChars!.length > 0 && !skinMode) { // normal to skin (button is to change back to normal)
                        chosenChar = skinChars![0];
                        skinMode = true;
                        await createCharacter(chosenChar);

                        let isNextSkin = false;
                        if (skinChars!.length > 1) {
                            isNextSkin = true;
                        }
                        createSkinButton(true, isNextSkin, chosenChar!.name);
                    } else if (skinChars!.length > 0 && skinMode && skinChars!.length > 1) { // skin to skin if more than 1 skin
                        let isNextSkin = true;
                        let prevI: number = 0;
                        for (let i = 0; i < skinChars!.length; i++) {
                            if (chosenChar!.id === skinChars![i].id) {
                                prevI = i;
                            }
                        }
                        const temp = (prevI + 1) % skinChars!.length;
                        if (temp == skinChars!.length - 1) {
                            isNextSkin = false;
                        }
                        if (prevI == skinChars!.length - 1) {
                            chosenChar = findCharByName(hnaSkinDataArray, chosenCharName);
                            skinMode = false;
                        } else {
                            chosenChar = skinChars![temp];
                            skinMode = true;
                        }
                        await createCharacter(chosenChar);
                        createSkinButton(true, isNextSkin, chosenChar!.name);
                    } else if (skinChars!.length > 0 && skinMode) { // skin to normal (button to change to skin)
                        skinMode = false;
                        chosenChar = findCharByName(hnaCharDataArray, chosenCharName);
                        await createCharacter(chosenChar);
                        createSkinButton(true, true, chosenChar!.name);
                    }
                } else {
                    skinMode = false;
                    chosenChar = findCharById(hnaCharDataArray, nextId!);
                    await createCharacter(chosenChar);
                    if (skinChars!.length > 0) {
                        createSkinButton(true, true, chosenChar!.name);
                    }
                }
            } else if (firstDigit == 6 || tabMode == "NTE") {
                tabMode = "NTE";
                const skinChars = findAllCharsByName(nteSkinDataArray, chosenCharName);
                if (prevCharName == chosenCharName && prevCharId == chosenChar?.id) {
                    if (skinChars!.length > 0 && !skinMode) { // normal to skin (button is to change back to normal)
                        chosenChar = skinChars![0];
                        skinMode = true;
                        await createCharacter(chosenChar);

                        let isNextSkin = false;
                        if (skinChars!.length > 1) {
                            isNextSkin = true;
                        }
                        createSkinButton(true, isNextSkin, chosenChar!.name);
                    } else if (skinChars!.length > 0 && skinMode && skinChars!.length > 1) { // skin to skin if more than 1 skin
                        let isNextSkin = true;
                        let prevI: number = 0;
                        for (let i = 0; i < skinChars!.length; i++) {
                            if (chosenChar!.id === skinChars![i].id) {
                                prevI = i;
                            }
                        }
                        const temp = (prevI + 1) % skinChars!.length;
                        if (temp == skinChars!.length - 1) {
                            isNextSkin = false;
                        }
                        if (prevI == skinChars!.length - 1) {
                            chosenChar = findCharByName(nteSkinDataArray, chosenCharName);
                            skinMode = false;
                        } else {
                            chosenChar = skinChars![temp];
                            skinMode = true;
                        }
                        await createCharacter(chosenChar);
                        createSkinButton(true, isNextSkin, chosenChar!.name);
                    } else if (skinChars!.length > 0 && skinMode) { // skin to normal (button to change to skin)
                        skinMode = false;
                        chosenChar = findCharByName(nteCharDataArray, chosenCharName);
                        await createCharacter(chosenChar);
                        createSkinButton(true, true, chosenChar!.name);
                    }
                } else {
                    skinMode = false;
                    chosenChar = findCharById(nteCharDataArray, nextId!);
                    await createCharacter(chosenChar);
                    if (skinChars!.length > 0) {
                        createSkinButton(true, true, chosenChar!.name);
                    }
                }
            } else {
                tabMode = "None";
                skinMode = false;
                chosenChar = findCharByName(
                    (tabMode === "Genshin" || firstDigit === 1) ? charDataArray :
                        (tabMode === "HSR" || firstDigit === 2) ? hsrCharDataArray :
                            (tabMode === "ZZZ" || firstDigit === 3) ? zzzCharDataArray :
                                (tabMode === "WuWa" || firstDigit === 4) ? wuwaCharDataArray :
                                    (tabMode === "HNA" || firstDigit === 5) ? hnaCharDataArray :
                                        (tabMode === "NTE" || firstDigit === 6) ? nteCharDataArray :
                                            [],
                    chosenCharName
                );
                await createCharacter(chosenChar);
            }
            resumePlayback();
        }

        function resumePlayback(): void {
            if (previousModelState.wasAnimationPlaying) {
                mmdRuntime.seekAnimation(previousModelState.previousSeekTimeFrame, true);
                previousModelState.wasAnimationPlaying = false;
                if (!mmdRuntime.isAnimationPlaying) {
                    mmdRuntime.playAnimation();
                }
            } else {
                stillCamera.target = new Vector3(0, 10 * worldScale, 1);
                stillCamera.setPosition(defCamPos);
                scene.activeCameras![0] = stillCamera;
            }
        }

        async function createCharacter(chosenChar?: BaseCharData|undefined): Promise<void> {
            engine.displayLoadingUI();
            // showLoadingScreen();
            if (skinButton != undefined) {
                skinButton.isEnabled = false;
            }
            showButton.isEnabled = false;
            promises = [];
            loadingTexts = [];
            prevCharId = chosenChar!.id;
            // ensure runtime is initialized (in case changeCharacter recreated/unregistered it)
            if (!mmdRuntime) {
                console.log("Initializing MMD runtime...");
                if (physicsModeOn) {
                    mmdRuntime = new MmdWasmRuntime(wasmInstance, scene, new MmdWasmPhysics(scene)); 
                } else {
                    mmdRuntime = new MmdRuntime(scene);
                }
                mmdRuntime.loggingEnabled = true;
                mmdRuntime.register(scene);
                mmdRuntime.setAudioPlayer(audioPlayer);
            }
            if (chosenChar && chosenChar.directory && chosenChar.pmx) {
                const isSpecialModel = ["Parayaya", "Denia", "Hiyuki"].some(name =>
                    chosenChar.name.includes(name)
                );

                const mmdModelOptions = {
                loggingEnabled: true,
                materialBuilder: materialBuilder,
                ...(isSpecialModel ? { buildSkeleton: false, buildMorph: false } : {})
                };

                promises.push(LoadAssetContainerAsync(
                    baseUrl + chosenChar.directory + "/" + chosenChar.pmx,
                    scene,
                    {
                        onProgress: (event) => updateLoadingText(2, `Loading model... ${event.loaded}/${event.total} (${Math.floor(event.loaded * 100 / event.total)}%)`),
                        pluginOptions: {
                            mmdmodel: mmdModelOptions
                        }
                    }
                )
                );
            } else {
                throw new Error("Chosen character or its properties are undefined");
            }
            if (tabMode == "WuWa" || tabMode == "NTE") {// || chosenChar.element == "Universal") {
                charScreenMode = false;
                charScreenModeButton.isVisible = false;
            } else {
                charScreenMode = true;
                charScreenModeButton.isVisible = true;
            }
            if (tabMode == "WuWa" || tabMode == "ZZZ" || tabMode == "NTE" || tabMode == "None" && (firstDigitGlobal == 4 || firstDigitGlobal == 3 || firstDigitGlobal == 6)) {
                charScreenMode = true;
                charScreenElement = "Universal";
            } else if (tabMode == "HSR" || tabMode == "HNA" || tabMode == "None" && (firstDigitGlobal == 2 || firstDigitGlobal == 5)) {
                charScreenMode = true;
                charScreenElement = "HSR";
            } else if (tabMode == "Genshin" || tabMode == "None" && (firstDigitGlobal == 1)) {
                charScreenMode = true;
                charScreenElement = chosenChar.element;
            }

            if (charScreenMode) {
                if (!isMobile) {
                    particleSystem.start();
                }
                promises.push(LoadAssetContainerAsync(
                    "res/stages/GenshinCharacterSphere" + "/" + "CharacterSphere_" + charScreenElement + "V.pmx",
                    scene,
                    {
                        onProgress: (event) => updateLoadingText(3, `Loading stage... ${event.loaded}/${event.total} (${Math.floor(event.loaded * 100 / event.total)}%)`),
                        pluginOptions: {
                            mmdmodel: {
                                loggingEnabled: true,
                                materialBuilder: materialBuilderSt,
                                buildSkeleton: false,
                                buildMorph: false,
                            }
                        }
                    }
                )
                );
            }
            loadResults = await Promise.all(promises);
            scene.onAfterRenderObservable.addOnce(() => {
                engine.hideLoadingUI();
                // hideLoadingScreen();
                setTimeout(() => {
                    if (skinButton != undefined) {
                        skinButton.isEnabled = true;
                    }
                    showButton.isEnabled = true;
                }, 1500);
            });
            // scene.activeCameras = [stillCamera, guiCam];

            if (charScreenMode) {
                const characterModelPromiseResSt = loadResults[1];
                characterModelPromiseResSt.addAllToScene();
                modelMeshSt = characterModelPromiseResSt.rootNodes[0] as MmdMesh;
                modelMeshSt.parent = mmdRoot;
            }

            theDiff = 1.85;
            theHeight = 1.85;
            boneWorldMatrixCam = new Matrix();

            characterModelPromiseRes = loadResults[0];
            characterModelPromiseRes.addAllToScene();
            modelMesh = characterModelPromiseRes.rootNodes[0] as MmdMesh;
            modelMesh.parent = mmdRoot;

            shadowGenerator.addShadowCaster(modelMesh);
            for (const mesh of modelMesh.metadata.meshes) mesh.receiveShadows = true;

            try {
                mmdModel = mmdRuntime.createMmdModel(modelMesh);
            } catch (error) {
                console.error("Failed to create MMD model:", error);
            }

            headBone = mmdModel.runtimeBones.find((bone: any) => bone.name === "頭");
            bodyBone = mmdModel.runtimeBones.find((bone: any) => bone.name === "センター");
            boneWorldMatrix = new Matrix();

            if (headBone != undefined && bodyBone != undefined) {
                if (theCharAnimation) {
                    if (physicsModeOn) {
                        theCharAnimation = new MmdWasmAnimation(theCharAnimation as any, wasmInstance, scene);
                    }
                    try {
                        const modelAnimationHandle = mmdModel.createRuntimeAnimation(theCharAnimation as any);
                        mmdModel.setRuntimeAnimation(modelAnimationHandle);
                    }
                    catch (error) {
                        console.error("Failed to create or set MMD animation:", error);
                    }
                }
                scene.onBeforeDrawPhaseObservable.addOnce(() => {
                    headBone!.getWorldMatrixToRef(boneWorldMatrixCam).multiplyToRef(modelMesh.getWorldMatrix(), boneWorldMatrixCam);
                    boneWorldMatrixCam.getTranslationToRef(mmdCameraRoot.position);
                    mmdCameraRoot.position.z = 10;
                    mmdCameraRoot.position.x = 0;
                    theDiff = theDiff - mmdCameraRoot.position.y/10;
                    theHeight = mmdCameraRoot.position.y/10;
                });

                scene.onBeforeRenderObservable.addOnce(() => {
                    bodyBone!.getWorldMatrixToRef(boneWorldMatrix).multiplyToRef(modelMesh.getWorldMatrix(), boneWorldMatrix);
                    boneWorldMatrix.getTranslationToRef(directionalLight.position);
                    directionalLight.position.y -= 10 * worldScale;
                });
            }

            // if (loadResults[0]) {
            //     const cameraAnimationHandle = mmdCamera.createRuntimeAnimation(loadResults[0] as any);
            //     mmdCamera.setRuntimeAnimation(cameraAnimationHandle);
            // }
            // attempt to register camera with runtime if available
            // if (typeof (mmdRuntime as any).setCamera === "function") {
            //     try { (mmdRuntime as any).setCamera(mmdCamera); } catch { /* ignore */ }
            // }
            mmdCamera.setRuntimeAnimation(cameraAnimationHandle);
            mmdRuntime.addAnimatable(mmdCamera);

            scene.onAfterRenderObservable.addOnce(() => {
                scene.freezeMaterials();

                const meshes = scene.meshes;
                for (let i = 0, len = meshes.length; i < len; ++i) {
                    const mesh = meshes[i];
                    mesh.freezeWorldMatrix();
                    mesh.doNotSyncBoundingInfo = true;
                    mesh.isPickable = false;
                    mesh.doNotSyncBoundingInfo = true;
                    mesh.alwaysSelectAsActiveMesh = true;
                }
                scene.skipPointerMovePicking = true;
                scene.skipPointerDownPicking = true;
                scene.skipPointerUpPicking = true;
                scene.skipFrustumClipping = true;
                scene.blockMaterialDirtyMechanism = true;
                // audioPlayer.mute();
                if (!isLocal) {

                    try {
                        // Call without awaiting
                        void firebase.countUp("phoshco", chosenChar.name.replace(/\./g, "")).catch((error) => {
                            console.error("Failed count: ", error);
                        });
                    } catch (error) {
                        console.error("Unexpected error during count: ", error);
                    }
                }
            });
        }

        // for scaling camera to model height
        {
            mmdCamera.parent = mmdCameraRoot;
            scene.onBeforeAnimationsObservable.add(() => {
                cameraPos = mmdCamera.position.y/10;
                if (cameraPos < theHeight && 0 < cameraPos) {
                    mmdCameraRoot.position = new Vector3(mmdCameraRoot.position.x, 10 * (0 - theDiff * (cameraPos / theHeight)), -1);
                } else if (cameraPos <= 0) {
                    mmdCameraRoot.position = new Vector3(mmdCameraRoot.position.x, 0, -1);
                } else {
                    mmdCameraRoot.position = new Vector3(mmdCameraRoot.position.x, 10 * (0 - theDiff), -1);
                }
                debugblock.text = `${cameraPos}\n${mmdCameraRoot.position.y}\n${theHeight}\n${theDiff}`;
            });
        }

        const rotationMatrix = new Matrix();
        const cameraNormal = new Vector3();
        let cameraEyePosition = new Vector3();
        const headRelativePosition = new Vector3();

        scene.onBeforeRenderObservable.add(() => {
            // const cameraRotation = mmdCamera.rotation;
            // Matrix.RotationYawPitchRollToRef(-cameraRotation.y, -cameraRotation.x, -cameraRotation.z, rotationMatrix);

            Vector3.TransformNormalFromFloatsToRef(0, 0, 1, rotationMatrix, cameraNormal);

            cameraEyePosition = mmdCamera.position.addToRef(
                Vector3.TransformCoordinatesFromFloatsToRef(0, 0, mmdCamera.distance, rotationMatrix, cameraEyePosition),
                cameraEyePosition
            );

            if (headBone != undefined && bodyBone != undefined) {
                headBone!.getWorldMatrixToRef(boneWorldMatrixCam).getTranslationToRef(headRelativePosition).subtractToRef(cameraEyePosition, headRelativePosition);
            }

            // defaultPipeline.depthOfField.focusDistance = (Vector3.Dot(headRelativePosition, cameraNormal) / Vector3.Dot(cameraNormal, cameraNormal)) * 1000;
        });

        // switch camera when double click
        let lastClickTime = -Infinity;
        canvas.onclick = (): void => {
            if (isMouseInPanel) {
                return;
            }
            const currentTime = performance.now();
            if (300 < currentTime - lastClickTime) {
                lastClickTime = currentTime;
                return;
            }
            lastClickTime = -Infinity;

            if (scene.activeCameras![0] === mmdCamera) {
                defaultPipeline.depthOfFieldEnabled = false;
                camera.setTarget(new Vector3(0, 10 * worldScale, 0));
                camera.setPosition(defCamPos);
                scene.activeCameras![0] = camera;
            } else {
                defaultPipeline.depthOfFieldEnabled = false; //true
                scene.activeCameras![0] = mmdCamera;
            }
            textblock.text = `${scene.activeCameras![0].name}`;
        };

        // pause animation using spacebar
        function handleKeyDown(e: KeyboardEvent): void {
            if (e.code === "Space" && !charPanel.isVisible) {
                e.preventDefault();
                if (scene.activeCameras![0] === stillCamera) {
                    defaultPipeline.depthOfFieldEnabled = false; //true
                    if (!mmdRuntime.isAnimationPlaying) {
                        scene.activeCameras![0] = mmdCamera;
                    }
                    textblock.text = `${scene.activeCameras![0].name}`;
                }
                if (mmdRuntime.isAnimationPlaying) {
                    mmdRuntime.pauseAnimation();
                } else {
                    mmdRuntime.playAnimation();
                }
            }
        }
        document.body.addEventListener("keydown", handleKeyDown);

        function handlePointerDown(evt: IPointerEvent): void {
            scenePointerDownCharPanel();
            onPointerDownSroll(evt);
        }
        scene.onPointerDown = handlePointerDown;

        function handlePointerUp(evt: IPointerEvent): void {
            scenePointerUpCharPanel();
            evt;
            onPointerUpScroll();
        }
        scene.onPointerUp = handlePointerUp;

        function handlePointerMove(evt: IPointerEvent): void {
            onPointerMoveScroll(evt);
        }
        scene.onPointerMove = handlePointerMove;

        if (firstTabMode == "Genshin") {
            const skinChars = findAllCharsByName(genshinSkinDataArray, chosenCharName);
            if (skinChars!.length > 0) { // normal to skin (button is to change back to normal)
                const chosenCharSk = skinChars![0];
                skinMode = false;
                createSkinButton(true, true, chosenCharSk!.name);
            }
        } else if (firstTabMode == "HSR") {
            handleHSRTabSwitch();
            const skinChars = findAllCharsByName(hsrSkinDataArray, chosenCharName);
            if (skinChars!.length > 0) { // normal to skin (button is to change back to normal)
                const chosenCharSk = skinChars![0];
                skinMode = false;
                createSkinButton(true, true, chosenCharSk!.name);
            }
        } else if (firstTabMode == "ZZZ") {
            handleZZZTabSwitch();
            const skinChars = findAllCharsByName(zzzSkinDataArray, chosenCharName);
            if (skinChars!.length > 0) { // normal to skin (button is to change back to normal)
                const chosenCharSk = skinChars![0];
                skinMode = false;
                createSkinButton(true, true, chosenCharSk!.name);
            }
        } else if (firstTabMode == "WuWa") {
            handleWuwaTabSwitch();
            const skinChars = findAllCharsByName(wuwaSkinDataArray, chosenCharName);
            if (skinChars!.length > 0) { // normal to skin (button is to change back to normal)
                const chosenCharSk = skinChars![0];
                skinMode = false;
                createSkinButton(true, true, chosenCharSk!.name);
            }
        } else if (firstTabMode == "HNA") {
            handleHNATabSwitch();
            const skinChars = findAllCharsByName(hnaSkinDataArray, chosenCharName);
            if (skinChars!.length > 0) { // normal to skin (button is to change back to normal)
                const chosenCharSk = skinChars![0];
                skinMode = false;
                createSkinButton(true, true, chosenCharSk!.name);
            }
        } else if (firstTabMode == "NTE") {
            handleNTETabSwitch();
            const skinChars = findAllCharsByName(nteSkinDataArray, chosenCharName);
            if (skinChars!.length > 0) { // normal to skin (button is to change back to normal)
                const chosenCharSk = skinChars![0];
                skinMode = false;
                createSkinButton(true, true, chosenCharSk!.name);
            }
        }

        // if you want to use inspector, uncomment following line.
        // Inspector.Show(scene, { });

        return scene;
    }
}
