/**
 * Creates a DefaultEngine.
 * @class
 * @classdesc  This class can be inherited to provide custom render engines
 */
function DefaultEngine()
{
    this.renderQuality_ = 2; // 1:Low, 2:Normal, 3:High
    this.name_ = 'Default';
    this.GUID_ = '{4A2D36F8-7749-417B-8BC2-AF85F67D08DF}';
    this.engineVariantIndex_ = 0;
}

// Add to the render engines
RENDER_ENGINES.push(new DefaultEngine());

/**
 * Returns the name of engine
 * @return {string}
 * @public
 */
DefaultEngine.prototype.GetName = function ()
{
    return this.name_;
};

/**
 * Returns the GUID for the engine
 * @return {string}
 * @public
 */
DefaultEngine.prototype.GetGUID = function ()
{
    return this.GUID_;
};

/**
 * Returns the mesh for the dummy vertex
 * @return {THREE.Mesh}
 * @public
 */
DefaultEngine.prototype.GetDummyVertexMesh = function ()
{
    var result = this.createSphere(10);
    result.material.color = new THREE.Color(0x3399FF);
    result.material.opacity = 0.5;
    result.material.transparent = true;
    return result;
};

/**
 * Updates graphical representation of a vertex
 * @param{Vertex} vertex
 * @param{boolean} isSelected - whether the vertex is selected or not
 * @param{boolean} isHighlighted - whether the vertex is highlighted or not
 * @public
 */
DefaultEngine.prototype.UpdateVertex = function (vertex, isSelected, isHighlighted)
{
    if (vertex.IsMeshUpdateNeeded())
        this.UpdateVertexMesh(vertex);

    vertex.GetMeshArray()[0].position.copy(vertex.GetPosition());
    this.UpdateVertexMaterial(vertex, isSelected, isHighlighted);
};

/**
 * Update the mesh for a vertex
 * @param{Vertex} vertex
 * @public
 */
DefaultEngine.prototype.UpdateVertexMesh = function (vertex)
{
    while (vertex.GetMeshArray().length > 0)
    {
        RENDER_MANAGER.RemoveMeshFromScene(vertex.GetMeshArray().pop());
    }
    var mesh = this.createSphere(10);
    vertex.GetMeshArray().push(mesh);
    RENDER_MANAGER.AddMeshToScene(mesh);
};

/**
 * Updates the material used for default rendering of a vertex
 * Can be used to change texture too. Textures can be made from HTML5 canvas too.
 * @param {Vertex} vertex
 * @param {boolean} isSelected - whether the vertex is selected or not
 * @param {boolean} isHighlighted - whether the vertex is highlighted or not
 * @public
 */
DefaultEngine.prototype.UpdateVertexMaterial =
    function (vertex, isSelected, isHighlighted)
    {
        var meshes = vertex.GetMeshArray();
        for (var i = 0; i < meshes.length; i++)
        {
            var mesh = meshes[i];
            if (isSelected)
                mesh.material.color = new THREE.Color(0x00CC00);
            else if (isHighlighted)
                mesh.material.color = new THREE.Color(0xFFCC00);
            else
                mesh.material.color = new THREE.Color(0xCC0000);
        }

    };

/**
 * Checks if a 2d point is inside the 2d projection of vertex geometry
 * @param {Vertex} vertex
 * @param {int} x - the x coordinate of the 2d Point to check in pixels
 * @param {int} y - the y coordinate of the 2d Point to check in pixels
 * @param {THREE.PerspectiveCamera} camera
 * @param {number} width - the width of projection in pixels
 * @param {number} height - the height of projection in pixels
 * @param {THREE.Vector3} forwardDirection - forward direction of camera
 * @return {number} null if the 2d point is not inside the 2d projection of
 * vertex geometry, otherwise the distance plane containing vertex from camera
 */
DefaultEngine.prototype.Is2DPointInVertexGeometry = function
    (vertex, x, y, camera, width, height, forwardDirection)
{
    if (vertex.GetMeshArray().length == 0)
        return null;

    return this.is2DPointInSphereMesh(vertex.GetMeshArray()[0],
        x, y, camera, width, height, forwardDirection, 10);
};

/**
 * Checks if a 2d point is inside the 2d projection of bend geometry
 * @param {Bend} bend
 * @param {int} x - the x coordinate of the 2d Point to check in pixels
 * @param {int} y - the y coordinate of the 2d Point to check in pixels
 * @param {THREE.PerspectiveCamera} camera
 * @param {number} width - the width of projection in pixels
 * @param {number} height - the height of projection in pixels
 * @param {THREE.Vector3} forwardDirection - forward direction of camera
 * @return {number} null if the 2d point is not inside the 2d projection of
 * bend geometry, otherwise the distance plane containing vertex from camera
 */
DefaultEngine.prototype.Is2DPointInBendGeometry = function
    (bend, x, y, camera, width, height, forwardDirection)
{
    if (bend.GetMeshArray().length == 0)
        return null;

    return this.is2DPointInSphereMesh(bend.GetMeshArray()[0],
        x, y, camera, width, height, forwardDirection, 4);
};

/**
 * Updates graphical representation of an edge line
 * @param {EdgeLine} edgeLine
 * @param {THREE.Vector3} startPoint - the 3D position of the edge line start
 * @param {THREE.Vector3} endPoint - the 3D position of the edge line end
 * @public
 */
DefaultEngine.prototype.UpdateEdgeLine = function (edgeLine, startPoint, endPoint)
{
    if (edgeLine.IsMeshUpdateNeeded())
        this.UpdateEdgeLineMesh(edgeLine);

    this.UpdateEdgeLineOrientation(edgeLine, startPoint, endPoint);
    this.UpdateEdgeLineMaterial(edgeLine);
};

/**
 * Update the mesh for an edge line
 * @param{EdgeLine} edgeLine
 * @public
 */
DefaultEngine.prototype.UpdateEdgeLineMesh = function (edgeLine)
{
    while (edgeLine.GetMeshArray().length > 0)
    {
        RENDER_MANAGER.RemoveMeshFromScene(edgeLine.GetMeshArray().pop());
    }
    var mesh = this.createCylinder(2);
    edgeLine.GetMeshArray().push(mesh);
    RENDER_MANAGER.AddMeshToScene(mesh);
};


/**
 * Updates orientation of an edge line that is placing the edge line between the
 * start point and end point
 * @param {EdgeLine} edgeLine
 * @param {THREE.Vector3} startPoint - the 3D position of the edge line start
 * @param {THREE.Vector3} endPoint - the 3D position of the edge line end
 * @public
 */
DefaultEngine.prototype.UpdateEdgeLineOrientation = function
    (edgeLine, startPoint, endPoint)
{
    this.moveCylinder(edgeLine.GetMeshArray()[0], startPoint, endPoint);
};

/**
 * Updates the material used for default rendering of a vertex
 * Can be used to change texture too. Textures can be made from HTML5 canvas too.
 * @param {EdgeLine} edgeLine
 * @public
 */
DefaultEngine.prototype.UpdateEdgeLineMaterial = function (edgeLine)
{
    var selectedEdge = GRAPH.GetSelectedEdge();
    if (selectedEdge != null && edgeLine.GetEdge().GetID() == selectedEdge.GetID())
        edgeLine.GetMeshArray()[0].material.color = new THREE.Color(0x0000CC);
    else
        edgeLine.GetMeshArray()[0].material.color = new THREE.Color(0xCCCCCC);
};


/**
 * Updates graphical representation of a bend
 * @param{Bend} bend
 * @param{boolean} isSelected - whether the bend is selected or not
 * @param{boolean} isHighlighted - whether the bend is highlighted or not
 * @public
 */
DefaultEngine.prototype.UpdateBend = function (bend, isSelected, isHighlighted)
{
    if (bend.IsMeshUpdateNeeded())
        this.UpdateBendMesh(bend);

    bend.GetMeshArray()[0].position.copy(bend.GetPosition());

    this.UpdateBendMaterial(bend, isSelected, isHighlighted);
};

/**
 * Update the mesh for a bend
 * @param{Bend} bend
 * @public
 */
DefaultEngine.prototype.UpdateBendMesh = function (bend)
{
    while (bend.GetMeshArray().length > 0)
    {
        RENDER_MANAGER.RemoveMeshFromScene(bend.GetMeshArray().pop());
    }
    var mesh = this.createSphere(4);
    bend.GetMeshArray().push(mesh);
    RENDER_MANAGER.AddMeshToScene(mesh);
};

/**
 * Updates the material used for default rendering of a bend
 * Can be used to change texture too. Textures can be made from HTML5 canvas too.
 * @param {Bend} bend
 * @param {boolean} isSelected - whether the bend is selected or not
 * @param {boolean} isHighlighted - whether the bend is highlighted or not
 * @public
 */
DefaultEngine.prototype.UpdateBendMaterial = function (bend, isSelected, isHighlighted)
{
    var meshes = bend.GetMeshArray();
    for (var i = 0; i < meshes.length; i++)
    {
        var mesh = meshes[i];
        if (isSelected)
            mesh.material.color = new THREE.Color(0x00CC00);
        else if (isHighlighted)
            mesh.material.color = new THREE.Color(0xFFCC00);
        else
            mesh.material.color = new THREE.Color(0x3399FF);
    }
};

/**
 * Returns the array of editable vertex property descriptions.
 * @return {PropertyDescription[]}
 * @public
 */
DefaultEngine.prototype.GetEditablePropertyList = function ()
{
    return [];
};

/**
 * Sets the quality of rendering
 * @public
 */
DefaultEngine.prototype.SetRenderQuality = function (renderQuality)
{
    this.renderQuality_ = renderQuality;
};

/**
 * Returns true if multiple edges are allowed
 * @return {boolean}
 * @public
 */
DefaultEngine.prototype.IsMultipleEdgesAllowed = function ()
{
    return false;
};

/**
 * Returns the maximum number of edges allowed between two vertices
 * @return {number}
 * @public
 */
DefaultEngine.prototype.MaximumMultipleEdgesAllowed = function ()
{
    return 1;
};

/**
 * Updates the start offset and end offset of an edge.
 * See {@link Edge#GetStartOffset} for further information.
 * @param{Edge} edge
 * @public
 */
DefaultEngine.prototype.UpdateEdgeOffsets = function (edge)
{

};

/**
 * Returns an array of names of engine variants.
 * @return {string[]}
 */
DefaultEngine.prototype.GetEngineVariants = function ()
{
    return ['Default'];
};

/**
 * Changes the engine variant by setting its index
 * @param{number} index
 * @public
 */
DefaultEngine.prototype.SetEngineVariantIndex = function (index)
{
    this.engineVariantIndex_ = index;

    var vertices = GRAPH.GetVertices();
    for (var i = 0; i < vertices.length; i++)
    {
        vertices[i].SetIsMeshUpdateNeeded(true);
        vertices[i].SetIsTextureUpdateNeeded(true);
    }

    var edges = GRAPH.GetEdges();
    for (var i = 0; i < edges.length; i++)
    {
        var edgeLines = edges[i].GetEdgeLines();
        for (var j = 0; j < edgeLines.length; j++)
        {
            edgeLines[j].SetIsMeshUpdateNeeded(true);
            edgeLines[j].SetIsTextureUpdateNeeded(true);
        }
    }
};

/**
 * Creates a sphere mesh
 * @param {number} radius
 * @return {THREE.Mesh}
 * @protected
 */
DefaultEngine.prototype.createSphere = function (radius)
{
    // set up the sphere vars
    var segments = 10, rings = 10; // Normal quality

    if (this.renderQuality_ == 1)
    { // Low Quality
        segments = 4;
        rings = 4;
    }
    else if (this.renderQuality_ == 3)
    { // High Quality
        segments = 20;
        rings = 20;
    }

    var material = this.createSimpleMaterial();

    // create a new mesh with sphere geometry
    var sphere = new THREE.Mesh(
        new THREE.SphereGeometry(
            radius,
            segments,
            rings),
        material);

    return sphere;
};

/**
 * Creates a simple material
 * @return {THREE.MeshLambertMaterial}
 * @protected
 */
DefaultEngine.prototype.createSimpleMaterial = function ()
{
    var material = new THREE.MeshLambertMaterial({color: 0xCCCCCC});
    return material;
};

/**
 * Creates a cylinder mesh
 * @param {number} radius
 * @return {THREE.Mesh}
 * @protected
 */
DefaultEngine.prototype.createCylinder = function (radius)
{
    var radiusTop = radius,
        radiusBottom = radius,
        height = 1,
        segmentsRadius = 10, // normal quality
        segmentsHeight = 1,
        openEnded = false;

    if (this.renderQuality_ == 1) // Low Quality
        segmentsRadius = 4;
    else if (this.renderQuality_ == 3) // High Quality
        segmentsRadius = 20;


    var cylinderGeometry = new THREE.CylinderGeometry(radiusTop, radiusBottom,
        height, segmentsRadius, segmentsHeight, openEnded);

    var cylinder = new THREE.Mesh(cylinderGeometry, this.createSimpleMaterial());

    return cylinder;
};

/**
 * Moves (transforms) a cylinder mesh between two points
 * It assumes that cylinder mesh has the height of 1 and is in y direction
 * @param {THREE.Mesh} cylinder
 * @param {THREE.Vector3} startPoint - The 3D position of cylinder start
 * @param {THREE.Vector3} endPoint - The 3D position of cylinder end
 * @protected
 */
DefaultEngine.prototype.moveCylinder = function (cylinder, startPoint, endPoint)
{
    var direction = new THREE.Vector3().subVectors(endPoint, startPoint);

    var epsilon = 0.0001;
    var height = direction.length();
    if (height > epsilon)
    {
        cylinder.scale.y = height;
        var directionQuaternion = this.
            createRotationQuaternionFromDirection(direction.clone());
        var rotation = new THREE.Euler().setFromQuaternion(
            directionQuaternion.normalize());
        cylinder.rotation.copy(rotation);
    }
    else
        cylinder.scale.y = epsilon;

    cylinder.position.copy(new THREE.Vector3().addVectors(startPoint,
        direction.multiplyScalar(0.5)));
};

/**
 * Checks if a 2d point is inside the 2d projection of a sphere mesh
 * @param {THREE.Mesh} sphereMesh
 * @param {int} x - the x coordinate of the 2d Point to check in pixels
 * @param {int} y - the y coordinate of the 2d Point to check in pixels
 * @param {THREE.PerspectiveCamera} camera
 * @param {number} width - the width of projection in pixels
 * @param {number} height - the height of projection in pixels
 * @param {THREE.Vector3} forwardDirection - forward direction of camera
 * @param {number} radius - the radius of the sphere
 * @return {number} null if the 2d point is not inside the 2d projection of
 * bend geometry, otherwise the distance plane containing vertex from camera
 */
DefaultEngine.prototype.is2DPointInSphereMesh = function
    (sphereMesh, x, y, camera, width, height, forwardDirection, radius)
{
    var halfWidth = width / 2;
    var halfHeight = height / 2;

    var worldPosition = new THREE.Vector3().setFromMatrixPosition(
        sphereMesh.matrixWorld);
    var vector = worldPosition.project(camera);
    var projectedX = (vector.x * halfWidth) + halfWidth;
    var projectedY = -(vector.y * halfHeight) + halfHeight;

    var diffX = projectedX - x;
    var diffY = projectedY - y;
    var diffLen = Math.sqrt(diffX * diffX + diffY * diffY);

    var a = new THREE.Vector3().subVectors(camera.position, sphereMesh.position);
    var t = -a.dot(forwardDirection) / forwardDirection.length();
    var planeDistance = forwardDirection.length() * t;

    var halfDisplayHeight = planeDistance * Math.tan(camera.fov / 2 * (Math.PI / 180));
    var acceptableRange = radius * halfHeight / halfDisplayHeight;

    if (diffLen < acceptableRange)
        return planeDistance;
    else
        return null;
};

/**
 * Returns a rotation quaternion based on a direction vector
 * @param{THREE.Vector3} direction
 * @return {THREE.Quaternion}
 */
DefaultEngine.prototype.createRotationQuaternionFromDirection = function (direction)
{
    // based on https://github.com/mrdoob/three.js/blob/master/src/extras/helpers/ArrowHelper.js

    direction.normalize();

    var epsilon = 1e-5;

    if (direction.y > 1 - epsilon)
        return new THREE.Quaternion(0, 0, 0, 1);
    else if (direction.y < -1 + epsilon)
        return new THREE.Quaternion(1, 0, 0, 0);
    else
        return new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(direction.z, 0, -direction.x).normalize(),
            Math.acos(direction.y));

};