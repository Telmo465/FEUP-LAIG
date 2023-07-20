class MyGraphNode{
    constructor(nodeID, graph){
        this.nodeID = nodeID;
        this.graph = graph;
        this.material = null;
        this.texture = null;
        this.afs= null;
        this.aft = null;
        this.children = []; //child nodes
        this.leaves = []; //child leaves
        this.animation = null;
        this.transformMatrix = mat4.create(); //matriz das transformacoes
        mat4.identity(this.transformMatrix);
        this.texturesAmplified = false;

    }

    addChildLeave(leaf){
        this.leaves.push(leaf);
    }

    addChildNode(nodeID){
        this.children.push(nodeID);
    }

    amplifyTexture(amplifierS, amplifierT, primitive) {
        for (let i = 0; i < primitive.texCoords.length; i += 2) {
            primitive.texCoords[i] = primitive.texCoords[i] / amplifierS;
            primitive.texCoords[i + 1] = primitive.texCoords[i + 1] / amplifierT;
        }
        
        primitive.updateTexCoordsGLBuffers();
    };

    display(MatIni, TextureIni){
        
        var currentMaterial = MatIni;
        var currentTexture = TextureIni;

        if (this.material != null) currentMaterial = this.material;
        if (this.texture != null && this.texture != "clear") currentTexture = this.texture;
        

        if (this.texture == "clear"){
            currentTexture = null;
        }
        this.graph.scene.multMatrix(this.transformMatrix);
        if (this.animation != null) this.animation.apply();


        for (var i = 0; i < this.leaves.length; i++){
            if (currentTexture != null && !this.texturesAmplified){
                this.leaves[i].updateTexCoords(this.afs, this.aft);
                this.texturesAmplified = true;
            }
            
            currentMaterial.setTextureWrap('REPEAT', 'REPEAT');
            currentMaterial.setTexture(currentTexture);
            currentMaterial.apply();
            
            this.leaves[i].display();
        }

        for (var j = 0; j < this.children.length; j++){
            this.graph.scene.pushMatrix();
            
            if (this.graph.nodes[this.children[j]] != null) {
                if (this.graph.nodes[this.children[j]].animation == null)
                    this.graph.nodes[this.children[j]].display(currentMaterial, currentTexture);


                if (this.graph.nodes[this.children[j]].animation != null){
                    if (this.graph.nodes[this.children[j]].animation.startedMoving)
                        this.graph.nodes[this.children[j]].display(currentMaterial, currentTexture);
                }

            }
            else this.graph.onXMLMinorError("Node not defined.");

            this.graph.scene.popMatrix();
            
        }

        
    }
}