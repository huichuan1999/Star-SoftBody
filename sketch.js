let physics;
let tailPhysics;
let stars = [];
let angStars = [];
let numStars = 7;
let particleGrabRadius = 30;

let handParticles = [];
let handAttractions = [];
const pinchThreshold = 50;
let canvas;

let draggedParticle = null;
//let lockedParticle = null; // To store the particle that is being dragged
let attraction;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.id("canvas");
  physics = new VerletPhysics2D();
  physics.setWorldBounds(new Rect(0, 0, width, height));
  physics.setDrag(0.01);

  tailPhysics = new VerletPhysics2D();
  tailPhysics.setWorldBounds(new Rect(0, 0, width, height));
  let gb = new GravityBehavior(new Vec2D(0, 0.1));// add gravity to tails
  tailPhysics.addBehavior(gb);
  //tailPhysics.setDrag(0.2);

  attraction = new AttractionBehavior(new Vec2D(0,0), 500, 0.5, 0.2);//整体的环境吸引力
  physics.addBehavior(attraction);

  colorMode(HSB, 255);

  for (let i = 0; i < numStars; i++) {
    let centerX = random(width / 6, width - width / 6);
    let centerY = random(height / 6, height - height / 6);
    angStars.push(random(3, 7));
    let star = new Star(centerX, centerY, angStars[i], random(10, 20), random(30, 50));
    stars.push(star);
  }

}

function draw() {
  clear();
  physics.update();
  tailPhysics.update();

  for (let star of stars) {
    star.draw();
  }

  //draw hand landmarks
  if (detections != undefined) {
    if (detections.multiHandLandmarks != undefined) {

      //draw landmarks 
      drawLines([0, 5, 9, 13, 17, 0]);//palm
      drawLines([0, 1, 2, 3, 4]);//thumb
      drawLines([5, 6, 7, 8]);//index finger
      drawLines([9, 10, 11, 12]);//middle finger
      drawLines([13, 14, 15, 16]);//ring finger
      drawLines([17, 18, 19, 20]);//pinky

      drawLandmarks([0, 1], 0);//palm base
      drawLandmarks([1, 5], 60);//thumb
      drawLandmarks([5, 9], 120);//index finger
      drawLandmarks([9, 13], 180);//middle finger
      drawLandmarks([13, 17], 240);//ring finger
      drawLandmarks([17, 21], 300);//pinky
    }
  }

  //If detected hand
  const allLandmarkIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  const allLandmarkCoordinates = getLandmarkCoordinates(allLandmarkIndices, detections);
  for (let i = 0; i < handParticles.length; i++) {
    const index = allLandmarkIndices[i];
    if (index == 8 || index == 4) {
      continue; // // Skip keys with index 8 (index finger) or 4 (thumb)
    }
    const coord = allLandmarkCoordinates[index];
    if (coord) {
      handParticles[i].updatePosition(coord.x, coord.y);
    }
  }

  if (handParticles.length === 0) {
    addHandParticle(allLandmarkCoordinates);
  }

  //添加手部粒子对物理系统中粒子的影响
  for (let i = 0; i < handParticles.length; i++) {
    if (tailPhysics.behaviors.length < 19) {
      handAttractions[i].attractor.set(handParticles[i].getPosition());
      tailPhysics.addBehavior(handAttractions[i]);
    } else {

      handAttractions[i].attractor.set(handParticles[i].getPosition());
    }
  }
  // console.log(physics.behaviors, physics);

  //Add pinch interaction
  const landmarkIndices = [8, 4];
  const landmarkCoordinates = getLandmarkCoordinates(landmarkIndices, detections);

  if (landmarkCoordinates[8] && landmarkCoordinates[4]) {
    const distance = calculateDistance(landmarkCoordinates[8], landmarkCoordinates[4]);

    if (distance < pinchThreshold) {
      // The pinch action occurs 捏合动作发生
      const midpoint = {
        x: (landmarkCoordinates[8].x + landmarkCoordinates[4].x) / 2,
        y: (landmarkCoordinates[8].y + landmarkCoordinates[4].y) / 2
      };
      fill(255);
      noStroke();
      ellipse(midpoint.x, midpoint.y, 20, 20);

      // 更新吸引行为的中心
      attraction.setAttractor(new Vec2D(midpoint.x, midpoint.y));

      //捏合交互
      // for (let star of stars) {
      //   //for (let point of star.points) {
      //     let d = dist(midpoint.x, midpoint.y, star.centerPoint.x, star.centerPoint.y);
      //     if (d < particleGrabRadius) {
      //       // star.centerPoint.lock();
      //       // star.centerPoint.x = midpoint.x;
      //       // star.centerPoint.y = midpoint.y;
      //       // star.centerPoint.unlock();
      //       draggedParticle = star.centerPoint;
      //       draggedParticle.set(midpoint.x, midpoint.y,);
      //       //break;
      //     }
      //   //}
      // }
    }
    else {
      draggedParticle = null;
    }
  }

}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

function keyPressed() {
  //press the space to reload
  if (keyCode === 32) {
    location.reload();
  }
}