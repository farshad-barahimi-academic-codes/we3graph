/**
 * The Vertex class
 * @constructor
 * @param {Graph} graph - The graph that this edge belongs to.
 * @param {string} id - The ID for the vertex.
 * See {@link Vertex#GetID} for ID format.
 * @param {THREE.Vector3} position - The 3D position of the vertex.
 */
Vertex = function Vertex(graph, id, position)
{
    /** @private
     * @type {Graph} */
    this.graph_ = graph;

    /** See {@link Vertex#GetID} for ID format.
     * @private
     * @type {string} */
    this.id_ = id;

    /** @private
     * @type {THREE.Vector3} */
    this.position_ = position;

    /** Used for custom properties of the vertex.
     * See {@link Vertex#UpdateProperty} for further information.
     * @private
     * @type {Object} */
    this.customProperties_ = new Object();

    /** @private
     * @type {boolean} */
    this.isSelected_ = false;

    /** See {@link Vertex#GetMeshArray} for further information.
     * @private
     * @type {THREE.Mesh[]} */
    this.meshArray_ = [];

    /** See {@link Vertex#IsMeshUpdateNeeded} for further information.
     * @private
     * @type {boolean} */
    this.isMeshUpdateNeeded_ = true;

    /** See {@link Vertex#IsTextureUpdateNeeded} for further information.
     * @private
     * @type {boolean} */
    this.isTextureUpdateNeeded_ = true;


    /** The array of adjacent edges.
     * @private
     * @type {Edge[]} */
    this.edges_ = [];

    /** The uniform scale for the vertex.
     * The render engine may decide to ignore it.
     * @private
     * @type {number} */
    this.scale_ = 1;

    /** The rotation quaternion for the vertex.
     * The render engine may decide to ignore it.
     * @private
     * @type {THREE.Quaternion} */
    this.rotation_ = new THREE.Quaternion(0, 0, 1, 1);
}

/**
 * Connects this vertex to another vertex using this vertex as start.
 * @param {Vertex} endVertex - The vertex to connect to.
 * @param {string} edgeID - The ID of the new edge.
 * See {@link Edge#GetID} for ID format.
 * @return {Edge} The created edge.
 */
Vertex.prototype.Connect = function (endVertex, edgeID)
{

    var edge = new Edge(GRAPH, edgeID, this, endVertex);

    this.edges_.push(edge);
    endVertex.GetEdges().push(edge);
    return edge;
};

/**
 * Checks if the this vertex is connected to the specified vertex
 * Direction of the edge is not important
 * @param {Vertex} vertex
 * @return {boolean}
 */
Vertex.prototype.IsConnectedTo = function (vertex)
{
    for (var i = 0; i < this.edges_.length; i++)
        if (this.edges_[i].GetStartVertex().GetID() == vertex.GetID()
            || this.edges_[i].GetEndVertex().GetID() == vertex.GetID())
            return true;

    return false;
};

/**
 * Checks if the this vertex is connected to specified vertex
 * and returns the connecting edge or null if not connected
 * Direction of the edge is not important
 * @param {Vertex} vertex
 * @return {Edge|null}
 */
Vertex.prototype.GetConnectingEdge = function (vertex)
{
    for (var i = 0; i < this.GetEdges().length; i++)
        if (this.edges_[i].GetStartVertex().GetID() == vertex.GetID() ||
            this.edges_[i].GetEndVertex().GetID() == vertex.GetID())
            return this.edges_[i];

    return null;
};

/**
 * Updates the value for a custom property of a vertex specified by a list name and a key
 * @param {string} listName - The list name. Will be created if doesn't exist.
 * @param {string} key - The key for the property.
 * @param {string} value - The value for the property. An empty value indicates removing.
 */
Vertex.prototype.UpdateProperty = function (listName, key, value)
{
    if (!(listName in this.customProperties_))
        this.customProperties_[listName] = new Object();
    if (value == '')
        delete this.customProperties_[listName][key];
    else
        this.customProperties_[listName][key] = value;
};

/**
 * Gets the value for a custom property of a vertex specified by a list name and a key
 * @param {string} listName - The list name. Use 'None' if there is no list.
 * @param {string} key - The key for the property.
 * @return {string} null if not found
 */
Vertex.prototype.GetPropertyValue = function (listName, key)
{
    if (listName in this.customProperties_)
    {
        if (key in this.customProperties_[listName])
            return this.customProperties_[listName][key];
        else
            return null;
    }
    else
        return null;
};


/**
 * Gets the list for a custom property of a vertex specified by a list name
 * @param {string} listName - The list name.
 * @return {string} null if not found
 */
Vertex.prototype.GetPropertyList = function (listName)
{
    if (listName in this.customProperties_)
        return this.customProperties_[listName];
    else
        return null;
};


/**
 * Returns the ID of the vertex.
 * The ID format is 'number-number'
 * The first number is the client ID and the second number is
 * incremental number created in client.
 * @public
 * @returns {string}
 */
Vertex.prototype.GetID = function ()
{
    return this.id_;
};

/**
 * Determines whether the vertex is selected or not.
 * @public
 * @returns {boolean}
 */
Vertex.prototype.IsSelected = function ()
{
    return this.isSelected_;
};

/**
 * Set whether the vertex is selected or not.
 * @public
 * @param {boolean} isSelected - Whether the bend is selected or not.
 */
Vertex.prototype.SetIsSelected = function (isSelected)
{
    this.isSelected_ = isSelected;
};

/**
 * Returns the mesh array used to hold the 3D mesh to be shown on the user interface.
 * @public
 * @returns {THREE.Mesh[]}
 */
Vertex.prototype.GetMeshArray = function ()
{
    return this.meshArray_;
};

/**
 * Returns whether the mesh for vertex needs to be updated or not.
 * This is to prevent updating the mesh on every frame.
 * It will be set to false after each frame render.
 * @public
 * @returns {boolean}
 */
Vertex.prototype.IsMeshUpdateNeeded = function ()
{
    return this.isMeshUpdateNeeded_;
};

/**
 * See {@link Vertex#IsMeshUpdateNeeded} for further information.
 * @public
 * @param {boolean} isMeshUpdateNeeded - Whether the mesh for the vertex needs
 * to be updated or not.
 */
Vertex.prototype.SetIsMeshUpdateNeeded = function (isMeshUpdateNeeded)
{
    this.isMeshUpdateNeeded_ = isMeshUpdateNeeded;
};

/**
 * Returns whether the texture for the vertex needs to be updated or not.
 * This is to prevent updating the texture on every frame.
 * It will be set to false after each frame render.
 * @public
 * @returns {boolean}
 */
Vertex.prototype.IsTextureUpdateNeeded = function ()
{
    return this.isTextureUpdateNeeded_;
};

/**
 * See {@link Vertex#IsTextureUpdateNeeded} for further information.
 * @public
 * @param {boolean} isTextureUpdateNeeded - Whether the texture for the vertex
 * needs to be updated or not.
 */
Vertex.prototype.SetIsTextureUpdateNeeded = function (isTextureUpdateNeeded)
{
    this.isTextureUpdateNeeded_ = isTextureUpdateNeeded;
};

/**
 * Returns the uniform scale for the vertex.
 * The render engine may decide to ignore it.
 * @returns {number}
 */
Vertex.prototype.GetScale = function ()
{
    return this.scale_;
};

/**
 * Returns the rotation quaternion for the vertex.
 * The render engine may decide to ignore it.
 * @returns {THREE.Quaternion}
 */
Vertex.prototype.GetRotation = function ()
{
    return this.rotation_;
};

/**
 * Sets the uniform scale for the vertex.
 * The render engine may decide to ignore it.
 * @param {number} scale
 */
Vertex.prototype.SetScale = function (scale)
{
    this.scale_ = scale;
};

/**
 * Sets the rotation quaternion for the vertex.
 * The render engine may decide to ignore it.
 * @param {THREE.Quaternion} rotation
 */
Vertex.prototype.SetRotation = function (rotation)
{
    this.rotation_ = rotation;
};

/**
 * Returns the position of the vertex.
 * @public
 * @returns {THREE.Vector3}
 */
Vertex.prototype.GetPosition = function ()
{
    return this.position_;
};

/**
 * Sets the position of the vertex.
 * @public
 * @param {THREE.Vector3} position - The new position of the vertex.
 */
Vertex.prototype.SetPosition = function (position)
{
    this.position_ = position;
};

/**
 * Returns the array of edges incident to the vertex.
 * @public
 * @return{Edge[]} - The array of edges incident to the vertex.
 */
Vertex.prototype.GetEdges = function ()
{
    return this.edges_;
};