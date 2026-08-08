# T-Rex Hero Model Pipeline — Meshy.ai → Blender → Website

The hero scene auto-loads `public/models/trex.glb`. Until that file exists it
renders a brand clapperboard placeholder, so the site never looks broken.
Follow this pipeline to produce the real model.

## 1. Generate in Meshy.ai

Use **Text to 3D** (or Image to 3D with the old site's hologram artwork as
reference). Prompt that matches the brand:

> A mechanical cyborg T-Rex, sci-fi hologram style, sleek armored panels,
> exposed robotic joints, aggressive pose standing on two legs, mouth slightly
> open mid-roar, hard-surface design, clean topology, game-ready

- Style: **Sculpture / Hard Surface**
- Topology: **Quad**, target ≤ 30k polys (the website treats it as a hologram —
  detail comes from the shader, not the mesh)
- Meshy community models tagged CC0 (e.g. "Mecha Rex") are also fair game as a
  starting point.

Export as **GLB**.

## 2. Clean up in Blender

1. `File → Import → glTF 2.0`, import the Meshy export.
2. **Orientation**: face the +Z axis forward, feet at Z = 0
   (the site auto-centers and auto-scales, but a clean origin avoids drift).
3. **Decimate** if above ~30k tris: add a *Decimate* modifier, ratio ≈ 0.5,
   apply. The hologram shader hides low-poly edges — go aggressive.
4. **Delete materials/textures** — the website overrides every material with
   its brand specimen material (navy metal, teal glow), so shipped textures are dead weight. In the
   glTF export settings untick *Materials → Export*.
5. Optional: pose the model (slight crouch, open jaw) for attitude.
6. `File → Export → glTF 2.0`:
   - Format: **glTF Binary (.glb)**
   - Include: *Selected Objects* only
   - Compression: enable **Draco**, level 6

Target file size: **under 2 MB** (Draco usually lands a 30k-tri model at
~300–600 KB).

## 3. Drop into the site

```bash
cp ~/Downloads/trex.glb public/models/trex.glb
```

Reload — the scene picks it up automatically, applies the brand specimen
material, auto-scales to 2.6 units and turns it with the scroll-driven
camera story.

## Optional upgrades once the model is in

- **Idle animation**: export with an armature + idle/roar action, then swap
  `useGLTF` for `useAnimations` in `components/three/TRex.tsx`.
- **Point-cloud mode** (Active Theory style): sample the mesh surface with
  `MeshSurfaceSampler` and render as GPU particles that assemble/disperse on
  scroll.
- **Draco decoding** is already supported by drei's `useGLTF` out of the box.
