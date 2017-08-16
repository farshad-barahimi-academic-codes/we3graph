/**
 * The ColorEngine class
 * This class is used as a custom render engine to add coloring to vertices of
 * the graph. A larger semi-transparent sphere is added around the vertex sphere
 * to show selection and hovering colors
 * Inherits from DefaultEngine
 * @constructor
 */
function ColorEngine()
{
    this.name_ = 'Color';
    this.GUID_ = '{95EF6618-3716-427B-867D-6E642633C419}';
}

// Setup the inheritance
ColorEngine.prototype = new DefaultEngine();
ColorEngine.prototype.constructor = ColorEngine;
// Add to the render engines
RENDER_ENGINES.push(new ColorEngine());

/**
 * Overrides the base function in the DefaultEngine class
 * Modified to move the semi-transparent sphere in addition to the vertex sphere
 * @public
 */
ColorEngine.prototype.UpdateVertex = function (vertex, isSelected, isHighlighted)
{
    if (vertex.IsMeshUpdateNeeded())
        this.UpdateVertexMesh(vertex);

    vertex.GetMeshArray()[0].position.copy(vertex.GetPosition());
    vertex.GetMeshArray()[1].position.copy(vertex.GetPosition());
    this.UpdateVertexMaterial(vertex, isSelected, isHighlighted);
};

/**
 * Overrides the base function in the DefaultEngine class
 * Modified to add the semi-transparent sphere
 * @public
 */
ColorEngine.prototype.UpdateVertexMesh = function (vertex)
{
    while (vertex.GetMeshArray().length > 0)
    {
        RENDER_MANAGER.RemoveMeshFromScene(vertex.GetMeshArray().pop());
    }
    var mesh = this.createSphere(10);
    vertex.GetMeshArray().push(mesh);
    RENDER_MANAGER.AddMeshToScene(mesh);
    var mesh = this.createSphere(12);
    vertex.GetMeshArray().push(mesh);
    RENDER_MANAGER.AddMeshToScene(mesh);
};

/**
 * Overrides the base function in the DefaultEngine class
 * Apply the color to the vertex sphere material and update the
 * semi-transparent sphere material
 * @public
 */
ColorEngine.prototype.UpdateVertexMaterial = function (vertex, isSelected, isHighlighted)
{
    var meshes = vertex.GetMeshArray();
    var color = new THREE.Color('#CC0000');
    var colorProperty = vertex.GetPropertyValue('None', 'Vertex Color');
    if (colorProperty != null && colorProperty != "Default")
        color = new THREE.Color("#" + COLORS[colorProperty]);


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
        mesh.visible = false;
};

/**
 * Overrides the base function in the DefaultEngine class
 * @public
 */
ColorEngine.prototype.GetEditablePropertyList = function ()
{
    var vertexColorNames = [];
    vertexColorNames.push('Default');
    for (var i = 0; i < COLOR_NAMES.length; i++)
        vertexColorNames.push(COLOR_NAMES[i]);

    var result = [];
    result.push(new PropertyDescription('Vertex', 'Vertex Color', 'Enum',
        vertexColorNames, false));
    return result;
};