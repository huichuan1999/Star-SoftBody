function getLandmarkCoordinates(indexArray, detections) {
  const coordinates = {};
  if (detections != undefined && detections.multiHandLandmarks != undefined) {
    for (let i = 0; i < detections.multiHandLandmarks.length; i++) {
      for (let j = 0; j < indexArray.length; j++) {
        let index = indexArray[j];
        let x = detections.multiHandLandmarks[i][index].x * width;
        let y = detections.multiHandLandmarks[i][index].y * height;
        coordinates[index] = { x, y };
      }
    }
  }
  return coordinates;
}

function calculateDistance(pointA, pointB) {
  const deltaX = pointA.x - pointB.x;
  const deltaY = pointA.y - pointB.y;
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}

// function addHandParticle(landmarkCoordinates) {
//   for (const index in landmarkCoordinates) {
//     if (index == 8 || index == 4) {
//       continue; 
//     }
//     const coord = landmarkCoordinates[index];
//     const p = new HandParticle(coord.x, coord.y);
//     handParticles.push(p);
//   }
// }

function addHandParticle(landmarkCoordinates) {
  for (let i = 0; i < 21; i++) {
    if (i === 4 || i === 8) {
      continue;
    }
    const coord = landmarkCoordinates[i];
    if (coord) {
      const handParticle = new HandParticle(coord.x, coord.y);
      handParticles.push(handParticle);

      // 创建 AttractionBehavior 对象并添加到 handAttractions 数组中
      const attraction = new toxi.physics2d.behaviors.AttractionBehavior(handParticle, 30, -20, 0);
      handAttractions.push(attraction);
    }
  }
}

// different landmark tests drawing functions-----------------------------------------------------

function drawTestC(index, hue, size) { //画会变色的圆圈
  stroke(0, 0, 255);
  strokeWeight(1);

  for (let i = 0; i < detections.multiHandLandmarks.length; i++) {
    for (let j = 0; j < index.length - 1; j++) {
      let x = detections.multiHandLandmarks[i][index[j]].x * width;
      let y = detections.multiHandLandmarks[i][index[j]].y * height;
      let z = detections.multiHandLandmarks[i][index[j]].z;

      let _x = detections.multiHandLandmarks[i][index[j + 1]].x * width;
      let _y = detections.multiHandLandmarks[i][index[j + 1]].y * height;
      let _z = detections.multiHandLandmarks[i][index[j + 1]].z;

      fill(hue, 140, 220, 200);
      ellipse(x, y, size); 
    }
  }
}

function drawHands() {
  beginShape();
  for (let i = 0; i < detections.multiHandLandmarks.length; i++) {
    for (let j = 0; j < detections.multiHandLandmarks[i].length; j++) {
      let x = detections.multiHandLandmarks[i][j].x * width;
      let y = detections.multiHandLandmarks[i][j].y * height;
      let z = detections.multiHandLandmarks[i][j].z;

      stroke(255);
      strokeWeight(10);
      point(x, y);
    }
    endShape();
  }
}

function drawLandmarks(indexArray, hue) {
  noFill();
  strokeWeight(8);
  beginShape();
  for (let i = 0; i < detections.multiHandLandmarks.length; i++) {
    for (let j = indexArray[0]; j < indexArray[1]; j++) {
      let x = detections.multiHandLandmarks[i][j].x * width;
      let y = detections.multiHandLandmarks[i][j].y * height;
      // let z = detections.multiHandLandmarks[i][j].z;
      stroke(hue, 40, 255,100);
      point(x, y);
    }
    endShape();
  }
}

function drawLines(index) {
  stroke(0, 0, 255, 120);
  strokeWeight(3);
  beginShape();
  for (let i = 0; i < detections.multiHandLandmarks.length; i++) {
    for (let j = 0; j < index.length - 1; j++) {
      let x = detections.multiHandLandmarks[i][index[j]].x * width;
      let y = detections.multiHandLandmarks[i][index[j]].y * height;
      // let z = detections.multiHandLandmarks[i][index[j]].z;

      let _x = detections.multiHandLandmarks[i][index[j + 1]].x * width;
      let _y = detections.multiHandLandmarks[i][index[j + 1]].y * height;
      // let _z = detections.multiHandLandmarks[i][index[j+1]].z;
      line(x, y, _x, _y);
    }
    endShape();
  }
}

function drawTest(indexArray, hue) {
  //noFill();
  fill(hue);
  strokeWeight(8);
  beginShape();
  for (let i = 0; i < detections.multiHandLandmarks.length; i++) {
    for (let j = indexArray[0]; j < indexArray[1]; j++) {
      let x = detections.multiHandLandmarks[i][j].x * width;
      let y = detections.multiHandLandmarks[i][j].y * height;
      stroke(hue, 40, 255);
      point(x, y);
    }
    endShape();
  }
}

function drawTestB(index, hue) {
  stroke(0, 0, 255);
  strokeWeight(10);
  noStroke();
  fill(hue);
  beginShape();
  for (let i = 0; i < detections.multiHandLandmarks.length; i++) {
    for (let j = 0; j < index.length - 1; j++) {
      let x = detections.multiHandLandmarks[i][index[j]].x * width;
      let y = detections.multiHandLandmarks[i][index[j]].y * height;
      // let z = detections.multiHandLandmarks[i][index[j]].z;

      let _x = detections.multiHandLandmarks[i][index[j + 1]].x * width;
      let _y = detections.multiHandLandmarks[i][index[j + 1]].y * height;
      // let _z = detections.multiHandLandmarks[i][index[j+1]].z;
      // line(x, y, _x, _y);
      vertex(x, y);
      vertex(_x, _y);
    }
    endShape();
  }

}

function drawHandsTest() {
  let hand_0 = detections.multiHandLandmarks[0];
  let hand_1 = detections.multiHandLandmarks[1];

  let a = hand_0[8].x * width;
  let b = hand_0[8].y * height;
  let c = hand_0[4].x * width;
  let d = hand_0[4].y * height;
  fill(100, 50, 200);
  ellipse(a, b, 100);
  ellipse(c, d, 100);
}


