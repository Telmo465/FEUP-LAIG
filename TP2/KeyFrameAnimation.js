class KeyFrameAnimation extends Animation{
    constructor(scene, id){
        super(scene, id)
        this.scene = scene;
        this.id = id
        this.transformMatrix = mat4.create();
        this.keyframes = [];
        this.startTime = 0;
        this.currentTime;
        this.currentKeyframe = 0; //current KeyFrame index
        this.running = false;
        this.startedMoving = false;

    }

    addKeyFrame(keyframe){

        if (this.keyframes.length == 0){
            this.keyframes.push(keyframe);
            return;
        }
        
        var last_instant = this.keyframes[this.keyframes.length-1].instant;

        if (keyframe.instant > last_instant){
            this.keyframes.push(keyframe);
        }
    }

    interpolate(Ti,Tf,p){
        return Ti + (Tf - Ti) * p;
    }

    update(t){
        if (this.startTime == 0)
            this.startTime = t;

        this.currentTime = t - this.startTime;
        
        if (this.currentTime >= this.keyframes[0].instant){
            this.startedMoving = true;
        }

        if (this.currentKeyframe < this.keyframes.length - 1) {
            if (this.currentTime >= this.keyframes[this.currentKeyframe+1].instant){
                this.currentKeyframe++;
            }
        }

        if (this.currentKeyframe == this.keyframes.length - 1) {
            this.transformMatrix = mat4.create();
            this.transformMatrix = mat4.translate(this.transformMatrix, this.transformMatrix, [this.keyframes[this.currentKeyframe].translateMatrix[0],this.keyframes[this.currentKeyframe].translateMatrix[1],this.keyframes[this.currentKeyframe].translateMatrix[2]]);
            this.transformMatrix = mat4.rotate(this.transformMatrix, this.transformMatrix, this.keyframes[this.currentKeyframe].rotationMatrix[0], [1,0,0]);
            this.transformMatrix = mat4.rotate(this.transformMatrix, this.transformMatrix, this.keyframes[this.currentKeyframe].rotationMatrix[1], [0,1,0]);
            this.transformMatrix = mat4.rotate(this.transformMatrix, this.transformMatrix, this.keyframes[this.currentKeyframe].rotationMatrix[2], [0,0,1]);
            this.transformMatrix = mat4.scale(this.transformMatrix, this.transformMatrix, [this.keyframes[this.currentKeyframe].scaleMatrix[0],this.keyframes[this.currentKeyframe].scaleMatrix[1],this.keyframes[this.currentKeyframe].scaleMatrix[2]]);
            return;
        }

        var percentage = (this.currentTime - this.keyframes[this.currentKeyframe].instant) / (this.keyframes[this.currentKeyframe + 1].instant - this.keyframes[this.currentKeyframe].instant);

        var tx = this.interpolate(this.keyframes[this.currentKeyframe].translateMatrix[0], this.keyframes[this.currentKeyframe + 1].translateMatrix[0], percentage);
        var ty = this.interpolate(this.keyframes[this.currentKeyframe].translateMatrix[1], this.keyframes[this.currentKeyframe + 1].translateMatrix[1], percentage);
        var tz = this.interpolate(this.keyframes[this.currentKeyframe].translateMatrix[2], this.keyframes[this.currentKeyframe + 1].translateMatrix[2], percentage);

        var rx = this.interpolate(this.keyframes[this.currentKeyframe].rotationMatrix[0], this.keyframes[this.currentKeyframe + 1].rotationMatrix[0], percentage);
        var ry = this.interpolate(this.keyframes[this.currentKeyframe].rotationMatrix[1], this.keyframes[this.currentKeyframe + 1].rotationMatrix[1], percentage);
        var rz = this.interpolate(this.keyframes[this.currentKeyframe].rotationMatrix[2], this.keyframes[this.currentKeyframe + 1].rotationMatrix[2], percentage);

        var sx = this.interpolate(this.keyframes[this.currentKeyframe].scaleMatrix[0], this.keyframes[this.currentKeyframe + 1].scaleMatrix[0], percentage);
        var sy = this.interpolate(this.keyframes[this.currentKeyframe].scaleMatrix[1], this.keyframes[this.currentKeyframe + 1].scaleMatrix[1], percentage);
        var sz = this.interpolate(this.keyframes[this.currentKeyframe].scaleMatrix[2], this.keyframes[this.currentKeyframe + 1].scaleMatrix[2], percentage);


        this.transformMatrix = mat4.create();

        this.transformMatrix = mat4.translate(this.transformMatrix, this.transformMatrix, [tx,ty,tz]);
        this.transformMatrix = mat4.rotate(this.transformMatrix, this.transformMatrix, rx, [1,0,0]);
        this.transformMatrix = mat4.rotate(this.transformMatrix, this.transformMatrix, ry, [0,1,0]);
        this.transformMatrix = mat4.rotate(this.transformMatrix, this.transformMatrix, rz, [0,0,1]);
        this.transformMatrix = mat4.scale(this.transformMatrix, this.transformMatrix, [sx,sy,sz]);


    }

    apply(){
        this.scene.multMatrix(this.transformMatrix);
    }
    
}