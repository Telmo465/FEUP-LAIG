class KeyFrame{
    constructor(instant, translateMatrix, rotationMatrix, scaleMatrix){
        this.instant = instant*1000; //to ms
        this.translateMatrix = translateMatrix;
        this.rotationMatrix = rotationMatrix;
        this.scaleMatrix = scaleMatrix;
    }
}
