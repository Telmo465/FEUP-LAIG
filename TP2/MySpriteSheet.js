class MySpriteSheet{
    constructor(scene, texture, sizeM, sizeN){
        this.scene = scene;
        this.texture = texture;
        this.sizeM = sizeM;
        this.sizeN = sizeN;
        this.shader = new CGFshader(this.scene.gl, "shaders/sprite.vert", "shaders/sprite.frag");
        this.shader.setUniformsValues({uSampler: 0});
        this.shader.setUniformsValues({spriteSheetSize: [1/this.sizeM, 1/this.sizeN]});
        this.defaultShader = this.scene.defaultShader;
    }

    activateCellMN(M, N){
        this.shader.setUniformsValues({selectedSprite: [M,N]});
    }

    activateCellP(P){
        var row = Math.floor(P / this.sizeM);
        var col = Math.floor(P % this.sizeM);
        this.shader.setUniformsValues({selectedSprite: [col,row]});
    }

    update(t){}

}