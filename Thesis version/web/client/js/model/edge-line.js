/**
 * The EdgeLine class.
 * Represent an edge line. Bends break the edge into edge lines.
 * @constructor
 * @param {Edge} edge - The parent edge.
 * @param {Bend|Vertex} start - The bend or vertex at the beginning of the edge line.
 * @param {Bend|Vertex} end - The bend or vertex at the end of the edge line.
 */
function EdgeLine(edge, start, end)
{

    /** The bend or vertex at the beginning of the edge line.
     * @private
     * @type {Bend|Vertex} */
    this.start_ = start;

    /** The bend or vertex at the end of the edge line.
     * @private
     * @type {Bend|Vertex} */
    this.end_ = end;

    /** The parent edge.
     * @private
     * @type {Edge} */
    this.edge_ = edge;

    /** See {@link EdgeLine#GetMeshArray} for further information.
     * @private
     * @type {THREE.Mesh[]} */
    this.meshArray_ = [];

    /** See {@link EdgeLine#IsMeshUpdateNeeded} for further information.
     * @private
     * @type {boolean} */
    this.isMeshUpdateNeeded_ = true;

    /** See {@link EdgeLine#IsTextureUpdateNeeded} for further information.
     * @private
     * @type {boolean} */
    this.isTextureUpdateNeeded_ = true;
}

/**
 * Returns the bend or vertex at the beginning of the edge line.
 * @public
 * @returns {Bend|Vertex}
 */
EdgeLine.prototype.GetStart = function ()
{
    return this.start_;
};

/**
 * Sets the bend or vertex at the beginning of the edge line.
 * @public
 * @param {Bend|Vertex} start
 */
EdgeLine.prototype.SetStart = function (start)
{
    this.start_ = start;
};

/**
 * Returns the bend or vertex at the end of the edge line.
 * @public
 * @returns {Bend|Vertex}
 */
EdgeLine.prototype.GetEnd = function ()
{
    return this.end_;
};

/**
 * Sets the bend or vertex at the beginning of the edge line.
 * @public
 * @param {Bend|Vertex} end
 */
EdgeLine.prototype.SetEnd = function (end)
{
    this.end_ = end;
};

/**
 * Returns the parent edge.
 * @public
 * @returns {Edge}
 */
EdgeLine.prototype.GetEdge = function ()
{
    return this.edge_;
};

/**
 * Returns the mesh array used to hold the 3D mesh to be shown on the user interface.
 * @public
 * @returns {THREE.Mesh[]}
 */
EdgeLine.prototype.GetMeshArray = function ()
{
    return this.meshArray_;
};

/**
 * Returns whether the mesh for edge line needs to be updated or not.
 * This is to prevent updating the mesh on every frame.
 * It will be set to false after each frame render.
 * @public
 * @returns {boolean}
 */
EdgeLine.prototype.IsMeshUpdateNeeded = function ()
{
    return this.isMeshUpdateNeeded_;
};

/**
 * See {@link EdgeLine#IsMeshUpdateNeeded} for further information.
 * @public
 * @param {boolean} isMeshUpdateNeeded - Whether the mesh for the edge line
 * needs to be updated or not.
 */
EdgeLine.prototype.SetIsMeshUpdateNeeded = function (isMeshUpdateNeeded)
{
    this.isMeshUpdateNeeded_ = isMeshUpdateNeeded;
};

/**
 * Returns whether the texture for the edge line needs to be updated or not.
 * This is to prevent updating the texture on every frame.
 * It will be set to false after each frame render.
 * @public
 * @returns {boolean}
 */
EdgeLine.prototype.IsTextureUpdateNeeded = function ()
{
    return this.isTextureUpdateNeeded_;
};

/**
 * See {@link EdgeLine#IsTextureUpdateNeeded} for further information.
 * @public
 * @param {boolean} isTextureUpdateNeeded - Whether the texture for the edge line
 * needs to be updated or not.
 */
EdgeLine.prototype.SetIsTextureUpdateNeeded = function (isTextureUpdateNeeded)
{
    this.isTextureUpdateNeeded_ = isTextureUpdateNeeded;
};
