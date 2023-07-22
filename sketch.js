let physics;
let tailPhysics;
let stars = [];
let angStars = [];
let numStars = 2;

function setup() {
  createCanvas(600,600);
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

function mousePressed() {
  let centerX = mouseX;
  let centerY = mouseY;
  let star = new Star(centerX, centerY, random(3,7), random(10, 20), random(30, 50));
  stars.push(star);

  // let repulsion = new AttractionBehavior(new Vec2D(mouseX, mouseY), 100, -0.01);
  // physics.addBehavior(repulsion);
}
