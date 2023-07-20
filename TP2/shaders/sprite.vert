attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 coords;
varying vec2 textCoods;

uniform vec2 selectedSprite;
uniform vec2 spriteSheetSize;



void main() {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    
    float width = spriteSheetSize.x; //sprite width
    float heigth = spriteSheetSize.y; //sprite heigth

    float dx = (selectedSprite.x ) * width + (aTextureCoord.x) * width;
    float dy = (selectedSprite.y ) * heigth + (aTextureCoord.y) * heigth;
 
    coords = vec2(dx,dy);
    
    
}