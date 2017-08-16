/**
 * The ChemistryEngine class
 * This class is used as a custom render engine for chemistry
 * Inherits from DefaultEngine
 * @constructor
 */
function ChemistryEngine()
{
    this.name_ = 'Chemistry';
    this.GUID_ = '{1E04BB7A-339E-40E7-84DA-187B3FBFC059}';
}

// Setup the inheritance
ChemistryEngine.prototype = new DefaultEngine();
ChemistryEngine.prototype.constructor = ChemistryEngine;
// Add to the render engines
RENDER_ENGINES.push(new ChemistryEngine());

/**
 * Overrides the base function in the DefaultEngine class
 * @public
 */
ChemistryEngine.prototype.GetEngineVariants = function ()
{
    // Model type for showing the chemistry molecule
    // Normal : Edges have default color
    // Solid edge color : Edges have solid color based on their vertex colors
    // Gradient edge color : Edges have gradient color based on their vertex colors
    // No vertex : Edges have gradient color based on their vertex colors, Vertices are not shown
    return ['Normal', 'Solid edge color', 'Gradient edge color', 'No vertex'];
};

/**
 * Overrides the base function in the DefaultEngine class
 * @public
 */
ChemistryEngine.prototype.UpdateVertex = function (vertex, isSelected, isHighlighted)
{
    var isRing = false;
    if (vertex.GetPropertyValue('None', 'Ring') == 'Yes')
        isRing = true;

    if (vertex.IsMeshUpdateNeeded())
        this.UpdateVertexMesh(vertex);

    var meshes = vertex.GetMeshArray();
    for (var i = 0; i < meshes.length; i++)
        meshes[i].position.copy(vertex.GetPosition());

    if (isRing)
    {
        meshes[0].scale.set(vertex.GetScale(), vertex.GetScale(), 1);
        meshes[0].quaternion.copy(vertex.GetRotation());
    }

    this.UpdateVertexMaterial(vertex, isSelected, isHighlighted);

};

/**
 * Overrides the base function in the DefaultEngine class
 * @public
 */
ChemistryEngine.prototype.UpdateVertexMesh = function (vertex)
{
    var isRing = false;
    if (vertex.GetPropertyValue('None', 'Ring') == 'Yes')
        isRing = true;

    var meshes = vertex.GetMeshArray();

    if (isRing && vertex.IsMeshUpdateNeeded())
    {
        while (meshes.length > 0)
        {
            RENDER_MANAGER.RemoveMeshFromScene(meshes.pop());
        }

        var geometry = new THREE.TorusGeometry(10, 1, 15, 30);
        var material = new THREE.MeshLambertMaterial({color: 0xCCCCCC});
        var mesh = new THREE.Mesh(geometry, material);
        meshes.push(mesh);
        RENDER_MANAGER.AddMeshToScene(mesh);
    }

    if (!isRing && vertex.IsMeshUpdateNeeded())
    {
        while (meshes.length > 0)
        {
            RENDER_MANAGER.RemoveMeshFromScene(meshes.pop());
        }


        var radius = 10;
        if (this.engineVariantIndex_ == 3)
            radius = 2;

        var mesh = this.createSphere(radius);
        mesh.position = vertex.GetPosition();
        meshes.push(mesh);
        RENDER_MANAGER.AddMeshToScene(mesh);
        var mesh = this.createSphere(radius + 2);
        mesh.position = vertex.GetPosition();
        meshes.push(mesh);
        RENDER_MANAGER.AddMeshToScene(mesh);
    }
};

/**
 * Overrides the base function in the DefaultEngine class
 * @public
 */
ChemistryEngine.prototype.UpdateVertexMaterial = function
    (vertex, isSelected, isHighlighted)
{
    var isRing = false;
    if (vertex.GetPropertyValue('None', 'Ring') == 'Yes')
        isRing = true;

    var meshes = vertex.GetMeshArray();

    if (isRing)
    {
        var mesh = meshes[0];
        if (isSelected)
            mesh.material.color = new THREE.Color(0x00CC00);
        else if (isHighlighted)
            mesh.material.color = new THREE.Color(0xFFCC00);
        else
            mesh.material.color = new THREE.Color(0xCCCCCC);

        return;
    }

    var color = new THREE.Color('#CC0000');
    var colorProperty = vertex.GetPropertyValue('None', 'Atom color');
    if (colorProperty != null && colorProperty != 'Default')
        color = new THREE.Color('#' + COLORS[colorProperty]);

    meshes[0].material.color = color;

    var mesh = meshes[1];
    if (isSelected)
    {
        mesh.material.color = new THREE.Color(0x00CC00);
        mesh.material.opacity = 0.5;
        mesh.material.transparent = true;
        mesh.visible = true;
    }
    else if (isHighlighted)
    {
        mesh.material.color = new THREE.Color(0xFFCC00);
        mesh.material.opacity = 0.5;
        mesh.material.transparent = true;
        mesh.visible = true;
    }
    else
    {
        mesh.visible = false;
    }
};

/**
 * Overrides the base function in the DefaultEngine class
 * @public
 */
ChemistryEngine.prototype.UpdateEdgeLineMesh = function (edgeLine)
{
    while (edgeLine.GetMeshArray().length > 0)
    {
        RENDER_MANAGER.RemoveMeshFromScene(edgeLine.GetMeshArray().pop());
    } // Clear the array

    var bondType = edgeLine.GetEdge().GetPropertyValue('None', 'Bond type');
    if (bondType == null)
        bondType = 'Single';

    var len = 0;
    if (bondType == 'Single')
        len = 1;
    else if (bondType == 'Double')
        len = 2;
    else if (bondType == 'Triple')
        len = 3;


    for (var i = 0; i < len; i++)
    {
        var mesh = this.createCylinder(2);
        edgeLine.GetMeshArray().push(mesh);
        RENDER_MANAGER.AddMeshToScene(mesh);

        var mesh = this.createCylinder(4);
        edgeLine.GetMeshArray().push(mesh);
        RENDER_MANAGER.AddMeshToScene(mesh);
    }
};

/**
 * Overrides the base function in the DefaultEngine class
 * @public
 */
ChemistryEngine.prototype.UpdateEdgeLineMaterial = function (edgeLine)
{
    var color = new THREE.Color(0xCCCCCC);

    var bondType = edgeLine.GetEdge().GetPropertyValue('None', 'Bond type');
    if (bondType == null)
        bondType = 'Single';

    var meshes = edgeLine.GetMeshArray();

    var len = 0;
    if (bondType == 'Single')
        len = 1;
    else if (bondType == 'Double')
        len = 2;
    else if (bondType == 'Triple')
        len = 3;

    for (var i = 0; i < len; i++)
    {
        var mesh = meshes[i * 2];
        if (edgeLine.IsTextureUpdateNeeded())
        {
            if (this.engineVariantIndex_ == 2 || this.engineVariantIndex_ == 3)
            {
                canvas = document.createElement('canvas');
                canvas.width = 10;
                canvas.height = 10;

                var context = canvas.getContext('2d');

                context.rect(0, 0, canvas.width, canvas.height);
                var gradient = context.createLinearGradient(0, 0, 0, canvas.height);
                gradient.addColorStop(0, '#' + edgeLine.GetEdge().
                    GetEndVertex().GetMeshArray()[0].material.color.getHexString());
                gradient.addColorStop(1, '#' + edgeLine.GetEdge().
                    GetStartVertex().GetMeshArray()[0].material.color.getHexString());
                context.fillStyle = gradient;
                context.fill();
                mesh.material.map = new THREE.Texture(canvas);
                mesh.material.map.needsUpdate = true;

            }
            else if (this.engineVariantIndex_ == 1)
            {
                canvas = document.createElement('canvas');
                canvas.width = 10;
                canvas.height = 10;

                var context = canvas.getContext('2d');

                context.rect(0, 0, canvas.width, canvas.height);
                var gradient = context.createLinearGradient(0, 0, 0, canvas.height);
                gradient.addColorStop(0, '#' + edgeLine.GetEdge().
                    GetEndVertex().GetMeshArray()[0].material.color.getHexString());
                gradient.addColorStop(0.5, '#' + edgeLine.GetEdge().
                    GetEndVertex().GetMeshArray()[0].material.color.getHexString());
                gradient.addColorStop(0.5, '#' + edgeLine.GetEdge().
                    GetStartVertex().GetMeshArray()[0].material.color.getHexString());
                gradient.addColorStop(1, '#' + edgeLine.GetEdge().
                    GetStartVertex().GetMeshArray()[0].material.color.getHexString());
                context.fillStyle = gradient;
                context.fill();
                mesh.material.map = new THREE.Texture(canvas);
                mesh.material.map.needsUpdate = true;
            }
            else mesh.material.color = color;
        }
        else
            mesh.material.color = color;
    }

    for (var i = 0; i < len; i++)
    {
        var mesh = meshes[i * 2 + 1];

        var selectedEdge = GRAPH.GetSelectedEdge();
        if (selectedEdge != null &&
            edgeLine.GetEdge().GetID() == selectedEdge.GetID())
        {
            mesh.material.color = new THREE.Color(0x00CC00);
            mesh.material.opacity = 0.5;
            mesh.material.transparent = true;
            mesh.visible = true;
        }
        else
            mesh.visible = false;
    }
};

/**
 * Overrides the base function in the DefaultEngine class
 * @public
 */
ChemistryEngine.prototype.UpdateEdgeLineOrientation = function
    (edgeLine, startPoint, endPoint)
{
    var bondType = edgeLine.GetEdge().GetPropertyValue('None', 'Bond type');
    if (bondType == null)
        bondType = 'Single';

    var meshes = edgeLine.GetMeshArray();

    if (bondType == 'Single')
    {
        meshes[0].scale.set(1, 1, 1);
        meshes[1].scale.set(1, 1, 1);
        this.moveCylinder(meshes[0], startPoint, endPoint);
        this.moveCylinder(meshes[1], startPoint, endPoint);
    }
    else if (bondType == 'Double')
    {
        meshes[0].scale.set(0.8, 0.8, 0.8);
        meshes[1].scale.set(0.8, 0.8, 0.8);
        meshes[2].scale.set(0.8, 0.8, 0.8);
        meshes[3].scale.set(0.8, 0.8, 0.8);
        this.moveCylinder(meshes[0], new THREE.Vector3(-5, 0, 0).add(startPoint),
            new THREE.Vector3(-5, 0, 0).add(endPoint));
        this.moveCylinder(meshes[1], new THREE.Vector3(-5, 0, 0).add(startPoint),
            new THREE.Vector3(-5, 0, 0).add(endPoint));
        this.moveCylinder(meshes[2], new THREE.Vector3(5, 0, 0).add(startPoint),
            new THREE.Vector3(5, 0, 0).add(endPoint));
        this.moveCylinder(meshes[3], new THREE.Vector3(5, 0, 0).add(startPoint),
            new THREE.Vector3(5, 0, 0).add(endPoint));
    }
    else if (bondType == 'Triple')
    {
        meshes[0].scale.set(0.5, 0.5, 0.5);
        meshes[1].scale.set(0.5, 0.5, 0.5);
        meshes[2].scale.set(0.5, 0.5, 0.5);
        meshes[3].scale.set(0.5, 0.5, 0.5);
        meshes[4].scale.set(0.5, 0.5, 0.5);
        meshes[5].scale.set(0.5, 0.5, 0.5);
        this.moveCylinder(meshes[0], startPoint, endPoint);
        this.moveCylinder(meshes[1], startPoint, endPoint);
        this.moveCylinder(meshes[2], new THREE.Vector3(-5, 0, 0).add(startPoint),
            new THREE.Vector3(-5, 0, 0).add(endPoint));
        this.moveCylinder(meshes[3], new THREE.Vector3(-5, 0, 0).add(startPoint),
            new THREE.Vector3(-5, 0, 0).add(endPoint));
        this.moveCylinder(meshes[4], new THREE.Vector3(5, 0, 0).add(startPoint),
            new THREE.Vector3(5, 0, 0).add(endPoint));
        this.moveCylinder(meshes[5], new THREE.Vector3(5, 0, 0).add(startPoint),
            new THREE.Vector3(5, 0, 0).add(endPoint));
    }

};

/**
 * Overrides the base function in the DefaultEngine class
 * @public
 */
ChemistryEngine.prototype.GetEditablePropertyList = function ()
{
    var vertexColorNames = [];
    vertexColorNames.push('Default');
    for (var i = 0; i < COLOR_NAMES.length; i++)
        vertexColorNames.push(COLOR_NAMES[i]);

    var result = [];
    result.push(new PropertyDescription('Vertex', 'Atom color', 'Enum',
        vertexColorNames, false));
    result.push(new PropertyDescription('Vertex', 'Ring', 'Enum',
        ['No', 'Yes'], true));
    result.push(new PropertyDescription('Edge', 'Bond type', 'Enum',
        ['Single', 'Double', 'Triple'], true));

    return result;
};

/**
 * Overrides the base function in the DefaultEngine class
 * @public
 */
ChemistryEngine.prototype.Is2DPointInVertexGeometry = function
    (vertex, x, y, camera, width, height, forwardDirection)
{
    if (vertex.GetMeshArray().length == 0)
        return null;

    var isRing = false;
    if (vertex.GetPropertyValue('None', 'Ring') == 'Yes')
        isRing = true;

    if (!isRing)
    {
        return this.is2DPointInSphereMesh(vertex.GetMeshArray()[0],
            x, y, camera, width, height, forwardDirection, 10)
    }
    else
    {
        var newx = (x / width) * 2 - 1;
        var newy = -(y / height) * 2 + 1;

        raycaster = new THREE.Raycaster();

        var vector = new THREE.Vector3();
        vector.set(newx, newy, 0.5);
        vector.unproject(camera);
        raycaster.ray.set(camera.position, vector.sub(camera.position).normalize());

        var intersects = raycaster.intersectObject(vertex.GetMeshArray()[0]);
        if (intersects.length == 0)
            return null;

        return intersects[0].distance;
    }
};
