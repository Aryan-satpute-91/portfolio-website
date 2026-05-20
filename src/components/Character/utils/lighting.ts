import * as THREE from "three";
import { RGBELoader } from "three-stdlib";
import { gsap } from "gsap";

const setLighting = (scene: THREE.Scene) => {
  // ── Primary purple back-directional light ──────────────────────────────
  const directionalLight = new THREE.DirectionalLight(0xc7a9ff, 0);
  directionalLight.intensity = 0;
  directionalLight.position.set(-0.47, -0.32, -1);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50;
  scene.add(directionalLight);

  // ── Warm golden Day Sun Light ──────────────────────────────────────────
  const sunLight = new THREE.DirectionalLight(0xfff7e6, 0);
  sunLight.position.set(5, 8, 4);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 1024;
  sunLight.shadow.mapSize.height = 1024;
  scene.add(sunLight);

  // ── Screen fill point light (driven by screen emissive) ───────────────
  const pointLight = new THREE.PointLight(0xc2a4ff, 0, 100, 3);
  pointLight.position.set(3, 12, 4);
  pointLight.castShadow = true;
  scene.add(pointLight);

  // ── Cyan left-fill rim light ───────────────────────────────────────────
  const cyanRim = new THREE.PointLight(0x00e5ff, 0, 30, 2);
  cyanRim.position.set(-4, 11, 3);
  scene.add(cyanRim);

  // ── Warm orange accent (back-right) ───────────────────────────────────
  const orangeAccent = new THREE.PointLight(0xff6a00, 0, 35, 2.5);
  orangeAccent.position.set(5, 9, -3);
  scene.add(orangeAccent);

  // ── Green low-ground bounce light ─────────────────────────────────────
  const greenBounce = new THREE.PointLight(0x39ff14, 0, 25, 2);
  greenBounce.position.set(0, 5, 5);
  scene.add(greenBounce);

  new RGBELoader()
    .setPath("/models/")
    .load("char_enviorment.hdr", function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.environmentIntensity = 0;
      scene.environmentRotation.set(5.76, 85.85, 1);
    });

  function setPointLight(screenLight: any) {
    if (screenLight && screenLight.material) {
      if (screenLight.material.opacity > 0.9) {
        pointLight.intensity = screenLight.material.emissiveIntensity * 20;
      } else {
        pointLight.intensity = 0;
      }
    } else {
      pointLight.intensity = 0;
    }
  }

  const duration = 2;
  const ease = "power2.inOut";

  function turnOnLights(currentTheme: "light" | "dark") {
    gsap.to(scene, {
      environmentIntensity: currentTheme === "light" ? 1.3 : 0.64,
      duration: duration,
      ease: ease,
    });
    if (currentTheme === "light") {
      gsap.to(sunLight, { intensity: 3.0, duration: duration, ease: ease });
      gsap.to(directionalLight, { intensity: 0.1, duration: duration, ease: ease });
      gsap.to(cyanRim, { intensity: 0.1, duration: duration + 0.5, ease: ease, delay: 0.4 });
      gsap.to(orangeAccent, { intensity: 0.15, duration: duration + 0.8, ease: ease, delay: 0.6 });
      gsap.to(greenBounce, { intensity: 0.05, duration: duration + 1, ease: ease, delay: 0.8 });
    } else {
      gsap.to(sunLight, { intensity: 0, duration: duration, ease: ease });
      gsap.to(directionalLight, { intensity: 1.2, duration: duration, ease: ease });
      gsap.to(cyanRim, { intensity: 1.8, duration: duration + 0.5, ease: ease, delay: 0.4 });
      gsap.to(orangeAccent, { intensity: 1.4, duration: duration + 0.8, ease: ease, delay: 0.6 });
      gsap.to(greenBounce, { intensity: 0.8, duration: duration + 1, ease: ease, delay: 0.8 });
    }
    gsap.to(".character-rim", {
      y: "55%",
      opacity: 1,
      delay: 0.2,
      duration: 2,
    });
  }

  function transitionToTheme(theme: "light" | "dark") {
    gsap.to(scene, {
      environmentIntensity: theme === "light" ? 1.3 : 0.64,
      duration: duration,
      ease: ease,
    });
    if (theme === "light") {
      gsap.to(sunLight, { intensity: 3.0, duration: duration, ease: ease });
      gsap.to(directionalLight, { intensity: 0.1, duration: duration, ease: ease });
      gsap.to(cyanRim, { intensity: 0.1, duration: duration, ease: ease });
      gsap.to(orangeAccent, { intensity: 0.15, duration: duration, ease: ease });
      gsap.to(greenBounce, { intensity: 0.05, duration: duration, ease: ease });
    } else {
      gsap.to(sunLight, { intensity: 0, duration: duration, ease: ease });
      gsap.to(directionalLight, { intensity: 1.2, duration: duration, ease: ease });
      gsap.to(cyanRim, { intensity: 1.8, duration: duration, ease: ease });
      gsap.to(orangeAccent, { intensity: 1.4, duration: duration, ease: ease });
      gsap.to(greenBounce, { intensity: 0.8, duration: duration, ease: ease });
    }
  }

  // Slow color-pulse cycling on the accent lights
  const colorPalettes = [
    { cyan: 0x00e5ff, orange: 0xff6a00, green: 0x39ff14 },
    { cyan: 0x7b2fff, orange: 0xff2d9a, green: 0x00ffd0 },
    { cyan: 0x00cfff, orange: 0xffaa00, green: 0xaaff00 },
  ];
  let paletteIndex = 0;

  function cycleColors() {
    paletteIndex = (paletteIndex + 1) % colorPalettes.length;
    const p = colorPalettes[paletteIndex];
    gsap.to(cyanRim.color, { r: ((p.cyan >> 16) & 0xff) / 255, g: ((p.cyan >> 8) & 0xff) / 255, b: (p.cyan & 0xff) / 255, duration: 3, ease: "sine.inOut" });
    gsap.to(orangeAccent.color, { r: ((p.orange >> 16) & 0xff) / 255, g: ((p.orange >> 8) & 0xff) / 255, b: (p.orange & 0xff) / 255, duration: 3, ease: "sine.inOut" });
    gsap.to(greenBounce.color, { r: ((p.green >> 16) & 0xff) / 255, g: ((p.green >> 8) & 0xff) / 255, b: (p.green & 0xff) / 255, duration: 3, ease: "sine.inOut" });
  }

  return { setPointLight, turnOnLights, cycleColors, transitionToTheme, cyanRim, orangeAccent, greenBounce };
};

export default setLighting;
