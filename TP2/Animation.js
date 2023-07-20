class Animation {
    
    constructor(scene, id){
        if (this.constructor === Animation)
            throw new Error("Class Animation cannot be instantiated.");
        this.scene = scene;
        this.id = id;
    }

    update(t){}

    apply(){}
}

