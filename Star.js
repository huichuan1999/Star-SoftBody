class Star {
  constructor(centerX, centerY, points, radius1, radius2) {
    this.points = [];
    this.radius1 = radius1;
    this.radius2 = radius2;
    this.centerX = centerX;
    this.centerY = centerY;
    this.particleStrings = []; // array to store ParticleString objects

    this.centerPoint = new VerletParticle2D(centerX, centerY);
    physics.addParticle(this.centerPoint);
    this.generatePoints(centerX, centerY, points, radius1, radius2);
  }

  generatePoints(centerX, centerY, points, radius1, radius2) {
    let angle = TWO_PI / points;
    let lastInnerPoint = null; // to store the last inner point created
    let firstInnerPoint = null; // to store the first inner point created
    let innerDistance = 0; // to store the distance between two adjacent inner points
    for (let a = 0; a < TWO_PI; a += angle) {
      let sx = centerX + cos(a) * radius2;
      let sy = centerY + sin(a) * radius2;
      this.points.push(new VerletParticle2D(sx, sy));
      physics.addParticle(this.points[this.points.length - 1]);
      if (a < TWO_PI) {
        let sx = centerX + cos(a + angle / 2) * radius1;
        let sy = centerY + sin(a + angle / 2) * radius1;
        let innerPoint = new VerletParticle2D(sx, sy);
        this.points.push(innerPoint);
        physics.addParticle(this.points[this.points.length - 1]);

        // Create a ParticleString for each inner point
        const stepDirection = new toxi.geom.Vec2D(0, 1).normalizeTo(20);
        let numParticles = random(4,15);
        let strength = 1;
        let damping = 0.1;
        let particleString = new ParticleString(tailPhysics, innerPoint, stepDirection, numParticles, strength, damping);
        this.particleStrings.push(particleString);

        // Add a spring connecting inner point and center point
        let innerSpring = new VerletSpring2D(innerPoint, this.centerPoint, this.centerPoint.distanceTo(innerPoint), 0.01);
        physics.addSpring(innerSpring);

        // If there's a last inner point, create a spring between it and the current inner point
        if (lastInnerPoint != null) {
          innerDistance = innerPoint.distanceTo(lastInnerPoint); // get the distance between two adjacent inner points
          let innerInnerSpring = new VerletSpring2D(innerPoint, lastInnerPoint, innerDistance, 0.01);
          physics.addSpring(innerInnerSpring);
        } else {
          firstInnerPoint = innerPoint; // update the first inner point if it's the first inner point created
        }
        lastInnerPoint = innerPoint; // update the last inner point
      }
    }

    // Create a spring between the first and the last inner point
    let innerInnerSpring = new VerletSpring2D(lastInnerPoint, firstInnerPoint, innerDistance, 0.01);
    physics.addSpring(innerInnerSpring);

    for (let i = 0; i < this.points.length - 1; i++) {
      let spring = new VerletSpring2D(this.points[i], this.points[i + 1], this.points[i].distanceTo(this.points[i + 1]), 0.01);
      physics.addSpring(spring);
    }

    // Add an extra spring to connect the last point with the first one
    let extraSpring = new VerletSpring2D(this.points[this.points.length - 1], this.points[0], this.points[this.points.length - 1].distanceTo(this.points[0]), 0.01);
    physics.addSpring(extraSpring);
  }

  updateParticleStrings() {
    // Iterate through each particle string
    for (let i = 0; i < this.particleStrings.length; i++) {
      // Update the position of the first particle in the string to match the corresponding inner point
      this.particleStrings[i].particles[0].set(this.points[i * 2 + 1]);
    }
  }

  draw() {
    
    // Draw springs
    stroke(255, 50); // Set the color to gray
    strokeWeight(1);
    for (let i = 0; i < physics.springs.length; i++) {
      let spring = physics.springs[i];
      line(spring.a.x, spring.a.y, spring.b.x, spring.b.y);
    }

    fill(255, 100);
    stroke(255);
    beginShape();
    for (let p of this.points) {
      circle(p.x, p.y, 10);
      vertex(p.x, p.y);
    }
    endShape(CLOSE);

    this.updateParticleStrings();
    for (let particleString of this.particleStrings) {
      particleString.display();
    }
  }


}