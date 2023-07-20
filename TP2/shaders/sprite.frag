#ifdef  GL_ES
precision highp float;
#endif

varying vec2 coords;
varying vec2 textCoords;

uniform sampler2D uSampler;



void main(){
    vec4 color = texture2D(uSampler, coords);    
    gl_FragColor = color;
    
}
