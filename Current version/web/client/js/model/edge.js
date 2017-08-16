/**
 * The edge class.
 * Represent an edge.
 * The edge is considered to be directed but the render engine may decide to
 * ignore the direction of the edge.
 * @constructor
 * @param {Graph} graph - The graph that this edge belongs to.
 * @param {string} id - The ID for the edge.
 * See {@link Edge#GetID|Edge.GetID} for ID format.
 * @param {Vertex} startVertex - The start vertex of the edge
 * @param {Vertex} endVertex - The end vertex of the edge
 */
function Edge(graph, id, startVertex, endVertex)
{
    /** @private
     * @type {Graph} */
    this.graph_ = graph;

    /** See {@link Edge#GetID|Edge.GetID} for ID format.
     * @private
     * @type {string} */
    this.id_ = id;

    /** @private
     * @type {Vertex} */
    this.startVertex_ = startVertex;

    /** @private
     * @type {Vertex} */
    this.endVertex_ = endVertex;

    /** See {@link Edge#GetEdgeLines} for further information.
     * @private
     * @type {EdgeLine[]} */
    this.edgeLines_ = [];
    var edgeLine = new EdgeLine(this, startVertex, endVertex);
    this.edgeLines_.push(edgeLine);

    /** See {@link Edge#GetStartOffset} for further information.
     * @private
     * @type {THREE.Vector3} */
    this.startOffset_ = new THREE.Vector3(0, 0, 0);

    /**
     * See {@link Edge#GetEndOffset} for further information.
     * @private
     * @type {THREE.Vector3} */
    this.endOffset_ = new THREE.Vector3(0, 0, 0);

    /**
     * See {@link Edge#IsMeshUpdateNeeded} for further information.
     * @private
     * @type {boolean} */
    this.isMeshUpdateNeeded_ = true;


    /** Used for custom properties of the edge.
     * See {@link Edge#UpdateProperty|Edge.UpdateProperty} for further information.
     * @private
     * @type {Object} */
    this.customProperties_ = new Object();
}

/**
 * Breaks the edgeLine at a specific index with a bend at a specific position.
 * @public
 * @param {THREE.Vector3} position - The position for the new bend.
 * @param {number} index - Index of the edgeLine to break (0 based).
 */
Edge.prototype.BreakEdgeLine = function (position, index)
{
    var newBend = new Bend(position, this);
    var oldEdgeLine = this.edgeLines_[index];
    var newEdgeLine = new EdgeLine(this, newBend, oldEdgeLine.GetEnd());
    oldEdgeLine.SetEnd(newBend);
    this.edgeLines_.splice(index + 1, 0, newEdgeLine);
};

/**
 * Removes the bend at a specific index
 * @param {number} index - Index of the bend to remove (0 based).
 * @return {Bend} The removed bend
 * @public
 */
Edge.prototype.RemoveBend = function (index)
{
    var beforeEdgeLine = this.edgeLines_[index];
    var afterEdgeLine = this.edgeLines_[index + 1];

    var bend = beforeEdgeLine.GetEnd()

    this.graph_.RemoveFromScene(bend);

    if (beforeEdgeLine.GetEnd().IsSelected())
        this.graph_.ClearSelection();

    beforeEdgeLine.SetEnd(afterEdgeLine.GetEnd());
    this.graph_.RemoveFromScene(afterEdgeLine);

    this.edgeLines_.splice(index + 1, 1);

    return bend;
};

/**
 * Updates the value for a custom property of an edge specified by a list name and a key
 * @param {string} listName - The list name. Will be created if doesn't exist.
 * @param {string} key - The key for the property.
 * @param {string} value - The value for the property. An empty value indicates removing.
 * @public
 */
Edge.prototype.UpdateProperty = function (listName, key, value)
{
    if (!(listName in this.customProperties_))
        this.customProperties_[listName] = new Object();
    if (value == '')
        delete this.customProperties_[listName][key];
    else
        this.customProperties_[listName][key] = value;
};

/**
 * Gets the value for a custom property of an edge specified by a list name and a key
 * @param {string} listName - The list name. Use 'None' if there is no list.
 * @param {string} key - The key for the property.
 * @return {string} null if not found
 * @public
 */
Edge.prototype.GetPropertyValue = function (listName, key)
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
 * Gets the list for a custom property of an edge specified by a list name
 * @param {string} listName - The list name.
 * @return {string} null if not found
 * @public
 */
Edge.prototype.GetPropertyList = function (listName)
{
    if (listName in this.customProperties_)
        return this.customProperties_[listName];
    else
        return null;
};

/**
 * Return the index of an edge in its end point vertex with lower ID only
 * counting parallel edges. An edge is parallel to this edge if it has the
 * same start and end vertex but direction doesn't matter.
 * @returns {number}
 * @public
 */
Edge.prototype.IndexInParallelEdges = function ()
{
    var startVertex = this.startVertex_;
    var endVertex = this.endVertex_;

    // Consider the endpoint with lower ID as the start vertex
    if (endVertex.GetID() < startVertex.GetID())
    {
        startVertex = this.endVertex_;
        endVertex = this.startVertex_;
    }

    var parallelCount = 0;
    var startVertexEdges = startVertex.GetEdges();
    for (var i = 0; i < startVertexEdges.length; i++)
    {
        var edge = startVertexEdges[i];
        if (edge.GetID() == this.GetID())
            return parallelCount;
        if (edge.GetEndVertex().GetID() == endVertex.GetID() ||
            edge.GetStartVertex().GetID() == endVertex.GetID())
            parallelCount++;
    }
};

/**
 * Selects the next parallel edge.
 * See {@link Edge#IndexInParallelEdges} for definition of parallel edges.
 * @public
 */
Edge.prototype.SelectNextEdge = function ()
{
    var startVertex = this.startVertex_;
    var endVertex = this.endVertex_;

    // Consider the endpoint with lower ID as the start vertex
    if (endVertex.GetID() < startVertex.GetID())
    {
        startVertex = this.endVertex_;
        endVertex = this.startVertex_;
    }

    var startVertexEdges = startVertex.GetEdges();
    var len = startVertexEdges.length;
    var index = -1;
    for (var i = 0; i < len; i++)
    {
        var edge = startVertexEdges[i];
        if (edge.GetID() == this.GetID())
            index = i;
    }

    for (var i = (index + 1) % len; i != index; i = (i + 1) % len)
    {
        var edge = startVertexEdges[i];
        if (edge.GetEndVertex().GetID() == endVertex.GetID() ||
            edge.GetStartVertex().GetID() == endVertex.GetID())
        {
            this.graph_.SetSelectedEdge(edge);
        }
    }
};

/**
 * Returns the start vertex of the edge.
 * @public
 * @returns {Vertex}
 */
Edge.prototype.GetStartVertex = function ()
{
    return this.startVertex_;
};

/**
 * Returns the end vertex of the edge.
 * @public
 * @returns {Vertex}
 */
Edge.prototype.GetEndVertex = function ()
{
    return this.endVertex_;
};

/**
 * Returns the offset from the startVertex center to actual start of the edge.
 * Default value is (0,0,0) but may be changed by the render engine.
 * @public
 * @returns {THREE.Vector3}
 */
Edge.prototype.GetStartOffset = function ()
{
    return this.startOffset_;
};

/**
 *
 * See {@link Edge#GetStartOffset} for further information.
 * @param{THREE.Vector3} startOffset
 * @public
 */
Edge.prototype.SetStartOffset = function (startOffset)
{
    this.startOffset_ = startOffset;
};

/**
 * Returns offset from the endVertex center to actual end of the edge.
 * Default value is (0,0,0) but may be changed by the render engine.
 * @public
 * @returns {THREE.Vector3}
 */
Edge.prototype.GetEndOffset = function ()
{
    return this.endOffset_;
};

/**
 * See {@link Edge#GetEndOffset} for further information.
 * @param{THREE.Vector3} endOffset
 * @public
 */
Edge.prototype.SetEndOffset = function (endOffset)
{
    this.endOffset_ = endOffset;
};

/**
 * Returns the ID of the edge.
 * The ID format is 'number-number'
 * The first number is the client ID and the second number is
 * incremental number created in client.
 * @public
 * @returns {string}
 */
Edge.prototype.GetID = function ()
{
    return this.id_;
};

/**
 * Returns whether the mesh for edge needs to be updated or not.
 * This is to prevent updating the mesh on every frame.
 * It will be set to false after each frame render.
 * @public
 * @returns {boolean}
 */
Edge.prototype.IsMeshUpdateNeeded = function ()
{
    return this.isMeshUpdateNeeded_;
};

/**
 * See {@link Edge#IsMeshUpdateNeeded} for further information.
 * @public
 * @param {boolean} isMeshUpdateNeeded - Whether the mesh for the edge needs to
 * be updated or not.
 */
Edge.prototype.SetIsMeshUpdateNeeded = function (isMeshUpdateNeeded)
{
    this.isMeshUpdateNeeded_ = isMeshUpdateNeeded;
};

/**
 * Returns the array to hold edge lines of the edge.
 * Bends break the edge into edge lines.
 * @public
 * @returns {EdgeLine[]}
 */
Edge.prototype.GetEdgeLines = function ()
{
    return this.edgeLines_;
};


