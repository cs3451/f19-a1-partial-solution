// import the little Scene Graph library
import * as sg from './SG.js';

// find the div's we want to use as our 3D Scene containers
var scene = new sg.Scene(<HTMLDivElement>document.getElementById("my-scene"));

///////////////////////////////////
// Scene 

///////////////////////////////////
// Two panels, set up so they are at 90 degrees to each other along an edge.
// We also tilt the camera, to test that.
var cam = new sg.Camera(25);
cam.position = new sg.Vector(0,200,1000); 

var camYRotation =0;
cam.rotation = sg.Matrix.makeRotationFromEuler(new sg.Vector(-10,camYRotation,0));
scene.world.add(cam);

// we move by -70.7 because after rotation by 45 degrees that's about what we have to move
// to get the edge into the center (hint: cos(45 degrees) = ~0.707)
var p4 = document.createElement("div");
p4.className = "panel image";
p4.style.backgroundImage = "url('./img/brick-color-colour-wall.jpg')"; 
var n4 = new sg.HTMLDivThing(p4);
n4.rotation = sg.Matrix.makeRotationFromEuler(new sg.Vector(0,45,0)); 
n4.position = new sg.Vector(-70.7,0,0);
scene.world.add(n4);

var p41 = document.createElement("div");
p41.className = "panel image";
p41.style.backgroundImage = "url('./img/wall-books.jpg')"; 
var n41 = new sg.HTMLDivThing(p41);
n41.rotation = sg.Matrix.makeRotationFromEuler(new sg.Vector(0,-90,0)); 
n41.position = new sg.Vector(100,0,100);
n4.add(n41);

var p4g = document.createElement("div");
p4g.className = "panel image";
p4g.style.backgroundImage = "url('./img/graph-paper.png')"; 
var n4g = new sg.HTMLDivThing(p4g);
n4g.rotation = sg.Matrix.makeRotationFromEuler(new sg.Vector(-90,0,0)); 
n4g.position = new sg.Vector(0,-100,0);
n4g.scale = new sg.Vector(2,2,2);
n4.add(n4g); 

var p5 = document.createElement("div");
p5.className = "panel image";
p5.style.backgroundImage = "url('./img/jon-awesome.gif')"; 
var n5 = new sg.HTMLDivThing(p5);
n5.rotation = sg.Matrix.makeRotationFromEuler(new sg.Vector(0,0,0)); 
n5.position = new sg.Vector(0,10,0);
n5.scale = new sg.Vector(0.5,0.5,0.5);

var camYInc = 0.2;
let startTime =  performance.now()

var flag1 = false;

var s5renderFunc = function(t: number) {
	// time is returned in millisecons.  Lets convert to seconds, so it's more intuitive.
	let dt = (t - startTime) / 1000.0

	if (dt < 1) {
		cam.position = new sg.Vector(0,600,1600); 
		cam.rotation = sg.Matrix.makeRotationFromEuler(new sg.Vector(-25,camYRotation,0));	
	} else if (dt < 3) {
		cam.position = new sg.Vector(0,400,1400); 
		cam.rotation = sg.Matrix.makeRotationFromEuler(new sg.Vector(-20,camYRotation,0));	
	} else if (dt < 5) {
		cam.position = new sg.Vector(0,200,1200); 
		cam.rotation = sg.Matrix.makeRotationFromEuler(new sg.Vector(-14,camYRotation,0));	
	} else {
		// only want to do this the first time into this part
		if (!flag1) {
			scene.world.add(n5);
			cam.position = new sg.Vector(0,200,1100); 
			flag1 = true;
		}

		// YOU shouldn't do things by incrementing per-frame;  you should do time-based 
		// interpolation.
		camYRotation += camYInc;
		if (camYRotation > 12 || camYRotation < -12) {
			camYInc *= -1;
		}
		cam.rotation = sg.Matrix.makeRotationFromEuler(new sg.Vector(-13,camYRotation,0));	
	}

	let rotationTime = (dt % 3) / 3
	let yRotation = 360 * rotationTime
	n5.rotation = sg.Matrix.makeRotationFromEuler(new sg.Vector(0,yRotation,0)); 
	
	scene.render();
	requestAnimationFrame(s5renderFunc);
};
s5renderFunc(startTime);