/* ------------------------------------------------------------
 * AlternativeFull
 * ------------------------------------------------------------ */
#define TEXTURE_THRESHOLD "shading_hint.png"
#define USE_MATERIAL_TEXTURE
#define USE_NORMALMAP
#define TEXTURE_NORMALMAP "Body.png"
float NormalMapResolution = 1;
#define USE_LAMBERT
float LambertFactor = 0.5;
#define USE_SELFSHADOW_MODE
#define USE_NONE_SELFSHADOW_MODE
#define USE_FILL_LIGHT_TYPE2
float FillLight2Power = 0.0;
#define USE_RIM_LIGHT
float RimLightPower = 0.9;
float RimLightThreshold = 3;
float SelfShadowPower = 1;
#define USE_MATERIAL_SPECULAR
#define USE_MATERIAL_SPHERE
float3 DefaultModeShadowColor = {1,1,1};
#define MAX_ANISOTROPY 16
#define USE_EXTRA_LIGHT_DIRECTION
#define USE_LIGHT_FIXED_NORMAL

#include "AlternativeFull.fxsub"
