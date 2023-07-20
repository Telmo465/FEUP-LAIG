class DefBarrel extends CGFobject{
    constructor(scene, base, middle, height, slices, stacks){
        super(scene);
        this.base = base;
        this.middle = middle;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;

        this.npartsU = slices/2;
        this.npartsV = stacks/2;
        var controlPointsTop = [
            [
                [-this.base,0,0,1],
                [-this.base,4*this.base/3,0,1],
                [this.base, 4*this.base/3,0,1],
                [this.base,0,0,1]
            ],

            [
                [-this.middle,0,this.height/2,1],
                [-this.middle,4/3*this.middle,this.height/2,1],
                [this.middle,4/3*this.middle,this.height/2,1],
                [this.middle,0,this.height/2,1]
            ],

            [
                [-this.base,0,this.height,1],
                [-this.base,4/3*this.base,this.height,1],
                [this.base,4/3*this.base,this.height,1],
                [this.base,0,this.height,1]       
            ]

        ];

        var controlPointsBot = [
            [
                [this.base,0,0,1],
                [this.base,-4*this.base/3,0,1],
                [-this.base,-4*this.base/3,0,1],
                [-this.base,0,0,1]
            ],

            [
                [this.middle,0,this.height/2,1],
                [this.middle,-4/3*this.middle,this.height/2,1],
                [-this.middle,-4/3*this.middle,this.height/2,1],
                [-this.middle,0,this.height/2,1]
            ],
    

    
            [
                [this.base,0,this.height,1],
                [this.base,-4/3*this.base,this.height,1],
                [-this.base,-4/3*this.base,this.height,1],
                [-this.base,0,this.height,1]       
            ]
    
        ];



        var nurbsSurfaceTop = new CGFnurbsSurface(2, 3, controlPointsTop);
        var nurbsSurfaceBottom = new CGFnurbsSurface(2, 3, controlPointsBot);
        this.nurbsCylinderTop = new CGFnurbsObject(this.scene,this.stacks,Math.ceil(this.slices/2),nurbsSurfaceTop);
        this.nurbsCylinderBottom = new CGFnurbsObject(this.scene,this.stacks,Math.ceil(this.slices/2),nurbsSurfaceBottom);
    }

    updateTexCoords(afs, aft){}

    display(){
        this.nurbsCylinderTop.display();
        this.nurbsCylinderBottom.display();
    }
}