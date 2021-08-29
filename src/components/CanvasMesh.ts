const _3D_PIXEL_SIZE = 1 / 64
export class CanvasMesh {
    // public static async CreateScene(engine: BABYLON.Engine, canvas: HTMLCanvasElement): Promise<BABYLON.Scene> {
    //     // This creates a basic Babylon Scene object (non-mesh)
    //     var scene = new BABYLON.Scene(engine);

    //     // This creates and positions a free camera (non-mesh)
    //     var camera = new BABYLON.ArcRotateCamera("camera1", -1 * Math.PI / 2, Math.PI * 1 / 3, 5, new BABYLON.Vector3(0, 1, 0), scene)
    //     camera.wheelPrecision = 100

    //     // This attaches the camera to the canvas
    //     camera.attachControl(canvas, true);

    //     // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    //     var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    //     // Default intensity is 1. Let's dim the light a small amount
    //     light.intensity = 0.7;

    //     // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
    //     var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 25, scene)


    //     const imageCanvas = await this.createImageCanvas(scene)

    //     const pizza = await pg.thinnizeCanvas(imageCanvas, scene)
    //     pizza.position.y = 1
    //     pizza.scaling.z = 32
    //     scene.registerBeforeRender(() => {
    //         pizza.rotateAround(pizza.position, pizza.up, Math.PI / 180)
    //     })

    //     // Put the texture on the ground too
    //     var materialGround = new BABYLON.StandardMaterial('Mat', scene)
    //     materialGround.diffuseTexture = imageCanvas
    //     ground.material = materialGround
        
    //     return scene;
    // }

    async createImageCanvas(scene: BABYLON.Scene): Promise<BABYLON.DynamicTexture> {
        var canvas = new BABYLON.DynamicTexture('dyn', {width: 64, height: 64}, scene, false)
        var ctx = canvas.getContext() as CanvasRenderingContext2D
        ctx.font = "56px emoji"
        ctx.textBaseline = 'top'
        ctx.fillStyle = 'blue'
        // ctx.fillText("🌎", 0, 6)
        ctx.fillText("🤚", 6, 6)
        ctx.fill
        
        // canvas.drawText("", 0, 0, '56px monospace', "green", "transparent", true, true)
        canvas.update()
        return canvas
    }

    async thinnizeCanvas(imageCanvas: BABYLON.DynamicTexture, scene: BABYLON.Scene) {
        const pizza = new BABYLON.AbstractMesh('pizza', scene)
        const ctx = imageCanvas.getContext()
        const imageData = ctx.getImageData(0, 0, imageCanvas.getSize().width, imageCanvas.getSize().height)
        const pixels = imageData.data
        const positions = []

        const textureWidth = imageData.width
        const textureHeight = imageData.height

        const byteOffsetStart = 0
        const byteOffsetEnd = pixels.length
        for (let i = byteOffsetStart; i < byteOffsetEnd; i += 4) {
            if (pixels[i + 3] === 0) {
                continue // Don't place invisible pixels
            }
            
            const row = Math.floor((i / 4) / textureWidth)
            const column = Math.floor((i / 4) % textureWidth)
            const baseX = column - textureWidth
            const baseY = textureHeight - row
            const position = this.calculatePosition(baseX, baseY, textureWidth, textureHeight, { r: pixels[i], g: pixels[i + 1], b: pixels[i + 2], a: pixels[i + 3] })
            positions.push(position)
        }

        const prefab = this.createPrefab(scene)
        prefab.setParent(pizza)
        this.spawnInstanced(positions, prefab)

        return prefab
    }

    calculatePosition(baseX, baseY, width, height, color) {
        const x = baseX * _3D_PIXEL_SIZE + width * _3D_PIXEL_SIZE / 2
        const y = baseY * _3D_PIXEL_SIZE - height * _3D_PIXEL_SIZE / 2
        let z = 0;
        const divider = 255
        const r = color.r / divider
        const g = color.g / divider
        const b = color.b / divider
        const a = color.a / divider

        return { x, y, z, r, g, b, a }
    }

    createPrefab(scene: BABYLON.Scene) {
        const options = {
            size: _3D_PIXEL_SIZE
        };
        const prefab = BABYLON.MeshBuilder.CreateBox("prefabBox", options, scene)
        prefab.scaling.z = 32
        return prefab
    }

    spawnInstanced(positions, prefabMesh) {
        const instanceCount = positions.length
        const bufferMatrices = new Float32Array(16 * instanceCount)
        const colorData = new Float32Array(4 * instanceCount);

        positions.forEach((p, i) => {

            const thinScale = BABYLON.Vector3.One()
            const thinPosition = new BABYLON.Vector3(p.x, p.y, p.z)
            const matrix3 = BABYLON.Matrix.Compose(
                thinScale,
                BABYLON.Vector3.ZeroReadOnly.toQuaternion(),
                thinPosition
            )

            matrix3.copyToArray(bufferMatrices, i * 16)

            colorData[i * 4 + 0] = p.r
            colorData[i * 4 + 1] = p.g
            colorData[i * 4 + 2] = p.b
            colorData[i * 4 + 3] = p.a
        })

        if (prefabMesh && prefabMesh.thinInstanceSetBuffer) {
            prefabMesh.name = 'prefab-' + prefabMesh.name
            prefabMesh.setAbsolutePosition(BABYLON.Vector3.Zero())
            prefabMesh.rotation = BABYLON.Vector3.Zero()
            prefabMesh.scaling = BABYLON.Vector3.One()
            prefabMesh.thinInstanceSetBuffer(
                "matrix",
                bufferMatrices,
                16,
                false
            )
            prefabMesh.thinInstanceSetBuffer(
                "color",
                colorData,
                4,
                false
            )
        }

    }

}