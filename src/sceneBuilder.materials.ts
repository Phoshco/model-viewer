import type { MmdStandardMaterial } from "babylon-mmd/esm/Loader/mmdStandardMaterial";
import { Material } from "@babylonjs/core";
import { Color3 } from "@babylonjs/core/Maths/math.color";

// Keep exact logic from original callbacks — exported so SceneBuilder can assign them.
export const afterBuildSingleMaterialDefault = (material: MmdStandardMaterial): void => {
    material.forceDepthWrite = true;
    material.useAlphaFromDiffuseTexture = true;
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

export const afterBuildSingleMaterialSt = (material: MmdStandardMaterial): void => {
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
