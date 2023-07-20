class MyGraphLeaf{
    constructor(leafType, graph, dimensions){
        this.graph = graph;
        this.leafType = leafType;
        this.primitive = null;
        
        if (leafType == "rectangle"){
            this.primitive = new MyRectangle(this.graph.scene, dimensions[0], dimensions[1], dimensions[2], dimensions[3]);
        }

        else if (leafType == 'sphere')
            this.primitive = new MySphere(this.graph.scene, dimensions[0], dimensions[1], dimensions[2]);

        else if (leafType == 'triangle')
            this.primitive = new MyTriangle(this.graph.scene, dimensions[0], dimensions[1], dimensions[2], dimensions[3], dimensions[4], dimensions[5]);

        else if (leafType == 'cylinder') {
            this.primitive = new MyCylinder(this.graph.scene, dimensions[0], dimensions[1], dimensions[2], dimensions[3], dimensions[4]);
        }
        else if (leafType == 'torus'){
            this.primitive = new MyTorus(this.graph.scene, dimensions[0], dimensions[1], dimensions[2], dimensions[3]);
        }
    }

    display(){
        this.primitive.display();
    }
}
