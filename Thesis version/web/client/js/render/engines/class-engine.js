/**
 * The ClassDiagramEngine class
 * This class is used as a custom render engine for class diagrams
 * Inherits from DefaultEngine
 * @constructor
 */
function ClassDiagramEngine()
{
    this.name_ = 'Class diagram';
    this.GUID_ = '{D213CC0C-1054-4A1C-B64B-4815A91C049C}';

    var halfUnit = 0.5;

    this.offsets_ = [];
    this.offsets_.push(new THREE.Vector3(0, halfUnit, 0));
    this.offsets_.push(new THREE.Vector3(0, -halfUnit, 0));

    this.offsets_.push(new THREE.Vector3(halfUnit, halfUnit, halfUnit));
    this.offsets_.push(new THREE.Vector3(halfUnit, -halfUnit, halfUnit));
    this.offsets_.push(new THREE.Vector3(-halfUnit, halfUnit, halfUnit));
    this.offsets_.push(new THREE.Vector3(-halfUnit, -halfUnit, halfUnit));


    this.offsets_.push(new THREE.Vector3(halfUnit, halfUnit, -halfUnit));
    this.offsets_.push(new THREE.Vector3(halfUnit, -halfUnit, -halfUnit));
    this.offsets_.push(new THREE.Vector3(-halfUnit, halfUnit, -halfUnit));
    this.offsets_.push(new THREE.Vector3(-halfUnit, -halfUnit, -halfUnit));
}

// Setup the inheritance
ClassDiagramEngine.prototype = new DefaultEngine();
ClassDiagramEngine.prototype.constructor = ClassDiagramEngine;
// Add to the render engines
RENDER_ENGINES.push(new ClassDiagramEngine());

/**
 * Overrides the base function in the DefaultEngine class
 * @public
 */
ClassDiagramEngine.prototype.UpdateVertex = function (vertex, isSelected, isHighlighted)
{
    if (vertex.IsMeshUpdateNeeded())
        this.UpdateVertexMesh(vertex);

    var meshes = vertex.GetMeshArray();
    for (var i = 0; i < meshes.length; i++)
        meshes[i].position.copy(vertex.GetPosition());

    this.UpdateVertexMaterial(vertex, isSelected, isHighlighted);

};

/**
 * Overrides the base function in the DefaultEngine class
 * @public
 */
ClassDiagramEngine.prototype.UpdateVertexMesh = function (vertex)
{
    while (vertex.GetMeshArray().length > 0)
    {
        RENDER_MANAGER.RemoveMeshFromScene(vertex.GetMeshArray().pop());
    } // Clear the array
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material1 = this.createSimpleMaterial();
    var material2 = this.createSimpleMaterial();
    var materials = [material2, material2, material1, material1, material2, material2];
    var meshFaceMaterial = new THREE.MeshFaceMaterial(materials);
    var mesh = new THREE.Mesh(geometry, meshFaceMaterial);
    mesh.scale.set(50, 50, 50);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    vertex.GetMeshArray().push(mesh);
    RENDER_MANAGER.AddMeshToScene(mesh);

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = this.createSimpleMaterial();
    var mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(51, 51, 51);
    vertex.GetMeshArray().push(mesh);
    RENDER_MANAGER.AddMeshToScene(mesh);
};

/**
 * Overrides the base function in the DefaultEngine class
 * @public
 */
ClassDiagramEngine.prototype.UpdateVertexMaterial = function
    (vertex, isSelected, isHighlighted)
{
    var meshes = vertex.GetMeshArray();

    meshes[0].material.materials[2].color = new THREE.Color(0xFFCC00);

    if (isSelected)
    {
        meshes[1].material.color = new THREE.Color(0x00CC00);
        meshes[1].material.opacity = 0.5;
        meshes[1].material.transparent = true;
        meshes[1].material.visible = true;
    }
    else if (isHighlighted)
    {
        meshes[1].material.color = new THREE.Color(0xCC0000);
        meshes[1].material.opacity = 0.5;
        meshes[1].material.transparent = true;
        meshes[1].material.visible = true;
    }
    else
        meshes[1].material.visible = false;

    if (vertex.IsTextureUpdateNeeded())
    {
        var attributes = vertex.GetPropertyList('Attributes list');
        if (attributes == null)
            attributes = new Object();

        var operations = vertex.GetPropertyList('Operations list');
        if (operations == null)
            operations = new Object();

        var className = vertex.GetPropertyValue('None', 'Class name');
        if (className == null)
            className = '';

        var verticalLength = Object.keys(attributes).length;
        verticalLength += Object.keys(operations).length;

        var step = 10;

        var classNameWidth = className.length * 12;

        var maxHorizontalWidth = classNameWidth + 60;
        for (var id in attributes)
        {
            var width = attributes[id].length * 6 + 20;
            if (width > maxHorizontalWidth)
                maxHorizontalWidth = width;
        }

        for (var id in operations)
        {
            var width = operations[id].length * 6 + 20;
            if (width > maxHorizontalWidth)
                maxHorizontalWidth = width;
        }

        var width = maxHorizontalWidth;
        var height = verticalLength * step + 60;

        meshes[0].scale.set(width, height, width);
        meshes[1].scale.set(width + 2, height + 2, width + 2);


        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;

        context.fillStyle = '#FFCC00';
        context.fillRect(0, 0, width, height);

        var y = 25;
        context.font = 'bold 20px Arial';
        context.fillStyle = 'black';
        context.fillText(className, (width - classNameWidth) / 2, y);
        y += 5;

        context.beginPath();
        context.moveTo(10, y);
        context.lineTo(width - 10, y);
        context.stroke();

        context.font = 'bold 10px Arial';

        y += 5;

        for (var id in attributes)
        {
            y += step;
            context.fillText(attributes[id], 10, y);
        }

        // canvas contents will be used for a texture
        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        meshes[0].material.materials[0].map = texture;

        y += 10;

        context.beginPath();
        context.moveTo(10, y);
        context.lineTo(width - 10, y);
        context.stroke();

        y += 5;

        for (var id in operations)
        {
            y += step;
            context.fillText(operations[id], 10, y);
        }
    }

};

/**
 * Overrides the base function in the DefaultEngine class
 * @public
 */
ClassDiagramEngine.prototype.Is2DPointInVertexGeometry = function
    (vertex, x, y, camera, width, height, forwardDirection)
{
    if (vertex.GetMeshArray().length == 0)
        return null;

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
};

/**
 * Overrides the base function in the DefaultEngine class
 * @public
 */
ClassDiagramEngine.prototype.GetEditablePropertyList = function ()
{
    var result = [];
    result.push(new PropertyDescription('Vertex', 'Class name',
        'String', null, false));
    result.push(new PropertyDescription('Vertex', 'Attributes list',
        'StringList', null, false));
    result.push(new PropertyDescription('Vertex', 'Operations list',
        'StringList', null, false));
    result.push(new PropertyDescription('Edge', 'Start symbol', 'Enum',
        ['None', 'White tetrahedron', 'Black tetrahedron',
            'White octahedron', 'Black octahedron', 'Arrow'], true));
    result.push(new PropertyDescription('Edge', 'End symbol', 'Enum',
        ['None', 'White tetrahedron', 'Black tetrahedron', 'White octahedron',
            'Black octahedron', 'Arrow'], true));
    result.push(new PropertyDescription('Edge', 'Start label',
        'String', null, true));
    result.push(new PropertyDescription('Edge', 'End label',
        'String', null, true));
    result.push(new PropertyDescription('Edge', 'Edge type',
        'Enum', ['Solid', 'Dashed'], false));

    return result;
};

/**
 * Overrides the base function in the DefaultEngine class
 * @public
 */
ClassDiagramEngine.prototype.IsMultipleEdgesAllowed = function ()
{
    return true;
};

/**
 * Overrides the base function in the DefaultEngine class
 * @public
 */
ClassDiagramEngine.prototype.UpdateEdgeOffsets = function (edge)
{
    if (edge.GetStartVertex().GetMeshArray().length == 0 ||
        edge.GetEndVertex().GetMeshArray().length == 0)
        return;

    var minDist = null;
    startIndex = 0;
    endIndex = 0;

    var start = edge.GetStartVertex().GetPosition();
    var end = edge.GetEndVertex().GetPosition();

    var startScale = edge.GetStartVertex().GetMeshArray()[0].scale;
    var endScale = edge.GetEndVertex().GetMeshArray()[0].scale;

    var startScaledOffsets = [];
    var endScaledOffsets = [];

    for (var i = 0; i < this.offsets_.length; i++)
    {
        startScaledOffsets.push(new THREE.Vector3(this.offsets_[i].x * startScale.x,
                this.offsets_[i].y * startScale.y, this.offsets_[i].z * startScale.z));
        endScaledOffsets.push(new THREE.Vector3(this.offsets_[i].x * endScale.x,
                this.offsets_[i].y * endScale.y, this.offsets_[i].z * endScale.z));
    }

    var epsilon = 1e-6;

    if (edge.GetEdgeLines().length == 1)
    {


        for (var i = 0; i < this.offsets_.length; i++)
            for (var j = 0; j < this.offsets_.length; j++)
            {
                var p1 = start.clone().add(startScaledOffsets[i]);
                var p2 = end.clone().add(endScaledOffsets[j]);
                var dist = p1.distanceTo(p2);
                if (minDist == null || dist + epsilon < minDist)
                {
                    minDist = dist;
                    startIndex = i;
                    endIndex = j;
                }

            }
    }
    else
    {
        for (var i = 0; i < this.offsets_.length; i++)
        {
            var p1 = start.clone().add(startScaledOffsets[i]);
            var p2 = edge.GetEdgeLines()[0].GetEnd().GetPosition();
            var dist = p1.distanceTo(p2);
            if (minDist == null || dist + epsilon < minDist)
            {
                minDist = dist;
                startIndex = i;
            }
        }

        minDist = null;

        for (var i = 0; i < this.offsets_.length; i++)
        {
            var p1 = edge.GetEdgeLines()[edge.GetEdgeLines().length - 1].
                GetStart().GetPosition();
            var p2 = end.clone().add(endScaledOffsets[i]);
            var dist = p1.distanceTo(p2);
            if (minDist == null || dist + epsilon < minDist)
            {
                minDist = dist;
                endIndex = i;
            }
        }
    }

    edge.SetStartOffset(startScaledOffsets[startIndex]);
    edge.SetEndOffset(endScaledOffsets[endIndex]);
};

ClassDiagramEngine.prototype.UpdateEdgeLineMesh = function (edgeLine)
{
    while (edgeLine.GetMeshArray().length > 0)
    {
        RENDER_MANAGER.RemoveMeshFromScene(edgeLine.GetMeshArray().pop());
    } // Clear the array
    var mesh = this.createCylinder(1);
    edgeLine.GetMeshArray().push(mesh);
    RENDER_MANAGER.AddMeshToScene(mesh);

    var startSymbol = edgeLine.GetEdge().GetPropertyValue('None', 'Start symbol');
    if (startSymbol == null)
        startSymbol = 'None';

    if (edgeLine.GetEdge().GetEdgeLines()[0] == edgeLine)
    {
        if (startSymbol == 'White tetrahedron' || startSymbol == 'Black tetrahedron')
        {
            var geometry = new THREE.CylinderGeometry(5, 5, 5, 3, 1);
            var mesh = new THREE.Mesh(geometry, this.createSimpleMaterial());
            edgeLine.GetMeshArray().push(mesh);
            RENDER_MANAGER.AddMeshToScene(mesh);
        }
        else if (startSymbol == 'White octahedron' || startSymbol == 'Black octahedron')
        {
            var geometry = new THREE.CylinderGeometry(5, 5, 5, 4, 1);
            var mesh = new THREE.Mesh(geometry, this.createSimpleMaterial());
            edgeLine.GetMeshArray().push(mesh);
            RENDER_MANAGER.AddMeshToScene(mesh);
        }
        else if (startSymbol == 'Arrow')
        {
            var geometry = new THREE.TextGeometry(
                '>', {size: 10, height: 5, font: 'helvetiker'});
            geometry.applyMatrix(
                new THREE.Matrix4().makeTranslation(0, -4.4, -2.5));
            var mesh = new THREE.Mesh(geometry, this.createSimpleMaterial());
            edgeLine.GetMeshArray().push(mesh);
            RENDER_MANAGER.AddMeshToScene(mesh);
        }
        else
        {
            var mesh = this.createSphere(1);
            edgeLine.GetMeshArray().push(mesh);
            RENDER_MANAGER.AddMeshToScene(mesh);
        }

        var startLabel = edgeLine.GetEdge().GetPropertyValue('None', 'Start label');
        if (startLabel != null)
        {
            var geometry = new THREE.TextGeometry(
                startLabel, {size: 10, height: 5, font: 'helvetiker'});
            geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 4, -2.5));
            var mesh = new THREE.Mesh(geometry, this.createSimpleMaterial());
            edgeLine.GetMeshArray().push(mesh);
            RENDER_MANAGER.AddMeshToScene(mesh);
        }

    }

    var endSymbol = edgeLine.GetEdge().GetPropertyValue('None', 'End symbol');
    if (endSymbol == null)
        endSymbol = 'None';

    if (edgeLine.GetEdge().
        GetEdgeLines()[edgeLine.GetEdge().GetEdgeLines().length - 1] == edgeLine)
    {
        if (endSymbol == 'White tetrahedron' || endSymbol == 'Black tetrahedron')
        {
            var geometry = new THREE.CylinderGeometry(5, 5, 5, 3, 1);
            var mesh = new THREE.Mesh(geometry, this.createSimpleMaterial());
            edgeLine.GetMeshArray().push(mesh);
            RENDER_MANAGER.AddMeshToScene(mesh);
        }
        else if (endSymbol == 'White octahedron' || endSymbol == 'Black octahedron')
        {
            var geometry = new THREE.CylinderGeometry(5, 5, 5, 4, 1);
            var mesh = new THREE.Mesh(geometry, this.createSimpleMaterial());
            edgeLine.GetMeshArray().push(mesh);
            RENDER_MANAGER.AddMeshToScene(mesh);
        }
        else if (endSymbol == 'Arrow')
        {
            var geometry = new THREE.TextGeometry('>', {
                size: 10,
                height: 5,
                font: 'helvetiker'
            });
            geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -4.4, -2.5));
            var mesh = new THREE.Mesh(geometry, this.createSimpleMaterial());
            edgeLine.GetMeshArray().push(mesh);
            RENDER_MANAGER.AddMeshToScene(mesh);
        }
        else
        {
            var mesh = this.createSphere(1);
            edgeLine.GetMeshArray().push(mesh);
            RENDER_MANAGER.AddMeshToScene(mesh);
        }

        var endLabel = edgeLine.GetEdge().GetPropertyValue('None', 'End label');
        if (endLabel != null)
        {
            var geometry = new THREE.TextGeometry(
                endLabel, {size: 10, height: 5, font: 'helvetiker'});
            geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 4, -2.5));
            var mesh = new THREE.Mesh(geometry, this.createSimpleMaterial());
            edgeLine.GetMeshArray().push(mesh);
            RENDER_MANAGER.AddMeshToScene(mesh);
        }
    }


};

/**
 * Overrides the base function in the DefaultEngine class
 * @public
 */
ClassDiagramEngine.prototype.UpdateEdgeLineOrientation = function
    (edgeLine, startPoint, endPoint)
{
    var index = 0;

    if (edgeLine.GetEdge().GetEdgeLines()[0] == edgeLine)
    {
        var startSymbol = edgeLine.GetEdge().GetPropertyValue('None', 'Start symbol');
        if (startSymbol == null)
            startSymbol = 'None';

        index++;

        if (startSymbol != 'None')
            startPoint.add(endPoint.clone().
                sub(startPoint).normalize().multiplyScalar(6));

        if (startSymbol == 'White tetrahedron' || startSymbol == 'Black tetrahedron')
            this.moveSymbol(edgeLine.
                GetMeshArray()[index], endPoint, startPoint, 2, false);
        else if (startSymbol == 'White octahedron' ||
            startSymbol == 'Black octahedron')
            this.moveSymbol(edgeLine.
                GetMeshArray()[index], endPoint, startPoint, 3, false);
        else if (startSymbol == 'Arrow')
            this.moveSymbol(edgeLine.
                GetMeshArray()[index], endPoint, startPoint, 5, true);
        else
            edgeLine.GetMeshArray()[index].position.copy(startPoint);

        var startLabel = edgeLine.GetEdge().GetPropertyValue('None', 'Start label');

        if (startLabel != null)
        {
            index++;
            var xOffset = 10;
            if (endPoint.x < startPoint.x)
                xOffset = -7.5 * startLabel.length - 10;
            var yOffset = 4;
            if (endPoint.y < startPoint.y)
                yOffset = -20;
            edgeLine.GetMeshArray()[index].position.copy(startPoint.clone()
                .add(new THREE.Vector3(xOffset, yOffset, 10)));
        }
    }

    if (edgeLine.GetEdge().
        GetEdgeLines()[edgeLine.GetEdge().GetEdgeLines().length - 1] == edgeLine)
    {
        var endSymbol = edgeLine.GetEdge().GetPropertyValue('None', 'End symbol');
        if (endSymbol == null)
            endSymbol = 'None';

        index++;

        if (endSymbol != 'None')
            endPoint.sub(endPoint.clone().sub(startPoint).normalize().multiplyScalar(6));

        if (endSymbol == 'White tetrahedron' || endSymbol == 'Black tetrahedron')
            this.moveSymbol(
                edgeLine.GetMeshArray()[index], startPoint, endPoint, 2, false);
        else if (endSymbol == 'White octahedron' || endSymbol == 'Black octahedron')
            this.moveSymbol(edgeLine.
                GetMeshArray()[index], startPoint, endPoint, 3, false);
        else if (endSymbol == 'Arrow')
            this.moveSymbol(edgeLine.
                GetMeshArray()[index], startPoint, endPoint, 5, true);
        else
            edgeLine.GetMeshArray()[index].position.copy(endPoint);

        var endLabel = edgeLine.GetEdge().GetPropertyValue('None', 'End label');

        if (endLabel != null)
        {
            index++;
            var xOffset = 10;
            if (startPoint.x < endPoint.x)
                xOffset = -7.5 * endLabel.length - 10;
            var yOffset = 4;
            if (startPoint.y < endPoint.y)
                yOffset = -20;
            edgeLine.GetMeshArray()[index].position.copy(endPoint.clone()
                .add(new THREE.Vector3(xOffset, yOffset, 10)));
        }
    }

    this.moveCylinder(edgeLine.GetMeshArray()[0], startPoint, endPoint);


};

/**
 * Overrides the base function in the DefaultEngine class
 * @public
 */
ClassDiagramEngine.prototype.UpdateEdgeLineMaterial = function (edgeLine)
{
    var selectedEdge = GRAPH.GetSelectedEdge();
    if (selectedEdge != null && edgeLine.GetEdge().GetID() == selectedEdge.GetID())
        edgeLine.GetMeshArray()[0].material.color = new THREE.Color(0x0000CC);
    else
        edgeLine.GetMeshArray()[0].material.color = new THREE.Color(0xCCCCCC);

    var index = 0;

    if (edgeLine.GetEdge().GetEdgeLines()[0] == edgeLine)
    {
        var startSymbol = edgeLine.GetEdge().GetPropertyValue('None', 'Start symbol');
        if (startSymbol == null)
            startSymbol = 'None';

        index++;

        if (startSymbol == 'White tetrahedron' || startSymbol == 'White octahedron')
            edgeLine.GetMeshArray()[index].material.color = new THREE.Color(0xCCCCCC);
        else if (startSymbol == 'Black tetrahedron' ||
            startSymbol == 'Black octahedron' || startSymbol == 'Arrow')
            edgeLine.GetMeshArray()[index].material.color = new THREE.Color(0x333333);
        else
            edgeLine.GetMeshArray()[index].material.color =
                edgeLine.GetMeshArray()[0].material.color;

        var startLabel = edgeLine.GetEdge().GetPropertyValue('None', 'Start label');

        if (startLabel != null)
        {
            index++;
            edgeLine.GetMeshArray()[index].material.color = new THREE.Color(0x333333);
        }
    }

    var endSymbol = edgeLine.GetEdge().GetPropertyValue('None', 'End symbol');
    if (endSymbol == null)
        endSymbol = 'None';
    else if (edgeLine.GetEdge().GetEdgeLines().length == 1)
        index++;

    if (edgeLine.GetEdge().
        GetEdgeLines()[edgeLine.GetEdge().GetEdgeLines().length - 1] == edgeLine)
    {
        var endSymbol = edgeLine.GetEdge().GetPropertyValue('None', 'End symbol');
        if (endSymbol == null)
            endSymbol = 'None';

        index++;

        if (endSymbol == 'White tetrahedron' || endSymbol == 'White octahedron')
            edgeLine.GetMeshArray()[index].material.color = new THREE.Color(0xCCCCCC);
        else if (endSymbol == 'Black tetrahedron' ||
            endSymbol == 'Black octahedron' || endSymbol == 'Arrow')
            edgeLine.GetMeshArray()[index].material.color = new THREE.Color(0x333333);
        else
            edgeLine.GetMeshArray()[index].material.color =
                edgeLine.GetMeshArray()[0].material.color;

        var endLabel = edgeLine.GetEdge().GetPropertyValue('None', 'End label');

        if (endLabel != null)
        {
            index++;
            edgeLine.GetMeshArray()[index].material.color = new THREE.Color(0x333333);
        }
    }

    if (edgeLine.IsTextureUpdateNeeded())
    {
        var edgeType = edgeLine.GetEdge().GetPropertyValue('None', 'Edge type');
        if (edgeType == null)
            edgeType = 'Solid';

        if (edgeType == 'Dashed')
        {
            canvas = document.createElement('canvas');
            canvas.width = 10;
            canvas.height = 90;

            var context = canvas.getContext('2d');

            var dashes = 5;
            var dashLen = 10;
            for (var i = 0; i < dashes; i++)
            {
                var y = i * 2 * dashLen;
                context.rect(0, y, canvas.width, dashLen);
                context.fillStyle = '#CCCCCC';
                context.fill();
            }
            edgeLine.GetMeshArray()[0].material.transparent = true;
            edgeLine.GetMeshArray()[0].material.map = new THREE.Texture(canvas);
            edgeLine.GetMeshArray()[0].material.map.needsUpdate = true;
        }
    }
};

ClassDiagramEngine.prototype.moveSymbol = function
    (mesh, startPoint, endPoint, symbolHeight, isArrow)
{
    var direction = new THREE.Vector3().subVectors(endPoint, startPoint);

    var epsilon = 0.0001;

    var len = direction.length();
    if (len > symbolHeight)
    {
        var directionQuaternion = this.
            createRotationQuaternionFromDirection(direction.clone());
        var baseQuaternion;
        if (isArrow)
            baseQuaternion = new THREE.Quaternion().
                setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2);
        else
            baseQuaternion = new THREE.Quaternion().
                setFromAxisAngle(new THREE.Vector3(-1, 0, 0), Math.PI / 2);
        var rotation = new THREE.Euler().
            setFromQuaternion(directionQuaternion.multiply(baseQuaternion).normalize());

        mesh.rotation.copy(rotation);
    }

    mesh.position.copy(new THREE.Vector3().subVectors(endPoint,
        direction.normalize().multiplyScalar(symbolHeight)));
};


/**
 * Overrides the base function in the DefaultEngine class
 * @public
 */
ClassDiagramEngine.prototype.UpdateBend = function (bend, isSelected, isHighlighted)
{
    if (bend.IsMeshUpdateNeeded())
        this.UpdateBendMesh(bend);

    bend.GetMeshArray()[0].position.copy(bend.GetPosition());

    if (isHighlighted || isSelected)
        bend.GetMeshArray()[0].scale.set(2, 2, 2);
    else
        bend.GetMeshArray()[0].scale.set(1, 1, 1);

    this.UpdateBendMaterial(bend, isSelected, isHighlighted);
};

/**
 * Overrides the base function in the DefaultEngine class
 * @public
 */
ClassDiagramEngine.prototype.UpdateBendMesh = function (bend)
{
    while (bend.GetMeshArray().length > 0)
    {
        RENDER_MANAGER.RemoveMeshFromScene(bend.GetMeshArray().pop());
    } // Clear the array
    var mesh = this.createSphere(1);
    bend.GetMeshArray().push(mesh);
    RENDER_MANAGER.AddMeshToScene(mesh);
};

/**
 * Overrides the base function in the DefaultEngine class
 * @public
 */
ClassDiagramEngine.prototype.UpdateBendMaterial = function (bend, isSelected, isHighlighted)
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
            mesh.material.color = bend.GetEdge().GetEdgeLines()[0].
                GetMeshArray()[0].material.color;
    }
};

/**
 * Overrides the base function in the DefaultEngine class
 * @public
 */
ClassDiagramEngine.prototype.Is2DPointInBendGeometry = function
    (bend, x, y, camera, width, height, forwardDirection)
{
    if (bend.GetMeshArray().length == 0)
        return null;

    return this.is2DPointInSphereMesh(bend.GetMeshArray()[0],
        x, y, camera, width, height, forwardDirection, 2);
};