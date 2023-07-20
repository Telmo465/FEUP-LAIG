class MyCylinder extends CGFobject {

  constructor(scene, slices, stacks, bottomRadius, topRadius, height) {
    super(scene);
    this.slices = slices;
    this.stacks = stacks;
    this.bottomRadius = bottomRadius;
    this.topRadius = topRadius;
    this.height = height;
    this.topBase = new MyCircle(this.scene,this.slices);
    this.bottomBase = new MyCircle(this.scene,this.slices);

    this.initBuffers();
  }


  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords=[];

    var ang = 2*Math.PI/this.slices;

    for (var i = 0; i <= this.stacks; i++) {
      for (var j = 0; j < this.slices; j++) {
        this.vertices.push(
          Math.cos(j * ang) * ((this.stacks - i) * (this.bottomRadius - this.topRadius) / (this.stacks) + this.topRadius),
          Math.sin(j * ang) * ((this.stacks - i) * (this.bottomRadius - this.topRadius) / (this.stacks) + this.topRadius),
          i / this.stacks * this.height);

        this.normals.push(Math.cos(j * ang),  Math.sin(j * ang), 0);

        this.texCoords.push(j / this.slices, i / this.stacks);
      }
    }

    for (var i = 0; i < this.stacks; i++) {
      for (j = 0; j < this.slices-1; j++) {
          this.indices.push(i * this.slices + j, i * this.slices + j + 1, (i + 1) * this.slices + j);
          this.indices.push(i * this.slices + j + 1, (i + 1) * this.slices + j + 1, (i + 1) * this.slices + j);
      }

      this.indices.push(i * this.slices + this.slices - 1, i * this.slices, (i + 1) * this.slices + this.slices - 1);
      this.indices.push(i * this.slices, i * this.slices + this.slices, (i + 1) * this.slices + this.slices - 1);
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }

  display(){

    CGFobject.prototype.display.call(this);
    
    this.scene.pushMatrix();
    this.scene.scale(this.topRadius, this.topRadius, 1);
    this.scene.translate(0,0,this.height);
    this.topBase.display();
    this.scene .popMatrix();

    this.scene.pushMatrix();
    this.scene.scale(this.bottomRadius, this.bottomRadius, 1);
    this.scene.rotate(Math.PI,1,0,0);
    this.bottomBase.display();
    this.scene.popMatrix();
  }

  updateBuffers(complexity){

    this.initBuffers();
    this.initNormalVizBuffers();
  }
  
  updateTexCoords(afs,aft) {
    this.updateTexCoordsGLBuffers();
  }
}
