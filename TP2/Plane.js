class Plane extends CGFobject {
    constructor(scene, ndivsU, ndivsV){
        super(scene);
        this.scene = scene;
        this.ndivsU = ndivsU;
        this.ndivsV = ndivsV;
    

    this.controlPoints = [  
        [
            [0.5,0.0,-0.5,1],
            [0.5,0.0, 0.5,1]
        ],
        [
            [-0.5,0.0,-0.5,1],
            [-0.5,0.0, 0.5,1]
        ]
    ];

    this.nurbsSurface = new CGFnurbsSurface(1,1,this.controlPoints);

    this.object = new CGFnurbsObject(this.scene ,this.ndivsU, this.ndivsV, this.nurbsSurface);

    }

    display(){
        this.object.display();
    }

    updateTexCoords(afs, aft){}

}