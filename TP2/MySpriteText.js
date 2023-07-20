class MySpriteText {
    constructor(scene, text){
        this.scene = scene;
        this.text = text;
        this.texture = new CGFtexture(scene, "./scenes/images/textSprite.png");
        this.spriteSheet = new MySpriteSheet(scene, this.texture, 16, 16);
        this.initBuffers();
        
    }

    initBuffers(){
        this.rectangles = [];

        for (let i = 0; i < this.text.length; i++){
            let rectangle = new MyRectangle(this.scene, 0,0,1,1);
            this.rectangles.push(rectangle);
        }
    }

    getCharacterPosition(character){
        var n = character.charCodeAt(0); //gets ASCII code from the first character
        this.spriteSheet.activateCellP(n);
    }

    updateTexCoords(afs, aft) {
        for (let i = 0; i < this.text.length; i++) {
            this.rectangles[i].updateTexCoords(afs, aft);
        }
    }

    display(){
        this.scene.gl.enable(this.scene.gl.BLEND);         // enables blending
        this.scene.gl.blendFunc(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA);
        this.scene.gl.depthMask(false);

        this.spriteSheet.scene.pushMatrix();
        this.spriteSheet.scene.setActiveShaderSimple(this.spriteSheet.shader);
        this.texture.bind();

        for (var i = 0; i < this.rectangles.length; i++){
            var str = this.text[i];
            this.getCharacterPosition(str);
            this.rectangles[i].display();
            this.scene.translate(1,0,0);
        }

        this.spriteSheet.texture.unbind();
        this.spriteSheet.scene.popMatrix();
        this.spriteSheet.scene.setActiveShaderSimple(this.spriteSheet.defaultShader);

        this.scene.gl.disable(this.scene.gl.BLEND);
        this.scene.gl.depthMask(true);
    }
}
