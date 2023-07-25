let physics;
let tailPhysics;
let stars = [];
let angStars = [];
let numStars = 0;
let particleGrabRadius = 10;

function setup() {
  createCanvas(windowWidth,windowHeight);
  physics = new VerletPhysics2D();
  physics.setWorldBounds(new Rect(0, 0, width, height));

  tailPhysics = new VerletPhysics2D();
  tailPhysics.setWorldBounds(new Rect(0, 0, width, height));

  for (let i = 0; i < numStars; i++) {
    let centerX = random(width);
    let centerY = random(height);
    angStars.push(random(3,7));
    let star = new Star(centerX, centerY, angStars[i], random(7, 15), random(25, 40));
    stars.push(star);
  }
}

function draw() {
  physics.update();
  tailPhysics.update();
  background(0);

  for (let star of stars) {
    star.draw();
  }
  
}

let lockedParticle = null; // To store the particle that is being dragged

function mousePressed() {
  // Check each star
  for (let star of stars) {
    // Check each point in the star
    for (let point of star.points) {
      let d = dist(mouseX, mouseY, point.x, point.y);
      if (d < particleGrabRadius) {
        lockedParticle = point; // Store the particle that is being dragged
        lockedParticle.lock(); // Lock the particle
        break;
      }
    }

    // If a particle has been found and locked, break the outer loop as well
    if (lockedParticle != null) {
      break;
    }
  }

  // If a particle is found and locked, then no need to add new repulsion behavior
  if (lockedParticle != null) {
    return;
  }

  // Else, add repulsion behavior as before
  let centerX = mouseX;
  let centerY = mouseY;
  let star = new Star(centerX, centerY, random(3,7), random(10, 20), random(30, 50));
  stars.push(star);

  let repulsion = new AttractionBehavior(new Vec2D(mouseX, mouseY), 100, -0.01);
  physics.addBehavior(repulsion);
}

function mouseDragged() {
  // If a particle is being dragged, update its position
  if (lockedParticle != null) {
    lockedParticle.set(mouseX, mouseY);
  }
}

function mouseReleased() {
  // If a particle is being dragged, unlock it when the mouse is released
  if (lockedParticle != null) {
    lockedParticle.unlock();
    lockedParticle = null; // Clear the stored particle
  }
}


// function mousePressed() {

//    // Check each star
//    for (let star of stars) {
//     // Check each point in the star
//     for (let point of star.points) {
//       let d = dist(mouseX, mouseY, point.x, point.y);
//       if (d < particleGrabRadius) {
//         lockedParticle = point; // Store the particle that is being dragged
//         lockedParticle.lock(); // Lock the particle
//         break;
//       }
//     }
//   }

//   //add stars
//   // let centerX = mouseX;
//   // let centerY = mouseY;
//   // let star = new Star(centerX, centerY, random(3,7), random(10, 20), random(30, 50));
//   // stars.push(star);

//   // let repulsion = new AttractionBehavior(new Vec2D(mouseX, mouseY), 100, -0.01);
//   // physics.addBehavior(repulsion);
// }
