// utility function to make sure we don't have too small numbers
function epsilon( value: number ): number {
    return Math.abs( value ) < 0.000001 ? 0 : value;
}

// convert degrees to radians
var degreeToRadiansFactor = Math.PI / 180;
function degToRad( degrees: number): number {
    return degrees * degreeToRadiansFactor;
}

// convert radians to degress
var radianToDegreesFactor = 180 / Math.PI;
function radToDeg( radians: number): number {
    return radians * radianToDegreesFactor;
}    	

///////////////////////////////////////////
// minimal matrix and vector classes
export class Matrix {
    // the matrix elements
    elements: number[];
    
    // construct a new matrix (including copying one and creating an identity matrix)
    constructor ( n11: number, n12: number, n13: number, n14: number, 
                  n21: number, n22: number, n23: number, n24: number, 
                  n31: number, n32: number, n33: number, n34: number, 
                  n41: number, n42: number, n43: number, n44: number ) {
    	this.elements = new Array<number>( 16 );
        var te = this.elements;
		te[ 0 ] = n11; te[ 4 ] = n12; te[ 8 ] = n13; te[ 12 ] = n14;
		te[ 1 ] = n21; te[ 5 ] = n22; te[ 9 ] = n23; te[ 13 ] = n24;
		te[ 2 ] = n31; te[ 6 ] = n32; te[ 10 ] = n33; te[ 14 ] = n34;
		te[ 3 ] = n41; te[ 7 ] = n42; te[ 11 ] = n43; te[ 15 ] = n44;
		return this;
	}
    static transpose(m: Matrix): Matrix {
        var t = m.elements; 
        return new Matrix(t[0],t[1],t[2] ,t[3] ,t[4] ,t[5] ,t[6] ,t[7],
                          t[8],t[9],t[10],t[11],t[12],t[13],t[14],t[15]);
    }     
	static copy (m: Matrix): Matrix {
		var te = m.elements;
		return new Matrix (te[0],te[4],te[8],te[12],
                           te[1],te[5],te[9],te[13],
                           te[2],te[6],te[10],te[14],
                           te[3],te[7],te[11],te[15])
	}

    // static methods for creating some useful matrices
	static identity(): Matrix { return new Matrix(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
    static lookAt(eye: Vector, target: Vector, up: Vector): Matrix {
		var z = Vector.norm(Vector.minus(target,eye));
        var x = Vector.norm(Vector.cross(up,z));
        var y = Vector.cross(z,x);        
        return new Matrix(x.x,x.y,x.z,0, y.x,y.y,y.z,0, z.x,z.y,z.z,0, 0,0,0,1);
    }
    static makeRotationFromEuler (eu: Vector): Matrix {        
        const x = degToRad(eu.x);
        const y = degToRad(eu.y);
        const z = degToRad(eu.z);
		const a = Math.cos( x ), b = Math.sin( x );
		const c = Math.cos( y ), d = Math.sin( y );
		const e = Math.cos( z ), f = Math.sin( z );

        var matrix = Matrix.identity();
		var te = matrix.elements;
        const ae = a * e, af = a * f, be = b * e, bf = b * f;

        te[ 0 ] = c * e;
        te[ 4 ] = - c * f;
        te[ 8 ] = d;

        te[ 1 ] = af + be * d;
        te[ 5 ] = ae - bf * d;
        te[ 9 ] = - b * c;

        te[ 2 ] = bf - ae * d;
        te[ 6 ] = be + af * d;
        te[ 10 ] = a * c;
        
		return matrix;
	}
	static makeTranslation(t: Vector): Matrix {
		return new Matrix(
			1, 0, 0, t.x,
			0, 1, 0, t.y,
			0, 0, 1, t.z,
			0, 0, 0, 1);
	}
	static makeScale(s: Vector): Matrix {
		return new Matrix(
			s.x, 0, 0, 0,
			0, s.y, 0, 0,
			0, 0, s.z, 0,
			0, 0, 0, 1);
    }
        
    // compose transformations with multiplication
   	multiply (b: Matrix ): Matrix {
		var ae = this.elements;
		var be = b.elements;

		var a11 = ae[ 0 ], a12 = ae[ 4 ], a13 = ae[ 8 ], a14 = ae[ 12 ];
		var a21 = ae[ 1 ], a22 = ae[ 5 ], a23 = ae[ 9 ], a24 = ae[ 13 ];
		var a31 = ae[ 2 ], a32 = ae[ 6 ], a33 = ae[ 10 ], a34 = ae[ 14 ];
		var a41 = ae[ 3 ], a42 = ae[ 7 ], a43 = ae[ 11 ], a44 = ae[ 15 ];

		var b11 = be[ 0 ], b12 = be[ 4 ], b13 = be[ 8 ], b14 = be[ 12 ];
		var b21 = be[ 1 ], b22 = be[ 5 ], b23 = be[ 9 ], b24 = be[ 13 ];
		var b31 = be[ 2 ], b32 = be[ 6 ], b33 = be[ 10 ], b34 = be[ 14 ];
		var b41 = be[ 3 ], b42 = be[ 7 ], b43 = be[ 11 ], b44 = be[ 15 ];

		return new Matrix(a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41,
                          a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42,
                          a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43,
                          a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44,                                                    
                          a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41,
                          a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42,
                          a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43,
                          a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44,
                                                    
                          a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41,
                          a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42,
                          a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43,
                          a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44,
                                                                              
                          a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41,
                          a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42,
                          a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43,
                          a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44);
	}

    multiplyVector ( v: Vector ): Vector {
		var x = v.x;
		var y = v.y;
		var z = v.z;
		var e = this.elements;
        return new Vector(e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z + e[ 12 ],
                          e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z + e[ 13 ],
                          e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ]);
	}
    
    getPosition(): Vector {
        return new Vector(this.elements[12], this.elements[13], this.elements[14]);
    }
    
    getXVector(): Vector {
        return new Vector(this.elements[0], this.elements[1], this.elements[2]);
    }
    getYVector(): Vector {
        return new Vector(this.elements[4], this.elements[5], this.elements[6]);
    }
    getZVector(): Vector {
        return new Vector(this.elements[8], this.elements[9], this.elements[10]);
    }
    
    toString(): string {
        var te = this.elements;
        return "[" + 
    		te[ 0 ] + ", " + te[ 4 ] + ", " + te[ 8 ] + ", " + te[ 12 ] + ",\n" +
		    te[ 1 ] + ", " + te[ 5 ] + ", " + te[ 9 ] + ", " + te[ 13 ] + ",\n" +
		    te[ 2 ] + ", " + te[ 6 ] + ", " + te[ 10 ]+ ", " + te[ 14 ] + ",\n" +
		    te[ 3 ] + ", " + te[ 7 ] + ", " + te[ 11 ]+ ", " + te[ 15 ] + "]";  
    }
}

export class Vector {
    constructor(public x: number,
                public y: number,
                public z: number) {
    }
    static times(k: number, v: Vector) { return new Vector(k * v.x, k * v.y, k * v.z); }
    static minus(v1: Vector, v2: Vector) { return new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z); }
    static plus(v1: Vector, v2: Vector) { return new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z); }
    static dot(v1: Vector, v2: Vector) { return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z; }
    static mag(v: Vector) { return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z); }
    static norm(v: Vector) {
        var mag = Vector.mag(v);
        var div = (mag === 0) ? Infinity : 1.0 / mag;
        return Vector.times(div, v);
    }
    static cross(v1: Vector, v2: Vector) {
        return new Vector(v1.y * v2.z - v1.z * v2.y,
                          v1.z * v2.x - v1.x * v2.z,
                          v1.x * v2.y - v1.y * v2.x);
    }
    toString(): string {
        return "[" + this.x + ", " + this.y + ", " + this.z + "]";
    }
}

//////////////////////////////////////////
// all the nodes in the tree are Things
export class Thing {
    children: Thing[];
    parent: Thing | null;
    
    // store position and scale as vectors, but orientation as a matrix, since there are many
    // ways to create an orientation matrix
    position: Vector;
    rotation: Matrix;
    scale: Vector;
    
    transform: Matrix;
    inverseTransform: Matrix;
    worldTransform: Matrix;
        
    constructor() {
        this.position = new Vector(0,0,0);
        this.rotation = Matrix.identity();
        this.scale = new Vector(1,1,1);
        
        this.parent = null;
        this.children = new Array();
        this.transform = Matrix.identity();
        this.inverseTransform = Matrix.identity();
        this.worldTransform = Matrix.identity();
    }

    computeTransforms() {
        var p = Matrix.makeTranslation(this.position);
        var pinv = Matrix.makeTranslation(Vector.times(-1,this.position));
        var r = this.rotation;
        var rinv = Matrix.transpose(r);
        var s = Matrix.makeScale(this.scale);
        var sinv = Matrix.makeScale(new Vector(1/this.scale.x, 1/this.scale.y, 1/this.scale.z));
        
        this.transform = p.multiply(r.multiply(s));
        this.inverseTransform = sinv.multiply(rinv.multiply(pinv));
    }    
        
    add(c: Thing) {
        this.children.push(c);
        if (c.parent) {
            c.parent.remove(c);
        }
        c.parent = this;
    }
    
    remove(c: Thing) {        
		var index = this.children.indexOf( c );

		if ( index !== - 1 ) {
			c.parent = null;
			this.children.splice( index, 1 );        
        }
    }

	traverse ( callback: (obj: Thing ) => void ) {
		callback( this );
		for ( var i = 0, l = this.children.length; i < l; i ++ ) {
			this.children[ i ].traverse( callback );
		}
	}
    
}

// The HTML div Thing.  These are all the HTML elements in the scene graph
export class HTMLDivThing extends Thing {
    transformCache: string;
    constructor(public div: HTMLDivElement) {
        super();
    	this.div.style.position = 'absolute';        
        this.transformCache = ""
    }
}

// The Camera Thing.  There must be one and only one in the Scene.
export class Camera extends Thing {
    worldInverseTransform: Matrix;
    
    constructor(public fovy: number) {
        super();
		this.worldInverseTransform = Matrix.identity();
    }
    
    getFocalLength (height: number): number {
        return 0.5 / Math.tan( degToRad( this.fovy * 0.5 ) ) * height;
    }
}
 
// A scene!
export class Scene {
    world: Thing;
    camera: Camera | null;
    
    // internal
    private domElement: HTMLDivElement;
    private width: number;
    private height: number;
    private windowTransform: string;

    constructor(public container: HTMLDivElement) {
        this.world = new Thing();
        this.camera = null;

        this.domElement = document.createElement( 'div' );
        this.container.style.overflow = 'hidden';

        this.domElement.style.transformStyle = "preserve-3d";
        this.container.appendChild(this.domElement);
       
        var rect = container.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;

		this.domElement.style.width = this.width + 'px';
		this.domElement.style.height = this.height + 'px';
        this.windowTransform = "matrix3d(1,0,0,0, 0,-1,0,0, 0,0,1,0, 0,0,0,1)" +
            " translate3d(" + this.width/2 + 'px, ' + this.height/2 + 'px, 0px)'; 
    }
    
    getObjectCSSMatrix( m: Matrix ): string {
		var elements = m.elements;

		return 'translate3d(-50%, -50%, 0) matrix3d(' +
			epsilon( elements[ 0 ]  ) + ',' +
			epsilon( elements[ 1 ]  ) + ',' +
			epsilon( elements[ 2 ]  ) + ',' +
			epsilon( elements[ 3 ]  ) + ',' +
			epsilon( - elements[ 4 ]  ) + ',' +
			epsilon( - elements[ 5 ]  ) + ',' +
			epsilon( - elements[ 6 ]  ) + ',' +
			epsilon( - elements[ 7 ]  ) + ',' +
			epsilon( elements[ 8 ]  ) + ',' +
			epsilon( elements[ 9 ]  ) + ',' +
			epsilon( elements[ 10 ]  ) + ',' +
			epsilon( elements[ 11 ]  ) + ',' +
			epsilon( elements[ 12 ]  ) + ',' +
			epsilon( elements[ 13 ]  ) + ',' +
			epsilon( elements[ 14 ]  ) + ',' +
			epsilon( elements[ 15 ]  ) +
		')';
	};

    render() {  
        // a function to traverse the graph, updating the matrices
        var updateMatricies = (obj: Thing) => {
            obj.computeTransforms();

            if (obj.parent) {
                obj.worldTransform = obj.parent.worldTransform.multiply(obj.transform);            
            } else {
                obj.worldTransform = obj.transform;
            }        
            
            if (obj instanceof Camera) {
                this.camera = obj;
            }
        }
        
        this.camera = null;
        
        // update the matrices
        this.world.traverse(updateMatricies);

        // WARNING:  HACK I needed here
        // Typescript does not notice that traverse() is calling updateMatricies and that (therefore) this.camera might get
        // set.  So it narrows the type of this.camera to "null", this causes the next "if" to narrow "this.camera" to "never" 
        // (since that condition will never succeed).  
        // So, a little hack (might be a better way, I'm not sure): by asseting the type of camera back out, and then reassigning
        // it, we prevent this from happening.    
        let tempCam = <Camera | null> this.camera
        this.camera = tempCam

        // if camera wasn't in the scene compute it's tranform;  otherwise compute it's inverse
        if (this.camera)
        {
            this.camera.worldInverseTransform = this.camera.inverseTransform;
            var cp = this.camera.parent;
            while (cp) {
                this.camera.worldInverseTransform = 
                    this.camera.worldInverseTransform.multiply(cp.inverseTransform);
                cp = cp.parent;
            }
            var focalLength = this.camera.getFocalLength(this.height).toString();
            
            this.container.style.perspective = focalLength + "px";
            this.domElement.style.transform = "translate3d(0px,0px," + focalLength + "px)" + this.windowTransform;
        }
          
        // set transform of each object to camera.wIT * obj.iT
        var renderThings = (obj: Thing) => {
            if (obj instanceof HTMLDivThing) {
                const pos = obj.worldTransform.getPosition();
                const normal = obj.worldTransform.getZVector();

                if (this.camera) {
                    var m = this.camera.worldInverseTransform.multiply(obj.worldTransform);                

                    const transformStr = this.getObjectCSSMatrix(m);
                    if (transformStr != obj.transformCache) {
                        obj.transformCache = transformStr;
                        obj.div.style.transform = transformStr;
                    }
                    this.domElement.appendChild(obj.div);
                }
            }
        };
        // "render" the div's
        this.world.traverse(renderThings);         
    }
}