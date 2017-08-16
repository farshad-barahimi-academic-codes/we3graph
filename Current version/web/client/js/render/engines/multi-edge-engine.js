/**
 * The MultiEdgeEngine class
 * This class is used for rendering of the graph with multiple edges
 * Inherits from DefaultEngine
 * @constructor
 */
function MultiEdgeEngine()
{
    this.name_ = "Multiple edges";
    this.GUID_ = "{67D9B4AD-AEA0-4DBC-947B-8636BCF0913A}";

    var radius = 9;
    this.offsets = [];
    this.offsets.push(new THREE.Vector3(radius, 0, 0));
    this.offsets.push(new THREE.Vector3(0, radius, 0));
    this.offsets.push(new THREE.Vector3(-radius, 0, 0));
    this.offsets.push(new THREE.Vector3(0, -radius, 0));
}

MultiEdgeEngine.prototype = new DefaultEngine(); // inherit from DefaultEngine
MultiEdgeEngine.prototype.constructor = MultiEdgeEngine;
RENDER_ENGINES.push(new MultiEdgeEngine());

/**
 * Overrides the base function in DefaultEngine class
 */
MultiEdgeEngine.prototype.UpdateEdgeLineMesh = function (edgeLine, startPoint, endPoint)
{
    while (edgeLine.GetMeshArray().length > 0)
    {
        RENDER_MANAGER.RemoveMeshFromScene(edgeLine.GetMeshArray().pop());
    } // Clear the array
    var mesh = this.createCylinder(1);
    edgeLine.GetMeshArray().push(mesh);
    RENDER_MANAGER.AddMeshToScene(mesh);
};

/**
 * Overrides the base function in DefaultEngine class
 */
MultiEdgeEngine.prototype.IsMultipleEdgesAllowed = function ()
{
    return true;
};

/**
 * @return {THREE.Vector3[]} return the offset for a new edge on both ends.
 */
MultiEdgeEngine.prototype.UpdateEdgeOffsets = function (edge)
{
    var index = edge.IndexInParallelEdges() % 4;

    edge.SetStartOffset(this.offsets[index].clone());
    edge.SetEndOffset(this.offsets[index].clone());
};