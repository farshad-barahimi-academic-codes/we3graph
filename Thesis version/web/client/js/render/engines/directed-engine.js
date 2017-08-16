/**
 * The DirectedEngine class
 * This class is used as a custom render engine for directed graph
 * Inherits from DefaultEngine
 * @constructor
 */
function DirectedEngine()
{
    this.name_ = 'Directed graph';
    this.GUID_ = '{46DA88A6-2067-4A12-A40B-9A25BBA59979}';
}

// Setup the inheritance
DirectedEngine.prototype = new DefaultEngine();
DirectedEngine.prototype.constructor = DirectedEngine;
// Add to the render engines
RENDER_ENGINES.push(new DirectedEngine());

DirectedEngine.prototype.UpdateEdgeLineMesh = function (edgeLine)
{
    while (edgeLine.GetMeshArray().length > 0)
    {
        RENDER_MANAGER.RemoveMeshFromScene(edgeLine.GetMeshArray().pop());
    } // Clear the array
    var mesh = this.createCylinder(2);
    edgeLine.GetMeshArray().push(mesh);
    RENDER_MANAGER.AddMeshToScene(mesh);
    var mesh = this.createCone(5);
    edgeLine.GetMeshArray().push(mesh);
    RENDER_MANAGER.AddMeshToScene(mesh);
};

/**
 * Overrides the base function in the DefaultEngine class
 * @public
 */
DirectedEngine.prototype.UpdateEdgeLineOrientation = function
    (edgeLine, startPoint, endPoint)
{
    this.moveCylinder(edgeLine.GetMeshArray()[0], startPoint, endPoint);
    this.moveCone(edgeLine.GetMeshArray()[1], startPoint, endPoint);
};

/**
 * Overrides the base function in the DefaultEngine class
 * @public
 */
DirectedEngine.prototype.UpdateEdgeLineMaterial = function (edgeLine)
{
    var selectedEdge = GRAPH.GetSelectedEdge();
    if (selectedEdge != null && edgeLine.GetEdge().GetID() == selectedEdge.GetID())
    {
        edgeLine.GetMeshArray()[0].material.color = new THREE.Color(0x0000CC);
        edgeLine.GetMeshArray()[1].material.color = new THREE.Color(0x0000CC);
    }
    else
    {
        edgeLine.GetMeshArray()[0].material.color = new THREE.Color(0xCCCCCC);
        edgeLine.GetMeshArray()[1].material.color = new THREE.Color(0xCCCCCC);
    }
};

/**
 * Moves (transforms) a cone mesh to the middle of two points
 * It assumes that cone mesh has the height of 1 and is in y direction
 * @param {THREE.Mesh} cone
 * @param {THREE.Vector3} startPoint - The start point
 * @param {THREE.Vector3} endPoint - The end point
 */
DirectedEngine.prototype.moveCone = function (cone, startPoint, endPoint)
{
    var direction = new THREE.Vector3().subVectors(endPoint, startPoint);

    var epsilon = 0.0001;
    var coneHeight = 10;

    var len = direction.length();
    if (len > coneHeight)
    {
        cone.scale.set(1, coneHeight, 1);
        var directionQuaternion = this.
            createRotationQuaternionFromDirection(direction.clone());
        var rotation = new THREE.Euler().setFromQuaternion(
            directionQuaternion.normalize());
        cone.rotation.copy(rotation);
    }
    else
        cone.scale.set(epsilon, epsilon, epsilon);

    cone.position.copy(new THREE.Vector3().addVectors(startPoint,
        direction.multiplyScalar(0.5)));
};

/**
 * Creates a cone mesh
 * It uses a cylinder geometry with top radius set to 0
 * @param {number} radius
 * @return {THREE.Mesh}
 */
DirectedEngine.prototype.createCone = function (radius)
{
    var radiusTop = 0,
        radiusBottom = radius,
        height = 1,
        segmentsRadius = 10, // normal quality
        segmentsHeight = 1,
        openEnded = false;

    if (this.renderQuality_ == 1) // Low Quality
        segmentsRadius = 4;
    else if (this.renderQuality_ == 3) // High Quality
        segmentsRadius = 20;


    var cylinderGeometry = new THREE.CylinderGeometry(radiusTop,
        radiusBottom, height, segmentsRadius, segmentsHeight, openEnded);

    var cylinder = new THREE.Mesh(cylinderGeometry, this.createSimpleMaterial());

    return cylinder;
};
