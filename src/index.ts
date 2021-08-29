import { Playground } from "./components/Playground";
import { Cassettes } from "./components/Cassettes";
import { Pointers } from './components/Pointers'
import { Engine } from "babylonjs/Engines/engine";
// const canvas: HTMLCanvasElement = document.getElementById('renderCanvas') as HTMLCanvasElement
// const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
// const width = 320;
// const height = 240;



const init = async () => {
	document.getElementById('intro').style.display = 'none'
    const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement
    canvas.style.display = 'block'
    const engine = new BABYLON.Engine(canvas, true)
    engine.displayLoadingUI()
	
	// Set up the puzzle side
	const cassettes = Cassettes.CreateCassettes()
	console.log(cassettes)

	const scene = await Playground.CreateScene(engine, canvas)
	const xrDefault = await scene.createDefaultXRExperienceAsync({});

	// POINTER EVENTS
	Pointers.AddPointerEvents(xrDefault.input, scene)

	// Register a render loop to repeatedly render the scene
	engine.runRenderLoop(function () {
		scene.render();
	});

	// Watch for browser/canvas resize events
	window.addEventListener("resize", function () {
		engine.resize();
	});
	engine.hideLoadingUI()
		
    document.addEventListener('keydown', (event) => {
        if (event.key === 'p') {
            (scene.debugLayer.isVisible()) ? scene.debugLayer.hide() : scene.debugLayer.show()
        }
        return false
    })
}

window.addEventListener('DOMContentLoaded', () => {
	const b = document.getElementById('playButton')
	b.onclick = init
})