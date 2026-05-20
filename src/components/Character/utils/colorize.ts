import * as THREE from "three";

// ════════════════════════════════════════════════════════════════════════════
//  PALETTE — "Neon Noir"
//  Strategy:
//   1. Hard-skip list  → hardware/tech meshes (eyes, screen, metal…)
//   2. Clothing map    → matched by keyword → get clothing colour
//   3. Default fallback → anything else (face, hands, body, etc.) → SKIN
// ════════════════════════════════════════════════════════════════════════════

type MatDef = [
  color: number,
  emissive: number,
  emissiveIntensity: number,
  roughness: number,
  metalness: number
];

// ── Skin tones ───────────────────────────────────────────────────────────────
// Warm medium-brown skin — used for face, head, neck, ears, body, fallback
const SKIN:    MatDef = [0xc68642, 0x3d1408, 0.04, 0.72, 0.0];
// Slightly lighter variant for hands / arms where needed
const SKIN_LT: MatDef = [0xc68642, 0x3d1408, 0.04, 0.72, 0.0]; // ← same as SKIN so ears/face always match
const HAIR:    MatDef = [0x1a0e08, 0x110804, 0.06, 0.60, 0.05];

// ── Clothing ─────────────────────────────────────────────────────────────────
const TSHIRT:  MatDef = [0x1c2333, 0x4488ff, 0.12, 0.80, 0.0];
const JACKET:  MatDef = [0x0b0e1f, 0x6a00ff, 0.18, 0.50, 0.05];
const HOODIE:  MatDef = [0x0d1527, 0x0070ff, 0.15, 0.70, 0.0];
// Clearly visible medium gray pants
const PANTS:   MatDef = [0x787880, 0x333338, 0.04, 0.85, 0.0];
// Rich warm brown leather shoes
const SHOE:    MatDef = [0x4a2810, 0x8b4513, 0.10, 0.60, 0.05];
const BELT:    MatDef = [0x1a0814, 0xcc0066, 0.15, 0.55, 0.20];
const STRAP:   MatDef = [0x1a0814, 0xaa0044, 0.12, 0.55, 0.20];
const GLOVE:   MatDef = [0x0a0f1e, 0x00d4ff, 0.15, 0.55, 0.10];
const SCARF:   MatDef = [0x1a0a0a, 0xcc2200, 0.12, 0.70, 0.0];
const CLOTH:   MatDef = [0x141420, 0x5533ff, 0.10, 0.70, 0.0];

// ── Clothing keyword → MatDef (order matters — more specific first) ───────────
const CLOTHING_MAP: Array<[string, MatDef]> = [
  // Hair
  ["hair",     HAIR],
  ["brow",     HAIR],
  ["beard",    HAIR],
  ["mustache", HAIR],
  ["lash",     HAIR],

  // Tops
  ["tshirt",   TSHIRT],
  ["t-shirt",  TSHIRT],
  ["shirt",    TSHIRT],
  ["tee",      TSHIRT],

  // Jacket / outer
  ["jacket",   JACKET],
  ["coat",     JACKET],
  ["hoodie",   HOODIE],
  ["hood",     HOODIE],
  ["collar",   JACKET],
  ["sleeve",   JACKET],
  ["uniform",  JACKET],
  ["suit",     JACKET],

  // Bottoms — many possible mesh names for pants/lower body
  ["pants",    PANTS],
  ["pant",     PANTS],
  ["trousers", PANTS],
  ["jeans",    PANTS],
  ["shorts",   PANTS],
  ["bottom",   PANTS],
  ["lower",    PANTS],
  ["thigh",    PANTS],
  ["calf",     PANTS],
  ["knee",     PANTS],
  ["waist",    PANTS],
  ["pelvis",   PANTS],
  ["hip",      PANTS],

  // Footwear
  ["shoe",     SHOE],
  ["boot",     SHOE],
  ["sneaker",  SHOE],
  ["sole",     SHOE],
  ["foot",     SHOE],   // "footR" / "footL" are the feet bones — color as shoe
  ["feet",     SHOE],

  // Accessories
  ["belt",     BELT],
  ["strap",    STRAP],
  ["glove",    GLOVE],
  ["scarf",    SCARF],
  ["wrap",     SCARF],

  // Generic cloth
  ["cloth",    CLOTH],
  ["fabric",   CLOTH],
];

// ── Meshes to skip entirely (engine / glass / metal parts) ──────────────────
const HARD_SKIP_KEYWORDS = [
  "eye", "iris", "sclera", "pupil",
  "teeth", "tongue", "nail",
  "glass", "lens", "screen", "light", "emit", "glow",
  "metal", "chrome", "steel", "iron",
  "rig", "bone", "armature", "helper",
];

// ── Meshes that are ALWAYS skin (even if name doesn't hint it) ───────────────
// Many Blender rigs name the body mesh as: Character, Mesh, Base, default…
const FORCE_SKIN_KEYWORDS = [
  "skin", "face", "head", "neck",
  "hand", "arm", "finger", "thumb",
  "leg",  "ear",  "nose",  "lip",
  "chin", "cheek", "forehead",
  // Blender generic body-mesh names
  "character", "base_mesh", "basemesh", "base mesh",
  "body_mesh",  "bodymesh",
  "human", "person", "man", "woman", "male", "female",
];

// ════════════════════════════════════════════════════════════════════════════

function applyDef(mat: THREE.Material, def: MatDef): THREE.Material {
  const m = mat.clone() as THREE.MeshStandardMaterial;
  if (!("color" in m)) return mat;
  m.color             = new THREE.Color(def[0]);
  m.emissive          = new THREE.Color(def[1]);
  m.emissiveIntensity = def[2];
  m.roughness         = def[3];
  m.metalness         = def[4];
  m.needsUpdate       = true;
  return m;
}

function resolveDef(name: string): MatDef | null {
  const lower = name.toLowerCase();

  // 1. Skip hardware / glass / metal
  for (const kw of HARD_SKIP_KEYWORDS) {
    if (lower.includes(kw)) return null;
  }

  // 2. Force skin for known skin/body keywords
  for (const kw of FORCE_SKIN_KEYWORDS) {
    if (lower.includes(kw)) return SKIN;
  }

  // 3. Match clothing keywords
  for (const [kw, def] of CLOTHING_MAP) {
    if (lower.includes(kw)) return def;
  }

  // 4. ★ DEFAULT FALLBACK ★ — anything not matched and not skipped
  //    is assumed to be exposed skin (face, torso, etc.)
  return SKIN_LT;
}

// ════════════════════════════════════════════════════════════════════════════

/**
 * Traverses all meshes in the GLTF character scene and applies the
 * Neon-Noir colour palette.  Un-matched meshes default to skin colour
 * so the face always gets coloured regardless of its mesh name.
 */
export function colorizeCharacter(
  character: THREE.Object3D,
  debug = false
): void {
  const log: Array<{ name: string; applied: string }> = [];

  character.traverse((child) => {
    if (!(child as THREE.Mesh).isMesh) return;
    const mesh = child as THREE.Mesh;
    const name = mesh.name ?? "";
    const def  = resolveDef(name);

    if (!def) {
      log.push({ name: name || "(unnamed)", applied: "— skipped" });
      return;
    }

    const label =
      def === SKIN    ? "SKIN"   :
      def === SKIN_LT ? "SKIN_LT":
      def === HAIR    ? "HAIR"   :
      def === TSHIRT  ? "TSHIRT" :
      def === JACKET  ? "JACKET" :
      def === HOODIE  ? "HOODIE" :
      def === PANTS   ? "PANTS"  :
      def === SHOE    ? "SHOE"   :
      def === BELT    ? "BELT"   :
      def === GLOVE   ? "GLOVE"  :
      def === SCARF   ? "SCARF"  :
      def === CLOTH   ? "CLOTH"  : "?";

    log.push({ name: name || "(unnamed)", applied: label });

    if (Array.isArray(mesh.material)) {
      mesh.material = mesh.material.map((m) => applyDef(m, def));
    } else {
      mesh.material = applyDef(mesh.material, def);
    }
  });

  if (debug) {
    console.group("🎨 colorize.ts — mesh → palette");
    log.forEach(({ name, applied }) =>
      console.log(`%c${applied.padEnd(8)}%c ${name}`,
        "color:#aaffcc;font-weight:bold", "color:#ccc")
    );
    console.groupEnd();
  }
}

/**
 * Directly tint a mesh by its exact name.
 * Use after spotting the right name in the debug console log.
 */
export function tintMeshByName(
  character: THREE.Object3D,
  meshName: string,
  color: number,
  emissive = 0x000000,
  emissiveIntensity = 0.1
): boolean {
  const target = character.getObjectByName(meshName) as THREE.Mesh | undefined;
  if (!target || !target.isMesh) return false;
  const def: MatDef = [color, emissive, emissiveIntensity, 0.72, 0.0];
  if (Array.isArray(target.material)) {
    target.material = target.material.map((m) => applyDef(m, def));
  } else {
    target.material = applyDef(target.material, def);
  }
  return true;
}
