import { defineConfig } from "vite"

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: "src/index.html",
        fbx2glb: "src/fbx2glb.html",
        obj2glb: "src/obj2glb.html",
        stl2glb: "src/stl2glb.html",
      }
    }
  }
})