import { CanvasMesh } from "./CanvasMesh"

export class Pointers {
    public static AddPointerEvents(xrInput: BABYLON.WebXRInput, scene: BABYLON.Scene): void {
        xrInput.onControllerAddedObservable.add((controller: BABYLON.WebXRInputSource) => {
            controller.onMeshLoadedObservable.add(async (mesh: BABYLON.AbstractMesh) => {
                const canvasMesh = new CanvasMesh()
                const handCanvas = await canvasMesh.createImageCanvas(scene)
                const hand = await canvasMesh.thinnizeCanvas(handCanvas, scene)
                controller.motionController.rootMesh.getChildMeshes().forEach((child) => {
                    child.visibility = 0
                })
                hand.setParent(controller.motionController.rootMesh)
                hand.position = BABYLON.Vector3.Zero()

                hand.rotation = controller.motionController.rootMesh.rotation
                hand.rotateAround(hand.position, hand.right, Math.PI * 3 / 2)
                if (controller.motionController.handedness === 'right')
                    hand.rotateAround(hand.position, hand.forward, Math.PI)
                hand.scaling = new BABYLON.Vector3(0.25, 0.25, 0.25)
            })
            // // Watch for trigger events
            // const mainComponent = controller.getMainComponent()
            // mainComponent.onButtonStateChanged.add((component /* WebXRControllerComponent */) => {
            //     // check for changes:
            //     // pressed changed?
            //     if (component.changes.pressed) {
            //       // is it pressed?
            //       if (component.changes.pressed.current === true) {
            //         // pressed
            //       }
            //       // or a different way:
            //       if (component.pressed) {
            //         // component is pressed.
            //       }
            //     }
            //   });
            // if (mainComponent.isButton()) {
            //     mainComponent.onButtonStateChangedObservable.add((component) => {
            //         context.mainComponentActive = (component.value === 1)
            //     })
            // } else if (mainComponent.isAxes()) {
            //     mainComponent.onAxisValueChangedObservable.add((values) => {
            //         context.mainComponentActive = (values.x === 1 || values.y === 1)
            //     })
            // }
            // controller.onModelLoadedObservable.add((model: BABYLON.WebXRAbstractMotionController) => {
            //     // console.log('onModelLoadedObservable', model)
            //     // Attach stuff to the controllers if you want
            //     const tutMesh = textPanelMesh({ width: 960, height: 341 }, scene)
            //     tutMesh.name = 'Tutorial-Mesh'
            //     tutMesh.setText('Press up on the joystick|to aim and teleport|to the pointer location')
            //     tutMesh.rotate(Vector3.Right(), Math.PI / 4)
            //     tutMesh.scaling = new Vector3(0.25, 0.25, 0.25)
            //     tutMesh.setParent(model.rootMesh)
            //     tutMesh.position.y = 0.08

            //     const oldTimerMesh = scene.getMeshByName('Timer-Mesh')
            //     if (oldTimerMesh) oldTimerMesh.dispose()
            //     const timerMesh = textPanelMesh({ width: 300, height: 160 }, scene)
            //     timerMesh.name = 'Timer-Mesh'
            //     timerMesh.setText('')
            //     timerMesh.rotate(Vector3.Right(), 2 / 3 * Math.PI )
            //     timerMesh.scaling = new Vector3(0.1, 0.1, 0.1)
            //     timerMesh.setParent(model.rootMesh)
            //     timerMesh.position = new Vector3(0, 0.04, 0.08)
            // })
        })
    }
}
