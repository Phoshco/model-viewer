import { baseUrl, resUrl, urlBasePath } from "../config";
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
import "babylon-mmd/esm/Loader/pmxLoader";
import "babylon-mmd/esm/Loader/mmdOutlineRenderer";
// for play `MmdAnimation` we need to import following two modules.
import "babylon-mmd/esm/Runtime/Animation/mmdRuntimeCameraAnimation";
import "babylon-mmd/esm/Runtime/Animation/mmdRuntimeModelAnimation";
import "babylon-mmd/esm/Runtime/Optimized/Animation/mmdWasmRuntimeModelAnimation";
import "@babylonjs/core/Rendering/depthRendererSceneComponent";
import "babylon-mmd/esm/Loader/Shaders/textureAlphaChecker.fragment";
import "babylon-mmd/esm/Loader/Shaders/textureAlphaChecker.vertex";

import type { IPointerEvent } from "@babylonjs/core";
import { MirrorTexture, ParticleSystem, Plane } from "@babylonjs/core";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import type { AbstractEngine } from "@babylonjs/core/Engines/abstractEngine";
import { Layer } from "@babylonjs/core/Layers";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import { LoadAssetContainerAsync } from "@babylonjs/core/Loading/sceneLoader";
import { ImageProcessingConfiguration } from "@babylonjs/core/Materials/imageProcessingConfiguration";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Texture } from "@babylonjs/core/Materials/Textures/texture.js";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { Matrix, Vector3 } from "@babylonjs/core/Maths/math.vector";
import { CreateGround } from "@babylonjs/core/Meshes/Builders/groundBuilder";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { DefaultRenderingPipeline } from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/defaultRenderingPipeline";
import { Scene } from "@babylonjs/core/scene";
import { ShadowOnlyMaterial } from "@babylonjs/materials/shadowOnly/shadowOnlyMaterial";
import type { MmdAnimation } from "babylon-mmd/esm/Loader/Animation/mmdAnimation";
import { MmdStandardMaterialBuilder } from "babylon-mmd/esm/Loader/mmdStandardMaterialBuilder";
import { BvmdLoader } from "babylon-mmd/esm/Loader/Optimized/bvmdLoader";
import { RegisterDxBmpTextureLoader } from "babylon-mmd/esm/Loader/registerDxBmpTextureLoader";
import { SdefInjector } from "babylon-mmd/esm/Loader/sdefInjector";
import { StreamAudioPlayer } from "babylon-mmd/esm/Runtime/Audio/streamAudioPlayer";
import { MmdCamera } from "babylon-mmd/esm/Runtime/mmdCamera";
import type { MmdMesh } from "babylon-mmd/esm/Runtime/mmdMesh";
import { MmdRuntime } from "babylon-mmd/esm/Runtime/mmdRuntime";
import { MmdWasmRuntime } from "babylon-mmd/esm/Runtime/Optimized/mmdWasmRuntime";
import { MmdWasmPhysics } from "babylon-mmd/esm/Runtime/Optimized/Physics/mmdWasmPhysics";
import { MmdWasmAnimation } from "babylon-mmd/esm/Runtime/Optimized/Animation/mmdWasmAnimation";
import { MmdWasmInstanceTypeSPR } from "babylon-mmd/esm/Runtime/Optimized/InstanceType/singlePhysicsRelease";
import { GetMmdWasmInstance } from "babylon-mmd/esm/Runtime/Optimized/mmdWasmInstance";
import miniSearch from "minisearch";

import extraCharDatas from "../../res/assets/extras.json";
import motionConfig from "../../res/cam_motion/motion.json";
import type { ISceneBuilder } from "../baseRuntime";
import { CustomLoadingScreen } from "../CustomLoadingScreen";
import { FirebaseInstance } from "../fb";
import { mobileMmdPlayerControl } from "../mobileMmdPlayerControl";
import type { BaseCharData, GenshinCharData, HSRCharData, ZZZCharData, WuwaCharData, HNACharData, NTECharData, ExtraCharData } from "../sceneBuilder.types";
import { normalize, getFirstDigit, findCharByName, findCharById, findAllCharsByName, createCharacterSlug } from "../sceneBuilder.utils";
import { afterBuildSingleMaterialDefault, afterBuildSingleMaterialSt } from "../sceneBuilder.materials";
import type { SceneApi } from "./sceneApi";
import { SceneStateStore, createInitialState } from "./sceneState";
import type { TabMode, CharacterData, SceneState } from "./sceneState";

export interface SceneBuildResult {
    scene: Scene;
    api: SceneApi;
}

export class SceneBuilder implements ISceneBuilder {
    private _result: SceneBuildResult | null = null;

    public getResult(): SceneBuildResult | null {
        return this._result;
    }

    public async build(canvas: HTMLCanvasElement, engine: AbstractEngine, item?: string): Promise<Scene> {
        const built = await this.buildWithApi(canvas, engine, item ?? "");
        this._result = built;
        return built.scene;
    }

    public async buildWithApi(canvas: HTMLCanvasElement, engine: AbstractEngine, item: string): Promise<SceneBuildResult> {
        // for apply SDEF on shadow, outline, depth rendering
        SdefInjector.OverrideEngineCreateEffect(engine);
        const isLocal = window.location.hostname.includes("localhost");
        const firebase = FirebaseInstance.GetInstance();

        // load character JSONs
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
        const arraysToSort = [
            charDataArray, genshinSkinDataArray, hsrSkinDataArray, zzzSkinDataArray, wuwaSkinDataArray,
            hsrCharDataArray, zzzCharDataArray, wuwaCharDataArray,
            hnaCharDataArray, hnaSkinDataArray, nteCharDataArray, nteSkinDataArray
        ];
        arraysToSort.forEach(a => a.sort((x, y) => y.id - x.id));

        type AllCharData = GenshinCharData | HSRCharData | ZZZCharData | WuwaCharData | NTECharData;
        const allCharDataArray: AllCharData[] = [
            ...charDataArray, ...hsrCharDataArray, ...zzzCharDataArray,
            ...wuwaCharDataArray, ...hnaCharDataArray, ...nteCharDataArray
        ];
        const allSkinCharDataArray: AllCharData[] = [
            ...genshinSkinDataArray, ...hsrSkinDataArray, ...zzzSkinDataArray,
            ...wuwaSkinDataArray, ...hnaSkinDataArray, ...nteSkinDataArray
        ];
        const miniSearchInstance = new miniSearch({
            fields: ["name"],
            storeFields: ["id", "name"],
            searchOptions: { fuzzy: 0.2, prefix: true }
        });
        miniSearchInstance.addAll(allCharDataArray);

        const findFirstCharByName = (nameToFind: string): [BaseCharData | undefined, TabMode] => {
            const normalizedTarget = normalize(nameToFind);
            const results = miniSearchInstance.search(normalizedTarget);
            let fallbackItem: BaseCharData | undefined;
            let tabModeLocal: TabMode;
            if (results.length > 0) {
                const tabById = getFirstDigit(results[0].id);
                if (tabById == 1) { fallbackItem = findCharByName(charDataArray, results[0].name); tabModeLocal = "Genshin"; }
                else if (tabById == 2) { fallbackItem = findCharByName(hsrCharDataArray, results[0].name); tabModeLocal = "HSR"; }
                else if (tabById == 3) { fallbackItem = findCharByName(zzzCharDataArray, results[0].name); tabModeLocal = "ZZZ"; }
                else if (tabById == 4) { fallbackItem = findCharByName(wuwaCharDataArray, results[0].name); tabModeLocal = "WuWa"; }
                else if (tabById == 5) { fallbackItem = findCharByName(hnaCharDataArray, results[0].name); tabModeLocal = "HNA"; }
                else { fallbackItem = findCharByName(nteCharDataArray, results[0].name); tabModeLocal = "NTE"; }
                if (!isLocal) {
                    try {
                        void firebase.countUp("phoshco", fallbackItem!.name.replace(/\./g, "")).catch((error) => {
                            console.error("Failed count: ", error);
                        });
                    } catch (error) {
                        console.error("Unexpected error during count: ", error);
                    }
                }
            } else {
                fallbackItem = findCharByName(charDataArray, "Hu Tao");
                tabModeLocal = "Genshin";
            }
            return [fallbackItem, tabModeLocal];
        };

        // Some characters need to be loaded WITHOUT skeleton/morph building
        const isSpecialModelChar = (c: BaseCharData): boolean => {
            const specialNames = ["Parayaya", "David", "Adam Smasher", "Muyu", "Nitsa"];
            if (specialNames.some(name => c.name.includes(name))) return true;
            if (c.name.includes("Mornye") && c.directory.includes("skin")) return true;
            return false;
        };

        const isMobile: boolean = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        RegisterDxBmpTextureLoader();
        const materialBuilder = new MmdStandardMaterialBuilder();
        materialBuilder.afterBuildSingleMaterial = afterBuildSingleMaterialDefault;

        const materialBuilderSt = new MmdStandardMaterialBuilder();
        materialBuilderSt.afterBuildSingleMaterial = afterBuildSingleMaterialSt;

        const scene = new Scene(engine);
        let bg_bool = true;
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            bg_bool = true;
            scene.clearColor = new Color4(0.001, 0.001, 0.001, 1.0);
        } else {
            scene.clearColor = new Color4(1, 1, 1, 1.0);
        }

        const worldScale = 1;
        const mmdRoot = new TransformNode("mmdRoot", scene);
        mmdRoot.scaling.scaleInPlace(worldScale);
        mmdRoot.position.z = 0;

        const mmdCameraRoot = new TransformNode("mmdRoot", scene);
        mmdCameraRoot.scaling.scaleInPlace(worldScale);
        mmdCameraRoot.position.z = 0;

        const mmdCamera = new MmdCamera("mmdCamera", new Vector3(0, 0, 0), scene);
        mmdCamera.maxZ = 5000;
        mmdCamera.minZ = 0.1;
        mmdCamera.layerMask = 1;

        const defCamPos = new Vector3(0, 10, -30).scaleInPlace(worldScale);

        const createArcCamera = (name: string): ArcRotateCamera => {
            const cam = new ArcRotateCamera(name, 0, 0, 30 * worldScale, new Vector3(0, 10, 0), scene);
            cam.maxZ = 5000;
            cam.setPosition(defCamPos);
            cam.attachControl(canvas, false);
            cam.inertia = 0.8;
            cam.speed = 0.5 * worldScale;
            cam.panningSensibility = 500;
            cam.zoomToMouseLocation = true;
            cam.wheelDeltaPercentage = 0.1;
            cam.upperRadiusLimit = 100 * worldScale;
            cam.lowerRadiusLimit = 1 * worldScale;
            if (isMobile) {
                cam.pinchDeltaPercentage = 0.002;
            }
            cam.layerMask = 1;
            return cam;
        };

        const camera = createArcCamera("arcRotateCamera");
        const stillCamera = createArcCamera("stillCamera");

        const guiCam = new ArcRotateCamera("guiCamera", Math.PI / 2 + Math.PI / 7, Math.PI / 2, 100, new Vector3(0, 20, 0), scene);
        guiCam.layerMask = 0x10000000;

        const hemisphericLight = new HemisphericLight("HemisphericLight", new Vector3(0, 1, 0), scene);
        hemisphericLight.intensity = 0.4;
        hemisphericLight.specular = new Color3(0, 0, 0);
        hemisphericLight.groundColor = new Color3(1, 1, 1);

        const directionalLight = new DirectionalLight("DirectionalLight", new Vector3(0.5, -1, 1), scene);
        directionalLight.intensity = 0.8;
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

        const particleSystem = new ParticleSystem("particles", 2000, scene);
        particleSystem.particleTexture = new Texture(resUrl("res/assets/flare.png"), scene);
        particleSystem.emitter = Vector3.Zero();
        particleSystem.minEmitBox = new Vector3(-25, -15, -25);
        particleSystem.maxEmitBox = new Vector3(25, 10, 25);
        particleSystem.color1 = new Color4(1.0, 1.0, 1.0, 0.9);
        particleSystem.color2 = new Color4(0.5, 0.5, 0.5, 0.9);
        particleSystem.colorDead = new Color4(0.1, 0.1, 0.1, 0.0);
        particleSystem.minSize = 0.1;
        particleSystem.maxSize = 0.4;
        particleSystem.minLifeTime = 0.3;
        particleSystem.maxLifeTime = 1.5;
        particleSystem.emitRate = 40;
        particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE;
        particleSystem.gravity = new Vector3(0, -9.81, 0);
        particleSystem.direction1 = new Vector3(-7, 8, 3);
        particleSystem.direction2 = new Vector3(7, 8, -3);
        particleSystem.minAngularSpeed = 0;
        particleSystem.maxAngularSpeed = Math.PI;
        particleSystem.minEmitPower = 1;
        particleSystem.maxEmitPower = 3;
        particleSystem.updateSpeed = 0.005;
        particleSystem.renderingGroupId = 1;

        let mmdRuntime: MmdRuntime | MmdWasmRuntime;
        let physicsModeOn = false;

        let motionName = motionConfig[Math.floor(Math.random() * motionConfig.length)].name;
        let audioPlayerFile = motionConfig.find((item) => item.name === motionName)!.audioPlayerFile;
        let camMotionFile = motionConfig.find((item) => item.name === motionName)!.camMotionFile;
        let modelMotionFile = motionConfig.find((item) => item.name === motionName)!.modelMotionFile;

        let audioPlayer = new StreamAudioPlayer(scene);
        audioPlayer.preservesPitch = false;
        audioPlayer.source = audioPlayerFile;
        let wasmInstance: any | undefined;

        const createMmdRuntime = (physicsOn: boolean): MmdRuntime | MmdWasmRuntime => {
            const rt = physicsOn
                ? new MmdWasmRuntime(wasmInstance, scene, new MmdWasmPhysics(scene))
                : new MmdRuntime(scene);
            rt.loggingEnabled = true;
            rt.register(scene);
            rt.setAudioPlayer(audioPlayer);
            // Wire play/pause into the state store so the Preact UI can fade out
            // toolbar / name / disclaimer while an animation is playing.
            const anyRt = rt as any;
            if (anyRt.onPlayAnimationObservable && typeof anyRt.onPlayAnimationObservable.add === "function") {
                anyRt.onPlayAnimationObservable.add(() => storeRef?.set({ isPlaying: true }));
            }
            if (anyRt.onPauseAnimationObservable && typeof anyRt.onPauseAnimationObservable.add === "function") {
                anyRt.onPauseAnimationObservable.add(() => storeRef?.set({ isPlaying: false }));
            }
            return rt;
        };
        // Forward reference so createMmdRuntime (defined before the store) can update it.
        let storeRef: SceneStateStore | undefined;

        if (physicsModeOn) {
            wasmInstance = await GetMmdWasmInstance(new MmdWasmInstanceTypeSPR());
        }
        mmdRuntime = createMmdRuntime(physicsModeOn);

        let mmdPlayerControl = new mobileMmdPlayerControl(scene, mmdRuntime, audioPlayer, isMobile);
        mmdPlayerControl.showPlayerControl();

        const customLoadingScreen = new CustomLoadingScreen(canvas);
        engine.loadingScreen = customLoadingScreen;
        engine.displayLoadingUI();

        let loadingTexts: string[] = [];
        const updateLoadingText = (updateIndex: number, text: string): void => {
            loadingTexts[updateIndex] = text;
            customLoadingScreen.loadingTextDiv.innerHTML = "<br/><br/><br/><br/>" + loadingTexts.join("<br/><br/>");
        };

        let promises: Promise<any>[] = [];

        const bvmdLoader = new BvmdLoader(scene);
        bvmdLoader.loggingEnabled = true;

        const safeLoadBvmd = async (type: string, url: string, onProgress?: any): Promise<any> => {
            try {
                return await bvmdLoader.loadAsync(type, url, onProgress);
            } catch (e: any) {
                console.warn("BVMD load failed, continuing without motion:", e?.message || e);
                return undefined;
            }
        };

        promises.push(safeLoadBvmd("motion", camMotionFile, (event: any) => updateLoadingText(0, `Loading camera... ${event.loaded}/${event.total} (${Math.floor(event.loaded * 100 / event.total)}%)`)));
        promises.push(safeLoadBvmd("motion", modelMotionFile, (event: any) => updateLoadingText(1, `Loading motion... ${event.loaded}/${event.total} (${Math.floor(event.loaded * 100 / event.total)}%)`)));

        let charScreenMode = true;
        let charScreenElement = "Pyro";
        let prevCharName: string;
        let prevCharId: number;
        let chosenCharName = item;
        const initialCharacterSlug = createCharacterSlug(chosenCharName);
        let chosenChar: BaseCharData | undefined;
        let tabMode: TabMode = "Genshin";
        let firstTabMode: TabMode = tabMode;
        [chosenChar, firstTabMode] = findFirstCharByName(chosenCharName);
        chosenCharName = chosenChar!.name;
        prevCharId = chosenChar!.id;
        charScreenElement = chosenChar!.element;
        if (firstTabMode == "HSR") {
            charScreenElement = "HSR";
        } else if (firstTabMode != "Genshin") {
            charScreenElement = "Universal";
        }

        {
            const basePath = urlBasePath();
            const charSlug = createCharacterSlug(chosenCharName);
            if (!initialCharacterSlug.startsWith(`${charSlug}%20`)) {
                window.history.replaceState(null, "", basePath + "/" + charSlug);
            }
        }

        if (chosenChar && chosenChar.directory && chosenChar.pmx) {
            const initialMmdModelOptions = {
                loggingEnabled: true,
                materialBuilder: materialBuilder,
                ...(isSpecialModelChar(chosenChar) ? { buildSkeleton: false, buildMorph: false } : {})
            };
            promises.push(LoadAssetContainerAsync(
                baseUrl + chosenChar.directory + "/" + chosenChar.pmx,
                scene,
                {
                    onProgress: (event) => updateLoadingText(2, `Loading model... ${event.loaded}/${event.total} (${Math.floor(event.loaded * 100 / event.total)}%)`),
                    pluginOptions: { mmdmodel: initialMmdModelOptions }
                }
            ));
        } else {
            throw new Error("Chosen character or its properties are undefined");
        }

        promises.push((async (): Promise<void> => {
            updateLoadingText(3, "Loading physics engine...");
            updateLoadingText(3, "Loading physics engine... Done");
        })());

        if (charScreenMode) {
            if (!isMobile) particleSystem.start();
            promises.push(LoadAssetContainerAsync(
                resUrl("res/stages/GenshinCharacterSphere/CharacterSphere_" + charScreenElement + "V.pmx"),
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
            ));
        }

        let loadResults = await Promise.all(promises);

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

        const shadowOnlyMaterial = new ShadowOnlyMaterial("shadowOnly", scene);
        shadowOnlyMaterial.activeLight = directionalLight;
        shadowOnlyMaterial.alpha = 0.4;
        ground.material = shadowOnlyMaterial;
        ground.receiveShadows = true;
        ground.parent = mmdRoot;

        // Wrap in try/catch: special-model handling
        let mmdModel: any;
        try {
            mmdModel = mmdRuntime.createMmdModel(modelMesh);
        } catch (error) {
            console.error("Failed to create MMD model:", error);
        }

        let theCharAnimation = loadResults[1] as MmdAnimation | MmdWasmAnimation | undefined;

        let headBone = mmdModel ? mmdModel.runtimeBones.find((bone: any) => bone.name === "頭") : undefined;
        let bodyBone = mmdModel ? mmdModel.runtimeBones.find((bone: any) => bone.name === "センター") : undefined;
        let boneWorldMatrix = new Matrix();

        if (headBone != undefined && bodyBone != undefined) {
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
                theDiff = theDiff - mmdCameraRoot.position.y / 10;
                theHeight = mmdCameraRoot.position.y / 10;
            });

            scene.onBeforeRenderObservable.addOnce(() => {
                bodyBone!.getWorldMatrixToRef(boneWorldMatrix).multiplyToRef(modelMesh.getWorldMatrix(), boneWorldMatrix);
                boneWorldMatrix.getTranslationToRef(directionalLight.position);
                directionalLight.position.y -= 10 * worldScale;
            });
        }

        let cameraAnimationHandle: any;
        if (loadResults[0]) {
            cameraAnimationHandle = mmdCamera.createRuntimeAnimation(loadResults[0] as any);
            mmdCamera.setRuntimeAnimation(cameraAnimationHandle);
        }
        mmdCamera.storeState();
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
            audioPlayer.mute();
            if (!isLocal) {
                try {
                    void firebase.countUp("phoshco", "hoyo").catch((error) => {
                        console.error("Failed count: ", error);
                    });
                } catch (error) {
                    console.error("Unexpected error during count: ", error);
                }
            }
        });

        const defaultPipeline = new DefaultRenderingPipeline("default", true, scene, [mmdCamera, camera, stillCamera]);
        defaultPipeline.samples = 4;
        defaultPipeline.chromaticAberrationEnabled = true;
        defaultPipeline.chromaticAberration.aberrationAmount = 1;
        defaultPipeline.fxaaEnabled = true;
        defaultPipeline.imageProcessing.toneMappingEnabled = false;
        defaultPipeline.imageProcessing.toneMappingType = ImageProcessingConfiguration.TONEMAPPING_ACES;
        defaultPipeline.imageProcessing.vignetteWeight = 0.5;
        defaultPipeline.imageProcessing.vignetteStretch = 0.5;
        defaultPipeline.imageProcessing.vignetteColor = new Color4(0, 0, 0, 0);
        defaultPipeline.imageProcessing.vignetteEnabled = true;
        defaultPipeline.depthOfFieldEnabled = false;

        let cameraPos = 69;

        const layer = new Layer("", resUrl("res/stages/hoyo.png"), scene, true, new Color4(1, 1, 1, 1));
        const light_bg = new Texture(resUrl("res/stages/hoyo.png"), scene, true);
        const dark_bg = new Texture(resUrl("res/stages/hoyo_dark.png"), scene, true);
        if (bg_bool) {
            layer.texture = dark_bg;
        }

        const resizeObserver = new ResizeObserver(() => {
            const canvasAspectRatio = canvas.width / canvas.height;
            if (canvasAspectRatio > 1) {
                layer.scale.y = canvasAspectRatio;
                layer.scale.x = 1;
                light_bg.uScale = 1; light_bg.vScale = 1 / layer.scale.y;
                light_bg.uOffset = 0; light_bg.vOffset = (1 - light_bg.vScale) * 0.5;
                dark_bg.uScale = 1; dark_bg.vScale = 1 / layer.scale.y;
                dark_bg.uOffset = 0; dark_bg.vOffset = (1 - dark_bg.vScale) * 0.5;
            } else {
                layer.scale.y = 1; layer.scale.x = 1 / canvasAspectRatio;
                light_bg.uScale = 1 / layer.scale.x; light_bg.vScale = 1;
                light_bg.uOffset = (1 - light_bg.uScale) * 0.5; light_bg.vOffset = 0;
                dark_bg.uScale = 1 / layer.scale.x; dark_bg.vScale = 1;
                dark_bg.uOffset = (1 - dark_bg.uScale) * 0.5; dark_bg.vOffset = 0;
            }
        });
        resizeObserver.observe(canvas);

        // ============ State store & API ============
        const charData: CharacterData = {
            genshin: charDataArray,
            genshinSkins: genshinSkinDataArray,
            hsr: hsrCharDataArray,
            hsrSkins: hsrSkinDataArray,
            zzz: zzzCharDataArray,
            zzzSkins: zzzSkinDataArray,
            wuwa: wuwaCharDataArray,
            wuwaSkins: wuwaSkinDataArray,
            hna: hnaCharDataArray,
            hnaSkins: hnaSkinDataArray,
            nte: nteCharDataArray,
            nteSkins: nteSkinDataArray,
            allSkins: allSkinCharDataArray as BaseCharData[]
        };

        // Sync the closure `tabMode` variable with the initial tab detected from the URL.
        // Without this, if the user URL-entered an HSR/ZZZ/WuWa/HNA/NTE character,
        // the closure `tabMode` would remain "Genshin" while the store's tabMode is correct.
        // Then any later physics toggle would call createCharacter with tabMode="Genshin"
        // and attempt to load e.g. CharacterSphere_ChaosV.pmx for an NTE character, 404ing.
        tabMode = firstTabMode;

        const store = new SceneStateStore(createInitialState(isMobile));
        // Give createMmdRuntime access to the store so it can push isPlaying updates.
        storeRef = store;
        store.set({
            chosenCharName,
            chosenCharId: chosenChar!.id,
            tabMode: firstTabMode,
            darkMode: bg_bool,
            charScreenMode: true,
            skinMode: false,
            physicsModeOn,
            motionName,
            charData
        });

        // Determine if initial character has any skins → enable skin button
        {
            const initialSkinArrays: Record<string, BaseCharData[]> = {
                Genshin: genshinSkinDataArray,
                HSR: hsrSkinDataArray,
                ZZZ: zzzSkinDataArray,
                WuWa: wuwaSkinDataArray,
                HNA: hnaSkinDataArray,
                NTE: nteSkinDataArray
            };
            const skinArray = initialSkinArrays[firstTabMode as string];
            if (skinArray) {
                const skinChars = findAllCharsByName(skinArray, chosenCharName);
                if (skinChars.length > 0) {
                    store.set({ hasSkinButton: true, skinMode: false });
                }
            }
        }

        const previousModelState = {
            wasAnimationPlaying: false,
            previousSeekTimeFrame: 0,
            wasMuted: false
        };

        async function changeMotion(): Promise<void> {
            mmdRuntime.pauseAnimation();
            mmdCamera.storeState();
            mmdRuntime.seekAnimation(0, true);
            const oldVolume = audioPlayer.volume;
            audioPlayer.dispose();

            audioPlayer = new StreamAudioPlayer(scene);
            audioPlayer.preservesPitch = false;
            audioPlayer.source = audioPlayerFile;
            mmdRuntime.setAudioPlayer(audioPlayer);
            mmdPlayerControl.dispose();
            audioPlayer.volume = oldVolume;
            mmdPlayerControl = new mobileMmdPlayerControl(scene, mmdRuntime, audioPlayer, isMobile);
            mmdPlayerControl.showPlayerControl();

            loadingTexts = [];
            engine.displayLoadingUI();
            promises = [];

            promises.push(safeLoadBvmd("motion", camMotionFile, (event: any) => updateLoadingText(0, `Loading camera... ${event.loaded}/${event.total} (${Math.floor(event.loaded * 100 / event.total)}%)`)));
            promises.push(safeLoadBvmd("motion", modelMotionFile, (event: any) => updateLoadingText(1, `Loading motion... ${event.loaded}/${event.total} (${Math.floor(event.loaded * 100 / event.total)}%)`)));

            loadResults = await Promise.all(promises);
            theCharAnimation = loadResults[1] as MmdAnimation | undefined;
            if (theCharAnimation) {
                if (physicsModeOn) {
                    theCharAnimation = new MmdWasmAnimation(theCharAnimation as any, wasmInstance, scene);
                }
                const modelAnimationHandle = mmdModel.createRuntimeAnimation(theCharAnimation as any);
                mmdModel.setRuntimeAnimation(modelAnimationHandle);
            }

            if (loadResults[0]) {
                cameraAnimationHandle = mmdCamera.createRuntimeAnimation(loadResults[0] as any);
                mmdCamera.setRuntimeAnimation(cameraAnimationHandle);
            }
            mmdCamera.restoreState();
            mmdCamera.position.addToRef(
                Vector3.TransformCoordinatesFromFloatsToRef(0, 0, mmdCamera.distance, rotationMatrix, cameraEyePosition),
                cameraEyePosition
            );
            mmdRuntime.addAnimatable(mmdCamera);

            engine.hideLoadingUI();
        }

        async function changePhysics(): Promise<void> {
            physicsModeOn = !physicsModeOn;
            store.set({ physicsModeOn });

            if (physicsModeOn && !wasmInstance) {
                wasmInstance = await GetMmdWasmInstance(new MmdWasmInstanceTypeSPR());
            }

            const currentCharName = chosenCharName;
            const currentCharId = chosenChar?.id ?? prevCharId;
            prevCharName = "";
            prevCharId = -1;

            await changeCharacter(currentCharName, currentCharId, true);
        }

        let firstDigitGlobal = 0;

        async function changeCharacter(nextCharacter?: string, nextId?: number, same?: boolean): Promise<void> {
            if (!nextCharacter) return;
            if (mmdRuntime.isAnimationPlaying) {
                previousModelState.wasAnimationPlaying = true;
            }
            mmdRuntime.pauseAnimation();
            previousModelState.previousSeekTimeFrame = mmdRuntime.currentFrameTime;
            prevCharName = chosenCharName;
            chosenCharName = nextCharacter;

            store.set({ chosenCharName, hasSkinButton: false });

            {
                const basePath = urlBasePath();
                const charSlugCC = createCharacterSlug(chosenCharName);
                window.history.replaceState(null, "", basePath + "/" + charSlugCC);
            }

            if (!isMobile) particleSystem.stop();
            modelMesh.dispose(false, true);
            if (modelMeshSt) modelMeshSt.dispose(false, true);
            mmdPlayerControl.dispose();
            mmdCamera.restoreState();
            mmdRuntime.unregister(scene);
            mmdRuntime = createMmdRuntime(physicsModeOn);
            mmdRuntime.setAudioPlayer(audioPlayer);
            mmdPlayerControl = new mobileMmdPlayerControl(scene, mmdRuntime, audioPlayer, isMobile);
            mmdPlayerControl.showPlayerControl();

            let firstDigit = 0;
            firstDigit = getFirstDigit(nextId!);
            if (tabMode == "None") {
                firstDigitGlobal = firstDigit;
            }

            let skinModeLocal = store.get().skinMode;

            if (same) {
                // Re-derive tabMode from the character's actual ID. The user may have
                // browsed to a different tab in the character panel without picking a
                // character, which leaves `tabMode` out of sync with the currently
                // displayed character. Reloading via physics-toggle would then pick the
                // wrong background stage inside createCharacter(). Fix: force tabMode
                // back to the tab that matches the loaded character.
                const derivedTab: TabMode | undefined =
                    firstDigit === 1 ? "Genshin" :
                        firstDigit === 2 ? "HSR" :
                            firstDigit === 3 ? "ZZZ" :
                                firstDigit === 4 ? "WuWa" :
                                    firstDigit === 5 ? "HNA" :
                                        firstDigit === 6 ? "NTE" :
                                            undefined;
                if (derivedTab && tabMode !== derivedTab) {
                    tabMode = derivedTab;
                    store.set({ tabMode });
                }

                let skinChars: BaseCharData[] | undefined;
                if (firstDigit === 1 || tabMode === "Genshin") skinChars = findAllCharsByName(genshinSkinDataArray, chosenChar!.name);
                else if (firstDigit === 2 || tabMode === "HSR") skinChars = findAllCharsByName(hsrSkinDataArray, chosenChar!.name);
                else if (firstDigit === 3 || tabMode === "ZZZ") skinChars = findAllCharsByName(zzzSkinDataArray, chosenChar!.name);
                else if (firstDigit === 4 || tabMode === "WuWa") skinChars = findAllCharsByName(wuwaSkinDataArray, chosenChar!.name);
                else if (firstDigit === 5 || tabMode === "HNA") skinChars = findAllCharsByName(hnaSkinDataArray, chosenChar!.name);
                else if (firstDigit === 6 || tabMode === "NTE") skinChars = findAllCharsByName(nteSkinDataArray, chosenChar!.name);
                if (skinChars && skinChars.length > 0) {
                    store.set({ hasSkinButton: true });
                }
                await createCharacter(chosenChar!);
            }
            else if (chosenCharName == "Paimon" || chosenCharName == "Pom-Pom" || chosenCharName == "Bangboo" || chosenCharName == "Abby") {
                skinModeLocal = false;
                store.set({ skinMode: false });
                chosenChar = findCharByName(extraDataArray, chosenCharName);
                await createCharacter(chosenChar);
            }
            /*
             * Per-tab skin-cycling dispatch (bug fix preserved for HNA/NTE resetToNormal).
             */
            else {
                interface SkinCycleConfig {
                    tab: TabMode;
                    mainArray: BaseCharData[];
                    skinArray: BaseCharData[];
                    resetToNormalArray: BaseCharData[];
                    samePrev: () => boolean;
                    findForNonSame: () => BaseCharData | undefined;
                }
                let cfg: SkinCycleConfig | undefined;
                if (firstDigit == 1 || tabMode == "Genshin") {
                    tabMode = "Genshin";
                    cfg = {
                        tab: "Genshin",
                        mainArray: charDataArray,
                        skinArray: genshinSkinDataArray,
                        resetToNormalArray: charDataArray,
                        samePrev: () => prevCharName == chosenCharName,
                        findForNonSame: () => findCharByName(charDataArray, chosenCharName)
                    };
                } else if (firstDigit == 2 || tabMode == "HSR") {
                    tabMode = "HSR";
                    cfg = {
                        tab: "HSR",
                        mainArray: hsrCharDataArray,
                        skinArray: hsrSkinDataArray,
                        resetToNormalArray: hsrCharDataArray,
                        samePrev: () => prevCharName == chosenCharName && prevCharId == chosenChar?.id,
                        findForNonSame: () => findCharById(hsrCharDataArray, nextId!)
                    };
                } else if (firstDigit == 3 || tabMode == "ZZZ") {
                    tabMode = "ZZZ";
                    cfg = {
                        tab: "ZZZ",
                        mainArray: zzzCharDataArray,
                        skinArray: zzzSkinDataArray,
                        resetToNormalArray: zzzCharDataArray,
                        samePrev: () => prevCharName == chosenCharName && prevCharId == chosenChar?.id,
                        findForNonSame: () => findCharById(zzzCharDataArray, nextId!)
                    };
                } else if (firstDigit == 4 || tabMode == "WuWa") {
                    tabMode = "WuWa";
                    cfg = {
                        tab: "WuWa",
                        mainArray: wuwaCharDataArray,
                        skinArray: wuwaSkinDataArray,
                        resetToNormalArray: wuwaCharDataArray,
                        samePrev: () => prevCharName == chosenCharName && prevCharId == chosenChar?.id,
                        findForNonSame: () => findCharById(wuwaCharDataArray, nextId!)
                    };
                } else if (firstDigit == 5 || tabMode == "HNA") {
                    tabMode = "HNA";
                    cfg = {
                        tab: "HNA",
                        mainArray: hnaCharDataArray,
                        skinArray: hnaSkinDataArray,
                        // Bug fix: reset to normal uses the main array (was skin array).
                        resetToNormalArray: hnaCharDataArray,
                        samePrev: () => prevCharName == chosenCharName && prevCharId == chosenChar?.id,
                        findForNonSame: () => findCharById(hnaCharDataArray, nextId!)
                    };
                } else if (firstDigit == 6 || tabMode == "NTE") {
                    tabMode = "NTE";
                    cfg = {
                        tab: "NTE",
                        mainArray: nteCharDataArray,
                        skinArray: nteSkinDataArray,
                        // Bug fix: reset to normal uses the main array (was skin array).
                        resetToNormalArray: nteCharDataArray,
                        samePrev: () => prevCharName == chosenCharName && prevCharId == chosenChar?.id,
                        findForNonSame: () => findCharById(nteCharDataArray, nextId!)
                    };
                }

                if (cfg) {
                    const skinChars = findAllCharsByName(cfg.skinArray, chosenCharName);
                    if (cfg.samePrev()) {
                        if (skinChars.length > 0 && !skinModeLocal) {
                            chosenChar = skinChars[0];
                            skinModeLocal = true;
                            await createCharacter(chosenChar);
                            store.set({ skinMode: true, hasSkinButton: true });
                        } else if (skinChars.length > 0 && skinModeLocal && skinChars.length > 1) {
                            let prevI = 0;
                            for (let i = 0; i < skinChars.length; i++) {
                                if (chosenChar!.id === skinChars[i].id) prevI = i;
                            }
                            const temp = (prevI + 1) % skinChars.length;
                            if (prevI == skinChars.length - 1) {
                                chosenChar = findCharByName(cfg.resetToNormalArray, chosenCharName);
                                skinModeLocal = false;
                            } else {
                                chosenChar = skinChars[temp];
                                skinModeLocal = true;
                            }
                            await createCharacter(chosenChar);
                            store.set({ skinMode: skinModeLocal, hasSkinButton: true });
                        } else if (skinChars.length > 0 && skinModeLocal) {
                            skinModeLocal = false;
                            chosenChar = findCharByName(cfg.mainArray, chosenCharName);
                            await createCharacter(chosenChar);
                            store.set({ skinMode: false, hasSkinButton: true });
                        }
                    } else {
                        skinModeLocal = false;
                        chosenChar = cfg.findForNonSame();
                        await createCharacter(chosenChar);
                        store.set({ skinMode: false, hasSkinButton: skinChars.length > 0 });
                    }
                    store.set({ tabMode });
                } else {
                    tabMode = "None";
                    skinModeLocal = false;
                    chosenChar = findCharByName(
                        (firstDigit === 1) ? charDataArray :
                            (firstDigit === 2) ? hsrCharDataArray :
                                (firstDigit === 3) ? zzzCharDataArray :
                                    (firstDigit === 4) ? wuwaCharDataArray :
                                        (firstDigit === 5) ? hnaCharDataArray :
                                            (firstDigit === 6) ? nteCharDataArray :
                                                charDataArray,
                        chosenCharName
                    );
                    await createCharacter(chosenChar);
                    store.set({ tabMode, skinMode: false });
                }
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

        async function createCharacter(chosenCharLocal?: BaseCharData | undefined): Promise<void> {
            engine.displayLoadingUI();
            promises = [];
            loadingTexts = [];
            prevCharId = chosenCharLocal!.id;
            if (!mmdRuntime) {
                mmdRuntime = createMmdRuntime(physicsModeOn);
            }
            if (chosenCharLocal && chosenCharLocal.directory && chosenCharLocal.pmx) {
                const mmdModelOptions = {
                    loggingEnabled: true,
                    materialBuilder: materialBuilder,
                    ...(isSpecialModelChar(chosenCharLocal) ? { buildSkeleton: false, buildMorph: false } : {})
                };

                promises.push(LoadAssetContainerAsync(
                    baseUrl + chosenCharLocal.directory + "/" + chosenCharLocal.pmx,
                    scene,
                    {
                        onProgress: (event) => updateLoadingText(2, `Loading model... ${event.loaded}/${event.total} (${Math.floor(event.loaded * 100 / event.total)}%)`),
                        pluginOptions: { mmdmodel: mmdModelOptions }
                    }
                ));
            } else {
                throw new Error("Chosen character or its properties are undefined");
            }
            if (tabMode == "WuWa" || tabMode == "NTE") {
                charScreenMode = false;
            } else {
                charScreenMode = true;
            }
            if (tabMode == "WuWa" || tabMode == "ZZZ" || tabMode == "NTE" || (tabMode == "None" && (firstDigitGlobal == 4 || firstDigitGlobal == 3 || firstDigitGlobal == 6))) {
                charScreenMode = true;
                charScreenElement = "Universal";
            } else if (tabMode == "HSR" || tabMode == "HNA" || (tabMode == "None" && (firstDigitGlobal == 2 || firstDigitGlobal == 5))) {
                charScreenMode = true;
                charScreenElement = "HSR";
            } else if (tabMode == "Genshin" || (tabMode == "None" && (firstDigitGlobal == 1))) {
                charScreenMode = true;
                charScreenElement = chosenCharLocal.element;
            }
            store.set({ charScreenMode });

            if (charScreenMode) {
                if (!isMobile) particleSystem.start();
                promises.push(LoadAssetContainerAsync(
                    resUrl("res/stages/GenshinCharacterSphere/CharacterSphere_" + charScreenElement + "V.pmx"),
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
                ));
            }
            loadResults = await Promise.all(promises);
            scene.onAfterRenderObservable.addOnce(() => {
                engine.hideLoadingUI();
            });

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

            headBone = mmdModel ? mmdModel.runtimeBones.find((bone: any) => bone.name === "頭") : undefined;
            bodyBone = mmdModel ? mmdModel.runtimeBones.find((bone: any) => bone.name === "センター") : undefined;
            boneWorldMatrix = new Matrix();

            if (headBone != undefined && bodyBone != undefined) {
                if (theCharAnimation) {
                    if (physicsModeOn) {
                        theCharAnimation = new MmdWasmAnimation(theCharAnimation as any, wasmInstance, scene);
                    }
                    try {
                        const modelAnimationHandle = mmdModel.createRuntimeAnimation(theCharAnimation as any);
                        mmdModel.setRuntimeAnimation(modelAnimationHandle);
                    } catch (error) {
                        console.error("Failed to create or set MMD animation:", error);
                    }
                }
                scene.onBeforeDrawPhaseObservable.addOnce(() => {
                    headBone!.getWorldMatrixToRef(boneWorldMatrixCam).multiplyToRef(modelMesh.getWorldMatrix(), boneWorldMatrixCam);
                    boneWorldMatrixCam.getTranslationToRef(mmdCameraRoot.position);
                    mmdCameraRoot.position.z = 10;
                    mmdCameraRoot.position.x = 0;
                    theDiff = theDiff - mmdCameraRoot.position.y / 10;
                    theHeight = mmdCameraRoot.position.y / 10;
                });

                scene.onBeforeRenderObservable.addOnce(() => {
                    bodyBone!.getWorldMatrixToRef(boneWorldMatrix).multiplyToRef(modelMesh.getWorldMatrix(), boneWorldMatrix);
                    boneWorldMatrix.getTranslationToRef(directionalLight.position);
                    directionalLight.position.y -= 10 * worldScale;
                });
            }

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
                if (!isLocal) {
                    try {
                        void firebase.countUp("phoshco", chosenCharLocal.name.replace(/\./g, "")).catch((error) => {
                            console.error("Failed count: ", error);
                        });
                    } catch (error) {
                        console.error("Unexpected error during count: ", error);
                    }
                }
            });

            store.set({ chosenCharId: chosenCharLocal.id });
        }

        // for scaling camera to model height
        {
            mmdCamera.parent = mmdCameraRoot;
            scene.onBeforeAnimationsObservable.add(() => {
                cameraPos = mmdCamera.position.y / 10;
                if (cameraPos < theHeight && 0 < cameraPos) {
                    mmdCameraRoot.position = new Vector3(mmdCameraRoot.position.x, 10 * (0 - theDiff * (cameraPos / theHeight)), -1);
                } else if (cameraPos <= 0) {
                    mmdCameraRoot.position = new Vector3(mmdCameraRoot.position.x, 0, -1);
                } else {
                    mmdCameraRoot.position = new Vector3(mmdCameraRoot.position.x, 10 * (0 - theDiff), -1);
                }
            });
        }

        const rotationMatrix = new Matrix();
        const cameraNormal = new Vector3();
        let cameraEyePosition = new Vector3();
        const headRelativePosition = new Vector3();

        scene.onBeforeRenderObservable.add(() => {
            Vector3.TransformNormalFromFloatsToRef(0, 0, 1, rotationMatrix, cameraNormal);
            cameraEyePosition = mmdCamera.position.addToRef(
                Vector3.TransformCoordinatesFromFloatsToRef(0, 0, mmdCamera.distance, rotationMatrix, cameraEyePosition),
                cameraEyePosition
            );
            if (headBone != undefined && bodyBone != undefined) {
                headBone!.getWorldMatrixToRef(boneWorldMatrixCam).getTranslationToRef(headRelativePosition).subtractToRef(cameraEyePosition, headRelativePosition);
            }
        });

        // switch camera when double click
        let lastClickTime = -Infinity;
        canvas.onclick = (): void => {
            // Preact UI now handles pointer-events isolation.
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
                defaultPipeline.depthOfFieldEnabled = false;
                scene.activeCameras![0] = mmdCamera;
            }
        };

        function handleKeyDown(e: KeyboardEvent): void {
            if (e.code === "Space" && !store.get().isCharPanelOpen) {
                e.preventDefault();
                if (scene.activeCameras![0] === stillCamera) {
                    defaultPipeline.depthOfFieldEnabled = false;
                    if (!mmdRuntime.isAnimationPlaying) {
                        scene.activeCameras![0] = mmdCamera;
                    }
                }
                if (mmdRuntime.isAnimationPlaying) {
                    mmdRuntime.pauseAnimation();
                } else {
                    mmdRuntime.playAnimation();
                }
            }
        }
        document.body.addEventListener("keydown", handleKeyDown);

        // Suppress reference-unused warnings
        void allSkinCharDataArray;
        void extraDataArray;
        void createCharacter;
        void changePhysics;
        void changeMotion;
        void handleKeyDown;
        void _cameraPositionUnused;

        function _cameraPositionUnused(): void {
            void cameraPos;
        }

        // Setter for dark mode: swap layer texture and update store.
        function setDarkMode(dark: boolean): void {
            bg_bool = dark;
            if (bg_bool) {
                layer.texture = dark_bg;
                scene.clearColor = new Color4(0.001, 0.001, 0.001, 1.0);
            } else {
                layer.texture = light_bg;
                scene.clearColor = new Color4(1, 1, 1, 1.0);
            }
            store.set({ darkMode: bg_bool });
        }

        function toggleCharScreenMode(): void {
            const s = store.get();
            if (s.charScreenMode) {
                if (modelMeshSt) modelMeshSt.setEnabled(false);
                if (!isMobile) particleSystem.stop();
            } else if ((tabMode == "Genshin" || tabMode == "HSR" || tabMode == "ZZZ" || tabMode == "HNA") && !s.charScreenMode) {
                if (modelMeshSt) modelMeshSt.setEnabled(true);
                if (!isMobile) particleSystem.start();
                if (!bg_bool) setDarkMode(true);
            }
            charScreenMode = !s.charScreenMode;
            store.set({ charScreenMode });
        }

        // The API bound to state store
        const api: SceneApi = {
            state: store,
            changeCharacter: async (name: string, id?: number): Promise<void> => {
                await changeCharacter(name, id ?? 0, false);
            },
            changeMotion: async (trackName: string): Promise<void> => {
                const track = motionConfig.find(t => t.name === trackName);
                if (!track) return;
                motionName = track.name;
                audioPlayerFile = track.audioPlayerFile;
                camMotionFile = track.camMotionFile;
                modelMotionFile = track.modelMotionFile;
                store.set({ motionName, isTrackPanelOpen: false });
                await changeMotion();
            },
            togglePhysics: async (): Promise<void> => {
                await changePhysics();
            },
            setDarkMode: (dark: boolean): void => {
                setDarkMode(dark);
            },
            toggleDarkMode: (): void => {
                setDarkMode(!bg_bool);
            },
            toggleCharScreenMode: (): void => {
                toggleCharScreenMode();
            },
            cycleSkin: async (): Promise<void> => {
                // Skin cycling reuses changeCharacter path with same character name/id.
                await changeCharacter(chosenCharName, chosenChar?.id, false);
            },
            openCharPanel: (): void => {
                store.set({ isCharPanelOpen: true });
            },
            closeCharPanel: (): void => {
                store.set({ isCharPanelOpen: false });
            },
            toggleCharPanel: (): void => {
                store.set({ isCharPanelOpen: !store.get().isCharPanelOpen });
            },
            openTrackPanel: (): void => {
                store.set({ isTrackPanelOpen: true });
            },
            closeTrackPanel: (): void => {
                store.set({ isTrackPanelOpen: false });
            },
            toggleTrackPanel: (): void => {
                store.set({ isTrackPanelOpen: !store.get().isTrackPanelOpen });
            },
            openSupport: (): void => {
                window.open("https://ko-fi.com/phoshco", "_blank");
            },
            setSearchQuery: (q: string): void => {
                store.set({ searchQuery: q });
            },
            setTab: (tab): void => {
                if (store.get().tabMode === tab) return;
                tabMode = tab;
                store.set({ tabMode: tab });
            },
            setSortAscending: (asc: boolean): void => {
                store.set({ sortModeAscending: asc });
            },
            toggleSortAscending: (): void => {
                store.set({ sortModeAscending: !store.get().sortModeAscending });
            },
            toggleSortModeKey: (): void => {
                const cur = store.get().sortModeKey;
                store.set({ sortModeKey: cur === "id" ? "name" : "id" });
            },
            setFilter: (tab, key, value): void => {
                const s = store.get();
                // Map tab name -> matching state field. Some tabs (HSR, ZZZ, HNA, NTE, WuWa)
                // need explicit mapping because a naive lowercase-first-char transform
                // would produce e.g. "hSRFilter" / "zZZFilter" which don't exist on state.
                const filterField: keyof SceneState =
                    tab === "Genshin" ? "genshinFilter" :
                        tab === "HSR" ? "hsrFilter" :
                            tab === "ZZZ" ? "zzzFilter" :
                                tab === "WuWa" ? "wuwaFilter" :
                                    tab === "HNA" ? "hnaFilter" :
                                        "nteFilter";
                const filterKey = filterField as keyof typeof s;
                const cur = (s[filterKey] as { key: string; value: string }[]).slice();
                const idx = cur.findIndex(e => e.key === key);
                if (idx !== -1) {
                    if (cur[idx].value === value) {
                        cur.splice(idx, 1);
                    } else {
                        cur[idx] = { key, value };
                    }
                } else {
                    cur.push({ key, value });
                }
                store.set({ [filterKey]: cur } as any);
            }
        };

        // Wire up pointer handlers used by camera+scene
        function handlePointerDown(_evt: IPointerEvent): void { /* char panel scroll now DOM */ }
        function handlePointerUp(_evt: IPointerEvent): void { /* char panel scroll now DOM */ }
        function handlePointerMove(_evt: IPointerEvent): void { /* char panel scroll now DOM */ }
        scene.onPointerDown = handlePointerDown;
        scene.onPointerUp = handlePointerUp;
        scene.onPointerMove = handlePointerMove;

        return { scene, api };
    }
}