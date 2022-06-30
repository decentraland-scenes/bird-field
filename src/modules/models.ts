export let birdIdleShape = new GLTFShape('models/bird.glb')
export let birdFlyShape = new GLTFShape('models/bird_fly.glb')
export let sandShape = new GLTFShape('models/sand.glb')

// preload the animated bird glbs (underground), for faster loading
const birdPreloadDummy = new Entity()      
birdPreloadDummy.addComponent(new Transform({ 
          position: new Vector3(8,-10,0),
          rotation: Quaternion.Euler(0,0,0),
          scale: new Vector3(1,1,1)
        }))        
birdPreloadDummy.addComponent(birdIdleShape )               
engine.addEntity(birdPreloadDummy)

// preload the animated bird glbs (underground), for faster loading
const birdFlyingPreloadDummy = new Entity()      
birdFlyingPreloadDummy.addComponent(new Transform({ 
          position: new Vector3(8,-10,0),
          rotation: Quaternion.Euler(0,0,0),
          scale: new Vector3(1,1,1)
        }))        
        birdFlyingPreloadDummy.addComponent(birdFlyShape )               
engine.addEntity(birdFlyingPreloadDummy)

// Add ground terrain
const sand = new Entity()      
sand.addComponent(new Transform({ 
          position: new Vector3(0,0,0),
          rotation: Quaternion.Euler(0,0,0),
          scale: new Vector3(1,1,1)
        }))        
sand.addComponent(sandShape )               
engine.addEntity(sand)