"use strict";(self.webpackChunkmodel_viewer=self.webpackChunkmodel_viewer||[]).push([[485],{5485:(e,n,i)=>{i.r(n),i.d(n,{mmdOutlineVertexShader:()=>o}),i(2806),i(8900),i(6340),i(8217),i(7029),i(4559),i(3226),i(8258),i(9129),i(1277),i(5470),i(242),i(5197),i(1482);const t="mmdOutlineVertexShader",r="\n// Attribute\nattribute position: vec3f;\nattribute normal: vec3f;\n\n#include<bonesDeclaration>\n#include<bakedVertexAnimationDeclaration>\n\n#include<morphTargetsVertexGlobalDeclaration>\n#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]\n\n#include<clipPlaneVertexDeclaration>\n\n// Uniform\nuniform offset: f32;\n\n#include<instancesDeclaration>\n\nuniform viewport: vec2f;\nuniform view: mat3x3f;\nuniform viewProjection: mat4x4f;\n#ifdef WORLDPOS_REQUIRED\nuniform inverseViewProjection: mat4x4f;\n#endif\n\n#ifdef ALPHATEST\nvarying vUV: vec2f;\nuniform diffuseMatrix: mat4x4f; \n#ifdef UV1\nattribute uv: vec2f;\n#endif\n#ifdef UV2\nattribute uv2: vec2f;\n#endif\n#endif\n#include<logDepthDeclaration>\n\n\n#define CUSTOM_VERTEX_DEFINITIONS\n\n@vertex\nfn main(input: VertexInputs) -> FragmentInputs {\n    var positionUpdated: vec3f = vertexInputs.position;\n    var normalUpdated: vec3f = vertexInputs.normal;\n#ifdef UV1\n    var uvUpdated: vec2f = vertexInputs.uv;\n#endif\n    #include<morphTargetsVertexGlobal>\n    #include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]\n\n#include<instancesVertex>\n#include<bonesVertex>\n#include<bakedVertexAnimation>\n\n    var viewNormal: vec3f = uniforms.view * (mat3x3(finalWorld[0].xyz, finalWorld[1].xyz, finalWorld[2].xyz) * normalUpdated);\n    var projectedPosition: vec4f = uniforms.viewProjection * finalWorld * vec4f(positionUpdated, 1.0);\n    var screenNormal: vec2f = normalize(viewNormal.xy);\n    projectedPosition = vec4f(\n        projectedPosition.xy + (screenNormal / (uniforms.viewport * 0.25 /* 0.5 */) * uniforms.offset * projectedPosition.w),\n        projectedPosition.z,\n        projectedPosition.w\n    );\n\n    vertexOutputs.position = projectedPosition;\n#ifdef WORLDPOS_REQUIRED\n    var worldPos: vec4f = uniforms.inverseViewProjection * projectedPosition;\n#endif\n\n#ifdef ALPHATEST\n#ifdef UV1\n    vertexOutputs.vUV = (uniforms.diffuseMatrix * vec4f(uvUpdated, 1.0, 0.0)).xy;\n#endif\n#ifdef UV2\n    vertexOutputs.vUV = (uniforms.diffuseMatrix * vec4f(vertexInputs.uv2, 1.0, 0.0)).xy;\n#endif\n#endif\n#include<clipPlaneVertex>\n#include<logDepthVertex>\n}\n";i(9610).l.ShadersStoreWGSL[t]=r;const o={name:t,shader:r}}}]);