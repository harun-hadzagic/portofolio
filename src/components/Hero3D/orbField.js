import * as THREE from "three";

/**
 * The orb reacts to the pointer as a force acting on its shell: a dimple under
 * the cursor, and rings that travel outward from each click. Both are pure
 * vertex displacement, injected into three's stock point and line shaders so
 * the orb keeps the exact material it already had — only the geometry moves.
 *
 * Every position here is in the spinning group's LOCAL space. The rig converts
 * the pointer into that space on the CPU each frame, which keeps the shader
 * free of any assumption about the orb's current transform.
 */

export const PULSE_SLOTS = 3;
export const PULSE_LIFETIME = 2.4;

const DECLARATIONS = /* glsl */ `
uniform vec3 uPointer;
uniform float uPointerStrength;
uniform float uPointerRadius;
uniform float uPointerPush;
uniform vec3 uPulseOrigin[${PULSE_SLOTS}];
uniform float uPulseAge[${PULSE_SLOTS}];
uniform float uPulseSpeed;
uniform float uPulseWidth;
uniform float uPulseAmp;
uniform float uSizeBoost;
uniform vec3 uHotColor;
varying float vOrbEnergy;
`;

const VERTEX_DISPLACEMENT = /* glsl */ `
vec3 orbBase = position;
vec3 orbNormal = normalize( orbBase + vec3( 1e-5 ) );
float orbEnergy = 0.0;

// The cursor presses into the shell. The dimple lives in the pointer's frame,
// not the orb's, so particles rotate through it instead of carrying it along.
vec3 orbToPointer = orbBase - uPointer;
float orbPointerFall = ( 1.0 - smoothstep( 0.0, uPointerRadius, length( orbToPointer ) ) ) * uPointerStrength;
transformed += normalize( orbToPointer + vec3( 1e-5 ) ) * orbPointerFall * uPointerPush;
orbEnergy += orbPointerFall;

// Each click releases a ring that expands across the surface and decays.
for ( int i = 0; i < ${PULSE_SLOTS}; i++ ) {
	float orbAlive = step( 0.0, uPulseAge[ i ] );
	float orbAge = max( uPulseAge[ i ], 0.0 );
	// pow() is undefined for a negative base, and this one straddles zero.
	float orbQ = ( distance( orbBase, uPulseOrigin[ i ] ) - orbAge * uPulseSpeed ) / uPulseWidth;
	float orbAmt = exp( - orbQ * orbQ ) * exp( - orbAge * 1.7 ) * orbAlive;
	transformed += orbNormal * orbAmt * uPulseAmp;
	orbEnergy += orbAmt;
}

vOrbEnergy = min( orbEnergy, 1.6 );
`;

const FRAGMENT_ENERGY = /* glsl */ `
float orbHeat = min( vOrbEnergy, 1.0 );
diffuseColor.rgb = mix( diffuseColor.rgb, uHotColor, orbHeat * 0.55 );
diffuseColor.rgb *= 1.0 + vOrbEnergy * 1.35;
diffuseColor.a = min( 1.0, diffuseColor.a * ( 1.0 + vOrbEnergy * 0.9 ) );
`;

export function createOrbUniforms() {
  return {
    uPointer: { value: new THREE.Vector3(0, 0, 1000) },
    uPointerStrength: { value: 0 },
    uPointerRadius: { value: 0.9 },
    uPointerPush: { value: 0.3 },
    uPulseOrigin: {
      value: Array.from({ length: PULSE_SLOTS }, () => new THREE.Vector3()),
    },
    uPulseAge: { value: new Array(PULSE_SLOTS).fill(-1) },
    uPulseSpeed: { value: 3.1 },
    uPulseWidth: { value: 0.45 },
    uPulseAmp: { value: 0.38 },
    uSizeBoost: { value: 1.6 },
    uHotColor: { value: new THREE.Color("#ffcf6e") },
  };
}

/**
 * Chains the displacement onto whatever the material already compiles, so a
 * material that arrives with its own onBeforeCompile (drei's PointMaterial and
 * its round-sprite mask) keeps it.
 */
export function applyOrbField(material, uniforms, { points = false } = {}) {
  const inherited = material.onBeforeCompile;

  material.onBeforeCompile = (shader, renderer) => {
    if (typeof inherited === "function") inherited.call(material, shader, renderer);

    Object.assign(shader.uniforms, uniforms);

    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", `#include <common>\n${DECLARATIONS}`)
      .replace("#include <begin_vertex>", `#include <begin_vertex>\n${VERTEX_DISPLACEMENT}`);

    if (points) {
      shader.vertexShader = shader.vertexShader.replace(
        "gl_PointSize = size;",
        "gl_PointSize = size * ( 1.0 + vOrbEnergy * uSizeBoost );"
      );
    }

    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", `#include <common>\n${DECLARATIONS}`)
      .replace("#include <color_fragment>", `#include <color_fragment>\n${FRAGMENT_ENERGY}`);
  };

  // Without this three warns, and the two point materials would be free to
  // share a cached program built before the injection.
  material.customProgramCacheKey = () => (points ? "orb-field-points" : "orb-field-line");
  material.needsUpdate = true;

  return material;
}

const rayDirection = new THREE.Vector3();

/**
 * Projects a pointer in NDC onto a sphere of `radius` at the world origin. When
 * the pointer sits outside the silhouette the contact point slides around the
 * limb rather than vanishing, so the dimple never snaps off the edge.
 */
export function pointerToShell(camera, ndcX, ndcY, radius, out) {
  rayDirection.set(ndcX, ndcY, 0.5).unproject(camera).sub(camera.position).normalize();

  const origin = camera.position;
  const closest = -origin.dot(rayDirection);
  const offsetSq = origin.lengthSq() - closest * closest;
  const radiusSq = radius * radius;

  if (offsetSq <= radiusSq) {
    const halfChord = Math.sqrt(radiusSq - offsetSq);
    return out.copy(rayDirection).multiplyScalar(closest - halfChord).add(origin);
  }

  return out.copy(rayDirection).multiplyScalar(closest).add(origin).setLength(radius);
}
