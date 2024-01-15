import { defineConfig } from "vite"

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: "index.html",
        fbx2glb: "fbx2glb.html",
        obj2glb: "obj2glb.html",
        stl2glb: "stl2glb.html",
      }
    }
  }
})