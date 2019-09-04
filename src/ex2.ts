// import the little Scene Graph library
import * as sg from './SG.js';

// find the div's we want to use as our 3D Scene containers
var s1 = new sg.Scene(<HTMLDivElement>document.getElementById("translate-z-negative"));
var s2 = new sg.Scene(<HTMLDivElement>document.getElementById("translate-z-positive"));
var s3 = new sg.Scene(<HTMLDivElement>document.getElementById("rotate-x"));
var s4 = new sg.Scene(<HTMLDivElement>document.getElementById("rotate-y"));
var s5 = new sg.Scene(<HTMLDivElement>document.getElementById("rotate-z"));

var res1 = <HTMLDivElement>document.getElementById("result1");
var res2 = <HTMLDivElement>document.getElementById("result2");
var res3 = <HTMLDivElement>document.getElementById("result3");
var res4 = <HTMLDivElement>document.getElementById("result4");
var res5 = <HTMLDivElement>document.getElementById("result5");
var res6 = <HTMLDivElement>document.getElementById("result6");

///////////////////////////////////
// Scene 1.

// Move the camera back, and up half the size of the panel.  The upper left corner
// of the panel should be at the center of the viewport.
var cam1 = new sg.Camera(25);
cam1.position = new sg.Vector(-100,100,0); 
s1.world.add(cam1);

// create a div for our content
var p1 = document.createElement("div");
p1.className = "panel";
p1.innerText = "transZ(-1000px)\n\ncamera trans(-100,\n100,0)";

// put the div in the scene graph, pushed out a bit further down the z axis
var n1 = new sg.HTMLDivThing(p1);
n1.position = new sg.Vector(0,0,-1000); 
s1.world.add(n1);

// render this graph into the div container.
s1.render()

if (s1.camera) {
	var m = s1.camera.worldInverseTransform.multiply(n1.worldTransform);              
	res1.innerText = "n1 position = " + m.getPosition().toString();
}

///////////////////////////////////
// Scene 2
//
// the camera is 25 degrees;  should result in a focal length of ~450 or so, based on a 200 pixel 
// square container.  We'll move it that far back, so the 200x200 panel should fill the viewport
var cam2 = new sg.Camera(25);
cam2.position = new sg.Vector(0,0,451); 
s2.world.add(cam2);

var p2 = document.createElement("div");
p2.className = "panel";
p2.innerText = "camera\ntransZ(451px)";
var n2 = new sg.HTMLDivThing(p2);
n2.position = new sg.Vector(0,0,0); 
s2.world.add(n2);

s2.render();

if (s2.camera) {
	var m = s2.camera.worldInverseTransform.multiply(n2.worldTransform);              
	res2.innerText = "n2 position = " + m.getPosition().toString();
}

///////////////////////////////////
// Scene 3
//
// Move back, and rotate around positive X.  Top edge should be closer to screen.

var cam3 = new sg.Camera(25);
cam3.position = new sg.Vector(0,0,750); 
s3.world.add(cam3);

var p3 = document.createElement("div");
p3.className = "panel";
p3.innerText = "rotateX(35deg)";
var n3 = new sg.HTMLDivThing(p3);
n3.rotation = sg.Matrix.makeRotationFromEuler(new sg.Vector(35,0,0)); 
s3.world.add(n3);

s3.render();

if (s3.camera) {
	var m = s3.camera.worldInverseTransform.multiply(n3.worldTransform);
	res3.innerText = "n3 matrix = " + n3.worldTransform.toString() + "\n" + 
		"n3 worldMatrix = " + m.toString();
}

///////////////////////////////////
// Scene 4.  
//
// More complex scene.  Two red panels, set up so they are at 90 degrees to each 
// other along an edge.  One image panel under them.
//
// We also tilt the camera, to test that.

var cam4 = new sg.Camera(25);
cam4.position = new sg.Vector(100,100,800); 
cam4.rotation = sg.Matrix.makeRotationFromEuler(new sg.Vector(-10,10,0));
s4.world.add(cam4);

// we move by -70.7 because after rotation by 45 degrees that's about what we have to move
// to get the edge into the center (hint: cos(45 degrees) = ~0.707)
var p4 = document.createElement("div");
p4.className = "panel";
p4.innerText = "rotate(0,45,0)\ntr(-70.7,0,0)";
var n4 = new sg.HTMLDivThing(p4);
n4.rotation = sg.Matrix.makeRotationFromEuler(new sg.Vector(0,45,0)); 
n4.position = new sg.Vector(-70.7,0,0);
s4.world.add(n4);

var p41 = document.createElement("div");
p41.className = "panel";
p41.innerText = "rotateY(-90) tr(100,0,100)";
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

s4.render();

if (s4.camera) {
	var m = s4.camera.worldInverseTransform.multiply(n41.worldTransform);              
	res4.innerText = "n4 matrix = " + n4.worldTransform.toString() + "\n" + 
		"n41 matrix = " + n41.worldTransform.toString() + "\n" + 
		"n41 worldMatrix = " + m.toString()
}

///////////////////////////////////
// Scene 5.  Till in Z, spin in X, and rotate the camera back and forth
var cam5 = new sg.Camera(25);
cam5.position = new sg.Vector(0,0,0); 
s5.world.add(cam5);

var p5 = document.createElement("div");
p5.className = "panel";
p5.innerText = "rotateZ( 35deg )";
var n5 = new sg.HTMLDivThing(p5);
n5.rotation = sg.Matrix.makeRotationFromEuler(new sg.Vector(0,0,35)); 
n5.position = new sg.Vector(0,0,-1000);
s5.world.add(n5);

var yRotation = 0;
var camYRotation =12;
var camYInc = 0.2;

var str1 = "LEFT:\n\n";
var str2 = "MIDDLE:\n\n";
var str3 = "RIGHT:\n\n";

var s5renderFunc = function() {
	yRotation += 3;
	if (yRotation > 360) {
		yRotation -= 360;
	}
	n5.rotation = sg.Matrix.makeRotationFromEuler(new sg.Vector(0,yRotation,35)); 
	
	camYRotation += camYInc;
	if (camYRotation > 12 || camYRotation < -12) {
		camYRotation -= camYInc;
		camYInc *= -1;
	}
	cam5.rotation = sg.Matrix.makeRotationFromEuler(new sg.Vector(0,camYRotation,0));
	
	s5.render();
	
	if (s5.camera) {
		var m = s5.camera.worldInverseTransform.multiply(n5.worldTransform);              
		if (camYRotation > 11 && str1.length < 20) {
			str1 = "LEFT:\n n5 matrix = " + n5.worldTransform.toString() + "\n" + 
				"n5 worldMatrix = " + m.toString() + "\n";
			res5.innerText = str1 + str2 + str3;
		} else if (camYRotation < -11 && str3.length < 20) {
			str3 = "RIGHT:\n n5 matrix = " + n5.worldTransform.toString() + "\n" + 
				"n5 worldMatrix = " + m.toString() + "\n" ;
			res5.innerText = str1 + str2 + str3;
		} else if (camYRotation > -0.1 && camYRotation < 0.1  && str2.length < 20) {
			str2 = "MIDDLE:\n n5 matrix = " + n5.worldTransform.toString() + "\n" + 
				"n5 worldMatrix = " + m.toString() + "\n";
			res5.innerText = str1 + str2 + str3;
		}
	}
	requestAnimationFrame(s5renderFunc);
};
s5renderFunc();