let birdShape = new GLTFShape('models/bird.glb')
let birdFlyShape = new GLTFShape('models/bird_fly.glb')

// preload the animated bird glb (underground), for faster loading
const birdPreloadDummy = new Entity()      
birdPreloadDummy.addComponent(new Transform({ 
          position: new Vector3(8,-10,0),
          rotation: Quaternion.Euler(0,0,0),
          scale: new Vector3(1,1,1)
        }))        
birdPreloadDummy.addComponent(birdFlyShape )               
engine.addEntity(birdPreloadDummy)

@Component("DistanceBird")
export class DistanceBird {  
  originalPos:Vector3
  dir:Vector3 
  elapsed:number = Math.random()
  flying:boolean = false

  constructor(pos:Vector3, dir:Vector3){
    this.originalPos = new Vector3(pos.x, pos.y, pos.z)
    this.dir = new Vector3(dir.x, dir.y, dir.z)        
  }
}

//function to calculate 3D distance between two points
export function realDistance(pos1: Vector3, pos2: Vector3): number 
{
    const a = pos1.x - pos2.x
    const b = pos1.y - pos2.y
    const c = pos1.z - pos2.z
    return Math.sqrt(a * a + b * b + c * c )
}

let player = Camera.instance

// System that checks distances to each bird
class ProximitySystem {
  radius:number = 8
  amplitude:number = 1  
  group = engine.getComponentGroup(Transform, DistanceBird)
  elapsed:number = 0
  update(dt: number) {

    for (let bird of this.group.entities){

      const transform = bird.getComponent(Transform)
      const birdInfo = bird.getComponent(DistanceBird)

      let playerDir = birdInfo.originalPos.subtract(player.position)
      let dist = realDistance(birdInfo.originalPos, player.position)
      let multiplier = (1-dist/this.radius)*this.amplitude

      if(dist < this.radius){
        if(!birdInfo.flying){
          birdInfo.flying = true
          bird.addComponentOrReplace(birdFlyShape)
        }
       
        transform.position = birdInfo.originalPos.add(playerDir.multiplyByFloats(multiplier, -4*multiplier, multiplier))
        birdInfo.elapsed +=dt
        transform.position.x += Math.sin( birdInfo.elapsed *10) * multiplier
        transform.position.y += Math.sin( birdInfo.elapsed *8)* multiplier
        transform.position.z += Math.sin( birdInfo.elapsed *11)* multiplier
        transform.lookAt(player.position)
      }
      else{
        if(birdInfo.flying){
          birdInfo.flying = false
          bird.addComponentOrReplace(birdShape)
        }
        transform.position.copyFrom(birdInfo.originalPos)
        
        
      }

    }
  }
}


engine.addSystem(new ProximitySystem())

class BirdController{
  birds:Entity[]
  center:Vector3
  sideLength:number = 20
  rows:number = 10
  cols:number = 10
  spacing:number = this.sideLength/this.rows
  base:Vector3 = new Vector3(14,0,14)

  constructor(){
    this.birds =  []
    this.center = new Vector3(24,0,24)
    this.addBirds()
  }

  addBirds(){
    
    for(let i=0; i< this.rows; i++){
      for(let j=0; j< this.cols; j++){     

        let newPos = new Vector3(
          this.base.x + i* this.spacing + Math.random()*20-10, 
          this.base.y , 
          this.base.z  + j * this.spacing + Math.random()*20-10) 

        const bird = new Entity()      
        bird.addComponent(new Transform({ 
          position: new Vector3(
            newPos.x, 
            newPos.y, 
            newPos.z),
            rotation: Quaternion.Euler(0, Math.random()*360,0) 
        }))        
        bird.addComponent(new DistanceBird(
          new Vector3(
            newPos.x, 
            newPos.y, 
            newPos.z),
            newPos.subtract(this.center)
        ))    
        
        bird.addComponent(birdShape )             
        engine.addEntity(bird)
      }
    }

  }
}

let birdControl = new BirdController()

