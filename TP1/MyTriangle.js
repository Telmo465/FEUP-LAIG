/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x1 - x coordinate corner 1
 * @param y1 - y coordinate corner 1
 * @param x2 - x coordinate corner 2
 * @param y2 - y coordinate corner 2
 */
class MyTriangle extends CGFobject {
	constructor(scene, x1, y1, x2, y2, x3, y3) {
		super(scene);
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.x3 = x3;
		this.y3 = y3;

		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [
			this.x1, this.y1, 0,	//0
			this.x2, this.y2, 0,	//1
			this.x3, this.y3, 0,	//2
		];
		
		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2,
			2, 1, 0
		];

		//Facing Z positive
		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		];
		
		/*
		Texture coords (s,t)
		+----------> s
        |
        |
		|
		v
        t
        */

	   	this.a = Math.sqrt(Math.pow((this.x2-this.x1),2) + Math.pow((this.y2-this.y1),2));
		this.b = Math.sqrt(Math.pow((this.x3-this.x2),2) + Math.pow((this.y3-this.y2),2));
		this.c = Math.sqrt(Math.pow((this.x1-this.x3),2) + Math.pow((this.y1-this.y3),2));
		
		this.alpha = Math.acos((Math.pow(this.a,2) - Math.pow(this.b,2) + Math.pow(this.c,2))/(2*this.a*this.c));

		this.alpha_cos = Math.cos(this.alpha);
		this.alpha_sin = Math.sin(this.alpha);

		var rectangle_maxX = this.x1;
		if (this.x2 > rectangle_maxX)
			rectangle_maxX = this.x2;
		else if (this.x3 > rectangle_maxX)
			rectangle_maxX = this.x3;
		
		var rectangle_maxY = this.y1;
		if (this.y2 > rectangle_maxY)
			rectangle_maxY = this.y2;
		else if (this.y3 > rectangle_maxY)
			rectangle_maxY = this.y3;

		if (rectangle_maxX > rectangle_maxY)
			rectangle_maxX = rectangle_maxY;
		else if (rectangle_maxY > rectangle_maxY)
			rectangle_maxY = rectangle_maxX;

		//var max = rectangle_maxX;

		var T1x = 0;
		var T1y = 1;
		
		var T2x = this.a;
		var T2y = 1;
		
		var T3x = this.c * Math.cos(this.alpha);
		var T3y = this.c * Math.sin(this.alpha);

		this.texCoords = [
			T1x, T1y,
			T2x, T2y,
			T3x, 1-T3y
		]
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinate
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(afs, aft) {
		this.texCoords = [
			0, 1,
			this.a/afs, 1,
			(this.c*this.alpha_cos)/afs, (this.c*this.alpha_sin)/aft
		];
		this.updateTexCoordsGLBuffers();
	}
}
 

