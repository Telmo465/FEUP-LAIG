const DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var INITIALS_INDEX = 0;
var VIEWS_INDEX = 1;
var ILLUMINATION_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var SPRITES_INDEX = 5;
var MATERIALS_INDEX = 6;
var ANIMATIONS_INDEX = 7;
var NODES_INDEX = 8;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * Constructor for MySceneGraph class.
     * Initializes necessary variables and starts the XML file reading process.
     * @param {string} filename - File that defines the 3D scene
     * @param {XMLScene} scene
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null; // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        this.animationIDs = [];
        this.spriteIDs = [];
        this.spriteAnimations = [];
        this.spriteAnimationIDs = [];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lsf")
            return "root tag <lsf> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <initials>
        var index;
        if ((index = nodeNames.indexOf("initials")) == -1)
            return "tag <initials> missing";
        else {
            if (index != INITIALS_INDEX)
                this.onXMLMinorError("tag <initials> out of order " + index);

            //Parse initials block
            if ((error = this.parseInitials(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order " + index);

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <illumination>
        if ((index = nodeNames.indexOf("illumination")) == -1)
            return "tag <illumination> missing";
        else {
            if (index != ILLUMINATION_INDEX)
                this.onXMLMinorError("tag <illumination> out of order");

            //Parse illumination block
            if ((error = this.parseIllumination(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        //<spritesheets>
        if ((index = nodeNames.indexOf("spritesheets")) == -1)
            return "tag <spritesheets> missing";
        else {
            if (index != SPRITES_INDEX)
                this.onXMLMinorError("tag <spritesheets> out of order");

            //Parse sprites block
            if ((error = this.parseSprites(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }
        
        //Animations
        if ((index = nodeNames.indexOf("animations")) == -1)
            NODES_INDEX = 7;
        else {
            if (index != ANIMATIONS_INDEX)
                this.onXMLMinorError("tag <animations> out of order");
            
            //parse animations
            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }
    

        // <nodes>
        if ((index = nodeNames.indexOf("nodes")) == -1)
            return "tag <nodes> missing";
        else {
            if (index != NODES_INDEX)
                this.onXMLMinorError("tag <nodes> out of order");

            //Parse nodes block
            if ((error = this.parseNodes(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <initials> block. 
     * @param {initials block element} initialsNode
     */
    parseInitials(initialsNode) {
        var children = initialsNode.children;
        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var rootIndex = nodeNames.indexOf("root");
        var referenceIndex = nodeNames.indexOf("reference");

        // Get root of the scene.
        if(rootIndex == -1)
            return "No root id defined for scene.";

        var rootNode = children[rootIndex];
        var id = this.reader.getString(rootNode, 'id');
        if (id == null)
            return "No root id defined for scene.";

        this.idRoot = id;

        // Get axis length        
        if(referenceIndex == -1)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        var refNode = children[referenceIndex];
        var axis_length = this.reader.getFloat(refNode, 'length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed initials");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseViews(viewsNode) {
        var children = viewsNode.children;
        var numCameras = 0;
        if (children.length == 0)
            this.log("No views defined");
        
        this.perspective = null;
            
        for (var i = 0; i < children.length; i++){
            var cameraID = this.reader.getString(children[i], "id");
            //perspective cameras
            if (children[i].nodeName == "perspective"){
                var perspective = children[i];
                
                var near = this.reader.getFloat(perspective, 'near');
                var far = this.reader.getFloat(perspective, 'far');
                var angle = this.reader.getFloat(perspective, 'angle');
                
                var perspectiveNodes = [];
                for (var j = 0; j < perspective.children.length; j++){
                    perspectiveNodes.push(perspective.children[j].nodeName);
                }


                var position_from_index = perspectiveNodes.indexOf('from');
                var position_to_index = perspectiveNodes.indexOf('to');

                var from_x = this.reader.getFloat(perspective.children[position_from_index], 'x');
                var from_y = this.reader.getFloat(perspective.children[position_from_index], 'y');
                var from_z = this.reader.getFloat(perspective.children[position_from_index], 'z');
                
                var to_x = this.reader.getFloat(perspective.children[position_to_index], 'x');
                var to_y = this.reader.getFloat(perspective.children[position_to_index], 'y');
                var to_z = this.reader.getFloat(perspective.children[position_to_index], 'z');

                this.perspective = new CGFcamera(angle * Math.PI/180, near, far, vec3.fromValues(from_x,from_y,from_z), vec3.fromValues(to_x, to_y, to_z));
                numCameras++;

                var index = this.scene.cameras.length;
                this.scene.cameras.push(this.perspective);
                this.scene.camerasIDs[cameraID] = index;
            }

            
            //Orthogonal cameras
            else if (children[i].nodeName == "ortho"){
                var ortho = children[i];
                
                var near = this.reader.getFloat(ortho, 'near');
                var far = this.reader.getFloat(ortho, 'far');

                var left = this.reader.getFloat(ortho, 'left');
                var right = this.reader.getFloat(ortho, 'right');
                var top = this.reader.getFloat(ortho, 'top');
                var bottom = this.reader.getFloat(ortho, 'bottom');

                //default up values
                var up_x = 0;
                var up_y = 1;
                var up_z = 0;
                
                var orthoNodes = [];
                for (var j = 0; j < ortho.children.length; j++){
                    orthoNodes.push(ortho.children[j].nodeName);
                }

                var position_from_index = orthoNodes.indexOf('from');
                var position_to_index = orthoNodes.indexOf('to');
                var up_index = orthoNodes.indexOf('up');
                
                
                var from_x = this.reader.getFloat(ortho.children[position_from_index], 'x');
                var from_y = this.reader.getFloat(ortho.children[position_from_index], 'y');
                var from_z = this.reader.getFloat(ortho.children[position_from_index], 'z');

                var to_x = this.reader.getFloat(ortho.children[position_to_index], 'x');
                var to_y = this.reader.getFloat(ortho.children[position_to_index], 'y');
                var to_z = this.reader.getFloat(ortho.children[position_to_index], 'z');



                if (up_index != -1){
                    up_x = this.reader.getFloat(ortho.children[up_index], 'x');
                    up_y = this.reader.getFloat(ortho.children[up_index], 'y');
                    up_z = this.reader.getFloat(ortho.children[up_index], 'z');
                }

                var position = vec3.fromValues(from_x, from_y, from_z);
                var target = vec3.fromValues(to_x, to_y, to_z);
                var up = vec3.fromValues(up_x, up_y, up_z);

                this.orthoCamera = new CGFcameraOrtho(left, right, bottom, top, near, far, position, target, up);

                var index = this.scene.cameras.length;
                this.scene.cameras.push(this.orthoCamera);
                this.scene.camerasIDs[cameraID] = index;
            }
        }
        
        this.log("Parsed views");
        return null;
    }

    /**
     * Parses the <illumination> node.
     * @param {illumination block element} illuminationsNode
     */
    parseIllumination(illuminationsNode) {

        var children = illuminationsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed Illumination.");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "light") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["enable", "position", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["boolean","position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "boolean")
                        var aux = this.parseBoolean(grandChildren[attributeIndex], "value", "enabled attribute for light of ID" + lightId);
                    else if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (typeof aux === 'string')
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }
            this.lights[lightId] = global;
            numLights++;
        }
        this.scene.numLights = numLights;
        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        //For each texture in textures block, check ID and file URL
        var children = texturesNode.children;
        this.textures = [];
        var textureNames = [];
        var numTextures = 0;
        
        for (var i = 0; i < children.length; i++){
            var textureID = this.reader.getString(children[i], "id");

            if (textureID == null){
                return "Error: texture without id";
            }
            if (this.textures[textureID] != null){
                return "Error: Texture id must be unique!";
            }
            textureNames.push(textureID);
            var text = new CGFtexture(this.scene, this.reader.getString(children[i], "path"));
            this.textures[textureID] = text;
            numTextures++;
        }

        if (numTextures == 0) return "No textures defined";
        this.log("Parsed textures");
        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];
        var numMaterials = 0;
        var grandChildren = [];
        var nodeNames = [];


        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each light (conflict: ID = " + materialID + ")";

            
            

            grandChildren = children[i].children;
            for (var j = 0; j < grandChildren.length; j++){
                nodeNames.push(grandChildren[j].nodeName);
            }
            
            var shininess_index = nodeNames.indexOf('shininess');
            var emissive_index = nodeNames.indexOf('emissive');
            var ambient_index = nodeNames.indexOf('ambient');
            var diffuse_index = nodeNames.indexOf('diffuse');
            var specular_index = nodeNames.indexOf('specular');

            //adicionar tratamento de nodes incorretos
            
            var r_ambient = this.reader.getFloat(grandChildren[ambient_index], 'r');
            var g_ambient = this.reader.getFloat(grandChildren[ambient_index], 'g');
            var b_ambient = this.reader.getFloat(grandChildren[ambient_index], 'b');
            var a_ambient = this.reader.getFloat(grandChildren[ambient_index], 'a');

            var r_diffuse = this.reader.getFloat(grandChildren[diffuse_index], 'r');
            var g_diffuse = this.reader.getFloat(grandChildren[diffuse_index], 'g');
            var b_diffuse = this.reader.getFloat(grandChildren[diffuse_index], 'b');
            var a_diffuse = this.reader.getFloat(grandChildren[diffuse_index], 'a');

            var r_specular = this.reader.getFloat(grandChildren[specular_index], 'r');
            var g_specular = this.reader.getFloat(grandChildren[specular_index], 'g');
            var b_specular = this.reader.getFloat(grandChildren[specular_index], 'b');
            var a_specular = this.reader.getFloat(grandChildren[specular_index], 'a');

            var r_emissive = this.reader.getFloat(grandChildren[emissive_index], 'r');
            var g_emissive = this.reader.getFloat(grandChildren[emissive_index], 'g');
            var b_emissive = this.reader.getFloat(grandChildren[emissive_index], 'b');
            var a_emissive = this.reader.getFloat(grandChildren[emissive_index], 'a');

            var shininess = this.reader.getFloat(grandChildren[shininess_index], 'value');

            var mat = new CGFappearance(this.scene);
            mat.setAmbient(r_ambient, g_ambient, b_ambient, a_ambient);
            mat.setShininess(shininess);
            mat.setDiffuse(r_diffuse, g_diffuse, b_diffuse, a_diffuse);
            mat.setSpecular(r_specular, g_specular, b_specular, a_specular);
            mat.setEmission(r_emissive, g_emissive, b_emissive, a_emissive);

            this.materials[materialID] = mat;

            if (materialID == "null") this.materials[materialID] = null;
            numMaterials++;
        }

        this.log("Parsed materials");
        return null;
        
    }

    parseAnimations(animationsNode){
        var children = animationsNode.children;
        this.animations = [];
        
        for (let i = 0; i < children.length; i++){
            
            if (children[i].nodeName != "animation"){
                this.onXMLError("Unknown tag " + children[i].nodeName);
                continue;
            }

            var animationID = this.reader.getString(children[i], "id");
            if (animationID == null){
                return "No id defined for animation.";
            }
            var keyframeAnimation = new KeyFrameAnimation(this.scene ,animationID);

            var grandChildren = children[i].children;

            for (let j = 0; j < grandChildren.length; j++){
                var instant = this.reader.getFloat(grandChildren[j], "instant");

                var grandGrandChildren = grandChildren[j].children; //Keyframe elements
                
                if (grandGrandChildren.length != 5){
                    this.onXMLMinorError("KeyFrame does not have 5 elements");
                }

                
                if (grandGrandChildren[0].nodeName != "translation" || grandGrandChildren[1].nodeName != "rotation" || grandGrandChildren[2].nodeName != "rotation" || grandGrandChildren[3].nodeName != "rotation" || grandGrandChildren[4].nodeName != "scale"){
                    return "Error in transformations";
                }

                let tx = this.reader.getFloat(grandGrandChildren[0], "x");
                let ty = this.reader.getFloat(grandGrandChildren[0], "y");
                let tz = this.reader.getFloat(grandGrandChildren[0], "z");

                let axis = this.reader.getString(grandGrandChildren[1], "axis");
                if (axis != "x"){
                    this.onXMLMinorError("Rotations defined in the wrong order!");
                }
                let rx = this.reader.getFloat(grandGrandChildren[1], "angle");

                axis = this.reader.getString(grandGrandChildren[2], "axis");
                if (axis != "y"){
                    this.onXMLMinorError("Rotations defined in the wrong order!");
                }
                let ry = this.reader.getFloat(grandGrandChildren[2], "angle");

                axis = this.reader.getString(grandGrandChildren[3], "axis");
                if (axis != "z"){
                    this.onXMLMinorError("Rotations defined in the wrong order!");
                }
                let rz = this.reader.getFloat(grandGrandChildren[3], "angle");

                let sx = this.reader.getFloat(grandGrandChildren[4], "sx");
                let sy = this.reader.getFloat(grandGrandChildren[4], "sy");
                let sz = this.reader.getFloat(grandGrandChildren[4], "sz");
                this.log(animationID);
                var keyFrame = new KeyFrame(instant, [tx,ty,tz], [rx * DEGREE_TO_RAD, ry * DEGREE_TO_RAD, rz * DEGREE_TO_RAD], [sx,sy,sz]);


                keyframeAnimation.addKeyFrame(keyFrame);
                this.log(keyFrame);

            }
            this.animations[animationID] = keyframeAnimation;
            this.animationIDs.push(animationID);       
        }
    }


    parseSprites(spritesNode) {
        this.sprites = [];
        let spritesChildren = spritesNode.children;
        for (let i = 0; i < spritesChildren.length; i++){
            let spriteID = this.reader.getString(spritesChildren[i], "id");
            let spritePath = this.reader.getString(spritesChildren[i], "path");
            let spriteSizeM = this.reader.getFloat(spritesChildren[i], "sizeM");
            let spriteSizeN = this.reader.getFloat(spritesChildren[i], "sizeN");
            let texture = new CGFtexture(this.scene, spritePath);
            var sprite = new MySpriteSheet(this.scene, texture, spriteSizeM, spriteSizeN);
            this.sprites[spriteID] = sprite;
            this.spriteIDs.push(spriteID);
        }
    }


    /**
   * Parses the <nodes> block.
   * @param {nodes block element} nodesNode
   */
  parseNodes(nodesNode) {
        var children = nodesNode.children;

        this.nodes = [];
        var nodesList = [];

        var grandChildren = [];
        var nodeNames = [];

        // Any number of nodes.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "node") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current node.
            var nodeID = this.reader.getString(children[i], 'id');
            if (nodeID == null)
                return "no ID defined for nodeID";

            // Checks for repeated IDs.
            this.log(nodeID);
            if (this.nodes[nodeID] != null){
                return "ID must be unique for each node (conflict: ID = " + nodeID + ")";
            }
            nodesList.push(nodeID);

            this.nodes[nodeID] = new MyGraphNode(nodeID, this);
            
            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationsIndex = nodeNames.indexOf("transformations");
            var materialIndex = nodeNames.indexOf("material");
            var textureIndex = nodeNames.indexOf("texture");
            var descendantsIndex = nodeNames.indexOf("descendants");
            var animationsIndex = nodeNames.indexOf("animationref");


            //Error treatment
            if (transformationsIndex == -1 || materialIndex == -1 || textureIndex == -1 || descendantsIndex == -1){
                return "XML file error.";
            }

            if (animationsIndex != -1 && animationsIndex != transformationsIndex +1)
                return "XML file error.";

            // Transformations
            
            var transformations = grandChildren[transformationsIndex].children;
            //indexar vetor por ordem inversa
            for (var k = 0; k < transformations.length; k++){
                var transformationNode = transformations[k].nodeName;
                if (transformationNode == 'translation'){
                    var x = this.reader.getFloat(transformations[k], 'x');
                    var y = this.reader.getFloat(transformations[k], 'y');
                    var z = this.reader.getFloat(transformations[k], 'z');
                    
                    if (isNaN(x) || isNaN(y) || isNaN(z)) return "Invalid translation values.";
                    else if (x == null || y == null || z == null) return "Invalid translation values.";


                    mat4.translate(this.nodes[nodeID].transformMatrix, this.nodes[nodeID].transformMatrix, [x, y, z]);

                }

                else if (transformationNode == 'scale'){
                    var sx = this.reader.getFloat(transformations[k], 'sx');
                    var sy = this.reader.getFloat(transformations[k], 'sy');
                    var sz = this.reader.getFloat(transformations[k], 'sz');
                    
                    if (isNaN(sx) || isNaN(sy) || isNaN(sz)) return "Invalid scale values.";
                    else if (sx == null || sy == null || sz == null) return "Invalid scale values.";

                    mat4.scale(this.nodes[nodeID].transformMatrix, this.nodes[nodeID].transformMatrix, [sx, sy, sz]);
                }

                else if (transformationNode == 'rotation'){
                    var axis = this.reader.getItem(transformations[k], 'axis', ['x', 'y', 'z']);
                    var angle = this.reader.getFloat(transformations[k], 'angle');

                    if (isNaN(angle)) return "Invalid rotation values.";
                    else if (axis == null || angle == null) return "Invalid rotation values.";

                    mat4.rotate(this.nodes[nodeID].transformMatrix, this.nodes[nodeID].transformMatrix, angle * Math.PI/180, this.axisCoords[axis]);

                }
            }

            // Animations
            if (animationsIndex != -1) {
                var animationID = this.reader.getString(grandChildren[animationsIndex], "id");
                if (this.animations[animationID] == null)
                    this.onXMLMinorError("Invalid animation ID in node " + nodeID);
                else this.nodes[nodeID].animation = this.animations[animationID];
            }


            // Material

            var IDMaterial = this.reader.getString(grandChildren[materialIndex], 'id');
            //Error treatment
            if (IDMaterial == null) return "No material id defined.";
            if (IDMaterial != "null" && this.materials[IDMaterial] == null) return "Material must be defined on materials tag.";

            this.nodes[nodeID].material = this.materials[IDMaterial];

            if (IDMaterial == "null") this.nodes[nodeID].material = null;

            // Texture

            var IDtexture = this.reader.getString(grandChildren[textureIndex], 'id');
            if (IDtexture == null) return "Unable to read texture ID";

            else if (IDtexture != "null" && IDtexture != "clear" && this.textures[IDtexture] == null){
                return "Unvalid texture!";
            }
            if (IDtexture == "null") this.nodes[nodeID].texture = null;
            
            if (IDtexture == "clear"){
                this.nodes[nodeID].texture = "clear";
            }
            
            var textureChildren = grandChildren[textureIndex].children;
            var textureChildrenNodes = [];
            for (var l = 0; l < textureChildren.length; l++) textureChildrenNodes.push(textureChildren[l].nodeName);
            var afs = 1.0;
            var aft = 1.0;
            var amplification_index = textureChildrenNodes.indexOf('amplification');
            if (amplification_index != -1){
                afs = this.reader.getFloat(textureChildren[amplification_index], 'afs');
                aft = this.reader.getFloat(textureChildren[amplification_index], 'aft');
            }

            if (isNaN(afs) || isNaN(aft)) return "Incorrect amplification values";
            if (IDtexture != "clear") this.nodes[nodeID].texture = this.textures[IDtexture];
            this.nodes[nodeID].afs = afs;
            this.nodes[nodeID].aft = aft;
            
            // Descendants

            var descendantsArray = grandChildren[descendantsIndex].children;
            for (var m = 0; m < descendantsArray.length; m++){
                
                if (descendantsArray[m].nodeName == 'noderef'){
                    var noderefID = this.reader.getString(descendantsArray[m], 'id');
                    if (noderefID == null) return "Error: invalid node reference.";
                    this.nodes[nodeID].addChildNode(noderefID);
                }

                else if (descendantsArray[m].nodeName == 'leaf'){
                    var typeLeaf = this.reader.getItem(descendantsArray[m], 'type', ['triangle', 'rectangle', 'cylinder', 'sphere', 'torus', 'spriteanim', 'spritetext', 'plane','patch', 'defbarrel']);
                    switch(typeLeaf){
                        case 'rectangle':
                            var x1= this.reader.getFloat(descendantsArray[m], 'x1');
                            var y1= this.reader.getFloat(descendantsArray[m], 'y1');
                            var x2= this.reader.getFloat(descendantsArray[m], 'x2');
                            var y2= this.reader.getFloat(descendantsArray[m], 'y2');
                            var leaf = new MyGraphLeaf('rectangle', this, [x1,y1,x2,y2]);
                            this.nodes[nodeID].addChildLeave(leaf);
                            break;
                        case 'cylinder':
                            var height=this.reader.getFloat(descendantsArray[m],'height');
                            var topRadius=this.reader.getFloat(descendantsArray[m],'topRadius');
                            var bottomRadius=this.reader.getFloat(descendantsArray[m],'bottomRadius');
                            var stacks=this.reader.getFloat(descendantsArray[m],'stacks');
                            var slices=this.reader.getFloat(descendantsArray[m],'slices');
                            var leaf = new MyGraphLeaf('cylinder', this, [slices,stacks,bottomRadius,topRadius,height]);
                            this.nodes[nodeID].addChildLeave(leaf);
                            break;
                        case 'sphere':
                            var radius = this.reader.getFloat(descendantsArray[m], 'radius');
                            var slices = this.reader.getFloat(descendantsArray[m], 'slices');
                            var stacks = this.reader.getFloat(descendantsArray[m], 'stacks');
                            var leaf = new MyGraphLeaf('sphere', this, [radius, slices, stacks]);
                            this.nodes[nodeID].addChildLeave(leaf);
                            break;
                        case 'triangle':
                            var x1= this.reader.getFloat(descendantsArray[m], 'x1');
                            var y1= this.reader.getFloat(descendantsArray[m], 'y1');
                            var x2= this.reader.getFloat(descendantsArray[m], 'x2');
                            var y2= this.reader.getFloat(descendantsArray[m], 'y2');
                            var x3= this.reader.getFloat(descendantsArray[m], 'x3');
                            var y3= this.reader.getFloat(descendantsArray[m], 'y3');
                            var leaf = new MyGraphLeaf('triangle', this, [x1, y1, x2, y2, x3, y3]);
                            this.nodes[nodeID].addChildLeave(leaf);
                            break;
                        case 'torus':
                            var inner = this.reader.getFloat(descendantsArray[m], 'inner');
                            var outer = this.reader.getFloat(descendantsArray[m], 'outer');
                            var slices = this.reader.getFloat(descendantsArray[m], 'slices');
                            var loops = this.reader.getFloat(descendantsArray[m], 'loops');
                            var leaf = new MyGraphLeaf('torus', this, [inner, outer, slices, loops]);
                            this.nodes[nodeID].addChildLeave(leaf);
                            break;
                        case 'spriteanim':
                            var ssid = this.reader.getString(descendantsArray[m], 'ssid');
                            var duration = this.reader.getFloat(descendantsArray[m], 'duration');
                            var startCell = this.reader.getFloat(descendantsArray[m], 'startCell');
                            var endCell = this.reader.getFloat(descendantsArray[m], 'endCell');
                            if (this.sprites[ssid] == null){
                                this.onXMLMinorError("No sprite with id " + ssid + " defined");
                                break;
                            }
                            var spriteAnim = new MySpriteAnimation(this.scene, this.sprites[ssid].texture, this.sprites[ssid].sizeM, this.sprites[ssid].sizeN, duration, startCell, endCell);
                            this.spriteAnimationIDs.push(ssid);
                            this.spriteAnimations[ssid] = spriteAnim;
                            this.nodes[nodeID].addChildLeave(spriteAnim);
                            break;
                        case 'spritetext':
                            var text = this.reader.getString(descendantsArray[m], 'text');
                            var spriteText = new MySpriteText(this.scene, text);
                            this.nodes[nodeID].addChildLeave(spriteText);
                            break;
                        case 'plane':
                            var npartsU = this.reader.getFloat(descendantsArray[m], 'npartsU');
                            var npartsV = this.reader.getFloat(descendantsArray[m], 'npartsV');
                            var plane = new Plane(this.scene, npartsU, npartsV);
                            this.nodes[nodeID].addChildLeave(plane);
                            break;
                        case 'patch':
                            var npointsU = this.reader.getFloat(descendantsArray[m], 'npointsU');
                            var npointsV = this.reader.getFloat(descendantsArray[m], 'npointsV');
                            var npartsU = this.reader.getFloat(descendantsArray[m], 'npartsU');
                            var npartsV = this.reader.getFloat(descendantsArray[m], 'npartsV');
                            var controlPoints = [];
                            var controlPointsNode = descendantsArray[m].children;
                            for (var c = 0; c < controlPointsNode.length; c++){
                                let x = this.reader.getFloat(controlPointsNode[c], 'x');
                                let y = this.reader.getFloat(controlPointsNode[c], 'y');
                                let z = this.reader.getFloat(controlPointsNode[c], 'z');
                                controlPoints.push([x,y,z,1]);
                            }
                            let patch = new Patch(this.scene, npointsU, npointsV, npartsU, npartsV, controlPoints);
                            this.nodes[nodeID].addChildLeave(patch);
                            break;
                        
                        case 'defbarrel':
                            var base = this.reader.getFloat(descendantsArray[m], 'base');
                            var middle = this.reader.getFloat(descendantsArray[m], 'middle');
                            var height = this.reader.getFloat(descendantsArray[m], 'height');
                            var slices = this.reader.getInteger(descendantsArray[m], 'slices');
                            var slices = this.reader.getInteger(descendantsArray[m], 'stacks');
                            var defBarrel = new DefBarrel(this.scene, base, middle, height, slices, stacks);
                            //console.log(defBarrel);
                            this.nodes[nodeID].addChildLeave(defBarrel);
                            break;
                        default: break;
                    }
                }
            }
        }
        this.log('Parsed nodes.');
    }


    parseBoolean(node, name, messageError){
        var boolVal = true;
        boolVal = this.reader.getBoolean(node, name);
        if (!(boolVal != null && !isNaN(boolVal) && (boolVal == true || boolVal == false)))
            this.onXMLMinorError("unable to parse value component " + messageError + "; assuming 'value = 1'");

        return boolVal;
    }
    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }



    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {

        
        if (this.nodes[this.idRoot].material == null){
            var mat = new CGFappearance(this.scene);
            mat.setShininess(0.0);
            mat.setAmbient(1.0, 1.0, 1.0, 1.0);
            mat.setDiffuse(0.6, 1.0, 1.0, 1.0);
            mat.setSpecular(0.6, 1.0, 1.0, 1.0);
            mat.setEmission(0.0, 0.0, 0.0, 1.0);

            this.nodes[this.idRoot].material = mat;
        }
        
        this.nodes[this.idRoot].display(this.nodes[this.idRoot].material, this.nodes[this.idRoot].texture);
    }
}