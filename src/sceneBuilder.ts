// for use loading screen, we need to import following module.
import "@babylonjs/core/Loading/loadingScreen";
// for cast shadow, we need to import following module.
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
// for use WebXR we need to import following two modules.
import "@babylonjs/core/Helpers/sceneHelpers";
import "@babylonjs/core/Materials/Node/Blocks";
// if your model has .tga texture, uncomment following line.
// import "@babylonjs/core/Materials/Textures/Loaders/tgaTextureLoader";
// for load .bpmx file, we need to import following module.
import "babylon-mmd/esm/Loader/Optimized/bpmxLoader";
// if you want to use .pmx file, uncomment following line.
import "babylon-mmd/esm/Loader/pmxLoader";
// if you want to use .pmd file, uncomment following line.
// import "babylon-mmd/esm/Loader/pmdLoader";
// for play `MmdAnimation` we need to import following two modules.
import "babylon-mmd/esm/Runtime/Animation/mmdRuntimeCameraAnimation";
import "babylon-mmd/esm/Runtime/Animation/mmdRuntimeModelAnimation";
import "@babylonjs/core/Rendering/depthRendererSceneComponent";

// import { MirrorTexture, Plane } from "@babylonjs/core";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import type { Engine } from "@babylonjs/core/Engines/engine";
import { Layer } from "@babylonjs/core/Layers";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { ImageProcessingConfiguration } from "@babylonjs/core/Materials/imageProcessingConfiguration";
// import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { Matrix, Vector3 } from "@babylonjs/core/Maths/math.vector";
import { CreateGround } from "@babylonjs/core/Meshes/Builders/groundBuilder";
import type { Mesh } from "@babylonjs/core/Meshes/mesh";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin";
import { DepthOfFieldEffectBlurLevel } from "@babylonjs/core/PostProcesses";
import { DefaultRenderingPipeline } from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/defaultRenderingPipeline";
import { Scene } from "@babylonjs/core/scene";
import * as gui from "@babylonjs/gui";
import havokPhysics from "@babylonjs/havok";
// import { Inspector } from "@babylonjs/inspector";
import { ShadowOnlyMaterial } from "@babylonjs/materials/shadowOnly/shadowOnlyMaterial";
import type { MmdAnimation } from "babylon-mmd/esm/Loader/Animation/mmdAnimation";
import type { MmdStandardMaterialBuilder } from "babylon-mmd/esm/Loader/mmdStandardMaterialBuilder";
import type { BpmxLoader } from "babylon-mmd/esm/Loader/Optimized/bpmxLoader";
import { BvmdLoader } from "babylon-mmd/esm/Loader/Optimized/bvmdLoader";
import { SdefInjector } from "babylon-mmd/esm/Loader/sdefInjector";
// import { VmdLoader } from "babylon-mmd/esm/Loader/vmdLoader";
import { StreamAudioPlayer } from "babylon-mmd/esm/Runtime/Audio/streamAudioPlayer";
import { MmdCamera } from "babylon-mmd/esm/Runtime/mmdCamera";
import { MmdPhysics } from "babylon-mmd/esm/Runtime/mmdPhysics";
import { MmdRuntime } from "babylon-mmd/esm/Runtime/mmdRuntime";
import { MmdPlayerControl } from "babylon-mmd/esm/Runtime/Util/mmdPlayerControl";

import genshinCharDatas from "../res/assets/Genshin/genshin.json";
import type { ISceneBuilder } from "./baseRuntime";

export class SceneBuilder implements ISceneBuilder {
    public async build(canvas: HTMLCanvasElement, engine: Engine): Promise<Scene> {
        // for apply SDEF on shadow, outline, depth rendering
        SdefInjector.OverrideEngineCreateEffect(engine);

        // character json
        interface GenshinCharData {
            "_id": number;
            "name": string;
            "weaponType": string;
            "element": string;
            "gender": string;
            "region": string;
            "rarity": number;
            "directory": string;
            "image": string;
            "pmx": string;
        }

        const charDataArray = genshinCharDatas as GenshinCharData[];
        charDataArray.sort((a, b) => b._id - a._id);
        const findCharByName = <T extends { name: string }>(jsonData: T[], nameToFind: string): T | undefined => {
            return jsonData.find((item) => item.name === nameToFind);
        };
        // function filterBy<T extends { _id: number }>(dataArray: T[], filter: string): T[] {
        //     return dataArray.filter((data) => data._id.toString().startsWith(filter));
        // }
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
                const valueA = String(a[sortByKey]);
                const valueB = String(b[sortByKey]);

                if (sortAscending) {
                    return valueA.localeCompare(valueB);
                } else {
                    return valueB.localeCompare(valueA);
                }
            });
        }

        // get bpmx loader and set some configurations.
        const bpmxLoader = SceneLoader.GetPluginForExtension(".bpmx") as BpmxLoader;
        bpmxLoader.loggingEnabled = true;
        const materialBuilder = bpmxLoader.materialBuilder as MmdStandardMaterialBuilder;

        // if you want override texture loading, uncomment following lines.
        // materialBuilder.loadDiffuseTexture = (): void => { /* do nothing */ };
        // materialBuilder.loadSphereTexture = (): void => { /* do nothing */ };
        // materialBuilder.loadToonTexture = (): void => { /* do nothing */ };

        // if you need outline rendering, comment out following line.
        materialBuilder.loadOutlineRenderingProperties = (): void => { /* do nothing */ };

        const scene = new Scene(engine);
        scene.clearColor = new Color4(1, 1, 1, 1.0);

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
        mmdCamera.maxZ = 1000;
        mmdCamera.minZ = 1;
        mmdCamera.parent = mmdRoot;
        mmdCamera.layerMask = 1;

        const defCamPos = new Vector3(0, 10, -20).scaleInPlace(worldScale);
        const camera = new ArcRotateCamera("arcRotateCamera", 0, 0, 25 * worldScale, new Vector3(0, 10 * worldScale, 1), scene);
        camera.maxZ = 1000;
        camera.minZ = 0.1;
        camera.setPosition(defCamPos);
        camera.attachControl(canvas, false);
        camera.inertia = 0.8;
        camera.speed = 4 * worldScale;
        camera.zoomToMouseLocation = true;
        camera.wheelDeltaPercentage = 0.1;
        camera.layerMask = 1;

        const stillCamera = new ArcRotateCamera("stillCamera", 0, 0, 25 * worldScale, new Vector3(0, 10 * worldScale, 1), scene);
        stillCamera.maxZ = 1000;
        stillCamera.minZ = 0.1;
        stillCamera.setPosition(defCamPos);
        stillCamera.attachControl(canvas, false);
        stillCamera.inertia = 0.8;
        stillCamera.speed = 4 * worldScale;
        stillCamera.zoomToMouseLocation = true;
        stillCamera.wheelDeltaPercentage = 0.1;
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

        // create mmd runtime with physics
        let mmdRuntime = new MmdRuntime(new MmdPhysics(scene));
        mmdRuntime.loggingEnabled = true;
        mmdRuntime.register(scene);

        const audioPlayerFile = "res/cam_motion/Specialist (Never End ver.)/music001.mp3";
        const camMotionFile = "res/cam_motion/Specialist (Never End ver.)/CameraMAIN2.bvmd";
        const modelMotionFile = "res/cam_motion/Specialist (Never End ver.)/mmd_Specialist_motion.bvmd";

        // set audio player
        let audioPlayer = new StreamAudioPlayer(scene);
        audioPlayer.preservesPitch = false;
        // song
        audioPlayer.source = audioPlayerFile;
        mmdRuntime.setAudioPlayer(audioPlayer);

        // play before loading. this will cause the audio to play first before all assets are loaded.
        // playing the audio first can help ease the user's patience
        mmdRuntime.playAnimation();
        mmdRuntime.pauseAnimation();

        // create youtube like player control
        let mmdPlayerControl = new MmdPlayerControl(scene, mmdRuntime, audioPlayer);
        mmdPlayerControl.showPlayerControl();

        // show loading screen
        engine.displayLoadingUI();

        let loadingTexts: string[] = [];
        const updateLoadingText = (updateIndex: number, text: string): void => {
            loadingTexts[updateIndex] = text;
            engine.loadingUIText = "<br/><br/><br/><br/>" + loadingTexts.join("<br/><br/>");
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

        // model
        let chosenCharName = "Hu Tao";
        let chosenChar = findCharByName(charDataArray, chosenCharName);
        if (chosenChar && chosenChar.directory && chosenChar.pmx) {
            promises.push(SceneLoader.ImportMeshAsync(
                undefined,
                chosenChar.directory + "/",
                chosenChar.pmx,
                scene,
                (event) => updateLoadingText(2, `Loading model... ${event.loaded}/${event.total} (${Math.floor(event.loaded * 100 / event.total)}%)`)
            ));
        } else {
            throw new Error("Chosen character or its properties are undefined");
        }

        // stage
        // promises.push(SceneLoader.ImportMeshAsync(
        //     undefined,
        //     "res/stages/Cathedral/",
        //     "m.pmx",
        //     scene,
        //     (event) => updateLoadingText(3, `Loading stage... ${event.loaded}/${event.total} (${Math.floor(event.loaded * 100 / event.total)}%)`)
        // ));

        // physics
        promises.push((async(): Promise<void> => {
            updateLoadingText(2, "Loading physics engine...");
            const havokInstance = await havokPhysics();
            const havokPlugin = new HavokPlugin(true, havokInstance);
            scene.enablePhysics(new Vector3(0, -98 * worldScale, 0), havokPlugin);
            updateLoadingText(2, "Loading physics engine... Done");
        })());

        // wait for all promises. parallel loading is faster than sequential loading.
        let loadResults = await Promise.all(promises);

        // hide loading screen
        scene.onAfterRenderObservable.addOnce(() => engine.hideLoadingUI());
        scene.activeCameras = [stillCamera, guiCam];

        {
            // const stageMesh = loadResults[3].meshes[0] as Mesh;
            // stageMesh.parent = mmdRoot;

            // shadowGenerator.addShadowCaster(stageMesh);
            // stageMesh.receiveShadows = true;
        }
        let theDiff = 1.66;
        let theHeight = 69;
        let boneWorldMatrixCam = new Matrix();

        let modelMesh = loadResults[2].meshes[0] as Mesh;
        modelMesh.parent = mmdRoot;

        shadowGenerator.addShadowCaster(modelMesh);
        modelMesh.receiveShadows = true;

        let mmdModel = mmdRuntime.createMmdModel(modelMesh);
        const theCharAnimation = loadResults[1] as MmdAnimation;
        mmdModel.addAnimation(theCharAnimation);
        mmdModel.setAnimation("motion");

        // for scaling camera to model height
        let headBone = modelMesh.skeleton!.bones.find((bone) => bone.name === "頭");
        headBone!.getFinalMatrix()!.multiplyToRef(modelMesh.getWorldMatrix(), boneWorldMatrixCam);
        boneWorldMatrixCam.getTranslationToRef(mmdCameraRoot.position);
        theDiff -= mmdCameraRoot.position.y;
        theHeight = mmdCameraRoot.position.y;

        // make sure directional light follow the model
        let bodyBone = modelMesh.skeleton!.bones.find((bone) => bone.name === "センター");
        let boneWorldMatrix = new Matrix();

        scene.onBeforeRenderObservable.add(() => {
            bodyBone!.getFinalMatrix()!.multiplyToRef(modelMesh.getWorldMatrix(), boneWorldMatrix);
            boneWorldMatrix.getTranslationToRef(directionalLight.position);
            directionalLight.position.y -= 10 * worldScale;
        });

        const ground = CreateGround("ground1", { width: 100, height: 100, subdivisions: 2, updatable: false }, scene);
        const shadowOnlyMaterial = ground.material = new ShadowOnlyMaterial("shadowOnly", scene);
        shadowOnlyMaterial.activeLight = directionalLight;
        shadowOnlyMaterial.alpha = 0.4;

        ground.receiveShadows = true;
        ground.parent = mmdRoot;

        // const groundMaterial = ground.material = new StandardMaterial("GroundMaterial", scene);
        // groundMaterial.alphaMode = 2;
        // groundMaterial.alpha = 0.5;
        // groundMaterial.diffuseColor = new Color3(0.7, 0.7, 0.7);
        // groundMaterial.specularPower = 128;
        // const groundReflectionTexture = groundMaterial.reflectionTexture = new MirrorTexture("MirrorTexture", 1024, scene, true);
        // groundReflectionTexture.mirrorPlane = Plane.FromPositionAndNormal(ground.position, ground.getFacetNormal(0).scale(-1));
        // groundReflectionTexture.renderList = [modelMesh];
        // groundReflectionTexture.level = 0.45;

        mmdCamera.addAnimation(loadResults[0]);
        mmdCamera.storeState();
        mmdRuntime.setCamera(mmdCamera);
        mmdCamera.setAnimation("motion");

        // optimize scene when all assets are loaded
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
        });

        // if you want ground collision, uncomment following lines.
        // const groundRigidBody = new PhysicsBody(ground, PhysicsMotionType.STATIC, true, scene);
        // groundRigidBody.shape = new PhysicsShapeBox(
        //     new Vector3(0, -1, 0),
        //     new Quaternion(),
        //     new Vector3(100, 2, 100), scene);

        const defaultPipeline = new DefaultRenderingPipeline("default", true, scene, [mmdCamera, camera, stillCamera]);
        defaultPipeline.samples = 4;
        defaultPipeline.bloomEnabled = true;
        defaultPipeline.bloomScale = 10;
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
        defaultPipeline.depthOfFieldBlurLevel = DepthOfFieldEffectBlurLevel.Medium;
        defaultPipeline.depthOfField.fStop = 0.05;
        defaultPipeline.depthOfField.focalLength = 20;

        let cameraPos = 69;

        const layer = new Layer("", "res/stages/hoyo.png", scene, true, new Color4(1, 1, 1, 1));
        // layer.layerMask = 0x10000000;
        layer.render;

        // GUI
        const advancedTexture = gui.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        advancedTexture.layer!.layerMask = 0x10000000;
        advancedTexture.idealWidth = 1000;
        advancedTexture.idealHeight = 1000;
        advancedTexture.useSmallestIdeal = true;

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

        const showButton = gui.Button.CreateImageOnlyButton("but", "https://cdn-icons-png.flaticon.com/512/10613/10613684.png");
        showButton.horizontalAlignment = gui.Control.HORIZONTAL_ALIGNMENT_LEFT;
        showButton.left = "10px";
        showButton.verticalAlignment = gui.Control.VERTICAL_ALIGNMENT_TOP;
        showButton.top = "10px";
        showButton.width = "50px";
        showButton.height = "50px";
        showButton.thickness = 0;
        advancedTexture.addControl(showButton);

        showButton.onPointerClickObservable.add(function() {
            charPanel.isVisible = !charPanel.isVisible;
        });

        const charPanel = new gui.Rectangle();
        charPanel.width = "720px";
        charPanel.height = "920px";
        charPanel.background = "rgb(44,48,50)";
        charPanel.cornerRadius = 20;
        charPanel.thickness = 3;
        charPanel.color = "black";
        advancedTexture.addControl(charPanel);
        charPanel.isVisible = false;

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
        topBar.height = "100px";
        topBar.thickness = 0;
        panel.addControl(topBar);

        const genshinButton = gui.Button.CreateSimpleButton("but", "Genshin Impact");
        genshinButton.width = "233px";
        genshinButton.height = "50px";
        genshinButton.color = "white";
        genshinButton.background = "rgb(64,68,70)";
        genshinButton.thickness = 0;
        genshinButton.left = -233;
        genshinButton.top = -25;
        genshinButton.cornerRadiusX = genshinButton.cornerRadiusY = 15;
        topBar.addControl(genshinButton);

        const hsrButton = gui.Button.CreateSimpleButton("but", "Honkai: Star Rail");
        hsrButton.width = "233px";
        hsrButton.height = "50px";
        hsrButton.color = "white";
        hsrButton.background = charPanel.background;
        hsrButton.thickness = 0;
        hsrButton.left = 0;
        hsrButton.top = -25;
        hsrButton.cornerRadiusX = hsrButton.cornerRadiusY = 15;
        topBar.addControl(hsrButton);

        const othersButton = gui.Button.CreateSimpleButton("but", "Others");
        othersButton.width = "233px";
        othersButton.height = "50px";
        othersButton.color = "white";
        othersButton.background = charPanel.background;
        othersButton.thickness = 0;
        othersButton.left = 233;
        othersButton.top = -25;
        othersButton.cornerRadiusX = othersButton.cornerRadiusY = 15;
        topBar.addControl(othersButton);

        let tabMode = "Genshin";
        let sortModeAscending = false;
        let sortModeKey: keyof GenshinCharData = "_id";

        const genshinFilter: { key: keyof GenshinCharData; value: string }[] = [
            { key: "_id", value: "10000" }
        ];
        let filteredArray = filterBy(charDataArray, genshinFilter);

        genshinButton.onPointerClickObservable.add(function() {
            if (tabMode != "Genshin") {
                genshinButton.background = "rgb(64,68,70)";
                hideGenshinElements();
                if (tabMode == "HSR") {
                    hsrButton.background = charPanel.background;
                } else {
                    othersButton.background = charPanel.background;
                }
                tabMode = "Genshin";
            }
        });
        hsrButton.onPointerClickObservable.add(function() {
            if (tabMode != "HSR") {
                hsrButton.background = "rgb(64,68,70)";
                if (tabMode == "Genshin") {
                    genshinButton.background = charPanel.background;
                    hideGenshinElements();
                } else {
                    othersButton.background = charPanel.background;
                }
                tabMode = "HSR";
            }
        });
        othersButton.onPointerClickObservable.add(function() {
            if (tabMode != "Others") {
                othersButton.background = "rgb(64,68,70)";
                if (tabMode == "Genshin") {
                    genshinButton.background = charPanel.background;
                    hideGenshinElements();
                } else {
                    hsrButton.background = charPanel.background;
                }
                tabMode = "Others";
            }
        });

        const filterBar = new gui.Rectangle();
        filterBar.width = "700px";
        filterBar.height = "50px";
        filterBar.thickness = 0;
        filterBar.top = 25;
        filterBar.background = "rgb(64,68,70)";
        topBar.addControl(filterBar);

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
                if (sortModeKey == "_id") {
                    sortModeKey = "name";
                    sortModeChanger.textBlock.text = " Name ";
                } else {
                    sortModeKey = "_id";
                    sortModeChanger.textBlock.text = " Release ";
                }
                filteredArray = sortBy(filteredArray, sortModeKey, sortModeAscending);
                generateGrid(filteredArray);
            }
        });

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

        const anemoImage = gui.Button.CreateImageOnlyButton("but", "res/assets/Genshin/element_anemo.png");
        anemoImage.height = "40px";
        anemoImage.width = "40px";
        anemoImage.left = -108;
        anemoImage.thickness = 0;
        anemoImage.cornerRadius = 5;
        filterBar.addControl(anemoImage);
        anemoImage.onPointerClickObservable.add(function() {
            checkIfInFilter(anemoImage, "Anemo", "element");
        });

        const geoImage = gui.Button.CreateImageOnlyButton("but", "res/assets/Genshin/element_geo.png");
        geoImage.height = "40px";
        geoImage.width = "40px";
        geoImage.left = -68;
        geoImage.thickness = 0;
        geoImage.cornerRadius = 5;
        filterBar.addControl(geoImage);
        geoImage.onPointerClickObservable.add(function() {
            checkIfInFilter(geoImage, "Geo", "element");
        });

        const electroImage = gui.Button.CreateImageOnlyButton("but", "res/assets/Genshin/element_electro.png");
        electroImage.height = "40px";
        electroImage.width = "40px";
        electroImage.left = -28;
        electroImage.thickness = 0;
        electroImage.cornerRadius = 5;
        filterBar.addControl(electroImage);
        electroImage.onPointerClickObservable.add(function() {
            checkIfInFilter(electroImage, "Electro", "element");
        });

        const dendroImage = gui.Button.CreateImageOnlyButton("but", "res/assets/Genshin/element_dendro.png");
        dendroImage.height = "40px";
        dendroImage.width = "40px";
        dendroImage.left = 12;
        dendroImage.thickness = 0;
        dendroImage.cornerRadius = 5;
        filterBar.addControl(dendroImage);
        dendroImage.onPointerClickObservable.add(function() {
            checkIfInFilter(dendroImage, "Dendro", "element");
        });

        const hydroImage = gui.Button.CreateImageOnlyButton("but", "res/assets/Genshin/element_hydro.png");
        hydroImage.height = "40px";
        hydroImage.width = "40px";
        hydroImage.left = 52;
        hydroImage.thickness = 0;
        hydroImage.cornerRadius = 5;
        filterBar.addControl(hydroImage);
        hydroImage.onPointerClickObservable.add(function() {
            checkIfInFilter(hydroImage, "Hydro", "element");
        });

        const pyroImage = gui.Button.CreateImageOnlyButton("but", "res/assets/Genshin/element_pyro.png");
        pyroImage.height = "40px";
        pyroImage.width = "40px";
        pyroImage.left = 92;
        pyroImage.thickness = 0;
        pyroImage.cornerRadius = 5;
        filterBar.addControl(pyroImage);
        pyroImage.onPointerClickObservable.add(function() {
            checkIfInFilter(pyroImage, "Pyro", "element");
        });

        const cryoImage = gui.Button.CreateImageOnlyButton("but", "res/assets/Genshin/element_cryo.png");
        cryoImage.height = "40px";
        cryoImage.width = "40px";
        cryoImage.left = 132;
        cryoImage.thickness = 0;
        cryoImage.cornerRadius = 5;
        filterBar.addControl(cryoImage);
        cryoImage.onPointerClickObservable.add(function() {
            checkIfInFilter(cryoImage, "Cryo", "element");
        });

        const swordImage = gui.Button.CreateImageOnlyButton("but", "res/assets/Genshin/Sword.png");
        swordImage.height = "40px";
        swordImage.width = "40px";
        swordImage.left = 172;
        swordImage.thickness = 0;
        swordImage.cornerRadius = 5;
        filterBar.addControl(swordImage);
        swordImage.onPointerClickObservable.add(function() {
            checkIfInFilter(swordImage, "Sword", "weaponType");
        });

        const catalystImage = gui.Button.CreateImageOnlyButton("but", "res/assets/Genshin/Catalyst.png");
        catalystImage.height = "40px";
        catalystImage.width = "40px";
        catalystImage.left = 212;
        catalystImage.thickness = 0;
        catalystImage.cornerRadius = 5;
        filterBar.addControl(catalystImage);
        catalystImage.onPointerClickObservable.add(function() {
            checkIfInFilter(catalystImage, "Catalyst", "weaponType");
        });

        const bowImage = gui.Button.CreateImageOnlyButton("but", "res/assets/Genshin/Bow.png");
        bowImage.height = "40px";
        bowImage.width = "40px";
        bowImage.left = 252;
        bowImage.thickness = 0;
        bowImage.cornerRadius = 5;
        filterBar.addControl(bowImage);
        bowImage.onPointerClickObservable.add(function() {
            checkIfInFilter(bowImage, "Bow", "weaponType");
        });

        const claymoreImage = gui.Button.CreateImageOnlyButton("but", "res/assets/Genshin/Claymore.png");
        claymoreImage.height = "40px";
        claymoreImage.width = "40px";
        claymoreImage.left = 292;
        claymoreImage.thickness = 0;
        claymoreImage.cornerRadius = 5;
        filterBar.addControl(claymoreImage);
        claymoreImage.onPointerClickObservable.add(function() {
            checkIfInFilter(claymoreImage, "Claymore", "weaponType");
        });

        const poleImage = gui.Button.CreateImageOnlyButton("but", "res/assets/Genshin/Pole.png");
        poleImage.height = "40px";
        poleImage.width = "40px";
        poleImage.left = 332;
        poleImage.thickness = 0;
        poleImage.cornerRadius = 5;
        filterBar.addControl(poleImage);
        poleImage.onPointerClickObservable.add(function() {
            checkIfInFilter(poleImage, "Polearm", "weaponType");
        });

        function hideGenshinElements(): void {
            fourStarImage.isVisible = !fourStarImage.isVisible;
            fiveStarImage.isVisible = !fiveStarImage.isVisible;
            anemoImage.isVisible = !anemoImage.isVisible;
            geoImage.isVisible = !geoImage.isVisible;
            electroImage.isVisible = !electroImage.isVisible;
            dendroImage.isVisible = !dendroImage.isVisible;
            hydroImage.isVisible = !hydroImage.isVisible;
            pyroImage.isVisible = !pyroImage.isVisible;
            cryoImage.isVisible = !cryoImage.isVisible;
            swordImage.isVisible = !swordImage.isVisible;
            catalystImage.isVisible = !catalystImage.isVisible;
            bowImage.isVisible = !bowImage.isVisible;
            claymoreImage.isVisible = !claymoreImage.isVisible;
            poleImage.isVisible = !poleImage.isVisible;
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

        const myScrollViewer = new gui.ScrollViewer("name");
        myScrollViewer.thickness = 0;
        panel.addControl(myScrollViewer);

        let grid = new gui.Grid();
        let rows = 10;

        function generateGrid<T extends {_id: number, name: string, rarity: number, image: string}>(
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
                        const charButton = gui.Button.CreateImageOnlyButton("but", "https://static.wikia.nocookie.net/gensin-impact/images/f/f8/Icon_Emoji_Paimon%27s_Paintings_02_Qiqi_1.png");
                        charButton.thickness = 0;
                        grid.addControl(charButton, i, j);
                    } else {
                        const selChar = dataArray[charIndex];
                        const theBG = new gui.Rectangle();
                        theBG.cornerRadius = 10;
                        theBG.thickness = 0;
                        theBG.paddingBottom = theBG.paddingTop = theBG.paddingRight = theBG.paddingLeft = 4;
                        theBG.background = "rgb(123,92,144)";
                        if (selChar.rarity == 5) {
                            theBG.background = "rgb(146,109,69)";
                        }
                        grid.addControl(theBG, i, j);
                        const charButton = gui.Button.CreateImageOnlyButton("but", `res/charsPNG/${selChar.image}`);
                        charButton.thickness = 0;
                        charButton.cornerRadius = 10;
                        charButton.paddingBottom = charButton.paddingTop = charButton.paddingRight = charButton.paddingLeft = 4;
                        grid.addControl(charButton, i, j);
                        charButton.onPointerClickObservable.add(async function() {
                            charPanel.isVisible = !charPanel.isVisible;
                            if (chosenCharName != selChar.name) {
                                await changeCharacter(selChar.name);
                            }
                        });
                        charIndex += 1;
                    }
                }
            }
        }

        generateGrid(filteredArray);

        async function changeCharacter(nextCharacter?: string): Promise<void> {
            if (!nextCharacter) {
                return;
            }
            mmdRuntime.pauseAnimation();
            chosenCharName = nextCharacter;
            mmdRuntime.destroyMmdModel(mmdModel);
            modelMesh.dispose(false, true);
            mmdPlayerControl.dispose();
            // mmdCamera.removeAnimation(0);
            mmdCamera.restoreState();
            mmdRuntime.unregister(scene);

            mmdRuntime = new MmdRuntime(new MmdPhysics(scene));
            mmdRuntime.loggingEnabled = true;
            mmdRuntime.register(scene);

            audioPlayer = new StreamAudioPlayer(scene);
            audioPlayer.preservesPitch = false;
            audioPlayer.source = audioPlayerFile;
            mmdRuntime.setAudioPlayer(audioPlayer);
            mmdRuntime.playAnimation();
            mmdRuntime.pauseAnimation();

            mmdPlayerControl = new MmdPlayerControl(scene, mmdRuntime, audioPlayer);
            mmdPlayerControl.showPlayerControl();

            engine.displayLoadingUI();
            promises = [];
            loadingTexts = [];
            chosenChar = findCharByName(charDataArray, chosenCharName);
            if (chosenChar && chosenChar.directory && chosenChar.pmx) {
                promises.push(SceneLoader.ImportMeshAsync(
                    undefined,
                    chosenChar.directory + "/",
                    chosenChar.pmx,
                    scene,
                    (event) => updateLoadingText(0, `Loading model... ${event.loaded}/${event.total} (${Math.floor(event.loaded * 100 / event.total)}%)`)
                ));
            } else {
                throw new Error("Chosen character or its properties are undefined");
            }
            loadResults = await Promise.all(promises);
            scene.onAfterRenderObservable.addOnce(() => engine.hideLoadingUI());
            scene.activeCameras = [stillCamera, guiCam];

            theDiff = 1.66;
            theHeight = 69;
            boneWorldMatrixCam = new Matrix();

            modelMesh = loadResults[0].meshes[0] as Mesh;
            modelMesh.parent = mmdRoot;

            shadowGenerator.addShadowCaster(modelMesh);
            modelMesh.receiveShadows = true;

            mmdModel = mmdRuntime.createMmdModel(modelMesh);
            mmdModel.addAnimation(theCharAnimation);
            mmdModel.setAnimation("motion");

            headBone = modelMesh.skeleton!.bones.find((bone) => bone.name === "頭");
            headBone!.getFinalMatrix()!.multiplyToRef(modelMesh.getWorldMatrix(), boneWorldMatrixCam);
            boneWorldMatrixCam.getTranslationToRef(mmdCameraRoot.position);
            theDiff -= mmdCameraRoot.position.y;
            theHeight = mmdCameraRoot.position.y;

            bodyBone = modelMesh.skeleton!.bones.find((bone) => bone.name === "センター");
            boneWorldMatrix = new Matrix();

            scene.onBeforeRenderObservable.add(() => {
                bodyBone!.getFinalMatrix()!.multiplyToRef(modelMesh.getWorldMatrix(), boneWorldMatrix);
                boneWorldMatrix.getTranslationToRef(directionalLight.position);
                directionalLight.position.y -= 10 * worldScale;
            });

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
                audioPlayer.mute();
            });
        }


        // for scaling camera to model height
        {
            mmdCameraRoot.position.x = mmdRoot.position.x;
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
                mmdCamera.parent = mmdCameraRoot;
            });
        }

        const rotationMatrix = new Matrix();
        const cameraNormal = new Vector3();
        const cameraEyePosition = new Vector3();
        const headRelativePosition = new Vector3();

        scene.onBeforeRenderObservable.add(() => {
            const cameraRotation = mmdCamera.rotation;
            Matrix.RotationYawPitchRollToRef(-cameraRotation.y, -cameraRotation.x, -cameraRotation.z, rotationMatrix);

            Vector3.TransformNormalFromFloatsToRef(0, 0, 1, rotationMatrix, cameraNormal);

            mmdCamera.position.addToRef(
                Vector3.TransformCoordinatesFromFloatsToRef(0, 0, mmdCamera.distance, rotationMatrix, cameraEyePosition),
                cameraEyePosition
            );

            headBone!.getFinalMatrix().getTranslationToRef(headRelativePosition).subtractToRef(cameraEyePosition, headRelativePosition);

            defaultPipeline.depthOfField.focusDistance = (Vector3.Dot(headRelativePosition, cameraNormal) / Vector3.Dot(cameraNormal, cameraNormal)) * 1000;
        });

        // switch camera when double click
        let lastClickTime = -Infinity;
        canvas.onclick = (): void => {
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
            if (e.code === "Space") {
                e.preventDefault();
                if (scene.activeCameras![0] === stillCamera) {
                    defaultPipeline.depthOfFieldEnabled = false; //true
                    scene.activeCameras![0] = mmdCamera;
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

        // if you want to use inspector, uncomment following line.
        // Inspector.Show(scene, { });

        // webxr experience for AR
        const webXrExperience = await scene.createDefaultXRExperienceAsync({
            uiOptions: {
                sessionMode: "immersive-ar",
                referenceSpaceType: "local-floor"
            }
        });
        webXrExperience;
        // webXrExperience.baseExperience?.sessionManager.onXRSessionInit.add(() => {
        //     defaultPipeline.addCamera(webXrExperience.baseExperience.camera);
        // });

        return scene;
    }
}
