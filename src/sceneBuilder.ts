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
import { loadAssetContainerAsync } from "@babylonjs/core/Loading/sceneLoader";
import { ImageProcessingConfiguration } from "@babylonjs/core/Materials/imageProcessingConfiguration";
import { Material } from "@babylonjs/core/Materials/material";
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
import * as gui from "@babylonjs/gui";
// import { Inspector } from "@babylonjs/inspector";
import { ShadowOnlyMaterial } from "@babylonjs/materials/shadowOnly/shadowOnlyMaterial";
import type { MmdAnimation } from "babylon-mmd/esm/Loader/Animation/mmdAnimation";
// import type { MmdModelLoader } from "babylon-mmd/esm/Loader/mmdModelLoader";
import type { MmdStandardMaterial } from "babylon-mmd/esm/Loader/mmdStandardMaterial";
import { MmdStandardMaterialBuilder, MmdStandardMaterialRenderMethod } from "babylon-mmd/esm/Loader/mmdStandardMaterialBuilder";
// import type { BpmxLoader } from "babylon-mmd/esm/Loader/Optimized/bpmxLoader";
import { BvmdLoader } from "babylon-mmd/esm/Loader/Optimized/bvmdLoader";
import { registerDxBmpTextureLoader } from "babylon-mmd/esm/Loader/registerDxBmpTextureLoader";
import { SdefInjector } from "babylon-mmd/esm/Loader/sdefInjector";
// import { VmdLoader } from "babylon-mmd/esm/Loader/vmdLoader";
import { StreamAudioPlayer } from "babylon-mmd/esm/Runtime/Audio/streamAudioPlayer";
import { MmdCamera } from "babylon-mmd/esm/Runtime/mmdCamera";
import type { MmdMesh } from "babylon-mmd/esm/Runtime/mmdMesh";
import { MmdRuntime } from "babylon-mmd/esm/Runtime/mmdRuntime";
// import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin";
// import havokPhysics from "@babylonjs/havok";
// import type { MmdWasmInstance } from "babylon-mmd";
// import { getMmdWasmInstance } from "babylon-mmd";
// import { MmdWasmAnimation, MmdWasmInstanceTypeSPR, MmdWasmPhysics, MmdWasmRuntime } from "babylon-mmd";
// import ammoPhysics from "babylon-mmd/esm/Runtime/Physics/External/ammo.wasm";
// import ammo from "babylon-mmd/esm/Runtime/Physics/External/ammo.wasm";
// import { MmdAmmoJSPlugin } from "babylon-mmd/esm/Runtime/Physics/mmdAmmoJSPlugin";
// import { MmdAmmoPhysics } from "babylon-mmd/esm/Runtime/Physics/mmdAmmoPhysics";
// import { MmdPhysics } from "babylon-mmd/esm/Runtime/Physics/mmdPhysics";
// import {CounterAPI} from "counterapi";
import miniSearch from "minisearch";

import extraCharDatas from "../res/assets/extras.json";
import genshinCharDatas from "../res/assets/Genshin/genshin.json";
import genshinSkinCharDatas from "../res/assets/Genshin/skins.json";
import hsrCharDatas from "../res/assets/HSR/hsr.json";
import hsrSkinCharDatas from "../res/assets/HSR/skins.json";
import wuwaSkinCharDatas from "../res/assets/WuWa/skins.json";
import wuwaCharDatas from "../res/assets/WuWa/wuwa.json";
import zzzSkinCharDatas from "../res/assets/ZZZ/skins.json";
import zzzCharDatas from "../res/assets/ZZZ/zzz.json";
import motionConfig from "../res/cam_motion/motion.json";
import type { ISceneBuilder } from "./baseRuntime";
import { CustomLoadingScreen } from "./CustomLoadingScreen";
import { FirebaseInstance } from "./fb";
// import { MmdPlayerControl } from "babylon-mmd/esm/Runtime/Util/mmdPlayerControl";
import { mobileMmdPlayerControl } from "./mobileMmdPlayerControl";

export class SceneBuilder implements ISceneBuilder {
    public async build(canvas: HTMLCanvasElement, engine: AbstractEngine, item: string): Promise<Scene> {
        // for apply SDEF on shadow, outline, depth rendering
        SdefInjector.OverrideEngineCreateEffect(engine);
        const isLocal = window.location.hostname.includes("localhost");
        const firebase = FirebaseInstance.GetInstance();

        // character json
        interface BaseCharData {
            "id": number;
            "name": string;
            "weaponType": string;
            "element": string;
            "gender": string;
            "rarity": number;
            "directory": string;
            "image": string;
            "pmx": string;
        }

        interface GenshinCharData extends BaseCharData {
            "region": string;
        }

        interface HSRCharData extends BaseCharData {
        }

        interface ZZZCharData extends BaseCharData {
            "region": string;
        }

        interface WuwaCharData extends BaseCharData {
        }

        interface ExtraCharData extends BaseCharData {
        }

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
        charDataArray.sort((a, b) => b.id - a.id);
        genshinSkinDataArray.sort((a, b) => b.id - a.id);
        hsrSkinDataArray.sort((a, b) => b.id - a.id);
        zzzSkinDataArray.sort((a, b) => b.id - a.id);
        wuwaSkinDataArray.sort((a, b) => b.id - a.id);
        hsrCharDataArray.sort((a, b) => b.id - a.id);
        zzzCharDataArray.sort((a, b) => b.id - a.id);
        wuwaCharDataArray.sort((a, b) => b.id - a.id);

        const findCharByName = <T extends { name: string }>(jsonData: T[], nameToFind: string): T | undefined => {
            return jsonData.find((item) => item.name === nameToFind);
        };

        type AllCharData = GenshinCharData | HSRCharData | ZZZCharData | WuwaCharData;
        const allCharDataArray: AllCharData[] = [
            ...charDataArray,
            ...hsrCharDataArray,
            ...zzzCharDataArray,
            ...wuwaCharDataArray
        ];
        const allSkinCharDataArray:  AllCharData[] = [
            ...genshinSkinDataArray,
            ...hsrSkinDataArray,
            ...zzzSkinDataArray,
            ...wuwaSkinDataArray
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

        const normalize = (str: string): string =>
            str.toLowerCase().replace(/[^a-z]/g, "");

        const getFirstDigit = (num: number): number => {
            const str = Math.abs(num).toString(); // Convert to string and handle negative numbers
            return parseInt(str[0], 10); // Extract the first digit and convert to a number
        };

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
                } else {
                    fallbackItem = findCharByName(wuwaCharDataArray, results[0].name);
                    tabMode = "WuWa";
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
                } else {
                    fallbackItem.push(findCharByName(wuwaCharDataArray, results[i].name)!);
                }
            }
            // console.log(fallbackItem);
            return fallbackItem;
        };

        const findCharById = <T extends { id: number }>(jsonData: T[], idToFind: number): T | undefined => {
            return jsonData.find((item) => item.id === idToFind);
        };

        const findAllCharsByName = <T extends { name: string }>(jsonData: T[], nameToFind: string): T[] | undefined => {
            return sortBy(jsonData.filter((item) => item.name === nameToFind), "name", false);
        };

        function filterBy<T>(
            dataArray: T[],
            filters: { key: keyof T; value: string }[]
        ): T[] {
            return dataArray.filter((data) =>
                filters.every((filter) => {
                    const propertyValue = String(data[filter.key]);
                    return propertyValue.includes(filter.value);
                })
            );
        }

        function sortBy<T>(
            dataArray: T[],
            sortByKey: keyof T,
            sortAscending: boolean = true
        ): T[] {
            return dataArray.slice().sort((a, b) => {
                const valueA = a[sortByKey];
                const valueB = b[sortByKey];

                if (typeof valueA === "number" && typeof valueB === "number") {
                    // Numerical comparison
                    return sortAscending ? valueA - valueB : valueB - valueA;
                } else {
                    // String comparison (converts values to strings if not already)
                    const strA = String(valueA);
                    const strB = String(valueB);
                    return sortAscending ? strB.localeCompare(strA) : strA.localeCompare(strB);
                }
            });
        }

        const isMobile: boolean = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        ///////////////
        registerDxBmpTextureLoader();
        const materialBuilder = new MmdStandardMaterialBuilder();
        materialBuilder.renderMethod = MmdStandardMaterialRenderMethod.DepthWriteAlphaBlending;
        materialBuilder.afterBuildSingleMaterial = (material: MmdStandardMaterial): void => {
            material.forceDepthWrite = true;
            const diffuseTexture = material.diffuseTexture;
            if (diffuseTexture) {
                diffuseTexture.hasAlpha = true;
                material.useAlphaFromDiffuseTexture = true;
            }
            if (material.transparencyMode === Material.MATERIAL_ALPHABLEND) {
                material.transparencyMode = Material.MATERIAL_ALPHATESTANDBLEND;
                material.alphaCutOff = 0.01;
            }
        };

        const materialBuilderSt = new MmdStandardMaterialBuilder();
        materialBuilderSt.renderMethod = MmdStandardMaterialRenderMethod.DepthWriteAlphaBlending;
        materialBuilderSt.afterBuildSingleMaterial = (material: MmdStandardMaterial): void => {
            material.forceDepthWrite = true;
            const diffuseTexture = material.diffuseTexture;
            material.specularColor = Color3.Black();
            if (diffuseTexture) {
                diffuseTexture.hasAlpha = true;
                material.useAlphaFromDiffuseTexture = true;
            }
            if (material.transparencyMode === Material.MATERIAL_ALPHABLEND) {
                material.transparencyMode = Material.MATERIAL_ALPHATESTANDBLEND;
                material.alphaCutOff = 0.01;
            }
        };

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

        const advancedTexture = gui.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        advancedTexture.layer!.layerMask = 0x10000000;
        advancedTexture.idealWidth = 1000;
        advancedTexture.idealHeight = 1000;
        advancedTexture.useSmallestIdeal = true;

        // scaling for WebXR
        const worldScale = 0.09;

        const mmdRoot = new TransformNode("mmdRoot", scene);
        mmdRoot.scaling.scaleInPlace(worldScale);
        mmdRoot.position.z = 1;

        const mmdCameraRoot = new TransformNode("mmdRoot", scene);
        mmdCameraRoot.scaling.scaleInPlace(worldScale);
        mmdCameraRoot.position.z = 1;

        // mmd camera for play mmd camera animation
        const mmdCamera = new MmdCamera("mmdCamera", new Vector3(0, 10, 0), scene);
        mmdCamera.maxZ = 5000;
        mmdCamera.minZ = 0.1;
        mmdCamera.parent = mmdRoot;
        mmdCamera.layerMask = 1;

        const defCamPos = new Vector3(0, 10, -20).scaleInPlace(worldScale);
        const camera = new ArcRotateCamera("arcRotateCamera", 0, 0, 25 * worldScale, new Vector3(0, 10 * worldScale, 1), scene);
        camera.maxZ = 100;
        camera.minZ = 0.1;
        camera.setPosition(defCamPos);
        camera.attachControl(canvas, false);
        camera.inertia = 0.8;
        camera.speed = 4 * worldScale;
        camera.zoomToMouseLocation = true;
        camera.wheelDeltaPercentage = 0.1;
        camera.upperRadiusLimit = 100 * worldScale;
        camera.lowerRadiusLimit = 1 * worldScale;
        if (isMobile) {
            camera.pinchDeltaPercentage = 0.002;
        }
        camera.layerMask = 1;

        const stillCamera = new ArcRotateCamera("stillCamera", 0, 0, 25 * worldScale, new Vector3(0, 10 * worldScale, 1), scene);
        stillCamera.maxZ = 100;
        stillCamera.minZ = 0.1;
        stillCamera.setPosition(defCamPos);
        stillCamera.attachControl(canvas, false);
        stillCamera.inertia = 0.8;
        stillCamera.speed = 4 * worldScale;
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

        // create mmd runtime with physics
        let mmdRuntime: MmdRuntime;// | MmdWasmRuntime;
        // let wasmInstance: MmdWasmInstance;
        // const physicsModeOn = false;

        // if (!physicsModeOn) {
        mmdRuntime = new MmdRuntime(scene);
        // } else {
        //     mmdRuntime = new MmdRuntime(scene, new MmdPhysics(scene));
        // }
        //mmdRuntime = new MmdRuntime(scene);
        mmdRuntime.loggingEnabled = true;
        mmdRuntime.register(scene);

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
        mmdRuntime.setAudioPlayer(audioPlayer);

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

        // camera motion
        promises.push(bvmdLoader.loadAsync("motion", camMotionFile,
            (event) => updateLoadingText(0, `Loading camera... ${event.loaded}/${event.total} (${Math.floor(event.loaded * 100 / event.total)}%)`))
        );

        // model motion
        promises.push(bvmdLoader.loadAsync("motion", modelMotionFile,
            (event) => updateLoadingText(1, `Loading motion... ${event.loaded}/${event.total} (${Math.floor(event.loaded * 100 / event.total)}%)`))
        );

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
        // if (firstTabMode == "ZZZ") {
        //     charScreenMode = false;
        // }
        if (firstTabMode == "HSR") {
            charScreenElement = "HSR";
        } else if (firstTabMode != "Genshin") {
            charScreenElement = "Universal";
        }

        if (chosenChar && chosenChar.directory && chosenChar.pmx) {
            promises.push(loadAssetContainerAsync(
                chosenChar.directory + "/" + chosenChar.pmx,
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
            promises.push(loadAssetContainerAsync(
                "res/stages/GenshinCharacterSphere" + "/" + "CharacterSphere_" + charScreenElement + "V.pmx",
                scene,
                {
                    onProgress: (event) => updateLoadingText(4, `Loading stage... ${event.loaded}/${event.total} (${Math.floor(event.loaded * 100 / event.total)}%)`),
                    pluginOptions: {
                        mmdmodel: {
                            loggingEnabled: true,
                            materialBuilder: materialBuilderSt
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

        let theDiff = 1.66;
        let theHeight = 69;
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
        let theCharAnimation = loadResults[1] as MmdAnimation;

        // for scaling camera to model height
        let headBone = mmdModel.runtimeBones.find((bone: any) => bone.name === "頭");

        // make sure directional light follow the model
        let bodyBone = mmdModel.runtimeBones.find((bone) => bone.name === "センター");
        let boneWorldMatrix = new Matrix();

        if (headBone != undefined && bodyBone != undefined) {
            mmdModel.addAnimation(theCharAnimation);
            mmdModel.setAnimation("motion");
            scene.onBeforeDrawPhaseObservable.addOnce(() => {
                headBone!.getWorldMatrixToRef(boneWorldMatrixCam).multiplyToRef(modelMesh.getWorldMatrix(), boneWorldMatrixCam);
                boneWorldMatrixCam.getTranslationToRef(mmdCameraRoot.position);
                // boneWorldMatrixCam.getTranslationToRef(mmdCameraRoot.position);
                theDiff = theDiff - mmdCameraRoot.position.y;
                theHeight = mmdCameraRoot.position.y;
            });

            scene.onBeforeRenderObservable.addOnce(() => {
                bodyBone!.getWorldMatrixToRef(boneWorldMatrix).multiplyToRef(modelMesh.getWorldMatrix(), boneWorldMatrix);
                // bodyBone!.getFinalMatrix()!.multiplyToRef(modelMesh.getWorldMatrix(), boneWorldMatrix);
                boneWorldMatrix.getTranslationToRef(directionalLight.position);
                directionalLight.position.y -= 10 * worldScale;
            });
        }

        mmdCamera.addAnimation(loadResults[0]);
        mmdCamera.storeState();
        mmdRuntime.setCamera(mmdCamera);
        mmdCamera.setAnimation("motion");

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

        const debugblock = new gui.TextBlock();
        debugblock.widthInPixels = 100;
        debugblock.heightInPixels = 50;
        debugblock.left = 0;
        debugblock.text = "lol"; // `${mmdCameraRoot.position.y}`;
        debugblock.fontSize = 16;
        debugblock.textHorizontalAlignment = gui.Control.HORIZONTAL_ALIGNMENT_LEFT;
        debugblock.horizontalAlignment = gui.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        debugblock.verticalAlignment = gui.Control.VERTICAL_ALIGNMENT_BOTTOM;
        debugblock.color = "black";
        advancedTexture.addControl(debugblock);
        debugblock.isVisible = false;

        const textblock = new gui.TextBlock();
        textblock.widthInPixels = 100;
        textblock.heightInPixels = 50;
        textblock.left = 0;
        textblock.text = `${scene.activeCameras[0].name}`;
        textblock.fontSize = 16;
        textblock.textHorizontalAlignment = gui.Control.HORIZONTAL_ALIGNMENT_LEFT;
        textblock.horizontalAlignment = gui.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        textblock.verticalAlignment = gui.Control.VERTICAL_ALIGNMENT_TOP;
        textblock.color = "black";
        advancedTexture.addControl(textblock);
        textblock.isVisible = false;

        const disclaimerText = new gui.TextBlock();
        disclaimerText.resizeToFit = true;
        disclaimerText.top = 0;
        disclaimerText.left = 0;
        disclaimerText.paddingTop = 10;
        disclaimerText.paddingRight = 10;
        disclaimerText.text = "Double click / tap to change camera mode.";
        disclaimerText.fontSize = isMobile ? 25 : 16;
        disclaimerText.textHorizontalAlignment = gui.Control.HORIZONTAL_ALIGNMENT_CENTER;
        disclaimerText.horizontalAlignment = gui.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        disclaimerText.verticalAlignment = gui.Control.VERTICAL_ALIGNMENT_TOP;
        disclaimerText.color = "grey";
        advancedTexture.addControl(disclaimerText);
        disclaimerText.isVisible = true;

        const iconWidthHeight = isMobile ? "100px" : "50px";

        const showButton = gui.Button.CreateImageOnlyButton("but", "res/assets/menu.png");
        showButton.horizontalAlignment = gui.Control.HORIZONTAL_ALIGNMENT_LEFT;
        showButton.left = "10px";
        showButton.verticalAlignment = gui.Control.VERTICAL_ALIGNMENT_TOP;
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

        let skinButton: gui.Button;
        function createSkinButton(visibility: boolean = false, nextSkinMode?: boolean, name?: string): void {
            if (skinButton != undefined) {
                skinButton.dispose();
            }
            skinButton = new gui.Button();
            skinButton = gui.Button.CreateImageOnlyButton("but", "res/assets/alter.png");
            if (bg_bool) {
                skinButton.image!.source = "res/assets/alter_light.png";
            }
            skinButton.horizontalAlignment = gui.Control.HORIZONTAL_ALIGNMENT_LEFT;
            skinButton.left = isMobile ? "110px" : "60px";
            skinButton.verticalAlignment = gui.Control.VERTICAL_ALIGNMENT_TOP;
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

        const darkButton = gui.Button.CreateImageOnlyButton("but", "res/assets/dark_mode.png");
        if (bg_bool) {
            darkButton.image!.source = "res/assets/light_mode.png";
        }
        darkButton.horizontalAlignment = gui.Control.HORIZONTAL_ALIGNMENT_LEFT;
        darkButton.left = isMobile ? "110px" : "60px";
        darkButton.verticalAlignment = gui.Control.VERTICAL_ALIGNMENT_TOP;
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
                if (skinButton != undefined) {
                    skinButton.image!.source = "res/assets/alter.png";
                }
                charNameText.color = "black";
            } else {
                layer.texture = dark_bg;
                darkButton.image!.source = "res/assets/light_mode.png";
                motionButton.image!.source = "res/assets/note_light.png";
                if (skinButton != undefined) {
                    skinButton.image!.source = "res/assets/alter_light.png";
                }
                charNameText.color = "white";
            }
            layer.render;
            bg_bool = !bg_bool;
        }
        darkButton.onPointerClickObservable.add(changeDarkMode);

        const charScreenModeButton = gui.Button.CreateImageOnlyButton("but", "res/assets/paimon.png");
        charScreenModeButton.horizontalAlignment = gui.Control.HORIZONTAL_ALIGNMENT_LEFT;
        charScreenModeButton.left = "10px";
        charScreenModeButton.verticalAlignment = gui.Control.VERTICAL_ALIGNMENT_TOP;
        charScreenModeButton.top = isMobile ? "110px" : "60px";
        charScreenModeButton.width = iconWidthHeight;
        charScreenModeButton.height = iconWidthHeight;
        charScreenModeButton.thickness = 0;
        advancedTexture.addControl(charScreenModeButton);
        if (firstTabMode == "WuWa") {
            charScreenModeButton.isVisible = false;
        }
        charScreenModeButton.onPointerClickObservable.add(function() {
            if (charScreenMode) {
                modelMeshSt.setEnabled(false);
                if (!isMobile) {
                    particleSystem.stop();
                }
                darkButton.isEnabled = true;
            } else if ((tabMode == "Genshin" || tabMode == "HSR" || tabMode == "ZZZ") && !charScreenMode) {
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

        const motionButton = gui.Button.CreateImageOnlyButton("but", "res/assets/note.png");
        motionButton.horizontalAlignment = gui.Control.HORIZONTAL_ALIGNMENT_LEFT;
        motionButton.left = "10px";
        motionButton.verticalAlignment = gui.Control.VERTICAL_ALIGNMENT_TOP;
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

        const charNameText = new gui.TextBlock();
        // charNameText.widthInPixels = 100;
        charNameText.heightInPixels = isMobile ? 100 : 50;
        charNameText.left = isMobile ? "220px" : "120px";
        charNameText.top = "10px";
        charNameText.text = chosenCharName;
        charNameText.fontSize = isMobile ? 40 : 20;
        charNameText.textHorizontalAlignment = gui.Control.HORIZONTAL_ALIGNMENT_LEFT;
        charNameText.horizontalAlignment = gui.Control.HORIZONTAL_ALIGNMENT_LEFT;
        charNameText.verticalAlignment = gui.Control.VERTICAL_ALIGNMENT_TOP;
        if (bg_bool) {
            charNameText.color = "white";
        } else {
            charNameText.color = "black";
        }
        advancedTexture.addControl(charNameText);
        charNameText.isVisible = true;

        let isMouseInPanel = false;
        const charPanel = new gui.Rectangle("charPanel");
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

        const containStack = new gui.Rectangle();
        containStack.width = "700px";
        containStack.height = "900px";
        containStack.thickness = 0;
        containStack.cornerRadius = 15;
        containStack.background = charPanel.background;
        charPanel.addControl(containStack);

        const panel = new gui.StackPanel();
        panel.width = "700px";
        panel.height = "900px";
        containStack.addControl(panel);

        const topBar = new gui.Rectangle();
        topBar.width = "700px";
        topBar.height = "150px";
        topBar.thickness = 0;
        panel.addControl(topBar);

        const genshinButton = gui.Button.CreateSimpleButton("but", "Genshin Impact");
        genshinButton.width = "233px";
        genshinButton.height = "50px";
        genshinButton.color = "white";
        genshinButton.background = "rgb(64,68,70)";
        genshinButton.disabledColor = charPanel.background;
        genshinButton.thickness = 0;
        genshinButton.left = -233;
        genshinButton.top = -50;
        genshinButton.cornerRadiusX = genshinButton.cornerRadiusY = 15;
        topBar.addControl(genshinButton);

        const hsrButton = gui.Button.CreateSimpleButton("but", "Honkai: Star Rail");
        hsrButton.width = "233px";
        hsrButton.height = "50px";
        hsrButton.color = "white";
        hsrButton.background = charPanel.background;
        hsrButton.disabledColor = charPanel.background;
        hsrButton.thickness = 0;
        hsrButton.left = 0;
        hsrButton.top = -50;
        hsrButton.cornerRadiusX = hsrButton.cornerRadiusY = 15;
        topBar.addControl(hsrButton);

        const zzzButton = gui.Button.CreateSimpleButton("but", "Zenless Zone Zero");
        zzzButton.width = "233px";
        zzzButton.height = "50px";
        zzzButton.color = "white";
        zzzButton.background = charPanel.background;
        zzzButton.disabledColor = charPanel.background;
        zzzButton.thickness = 0;
        zzzButton.left = 233;
        zzzButton.top = -50;
        zzzButton.cornerRadiusX = zzzButton.cornerRadiusY = 15;
        topBar.addControl(zzzButton);

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
        let filteredArray: BaseCharData[];
        filteredArray = filterBy(charDataArray, genshinFilter);
        sortModeKey = "id";

        function handleGenshinTabSwitch(): void {
            if (tabMode != "Genshin") {
                genshinButton.background = "rgb(64,68,70)";
                if (tabMode == "HSR") {
                    hsrButton.background = charPanel.background;
                    hideHSRElements();
                } else if (tabMode == "ZZZ") {
                    zzzButton.background = charPanel.background;
                    hideZZZElements();
                } else {
                    hideWuwaElements();
                }
                tabMode = "Genshin";
                filteredArray = filterBy(charDataArray, genshinFilter);
                filteredArray = sortBy(filteredArray, sortModeKey, sortModeAscending);
                showGenshinElements();
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
                    hideGenshinElements();
                } else if (tabMode == "ZZZ") {
                    zzzButton.background = charPanel.background;
                    hideZZZElements();
                } else {
                    hideWuwaElements();
                }
                tabMode = "HSR";
                if (sortModeKey == "id") {
                    hsrSortModeChanger.image!.source = "res/assets/release.png";
                } else if (sortModeKey == "name") {
                    hsrSortModeChanger.image!.source = "res/assets/alphabet.png";
                }
                filteredArray = filterBy(hsrCharDataArray, hsrFilter);
                filteredArray = sortBy(filteredArray, sortModeKey, sortModeAscending);
                showAllHSRElements();
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
                    hideGenshinElements();
                } else if (tabMode == "HSR") {
                    hideHSRElements();
                    hsrButton.background = charPanel.background;
                } else {
                    hideWuwaElements();
                }
                tabMode = "ZZZ";
                filteredArray = filterBy(zzzCharDataArray, zzzFilter);
                filteredArray = sortBy(filteredArray, sortModeKey, sortModeAscending);
                showAllZZZElements();
                generateGrid(filteredArray);
            }
        }
        zzzButton.onPointerClickObservable.add(function() {
            handleZZZTabSwitch();
        });

        const filterBar = new gui.Rectangle();
        filterBar.width = "700px";
        filterBar.height = "50px";
        filterBar.thickness = 0;
        filterBar.top = 0;
        filterBar.background = "rgb(64,68,70)";
        topBar.addControl(filterBar);

        const filterBar2 = new gui.Rectangle();
        filterBar2.width = "700px";
        filterBar2.height = "50px";
        filterBar2.thickness = 0;
        filterBar2.top = 50;
        filterBar2.background = "rgb(64,68,70)";
        filterBar2.cornerRadiusW = filterBar2.cornerRadiusZ = 15;
        topBar.addControl(filterBar2);

        const hoverCharName = new gui.TextBlock();
        hoverCharName.width = "150px";
        hoverCharName.height = "40px";
        hoverCharName.color = "white";
        hoverCharName.left = -48;
        hoverCharName.text = "";
        hoverCharName.textHorizontalAlignment = gui.Control.HORIZONTAL_ALIGNMENT_LEFT;
        // hoverCharName.horizontalAlignment = gui.Control.HORIZONTAL_ALIGNMENT_LEFT;
        filterBar.addControl(hoverCharName);

        const searchBar = new gui.Rectangle();
        searchBar.width = "300px";
        searchBar.height = "40px";
        searchBar.background = charPanel.background;
        searchBar.cornerRadius = 15;
        searchBar.left = -190;
        searchBar.thickness = 0;
        filterBar2.addControl(searchBar);

        const searchImage = gui.Button.CreateImageOnlyButton("but", "res/assets/search.png");
        searchImage.height = "40px";
        searchImage.width = "40px";
        searchImage.left = -130;
        searchImage.thickness = 0;
        searchImage.cornerRadius = 5;
        searchBar.addControl(searchImage);

        function handleWuwaTabSwitch(): void {
            if (tabMode != "WuWa") {
                if (tabMode == "Genshin") {
                    genshinButton.background = charPanel.background;
                    hideGenshinElements();
                } else if (tabMode == "HSR") {
                    hideHSRElements();
                    hsrButton.background = charPanel.background;
                } else if (tabMode == "ZZZ") {
                    zzzButton.background = charPanel.background;
                    hideZZZElements();
                }
                tabMode = "WuWa";
                filteredArray = filterBy(wuwaCharDataArray, wuwaFilter);
                filteredArray = sortBy(filteredArray, sortModeKey, sortModeAscending);
                showAllWuwaElements();
                generateGrid(filteredArray);
            }
        }
        searchImage.onPointerClickObservable.add(function() {
            handleWuwaTabSwitch();
        });

        searchImage.onPointerEnterObservable.add(function() {
            searchImage.image!.source = "res/assets/tacet.png";
        });
        searchImage.onPointerOutObservable.add(function() {
            searchImage.image!.source = "res/assets/search.png";
        });
        searchImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Wuthering Waves";
        });
        searchImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const searchTextbox = new gui.InputText();
        searchTextbox.placeholderText = "Search all characters...";
        searchTextbox.placeholderColor = "rgb(64,68,70)";
        searchTextbox.thickness = 0;
        searchTextbox.background = searchBar.background;
        searchTextbox.width = "220px";
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
                sortImage.isVisible = true;
                if (searchTextboxPrevTab == "Genshin") {
                    handleGenshinTabSwitch();
                } else if (searchTextboxPrevTab == "HSR") {
                    handleHSRTabSwitch();
                } else if (searchTextboxPrevTab == "ZZZ") {
                    handleZZZTabSwitch();
                } else if (searchTextboxPrevTab == "WuWa") {
                    handleWuwaTabSwitch();
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
                    hideGenshinElements();
                    hideHSRElements();
                    hideZZZElements();
                    hideWuwaElements();
                }
                tabMode = "None";
                searchCharArray = searchCharFunction(searchTextbox.text);
                generateGrid(searchCharArray);
            }
        });

        const clearTextImage = gui.Button.CreateImageOnlyButton("but", "res/assets/clear.png");
        clearTextImage.height = "40px";
        clearTextImage.width = "40px";
        clearTextImage.left = 130;
        clearTextImage.thickness = 0;
        clearTextImage.cornerRadius = 5;
        searchBar.addControl(clearTextImage);
        clearTextImage.onPointerClickObservable.add(function() {
            searchTextbox.text = "";
        });

        const sortImage = gui.Button.CreateImageOnlyButton("but", "res/assets/descending.png");
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

        const sortModeChanger = gui.Button.CreateSimpleButton("but", " Release ");
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
                    hsrSortModeChanger.image!.source = "res/assets/release.png";
                    sortModeChanger.textBlock.text = " Name ";
                } else {
                    sortModeKey = "id";
                    hsrSortModeChanger.image!.source = "res/assets/alphabet.png";
                    sortModeChanger.textBlock.text = " Release ";
                }
                filteredArray = sortBy(filteredArray, sortModeKey, sortModeAscending);
                generateGrid(filteredArray);
            }
        });

        const hsrSortModeChanger = gui.Button.CreateImageOnlyButton("but", "res/assets/release.png");
        hsrSortModeChanger.height = "40px";
        hsrSortModeChanger.width = "40px";
        hsrSortModeChanger.left = -278;
        hsrSortModeChanger.thickness = 0;
        filterBar.addControl(hsrSortModeChanger);
        hsrSortModeChanger.onPointerClickObservable.add(() => {
            if (sortModeKey == "id") {
                sortModeKey = "name";
                hsrSortModeChanger.image!.source = "res/assets/alphabet.png";
                sortModeChanger.textBlock!.text = " Name ";
            } else {
                sortModeKey = "id";
                hsrSortModeChanger.image!.source = "res/assets/release.png";
                sortModeChanger.textBlock!.text = " Release ";
            }
            filteredArray = sortBy(filteredArray, sortModeKey, sortModeAscending);
            generateGrid(filteredArray);
        });
        hsrSortModeChanger.isVisible = false;

        const fourStarImage = gui.Button.CreateImageOnlyButton("but", "res/assets/Genshin/rarity_4.png");
        fourStarImage.height = "40px";
        fourStarImage.width = "40px";
        fourStarImage.left = -188;
        fourStarImage.thickness = 0;
        fourStarImage.cornerRadius = 5;
        filterBar.addControl(fourStarImage);
        fourStarImage.onPointerClickObservable.add(function() {
            const index = genshinFilter.findIndex(obj => obj.key === "rarity");
            if (index !== -1) { // Object with the key exists
                if (genshinFilter[index].value == "4") {
                    genshinFilter.splice(index, 1);
                    fourStarImage.background = "rgba(0,0,0,0)";
                } else {
                    genshinFilter[index].value = "4";
                    fiveStarImage.background = "rgba(0,0,0,0)";
                    fourStarImage.background = charPanel.background;
                }
            } else {
                const newPush: { key: keyof GenshinCharData; value: string } = {
                    key: "rarity",
                    value: "4"
                };
                genshinFilter.push(newPush);
                fourStarImage.background = charPanel.background;
            }
            filteredArray = filterBy(charDataArray, genshinFilter);
            filteredArray = sortBy(filteredArray, sortModeKey, sortModeAscending);
            generateGrid(filteredArray);
        });

        const fiveStarImage = gui.Button.CreateImageOnlyButton("but", "res/assets/Genshin/rarity_5.png");
        fiveStarImage.height = "40px";
        fiveStarImage.width = "40px";
        fiveStarImage.left = -148;
        fiveStarImage.thickness = 0;
        fiveStarImage.cornerRadius = 5;
        filterBar.addControl(fiveStarImage);
        fiveStarImage.onPointerClickObservable.add(function() {
            const index = genshinFilter.findIndex(obj => obj.key === "rarity");
            if (index !== -1) { // Object with the key exists
                if (genshinFilter[index].value == "5") {
                    genshinFilter.splice(index, 1);
                    fiveStarImage.background = "rgba(0,0,0,0)";
                } else {
                    genshinFilter[index].value = "5";
                    fourStarImage.background = "rgba(0,0,0,0)";
                    fiveStarImage.background = charPanel.background;
                }
            } else {
                const newPush: { key: keyof GenshinCharData; value: string } = {
                    key: "rarity",
                    value: "5"
                };
                genshinFilter.push(newPush);
                fiveStarImage.background = charPanel.background;
            }
            filteredArray = filterBy(charDataArray, genshinFilter);
            filteredArray = sortBy(filteredArray, sortModeKey, sortModeAscending);
            generateGrid(filteredArray);
        });

        // 5star+tp -> 5star+bg -> 4star+bg -> 5star+tp
        const hsrStarImage = gui.Button.CreateImageOnlyButton("but", "res/assets/HSR/rarity_5.png");
        hsrStarImage.height = "40px";
        hsrStarImage.width = "40px";
        hsrStarImage.left = -238;
        hsrStarImage.thickness = 0;
        hsrStarImage.cornerRadius = 5;
        filterBar.addControl(hsrStarImage);
        hsrStarImage.isVisible = false;
        hsrStarImage.onPointerClickObservable.add(function() {
            const index = hsrFilter.findIndex(obj => obj.key === "rarity");
            if (index !== -1) { // Object with the key exists
                if (hsrFilter[index].value == "4") {
                    hsrFilter.splice(index, 1);
                    hsrStarImage.background = "rgba(0,0,0,0)";
                    hsrStarImage.image!.source = "res/assets/HSR/rarity_5.png";
                } else {
                    hsrFilter[index].value = "4";
                    hsrStarImage.background = charPanel.background;
                    hsrStarImage.image!.source = "res/assets/HSR/rarity_4.png";
                }
            } else {
                const newPush: { key: keyof HSRCharData; value: string } = {
                    key: "rarity",
                    value: "5"
                };
                hsrFilter.push(newPush);
                hsrStarImage.background = charPanel.background;
            }
            filteredArray = filterBy(hsrCharDataArray, hsrFilter);
            filteredArray = sortBy(filteredArray, sortModeKey, sortModeAscending);
            generateGrid(filteredArray);
        });

        const zzzFourStarImage = gui.Button.CreateImageOnlyButton("but", "res/assets/ZZZ/Icon_AgentRank_A.png");
        zzzFourStarImage.height = "40px";
        zzzFourStarImage.width = "40px";
        zzzFourStarImage.left = -188;
        zzzFourStarImage.thickness = 0;
        zzzFourStarImage.cornerRadius = 5;
        filterBar.addControl(zzzFourStarImage);
        zzzFourStarImage.isVisible = false;
        zzzFourStarImage.onPointerClickObservable.add(function() {
            const index = zzzFilter.findIndex(obj => obj.key === "rarity");
            if (index !== -1) { // Object with the key exists
                if (zzzFilter[index].value == "4") {
                    zzzFilter.splice(index, 1);
                    zzzFourStarImage.background = "rgba(0,0,0,0)";
                } else {
                    zzzFilter[index].value = "4";
                    zzzFiveStarImage.background = "rgba(0,0,0,0)";
                    zzzFourStarImage.background = charPanel.background;
                }
            } else {
                const newPush: { key: keyof ZZZCharData; value: string } = {
                    key: "rarity",
                    value: "4"
                };
                zzzFilter.push(newPush);
                zzzFourStarImage.background = charPanel.background;
            }
            filteredArray = filterBy(zzzCharDataArray, zzzFilter);
            filteredArray = sortBy(filteredArray, sortModeKey, sortModeAscending);
            generateGrid(filteredArray);
        });

        const zzzFiveStarImage = gui.Button.CreateImageOnlyButton("but", "res/assets/ZZZ/Icon_AgentRank_S.png");
        zzzFiveStarImage.height = "40px";
        zzzFiveStarImage.width = "40px";
        zzzFiveStarImage.left = -148;
        zzzFiveStarImage.thickness = 0;
        zzzFiveStarImage.cornerRadius = 5;
        filterBar.addControl(zzzFiveStarImage);
        zzzFiveStarImage.isVisible = false;
        zzzFiveStarImage.onPointerClickObservable.add(function() {
            const index = zzzFilter.findIndex(obj => obj.key === "rarity");
            if (index !== -1) { // Object with the key exists
                if (zzzFilter[index].value == "5") {
                    zzzFilter.splice(index, 1);
                    zzzFiveStarImage.background = "rgba(0,0,0,0)";
                } else {
                    zzzFilter[index].value = "5";
                    zzzFourStarImage.background = "rgba(0,0,0,0)";
                    zzzFiveStarImage.background = charPanel.background;
                }
            } else {
                const newPush: { key: keyof ZZZCharData; value: string } = {
                    key: "rarity",
                    value: "5"
                };
                zzzFilter.push(newPush);
                zzzFiveStarImage.background = charPanel.background;
            }
            filteredArray = filterBy(zzzCharDataArray, zzzFilter);
            filteredArray = sortBy(filteredArray, sortModeKey, sortModeAscending);
            generateGrid(filteredArray);
        });

        const wuwaFourStarImage = gui.Button.CreateImageOnlyButton("but", "res/assets/WuWa/rarity_4.png");
        wuwaFourStarImage.height = "40px";
        wuwaFourStarImage.width = "40px";
        wuwaFourStarImage.left = -188;
        wuwaFourStarImage.thickness = 0;
        wuwaFourStarImage.cornerRadius = 5;
        filterBar.addControl(wuwaFourStarImage);
        wuwaFourStarImage.isVisible = false;
        wuwaFourStarImage.onPointerClickObservable.add(function() {
            const index = wuwaFilter.findIndex(obj => obj.key === "rarity");
            if (index !== -1) { // Object with the key exists
                if (wuwaFilter[index].value == "4") {
                    wuwaFilter.splice(index, 1);
                    wuwaFourStarImage.background = "rgba(0,0,0,0)";
                } else {
                    wuwaFilter[index].value = "4";
                    wuwaFiveStarImage.background = "rgba(0,0,0,0)";
                    wuwaFourStarImage.background = charPanel.background;
                }
            } else {
                const newPush: { key: keyof WuwaCharData; value: string } = {
                    key: "rarity",
                    value: "4"
                };
                wuwaFilter.push(newPush);
                wuwaFourStarImage.background = charPanel.background;
            }
            filteredArray = filterBy(wuwaCharDataArray, wuwaFilter);
            filteredArray = sortBy(filteredArray, sortModeKey, sortModeAscending);
            generateGrid(filteredArray);
        });

        const wuwaFiveStarImage = gui.Button.CreateImageOnlyButton("but", "res/assets/WuWa/rarity_5.png");
        wuwaFiveStarImage.height = "40px";
        wuwaFiveStarImage.width = "40px";
        wuwaFiveStarImage.left = -148;
        wuwaFiveStarImage.thickness = 0;
        wuwaFiveStarImage.cornerRadius = 5;
        filterBar.addControl(wuwaFiveStarImage);
        wuwaFiveStarImage.isVisible = false;
        wuwaFiveStarImage.onPointerClickObservable.add(function() {
            const index = wuwaFilter.findIndex(obj => obj.key === "rarity");
            if (index !== -1) { // Object with the key exists
                if (wuwaFilter[index].value == "5") {
                    wuwaFilter.splice(index, 1);
                    wuwaFiveStarImage.background = "rgba(0,0,0,0)";
                } else {
                    wuwaFilter[index].value = "5";
                    wuwaFourStarImage.background = "rgba(0,0,0,0)";
                    wuwaFiveStarImage.background = charPanel.background;
                }
            } else {
                const newPush: { key: keyof WuwaCharData; value: string } = {
                    key: "rarity",
                    value: "5"
                };
                wuwaFilter.push(newPush);
                wuwaFiveStarImage.background = charPanel.background;
            }
            filteredArray = filterBy(wuwaCharDataArray, wuwaFilter);
            filteredArray = sortBy(filteredArray, sortModeKey, sortModeAscending);
            generateGrid(filteredArray);
        });

        function checkIfInFilter(buttonObj: gui.Button, theObjType: string, theKey: keyof GenshinCharData): void {
            const index = genshinFilter.findIndex(obj => obj.key === theKey);
            if (index !== -1) { // Object with the key exists
                if (genshinFilter[index].value == theObjType) {
                    genshinFilter.splice(index, 1);
                    buttonObj.background = "rgba(0,0,0,0)";
                } else {
                    genshinFilter[index].value = theObjType;
                    if (theKey.toString() == "element") {
                        offElementBG();
                    } else {
                        offWeaponBG();
                    }
                    buttonObj.background = charPanel.background;
                }
            } else {
                const newPush: { key: keyof GenshinCharData; value: string } = {
                    key: theKey,
                    value: theObjType
                };
                genshinFilter.push(newPush);
                buttonObj.background = charPanel.background;
            }
            filteredArray = filterBy(charDataArray, genshinFilter);
            filteredArray = sortBy(filteredArray, sortModeKey, sortModeAscending);
            generateGrid(filteredArray);
        }

        function checkIfInHSRFilter(buttonObj: gui.Button, theObjType: string, theKey: keyof HSRCharData): void {
            const index = hsrFilter.findIndex(obj => obj.key === theKey);
            if (index !== -1) { // Object with the key exists
                if (hsrFilter[index].value == theObjType) {
                    hsrFilter.splice(index, 1);
                    buttonObj.background = "rgba(0,0,0,0)";
                } else {
                    hsrFilter[index].value = theObjType;
                    if (theKey.toString() == "element") {
                        offHSRElementBG();
                    } else {
                        offPathBG();
                    }
                    buttonObj.background = charPanel.background;
                }
            } else {
                const newPush: { key: keyof HSRCharData; value: string } = {
                    key: theKey,
                    value: theObjType
                };
                hsrFilter.push(newPush);
                buttonObj.background = charPanel.background;
            }
            filteredArray = filterBy(hsrCharDataArray, hsrFilter);
            filteredArray = sortBy(filteredArray, sortModeKey, sortModeAscending);
            generateGrid(filteredArray);
        }

        function checkIfInZZZFilter(buttonObj: gui.Button, theObjType: string, theKey: keyof ZZZCharData): void {
            const index = zzzFilter.findIndex(obj => obj.key === theKey);
            if (index !== -1) { // Object with the key exists
                if (zzzFilter[index].value == theObjType) {
                    zzzFilter.splice(index, 1);
                    buttonObj.background = "rgba(0,0,0,0)";
                } else {
                    zzzFilter[index].value = theObjType;
                    if (theKey.toString() == "element") {
                        offZZZElementBG();
                    } else {
                        offStyleBG();
                    }
                    buttonObj.background = charPanel.background;
                }
            } else {
                const newPush: { key: keyof ZZZCharData; value: string } = {
                    key: theKey,
                    value: theObjType
                };
                zzzFilter.push(newPush);
                buttonObj.background = charPanel.background;
            }
            filteredArray = filterBy(zzzCharDataArray, zzzFilter);
            filteredArray = sortBy(filteredArray, sortModeKey, sortModeAscending);
            generateGrid(filteredArray);
        }

        function checkIfInWuwaFilter(buttonObj: gui.Button, theObjType: string, theKey: keyof WuwaCharData): void {
            const index = wuwaFilter.findIndex(obj => obj.key === theKey);
            if (index !== -1) { // Object with the key exists
                if (wuwaFilter[index].value == theObjType) {
                    wuwaFilter.splice(index, 1);
                    buttonObj.background = "rgba(0,0,0,0)";
                } else {
                    wuwaFilter[index].value = theObjType;
                    if (theKey.toString() == "element") {
                        offWuwaElementBG();
                    } else {
                        offWuwaWeaponBG();
                    }
                    buttonObj.background = charPanel.background;
                }
            } else {
                const newPush: { key: keyof WuwaCharData; value: string } = {
                    key: theKey,
                    value: theObjType
                };
                wuwaFilter.push(newPush);
                buttonObj.background = charPanel.background;
            }
            filteredArray = filterBy(wuwaCharDataArray, wuwaFilter);
            filteredArray = sortBy(filteredArray, sortModeKey, sortModeAscending);
            generateGrid(filteredArray);
        }

        const fireImage = gui.Button.CreateImageOnlyButton("but", "res/assets/HSR/element_fire.png");
        fireImage.height = "40px";
        fireImage.width = "40px";
        fireImage.left = 52;
        fireImage.thickness = 0;
        fireImage.cornerRadius = 5;
        fireImage.isVisible = false;
        filterBar.addControl(fireImage);
        fireImage.onPointerClickObservable.add(function() {
            checkIfInHSRFilter(fireImage, "Fire", "element");
        });
        fireImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Fire";
        });
        fireImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const iceImage = gui.Button.CreateImageOnlyButton("but", "res/assets/HSR/element_ice.png");
        iceImage.height = "40px";
        iceImage.width = "40px";
        iceImage.left = 92;
        iceImage.thickness = 0;
        iceImage.cornerRadius = 5;
        iceImage.isVisible = false;
        filterBar.addControl(iceImage);
        iceImage.onPointerClickObservable.add(function() {
            checkIfInHSRFilter(iceImage, "Ice", "element");
        });
        iceImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Ice";
        });
        iceImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const imaginaryImage = gui.Button.CreateImageOnlyButton("but", "res/assets/HSR/element_imaginary.png");
        imaginaryImage.height = "40px";
        imaginaryImage.width = "40px";
        imaginaryImage.left = 132;
        imaginaryImage.thickness = 0;
        imaginaryImage.cornerRadius = 5;
        imaginaryImage.isVisible = false;
        filterBar.addControl(imaginaryImage);
        imaginaryImage.onPointerClickObservable.add(function() {
            checkIfInHSRFilter(imaginaryImage, "Imaginary", "element");
        });
        imaginaryImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Imaginary";
        });
        imaginaryImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const lightningImage = gui.Button.CreateImageOnlyButton("but", "res/assets/HSR/element_lightning.png");
        lightningImage.height = "40px";
        lightningImage.width = "40px";
        lightningImage.left = 172;
        lightningImage.thickness = 0;
        lightningImage.cornerRadius = 5;
        lightningImage.isVisible = false;
        filterBar.addControl(lightningImage);
        lightningImage.onPointerClickObservable.add(function() {
            checkIfInHSRFilter(lightningImage, "Lightning", "element");
        });
        lightningImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Lightning";
        });
        lightningImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const physicalImage = gui.Button.CreateImageOnlyButton("but", "res/assets/HSR/element_physical.png");
        physicalImage.height = "40px";
        physicalImage.width = "40px";
        physicalImage.left = 212;
        physicalImage.thickness = 0;
        physicalImage.cornerRadius = 5;
        physicalImage.isVisible = false;
        filterBar.addControl(physicalImage);
        physicalImage.onPointerClickObservable.add(function() {
            checkIfInHSRFilter(physicalImage, "Physical", "element");
        });
        physicalImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Physical";
        });
        physicalImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const quantumImage = gui.Button.CreateImageOnlyButton("but", "res/assets/HSR/element_quantum.png");
        quantumImage.height = "40px";
        quantumImage.width = "40px";
        quantumImage.left = 252;
        quantumImage.thickness = 0;
        quantumImage.cornerRadius = 5;
        quantumImage.isVisible = false;
        filterBar.addControl(quantumImage);
        quantumImage.onPointerClickObservable.add(function() {
            checkIfInHSRFilter(quantumImage, "Quantum", "element");
        });
        quantumImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Quantum";
        });
        quantumImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const windImage = gui.Button.CreateImageOnlyButton("but", "res/assets/HSR/element_wind.png");
        windImage.height = "40px";
        windImage.width = "40px";
        windImage.left = 292;
        windImage.thickness = 0;
        windImage.cornerRadius = 5;
        windImage.isVisible = false;
        filterBar.addControl(windImage);
        windImage.onPointerClickObservable.add(function() {
            checkIfInHSRFilter(windImage, "Wind", "element");
        });
        windImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Wind";
        });
        windImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const abundanceImage = gui.Button.CreateImageOnlyButton("but", "res/assets/HSR/path_the_abundance.png");
        abundanceImage.height = "40px";
        abundanceImage.width = "40px";
        abundanceImage.left = 12;
        abundanceImage.thickness = 0;
        abundanceImage.cornerRadius = 5;
        abundanceImage.isVisible = false;
        filterBar2.addControl(abundanceImage);
        abundanceImage.onPointerClickObservable.add(function() {
            checkIfInHSRFilter(abundanceImage, "Abundance", "weaponType");
        });
        abundanceImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Abundance";
        });
        abundanceImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const destructionImage = gui.Button.CreateImageOnlyButton("but", "res/assets/HSR/path_the_destruction.png");
        destructionImage.height = "40px";
        destructionImage.width = "40px";
        destructionImage.left = 52;
        destructionImage.thickness = 0;
        destructionImage.cornerRadius = 5;
        destructionImage.isVisible = false;
        filterBar2.addControl(destructionImage);
        destructionImage.onPointerClickObservable.add(function() {
            checkIfInHSRFilter(destructionImage, "Destruction", "weaponType");
        });
        destructionImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Destruction";
        });
        destructionImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const eruditionImage = gui.Button.CreateImageOnlyButton("but", "res/assets/HSR/path_the_erudition.png");
        eruditionImage.height = "40px";
        eruditionImage.width = "40px";
        eruditionImage.left = 92;
        eruditionImage.thickness = 0;
        eruditionImage.cornerRadius = 5;
        eruditionImage.isVisible = false;
        filterBar2.addControl(eruditionImage);
        eruditionImage.onPointerClickObservable.add(function() {
            checkIfInHSRFilter(eruditionImage, "Erudition", "weaponType");
        });
        eruditionImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Erudition";
        });
        eruditionImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const harmonyImage = gui.Button.CreateImageOnlyButton("but", "res/assets/HSR/path_the_harmony.png");
        harmonyImage.height = "40px";
        harmonyImage.width = "40px";
        harmonyImage.left = 132;
        harmonyImage.thickness = 0;
        harmonyImage.cornerRadius = 5;
        harmonyImage.isVisible = false;
        filterBar2.addControl(harmonyImage);
        harmonyImage.onPointerClickObservable.add(function() {
            checkIfInHSRFilter(harmonyImage, "Harmony", "weaponType");
        });
        harmonyImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Harmony";
        });
        harmonyImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const huntImage = gui.Button.CreateImageOnlyButton("but", "res/assets/HSR/path_the_hunt.png");
        huntImage.height = "40px";
        huntImage.width = "40px";
        huntImage.left = 172;
        huntImage.thickness = 0;
        huntImage.cornerRadius = 5;
        huntImage.isVisible = false;
        filterBar2.addControl(huntImage);
        huntImage.onPointerClickObservable.add(function() {
            checkIfInHSRFilter(huntImage, "Hunt", "weaponType");
        });
        huntImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Hunt";
        });
        huntImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const nihilityImage = gui.Button.CreateImageOnlyButton("but", "res/assets/HSR/path_the_nihility.png");
        nihilityImage.height = "40px";
        nihilityImage.width = "40px";
        nihilityImage.left = 212;
        nihilityImage.thickness = 0;
        nihilityImage.cornerRadius = 5;
        nihilityImage.isVisible = false;
        filterBar2.addControl(nihilityImage);
        nihilityImage.onPointerClickObservable.add(function() {
            checkIfInHSRFilter(nihilityImage, "Nihility", "weaponType");
        });
        nihilityImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Nihility";
        });
        nihilityImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const preservationImage = gui.Button.CreateImageOnlyButton("but", "res/assets/HSR/path_the_preservation.png");
        preservationImage.height = "40px";
        preservationImage.width = "40px";
        preservationImage.left = 252;
        preservationImage.thickness = 0;
        preservationImage.cornerRadius = 5;
        preservationImage.isVisible = false;
        filterBar2.addControl(preservationImage);
        preservationImage.onPointerClickObservable.add(function() {
            checkIfInHSRFilter(preservationImage, "Preservation", "weaponType");
        });
        preservationImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Preservation";
        });
        preservationImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const remembranceImage = gui.Button.CreateImageOnlyButton("but", "res/assets/HSR/path_the_remembrance.png");
        remembranceImage.height = "40px";
        remembranceImage.width = "40px";
        remembranceImage.left = 292;
        remembranceImage.thickness = 0;
        remembranceImage.cornerRadius = 5;
        remembranceImage.isVisible = false;
        filterBar2.addControl(remembranceImage);
        remembranceImage.onPointerClickObservable.add(function() {
            checkIfInHSRFilter(remembranceImage, "Remembrance", "weaponType");
        });
        remembranceImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Remembrance";
        });
        remembranceImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        function hideHSRElements(): void {
            fireImage.isVisible = false;
            iceImage.isVisible = false;
            imaginaryImage.isVisible = false;
            lightningImage.isVisible = false;
            physicalImage.isVisible = false;
            quantumImage.isVisible = false;
            windImage.isVisible = false;
            abundanceImage.isVisible = false;
            destructionImage.isVisible = false;
            eruditionImage.isVisible = false;
            harmonyImage.isVisible = false;
            huntImage.isVisible = false;
            nihilityImage.isVisible = false;
            preservationImage.isVisible = false;
            remembranceImage.isVisible = false;
            hsrSortModeChanger.isVisible = false;
            hsrStarImage.isVisible = false;
        }

        function showAllHSRElements(): void {
            fireImage.isVisible = true;
            iceImage.isVisible = true;
            imaginaryImage.isVisible = true;
            lightningImage.isVisible = true;
            physicalImage.isVisible = true;
            quantumImage.isVisible = true;
            windImage.isVisible = true;
            abundanceImage.isVisible = true;
            destructionImage.isVisible = true;
            eruditionImage.isVisible = true;
            harmonyImage.isVisible = true;
            huntImage.isVisible = true;
            nihilityImage.isVisible = true;
            preservationImage.isVisible = true;
            remembranceImage.isVisible = true;
            hsrSortModeChanger.isVisible = true;
            hsrStarImage.isVisible = true;
        }


        function offHSRElementBG(): void {
            fireImage.background = "rgba(0,0,0,0)";
            iceImage.background = "rgba(0,0,0,0)";
            imaginaryImage.background = "rgba(0,0,0,0)";
            lightningImage.background = "rgba(0,0,0,0)";
            physicalImage.background = "rgba(0,0,0,0)";
            quantumImage.background = "rgba(0,0,0,0)";
            windImage.background = "rgba(0,0,0,0)";
        }

        function offPathBG(): void {
            abundanceImage.background = "rgba(0,0,0,0)";
            destructionImage.background = "rgba(0,0,0,0)";
            eruditionImage.background = "rgba(0,0,0,0)";
            harmonyImage.background = "rgba(0,0,0,0)";
            huntImage.background = "rgba(0,0,0,0)";
            nihilityImage.background = "rgba(0,0,0,0)";
            preservationImage.background = "rgba(0,0,0,0)";
            remembranceImage.background = "rgba(0,0,0,0)";
        }

        const anemoImage = gui.Button.CreateImageOnlyButton("but", "res/assets/Genshin/element_anemo.png");
        anemoImage.height = "40px";
        anemoImage.width = "40px";
        anemoImage.left = 52;
        anemoImage.thickness = 0;
        anemoImage.cornerRadius = 5;
        filterBar.addControl(anemoImage);
        anemoImage.onPointerClickObservable.add(function() {
            checkIfInFilter(anemoImage, "Anemo", "element");
        });
        anemoImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Anemo";
        });
        anemoImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const geoImage = gui.Button.CreateImageOnlyButton("but", "res/assets/Genshin/element_geo.png");
        geoImage.height = "40px";
        geoImage.width = "40px";
        geoImage.left = 92;
        geoImage.thickness = 0;
        geoImage.cornerRadius = 5;
        filterBar.addControl(geoImage);
        geoImage.onPointerClickObservable.add(function() {
            checkIfInFilter(geoImage, "Geo", "element");
        });
        geoImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Geo";
        });
        geoImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const electroImage = gui.Button.CreateImageOnlyButton("but", "res/assets/Genshin/element_electro.png");
        electroImage.height = "40px";
        electroImage.width = "40px";
        electroImage.left = 132;
        electroImage.thickness = 0;
        electroImage.cornerRadius = 5;
        filterBar.addControl(electroImage);
        electroImage.onPointerClickObservable.add(function() {
            checkIfInFilter(electroImage, "Electro", "element");
        });
        electroImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Electro";
        });
        electroImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const dendroImage = gui.Button.CreateImageOnlyButton("but", "res/assets/Genshin/element_dendro.png");
        dendroImage.height = "40px";
        dendroImage.width = "40px";
        dendroImage.left = 172;
        dendroImage.thickness = 0;
        dendroImage.cornerRadius = 5;
        filterBar.addControl(dendroImage);
        dendroImage.onPointerClickObservable.add(function() {
            checkIfInFilter(dendroImage, "Dendro", "element");
        });
        dendroImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Dendro";
        });
        dendroImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const hydroImage = gui.Button.CreateImageOnlyButton("but", "res/assets/Genshin/element_hydro.png");
        hydroImage.height = "40px";
        hydroImage.width = "40px";
        hydroImage.left = 212;
        hydroImage.thickness = 0;
        hydroImage.cornerRadius = 5;
        filterBar.addControl(hydroImage);
        hydroImage.onPointerClickObservable.add(function() {
            checkIfInFilter(hydroImage, "Hydro", "element");
        });
        hydroImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Hydro";
        });
        hydroImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const pyroImage = gui.Button.CreateImageOnlyButton("but", "res/assets/Genshin/element_pyro.png");
        pyroImage.height = "40px";
        pyroImage.width = "40px";
        pyroImage.left = 252;
        pyroImage.thickness = 0;
        pyroImage.cornerRadius = 5;
        filterBar.addControl(pyroImage);
        pyroImage.onPointerClickObservable.add(function() {
            checkIfInFilter(pyroImage, "Pyro", "element");
        });
        pyroImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Pyro";
        });
        pyroImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const cryoImage = gui.Button.CreateImageOnlyButton("but", "res/assets/Genshin/element_cryo.png");
        cryoImage.height = "40px";
        cryoImage.width = "40px";
        cryoImage.left = 292;
        cryoImage.thickness = 0;
        cryoImage.cornerRadius = 5;
        filterBar.addControl(cryoImage);
        cryoImage.onPointerClickObservable.add(function() {
            checkIfInFilter(cryoImage, "Cryo", "element");
        });
        cryoImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Cryo";
        });
        cryoImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const swordImage = gui.Button.CreateImageOnlyButton("but", "res/assets/Genshin/Sword.png");
        swordImage.height = "40px";
        swordImage.width = "40px";
        swordImage.left = 92;
        swordImage.thickness = 0;
        swordImage.cornerRadius = 5;
        filterBar2.addControl(swordImage);
        swordImage.onPointerClickObservable.add(function() {
            checkIfInFilter(swordImage, "Sword", "weaponType");
        });
        swordImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Sword";
        });
        swordImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const catalystImage = gui.Button.CreateImageOnlyButton("but", "res/assets/Genshin/Catalyst.png");
        catalystImage.height = "40px";
        catalystImage.width = "40px";
        catalystImage.left = 132;
        catalystImage.thickness = 0;
        catalystImage.cornerRadius = 5;
        filterBar2.addControl(catalystImage);
        catalystImage.onPointerClickObservable.add(function() {
            checkIfInFilter(catalystImage, "Catalyst", "weaponType");
        });
        catalystImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Catalyst";
        });
        catalystImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const bowImage = gui.Button.CreateImageOnlyButton("but", "res/assets/Genshin/Bow.png");
        bowImage.height = "40px";
        bowImage.width = "40px";
        bowImage.left = 172;
        bowImage.thickness = 0;
        bowImage.cornerRadius = 5;
        filterBar2.addControl(bowImage);
        bowImage.onPointerClickObservable.add(function() {
            checkIfInFilter(bowImage, "Bow", "weaponType");
        });
        bowImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Bow";
        });
        bowImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const claymoreImage = gui.Button.CreateImageOnlyButton("but", "res/assets/Genshin/Claymore.png");
        claymoreImage.height = "40px";
        claymoreImage.width = "40px";
        claymoreImage.left = 212;
        claymoreImage.thickness = 0;
        claymoreImage.cornerRadius = 5;
        filterBar2.addControl(claymoreImage);
        claymoreImage.onPointerClickObservable.add(function() {
            checkIfInFilter(claymoreImage, "Claymore", "weaponType");
        });
        claymoreImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Claymore";
        });
        claymoreImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const poleImage = gui.Button.CreateImageOnlyButton("but", "res/assets/Genshin/Pole.png");
        poleImage.height = "40px";
        poleImage.width = "40px";
        poleImage.left = 252;
        poleImage.thickness = 0;
        poleImage.cornerRadius = 5;
        filterBar2.addControl(poleImage);
        poleImage.onPointerClickObservable.add(function() {
            checkIfInFilter(poleImage, "Polearm", "weaponType");
        });
        poleImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Polearm";
        });
        poleImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        function hideGenshinElements(): void {
            fourStarImage.isVisible = false;
            fiveStarImage.isVisible = false;
            anemoImage.isVisible = false;
            geoImage.isVisible = false;
            electroImage.isVisible = false;
            dendroImage.isVisible = false;
            hydroImage.isVisible = false;
            pyroImage.isVisible = false;
            cryoImage.isVisible = false;
            swordImage.isVisible = false;
            catalystImage.isVisible = false;
            bowImage.isVisible = false;
            claymoreImage.isVisible = false;
            poleImage.isVisible = false;
            sortModeChanger.isVisible = false;
        }

        function showGenshinElements(): void {
            fourStarImage.isVisible = true;
            fiveStarImage.isVisible = true;
            anemoImage.isVisible = true;
            geoImage.isVisible = true;
            electroImage.isVisible = true;
            dendroImage.isVisible = true;
            hydroImage.isVisible = true;
            pyroImage.isVisible = true;
            cryoImage.isVisible = true;
            swordImage.isVisible = true;
            catalystImage.isVisible = true;
            bowImage.isVisible = true;
            claymoreImage.isVisible = true;
            poleImage.isVisible = true;
            sortModeChanger.isVisible = true;
        }

        function offElementBG(): void {
            anemoImage.background = "rgba(0,0,0,0)";
            geoImage.background = "rgba(0,0,0,0)";
            electroImage.background = "rgba(0,0,0,0)";
            dendroImage.background = "rgba(0,0,0,0)";
            hydroImage.background = "rgba(0,0,0,0)";
            pyroImage.background = "rgba(0,0,0,0)";
            cryoImage.background = "rgba(0,0,0,0)";
        }

        function offWeaponBG(): void {
            swordImage.background = "rgba(0,0,0,0)";
            catalystImage.background = "rgba(0,0,0,0)";
            bowImage.background = "rgba(0,0,0,0)";
            claymoreImage.background = "rgba(0,0,0,0)";
            poleImage.background = "rgba(0,0,0,0)";
        }

        const electricImage = gui.Button.CreateImageOnlyButton("but", "res/assets/ZZZ/Icon_Electric.png");
        electricImage.height = "40px";
        electricImage.width = "40px";
        electricImage.left = 92;
        electricImage.thickness = 0;
        electricImage.cornerRadius = 5;
        electricImage.isVisible = false;
        filterBar.addControl(electricImage);
        electricImage.onPointerClickObservable.add(function() {
            checkIfInZZZFilter(electricImage, "Electric", "element");
        });
        electricImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Electric";
        });
        electricImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const etherImage = gui.Button.CreateImageOnlyButton("but", "res/assets/ZZZ/Icon_Ether.png");
        etherImage.height = "40px";
        etherImage.width = "40px";
        etherImage.left = 132;
        etherImage.thickness = 0;
        etherImage.cornerRadius = 5;
        etherImage.isVisible = false;
        filterBar.addControl(etherImage);
        etherImage.onPointerClickObservable.add(function() {
            checkIfInZZZFilter(etherImage, "Ether", "element");
        });
        etherImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Ether";
        });
        etherImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const zzzFireImage = gui.Button.CreateImageOnlyButton("but", "res/assets/ZZZ/Icon_Fire.png");
        zzzFireImage.height = "40px";
        zzzFireImage.width = "40px";
        zzzFireImage.left = 172;
        zzzFireImage.thickness = 0;
        zzzFireImage.cornerRadius = 5;
        zzzFireImage.isVisible = false;
        filterBar.addControl(zzzFireImage);
        zzzFireImage.onPointerClickObservable.add(function() {
            checkIfInZZZFilter(zzzFireImage, "Fire", "element");
        });
        zzzFireImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Fire";
        });
        zzzFireImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const zzzIceImage = gui.Button.CreateImageOnlyButton("but", "res/assets/ZZZ/Icon_Ice.png");
        zzzIceImage.height = "40px";
        zzzIceImage.width = "40px";
        zzzIceImage.left = 212;
        zzzIceImage.thickness = 0;
        zzzIceImage.cornerRadius = 5;
        zzzIceImage.isVisible = false;
        filterBar.addControl(zzzIceImage);
        zzzIceImage.onPointerClickObservable.add(function() {
            checkIfInZZZFilter(zzzIceImage, "Ice", "element");
        });
        zzzIceImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Ice";
        });
        zzzIceImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const zzzPhyscialImage = gui.Button.CreateImageOnlyButton("but", "res/assets/ZZZ/Icon_Physical.png");
        zzzPhyscialImage.height = "40px";
        zzzPhyscialImage.width = "40px";
        zzzPhyscialImage.left = 252;
        zzzPhyscialImage.thickness = 0;
        zzzPhyscialImage.cornerRadius = 5;
        zzzPhyscialImage.isVisible = false;
        filterBar.addControl(zzzPhyscialImage);
        zzzPhyscialImage.onPointerClickObservable.add(function() {
            checkIfInZZZFilter(zzzPhyscialImage, "Physical", "element");
        });
        zzzPhyscialImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Physical";
        });
        zzzPhyscialImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const anomalyImage = gui.Button.CreateImageOnlyButton("but", "res/assets/ZZZ/Icon_Anomaly.png");
        anomalyImage.height = "40px";
        anomalyImage.width = "40px";
        anomalyImage.left = 92;
        anomalyImage.thickness = 0;
        anomalyImage.cornerRadius = 5;
        anomalyImage.isVisible = false;
        filterBar2.addControl(anomalyImage);
        anomalyImage.onPointerClickObservable.add(function() {
            checkIfInZZZFilter(anomalyImage, "Anomaly", "weaponType");
        });
        anomalyImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Anomaly";
        });
        anomalyImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const attackImage = gui.Button.CreateImageOnlyButton("but", "res/assets/ZZZ/Icon_Attack.png");
        attackImage.height = "40px";
        attackImage.width = "40px";
        attackImage.left = 132;
        attackImage.thickness = 0;
        attackImage.cornerRadius = 5;
        attackImage.isVisible = false;
        filterBar2.addControl(attackImage);
        attackImage.onPointerClickObservable.add(function() {
            checkIfInZZZFilter(attackImage, "Attack", "weaponType");
        });
        attackImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Attack";
        });
        attackImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const defenseImage = gui.Button.CreateImageOnlyButton("but", "res/assets/ZZZ/Icon_Defense.png");
        defenseImage.height = "40px";
        defenseImage.width = "40px";
        defenseImage.left = 172;
        defenseImage.thickness = 0;
        defenseImage.cornerRadius = 5;
        defenseImage.isVisible = false;
        filterBar2.addControl(defenseImage);
        defenseImage.onPointerClickObservable.add(function() {
            checkIfInZZZFilter(defenseImage, "Defense", "weaponType");
        });
        defenseImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Defense";
        });
        defenseImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const stunImage = gui.Button.CreateImageOnlyButton("but", "res/assets/ZZZ/Icon_Stun.png");
        stunImage.height = "40px";
        stunImage.width = "40px";
        stunImage.left = 212;
        stunImage.thickness = 0;
        stunImage.cornerRadius = 5;
        stunImage.isVisible = false;
        filterBar2.addControl(stunImage);
        stunImage.onPointerClickObservable.add(function() {
            checkIfInZZZFilter(stunImage, "Stun", "weaponType");
        });
        stunImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Stun";
        });
        stunImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const supportImage = gui.Button.CreateImageOnlyButton("but", "res/assets/ZZZ/Icon_Support.png");
        supportImage.height = "40px";
        supportImage.width = "40px";
        supportImage.left = 252;
        supportImage.thickness = 0;
        supportImage.cornerRadius = 5;
        supportImage.isVisible = false;
        filterBar2.addControl(supportImage);
        supportImage.onPointerClickObservable.add(function() {
            checkIfInZZZFilter(supportImage, "Support", "weaponType");
        });
        supportImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Support";
        });
        supportImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const ruptureImage = gui.Button.CreateImageOnlyButton("but", "res/assets/ZZZ/Icon_Rupture.png");
        ruptureImage.height = "40px";
        ruptureImage.width = "40px";
        ruptureImage.left = 292;
        ruptureImage.thickness = 0;
        ruptureImage.cornerRadius = 5;
        ruptureImage.isVisible = false;
        filterBar2.addControl(ruptureImage);
        ruptureImage.onPointerClickObservable.add(function() {
            checkIfInZZZFilter(ruptureImage, "Rupture", "weaponType");
        });
        ruptureImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Rupture";
        });
        ruptureImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        function hideZZZElements(): void {
            zzzFourStarImage.isVisible = false;
            zzzFiveStarImage.isVisible = false;
            electricImage.isVisible = false;
            etherImage.isVisible = false;
            zzzFireImage.isVisible = false;
            zzzIceImage.isVisible = false;
            zzzPhyscialImage.isVisible = false;
            anomalyImage.isVisible = false;
            attackImage.isVisible = false;
            defenseImage.isVisible = false;
            stunImage.isVisible = false;
            supportImage.isVisible = false;
            ruptureImage.isVisible = false;
            sortModeChanger.isVisible = false;
        }

        function showAllZZZElements(): void {
            zzzFourStarImage.isVisible = true;
            zzzFiveStarImage.isVisible = true;
            electricImage.isVisible = true;
            etherImage.isVisible = true;
            zzzFireImage.isVisible = true;
            zzzIceImage.isVisible = true;
            zzzPhyscialImage.isVisible = true;
            anomalyImage.isVisible = true;
            attackImage.isVisible = true;
            defenseImage.isVisible = true;
            stunImage.isVisible = true;
            supportImage.isVisible = true;
            ruptureImage.isVisible = true;
            sortModeChanger.isVisible = true;
        }

        function offZZZElementBG(): void {
            electricImage.background = "rgba(0,0,0,0)";
            etherImage.background = "rgba(0,0,0,0)";
            zzzFireImage.background = "rgba(0,0,0,0)";
            zzzIceImage.background = "rgba(0,0,0,0)";
            zzzPhyscialImage.background = "rgba(0,0,0,0)";
        }

        function offStyleBG(): void {
            anomalyImage.background = "rgba(0,0,0,0)";
            attackImage.background = "rgba(0,0,0,0)";
            defenseImage.background = "rgba(0,0,0,0)";
            stunImage.background = "rgba(0,0,0,0)";
            supportImage.background = "rgba(0,0,0,0)";
            ruptureImage.background = "rgba(0,0,0,0)";
        }

        const aeroImage = gui.Button.CreateImageOnlyButton("but", "res/assets/WuWa/Aero.png");
        aeroImage.height = "40px";
        aeroImage.width = "40px";
        aeroImage.left = 52;
        aeroImage.thickness = 0;
        aeroImage.cornerRadius = 5;
        filterBar.addControl(aeroImage);
        aeroImage.onPointerClickObservable.add(function() {
            checkIfInWuwaFilter(aeroImage, "Aero", "element");
        });
        aeroImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Aero";
        });
        aeroImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const spectroImage = gui.Button.CreateImageOnlyButton("but", "res/assets/WuWa/Spectro.png");
        spectroImage.height = "40px";
        spectroImage.width = "40px";
        spectroImage.left = 92;
        spectroImage.thickness = 0;
        spectroImage.cornerRadius = 5;
        filterBar.addControl(spectroImage);
        spectroImage.onPointerClickObservable.add(function() {
            checkIfInWuwaFilter(spectroImage, "Spectro", "element");
        });
        spectroImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Spectro";
        });
        spectroImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const electroWuwaImage = gui.Button.CreateImageOnlyButton("but", "res/assets/WuWa/Electro.png");
        electroWuwaImage.height = "40px";
        electroWuwaImage.width = "40px";
        electroWuwaImage.left = 132;
        electroWuwaImage.thickness = 0;
        electroWuwaImage.cornerRadius = 5;
        filterBar.addControl(electroWuwaImage);
        electroWuwaImage.onPointerClickObservable.add(function() {
            checkIfInWuwaFilter(electroWuwaImage, "Electro", "element");
        });
        electroWuwaImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Electro";
        });
        electroWuwaImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const havocImage = gui.Button.CreateImageOnlyButton("but", "res/assets/WuWa/Havoc.png");
        havocImage.height = "40px";
        havocImage.width = "40px";
        havocImage.left = 172;
        havocImage.thickness = 0;
        havocImage.cornerRadius = 5;
        filterBar.addControl(havocImage);
        havocImage.onPointerClickObservable.add(function() {
            checkIfInWuwaFilter(havocImage, "Havoc", "element");
        });
        havocImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Havoc";
        });
        havocImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const glacioImage = gui.Button.CreateImageOnlyButton("but", "res/assets/WuWa/Glacio.png");
        glacioImage.height = "40px";
        glacioImage.width = "40px";
        glacioImage.left = 212;
        glacioImage.thickness = 0;
        glacioImage.cornerRadius = 5;
        filterBar.addControl(glacioImage);
        glacioImage.onPointerClickObservable.add(function() {
            checkIfInWuwaFilter(glacioImage, "Glacio", "element");
        });
        glacioImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Glacio";
        });
        glacioImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const fusionImage = gui.Button.CreateImageOnlyButton("but", "res/assets/WuWa/Fusion.png");
        fusionImage.height = "40px";
        fusionImage.width = "40px";
        fusionImage.left = 252;
        fusionImage.thickness = 0;
        fusionImage.cornerRadius = 5;
        filterBar.addControl(fusionImage);
        fusionImage.onPointerClickObservable.add(function() {
            checkIfInWuwaFilter(fusionImage, "Fusion", "element");
        });
        fusionImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Fusion";
        });
        fusionImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const swordWuwaImage = gui.Button.CreateImageOnlyButton("but", "res/assets/WuWa/Sword_Icon.png");
        swordWuwaImage.height = "40px";
        swordWuwaImage.width = "40px";
        swordWuwaImage.left = 92;
        swordWuwaImage.thickness = 0;
        swordWuwaImage.cornerRadius = 5;
        filterBar2.addControl(swordWuwaImage);
        swordWuwaImage.onPointerClickObservable.add(function() {
            checkIfInWuwaFilter(swordWuwaImage, "Sword", "weaponType");
        });
        swordWuwaImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Sword";
        });
        swordWuwaImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const rectifierImage = gui.Button.CreateImageOnlyButton("but", "res/assets/WuWa/Rectifier_Icon.png");
        rectifierImage.height = "40px";
        rectifierImage.width = "40px";
        rectifierImage.left = 132;
        rectifierImage.thickness = 0;
        rectifierImage.cornerRadius = 5;
        filterBar2.addControl(rectifierImage);
        rectifierImage.onPointerClickObservable.add(function() {
            checkIfInWuwaFilter(rectifierImage, "Rectifier", "weaponType");
        });
        rectifierImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Rectifier";
        });
        rectifierImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const pistolsImage = gui.Button.CreateImageOnlyButton("but", "res/assets/WuWa/Pistols_Icon.png");
        pistolsImage.height = "40px";
        pistolsImage.width = "40px";
        pistolsImage.left = 172;
        pistolsImage.thickness = 0;
        pistolsImage.cornerRadius = 5;
        filterBar2.addControl(pistolsImage);
        pistolsImage.onPointerClickObservable.add(function() {
            checkIfInWuwaFilter(pistolsImage, "Pistols", "weaponType");
        });
        pistolsImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Pistols";
        });
        pistolsImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const gauntletsImage = gui.Button.CreateImageOnlyButton("but", "res/assets/WuWa/Gauntlets_Icon.png");
        gauntletsImage.height = "40px";
        gauntletsImage.width = "40px";
        gauntletsImage.left = 212;
        gauntletsImage.thickness = 0;
        gauntletsImage.cornerRadius = 5;
        filterBar2.addControl(gauntletsImage);
        gauntletsImage.onPointerClickObservable.add(function() {
            checkIfInWuwaFilter(gauntletsImage, "Gauntlets", "weaponType");
        });
        gauntletsImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Gauntlets";
        });
        gauntletsImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        const broadbladeImage = gui.Button.CreateImageOnlyButton("but", "res/assets/WuWa/Broadblade_Icon.png");
        broadbladeImage.height = "40px";
        broadbladeImage.width = "40px";
        broadbladeImage.left = 252;
        broadbladeImage.thickness = 0;
        broadbladeImage.cornerRadius = 5;
        filterBar2.addControl(broadbladeImage);
        broadbladeImage.onPointerClickObservable.add(function() {
            checkIfInWuwaFilter(broadbladeImage, "Broadblade", "weaponType");
        });
        broadbladeImage.onPointerEnterObservable.add(function() {
            hoverCharName.text = "Broadblade";
        });
        broadbladeImage.onPointerOutObservable.add(function() {
            hoverCharName.text = "";
        });

        function hideWuwaElements(): void {
            wuwaFourStarImage.isVisible = false;
            wuwaFiveStarImage.isVisible = false;
            aeroImage.isVisible = false;
            spectroImage.isVisible = false;
            electroWuwaImage.isVisible = false;
            havocImage.isVisible = false;
            glacioImage.isVisible = false;
            fusionImage.isVisible = false;
            swordWuwaImage.isVisible = false;
            rectifierImage.isVisible = false;
            pistolsImage.isVisible = false;
            gauntletsImage.isVisible = false;
            broadbladeImage.isVisible = false;
            sortModeChanger.isVisible = false;
            searchImage.image!.source = "res/assets/search.png";
        }

        function showAllWuwaElements(): void {
            wuwaFourStarImage.isVisible = true;
            wuwaFiveStarImage.isVisible = true;
            aeroImage.isVisible = true;
            spectroImage.isVisible = true;
            electroWuwaImage.isVisible = true;
            havocImage.isVisible = true;
            glacioImage.isVisible = true;
            fusionImage.isVisible = true;
            swordWuwaImage.isVisible = true;
            rectifierImage.isVisible = true;
            pistolsImage.isVisible = true;
            gauntletsImage.isVisible = true;
            broadbladeImage.isVisible = true;
            sortModeChanger.isVisible = true;
        }

        function offWuwaElementBG(): void {
            aeroImage.background = "rgba(0,0,0,0)";
            spectroImage.background = "rgba(0,0,0,0)";
            electroWuwaImage.background = "rgba(0,0,0,0)";
            havocImage.background = "rgba(0,0,0,0)";
            glacioImage.background = "rgba(0,0,0,0)";
            fusionImage.background = "rgba(0,0,0,0)";
        }

        function offWuwaWeaponBG(): void {
            swordWuwaImage.background = "rgba(0,0,0,0)";
            rectifierImage.background = "rgba(0,0,0,0)";
            pistolsImage.background = "rgba(0,0,0,0)";
            gauntletsImage.background = "rgba(0,0,0,0)";
            broadbladeImage.background = "rgba(0,0,0,0)";
        }
        hideWuwaElements();
        sortModeChanger.isVisible = true;

        const myScrollViewer = new gui.ScrollViewer("scrollName");
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

        let grid = new gui.Grid();
        let rows = 10;

        function generateGrid<T extends {id: number, name: string, rarity: number, image: string}>(
            dataArray: T[]
        ): void {
            grid.dispose();
            grid = new gui.Grid();
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
                        let charButton: gui.Button;
                        extraDataArray;
                        if (tabMode == "Genshin" || tabMode == "None") {
                            charButton = gui.Button.CreateImageOnlyButton("but", "res/charsPNG/Genshin/Paimon.png");
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
                            charButton = gui.Button.CreateImageOnlyButton("but", "res/charsPNG/HSR/Pom-Pom.png");
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
                            charButton = gui.Button.CreateImageOnlyButton("but", "res/charsPNG/ZZZ/Bangboo.png");
                            charButton.onPointerEnterObservable.add(function() {
                                hoverCharName.text = "Bangboo";
                            });
                            charButton.onPointerClickObservable.add(async function() {
                                charPanel.isVisible = !charPanel.isVisible;
                                if (chosenCharName != "Bangboo") {
                                    await changeCharacter("Bangboo");
                                }
                            });
                        } else {
                            charButton = gui.Button.CreateImageOnlyButton("but", "res/charsPNG/WuWa/Abby.png");
                            charButton.onPointerEnterObservable.add(function() {
                                hoverCharName.text = "Abby";
                            });
                            charButton.onPointerClickObservable.add(async function() {
                                charPanel.isVisible = !charPanel.isVisible;
                                if (chosenCharName != "Abby") {
                                    await changeCharacter("Abby");
                                }
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
                        const theBG = new gui.Rectangle();
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
                        const charButton = gui.Button.CreateImageOnlyButton("but", `res/charsPNG/${selChar.image}`);
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
                            const skinCharButton = new gui.Image("but", "res/assets/skin_icon.png");
                            skinCharButton.verticalAlignment = gui.Control.VERTICAL_ALIGNMENT_TOP;
                            skinCharButton.horizontalAlignment = gui.Control.HORIZONTAL_ALIGNMENT_RIGHT;
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
            promises.push(bvmdLoader.loadAsync("motion", camMotionFile,
                (event) => updateLoadingText(0, `Loading camera... ${event.loaded}/${event.total} (${Math.floor(event.loaded * 100 / event.total)}%)`))
            );

            // model motion
            promises.push(bvmdLoader.loadAsync("motion", modelMotionFile,
                (event) => updateLoadingText(1, `Loading motion... ${event.loaded}/${event.total} (${Math.floor(event.loaded * 100 / event.total)}%)`))
            );

            loadResults = await Promise.all(promises);
            theCharAnimation = loadResults[1] as MmdAnimation;
            mmdModel.addAnimation(theCharAnimation);
            mmdModel.setAnimation("motion");

            mmdCamera.addAnimation(loadResults[0]);
            mmdCamera.restoreState();
            mmdCamera.position.addToRef(
                Vector3.TransformCoordinatesFromFloatsToRef(0, 0, mmdCamera.distance, rotationMatrix, cameraEyePosition),
                cameraEyePosition
            );
            mmdRuntime.setCamera(mmdCamera);
            mmdCamera.setAnimation("motion");

            engine.hideLoadingUI();
        }

        let firstDigitGlobal = 0;

        async function changeCharacter(nextCharacter?: string, nextId?: number): Promise<void> {
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

            // if (!physicsModeOn) {
            mmdRuntime = new MmdRuntime(scene);
            // } else {
            //     mmdRuntime = new MmdRuntime(scene, new MmdPhysics(scene));
            // }
            mmdRuntime.loggingEnabled = true;
            mmdRuntime.register(scene);

            // audioPlayer = new StreamAudioPlayer(scene);
            // audioPlayer.preservesPitch = false;
            // audioPlayer.source = audioPlayerFile;
            mmdRuntime.setAudioPlayer(audioPlayer);
            // mmdRuntime.playAnimation();
            // mmdRuntime.pauseAnimation();

            mmdPlayerControl = new mobileMmdPlayerControl(scene, mmdRuntime, audioPlayer, isMobile);
            mmdPlayerControl.showPlayerControl();

            let firstDigit = 0;
            if (tabMode == "None") {
                firstDigit = getFirstDigit(nextId!);
                firstDigitGlobal = firstDigit;
            }

            if (chosenCharName == "Paimon" || chosenCharName == "Pom-Pom" || chosenCharName == "Bangboo" || chosenCharName == "Abby") {
                skinMode = false;
                chosenChar = findCharByName(extraDataArray, chosenCharName);
                await createCharacter(chosenChar);
            } else if (tabMode == "Genshin" || firstDigit == 1) {
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
            } else if (tabMode == "HSR" || firstDigit == 2) {
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
            } else if (tabMode == "ZZZ" || firstDigit == 3) {
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
            } else if (tabMode == "WuWa" || firstDigit == 4) {
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
            } else {
                skinMode = false;
                chosenChar = findCharByName(
                    (tabMode === "Genshin" || firstDigit === 1) ? charDataArray :
                        (tabMode === "HSR" || firstDigit === 2) ? hsrCharDataArray :
                            (tabMode === "ZZZ" || firstDigit === 3) ? zzzCharDataArray :
                                (tabMode === "WuWa" || firstDigit === 4) ? wuwaCharDataArray :
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
            if (chosenChar && chosenChar.directory && chosenChar.pmx) {
                promises.push(loadAssetContainerAsync(
                    chosenChar.directory + "/" + chosenChar.pmx,
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
            if (tabMode == "WuWa") {// || chosenChar.element == "Universal") {
                charScreenMode = false;
                charScreenModeButton.isVisible = false;
            } else {
                charScreenMode = true;
                charScreenModeButton.isVisible = true;
            }
            if (tabMode == "WuWa" || tabMode == "ZZZ" || tabMode == "None" && (firstDigitGlobal == 4 || firstDigitGlobal == 3)) {
                charScreenMode = true;
                charScreenElement = "Universal";
            } else if (tabMode == "HSR" || tabMode == "None" && (firstDigitGlobal == 2)) {
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
                promises.push(loadAssetContainerAsync(
                    "res/stages/GenshinCharacterSphere" + "/" + "CharacterSphere_" + charScreenElement + "V.pmx",
                    scene,
                    {
                        onProgress: (event) => updateLoadingText(3, `Loading stage... ${event.loaded}/${event.total} (${Math.floor(event.loaded * 100 / event.total)}%)`),
                        pluginOptions: {
                            mmdmodel: {
                                loggingEnabled: true,
                                materialBuilder: materialBuilderSt
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

            theDiff = 1.66;
            theHeight = 69;
            boneWorldMatrixCam = new Matrix();

            characterModelPromiseRes = loadResults[0];
            characterModelPromiseRes.addAllToScene();
            modelMesh = characterModelPromiseRes.rootNodes[0] as MmdMesh;
            modelMesh.parent = mmdRoot;

            shadowGenerator.addShadowCaster(modelMesh);
            for (const mesh of modelMesh.metadata.meshes) mesh.receiveShadows = true;

            mmdModel = mmdRuntime.createMmdModel(modelMesh);

            headBone = mmdModel.runtimeBones.find((bone: any) => bone.name === "頭");
            bodyBone = mmdModel.runtimeBones.find((bone) => bone.name === "センター");
            boneWorldMatrix = new Matrix();

            if (headBone != undefined && bodyBone != undefined) {
                mmdModel.addAnimation(theCharAnimation);
                mmdModel.setAnimation("motion");
                scene.onBeforeDrawPhaseObservable.addOnce(() => {
                    headBone!.getWorldMatrixToRef(boneWorldMatrixCam).multiplyToRef(modelMesh.getWorldMatrix(), boneWorldMatrixCam);
                    boneWorldMatrixCam.getTranslationToRef(mmdCameraRoot.position);
                    mmdCameraRoot.position.z = 1;
                    mmdCameraRoot.position.x = 0;
                    theDiff = theDiff - mmdCameraRoot.position.y;
                    theHeight = mmdCameraRoot.position.y;
                });

                scene.onBeforeRenderObservable.addOnce(() => {
                    bodyBone!.getWorldMatrixToRef(boneWorldMatrix).multiplyToRef(modelMesh.getWorldMatrix(), boneWorldMatrix);
                    boneWorldMatrix.getTranslationToRef(directionalLight.position);
                    directionalLight.position.y -= 10 * worldScale;
                });
            }

            mmdRuntime.setCamera(mmdCamera);
            mmdCamera.setAnimation("motion");

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
            mmdCameraRoot.position.x = mmdRoot.position.x;
            mmdCameraRoot.position.y = mmdRoot.position.y;
            mmdCameraRoot.position.z = mmdRoot.position.z;
            scene.onBeforeAnimationsObservable.add(() => {
                cameraPos = mmdCamera.position.y / 10;
                textblock.text = `${scene.activeCameras![0].name}`;
                if (cameraPos < theHeight && 0 < cameraPos) {
                    mmdCameraRoot.position.y = 0 - theDiff * (cameraPos / theHeight);
                } else if (cameraPos <= 0) {
                    mmdCameraRoot.position.y = 0;
                } else {
                    mmdCameraRoot.position.y = 0 - theDiff;
                }
                // debugblock.text = `${mmdCameraRoot.position.y}\n${theHeight}\n${theDiff}`;
                mmdCamera.parent = mmdCameraRoot;
            });
        }

        const rotationMatrix = new Matrix();
        const cameraNormal = new Vector3();
        let cameraEyePosition = new Vector3();
        const headRelativePosition = new Vector3();

        scene.onBeforeRenderObservable.add(() => {
            const cameraRotation = mmdCamera.rotation;
            Matrix.RotationYawPitchRollToRef(-cameraRotation.y, -cameraRotation.x, -cameraRotation.z, rotationMatrix);

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
                camera.setTarget(new Vector3(0, 10 * worldScale, 1));
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
        }

        // if you want to use inspector, uncomment following line.
        // Inspector.Show(scene, { });

        // webxr experience for AR
        // const webXrExperience = await scene.createDefaultXRExperienceAsync({
        //     uiOptions: {
        //         sessionMode: "immersive-ar",
        //         referenceSpaceType: "local-floor"
        //     }
        // });

        //if (webXrExperience.baseExperience !== undefined) {
        // post process seems not working on immersive-ar
        // webXrExperience.baseExperience.sessionManager.onXRFrameObservable.addOnce(() => {
        //     defaultPipeline.addCamera(webXrExperience.baseExperience.camera);
        // });
        //    webXrExperience.baseExperience.sessionManager.worldScalingFactor = 15;
        //}
        // webXrExperience.baseExperience?.sessionManager.onXRSessionInit.add(() => {
        //     defaultPipeline.addCamera(webXrExperience.baseExperience.camera);
        // });

        return scene;
    }
}
