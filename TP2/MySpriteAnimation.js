class MySpriteAnimation{
    constructor(scene, texture, sizeM, sizeN, duration, startCell, endCell){
        this.spriteSheet = new MySpriteSheet(scene, texture, sizeM, sizeN);
        this.scene = scene;
        this.duration = duration;
        this.startCell = startCell;
        this.endCell = endCell;
        this.startTime = 0;
        this.numCells = this.sizeM * this.sizeN;
        this.spriteSheet.activateCellP(this.startCell);
        this.currentCell = this.startCell;
        this.transitionTime = this.duration*1000/(this.endCell - this.startCell);
        this.surface = new MyRectangle(this.spriteSheet.scene, 0,0,1,1);
    }

    update(t){
        
        if ((t - this.startTime) >= this.transitionTime){
            if (this.currentCell == this.endCell){
                this.currentCell = this.startCell;
                this.spriteSheet.activateCellP(this.currentCell);
            }
            this.currentCell++;
            this.spriteSheet.activateCellP(this.currentCell);
            this.startTime = t;
        }
    }

    updateTexCoords(afs, aft) {}

    display(){ //display function required, because MySpriteAnimation is also a leafType
        this.scene.gl.enable(this.scene.gl.BLEND);         // enables blending
        this.scene.gl.blendFunc(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA);
        this.scene.gl.depthMask(false);

        this.spriteSheet.scene.pushMatrix();
        this.spriteSheet.scene.setActiveShaderSimple(this.spriteSheet.shader);
        this.spriteSheet.texture.bind();
        this.surface.display();
        this.spriteSheet.texture.unbind();
        this.spriteSheet.scene.setActiveShaderSimple(this.spriteSheet.defaultShader);
        this.spriteSheet.scene.popMatrix();

        this.scene.gl.disable(this.scene.gl.BLEND);
        this.scene.gl.depthMask(true);
    }


}