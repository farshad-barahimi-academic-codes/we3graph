/**
 * The bend class.
 * Represent a bend. Bends break the edge into edge lines.
 * @constructor
 * @param {THREE.Vector3} position - The 3D position of the bend.
 * @param {Edge} edge - The edge that this bend belongs to.
 */
function Bend(position, edge)
{
    /** @private
     * @type {THREE.Vector3} */
    this.position_ = position;

    /** @private
     * @type {Edge} */
    this.edge_ = edge;


    /** @private
     * @type {boolean} */
    this.isSelected_ = false;

    /** See {@link Bend#GetMeshArray} for further information.
     * @private
     * @type {THREE.Mesh[]} */
    this.meshArray_ = [];

    /** See {@link Bend#IsMeshUpdateNeeded} for further information.
     * @private
     * @type {boolean} */
    this.isMeshUpdateNeeded_ = true;
}

/**
 * Returns the parent edge of the bend.
 * @public
 * @returns {Edge}
 */
Bend.prototype.GetEdge = function ()
{
    return this.edge_;
};

/**
 * Returns the index of the bend in its parent edge.
 * @public
 * @return {number}
 */
Bend.prototype.GetIndex = function ()
{
    for (var i = 0; i < this.GetEdge().GetEdgeLines().length; i++)
        if (this.GetEdge().GetEdgeLines()[i].GetEnd() == this)
            return i;
};

/**
 * Returns the position of the bend.
 * @public
 * @returns {THREE.Vector3}
 */
Bend.prototype.GetPosition = function ()
{
    return this.position_;
};

/**
 * Sets the position of the bend.
 * @public
 * @param {THREE.Vector3} position - The new position of the bend.
 */
Bend.prototype.SetPosition = function (position)
{
    this.position_ = position;
};

/**
 * Determines whether the bend is selected or not.
 * @public
 * @returns {boolean}
 */
Bend.prototype.IsSelected = function ()
{
    return this.isSelected_;
};

/**
 * Set whether the bend is selected or not.
 * @public
 * @param {boolean} isSelected - Whether the bend is selected or not.
 */
Bend.prototype.SetIsSelected = function (isSelected)
{
    this.isSelected_ = isSelected;
};

/**
 * Returns the mesh array used to hold the 3D mesh to be shown on the user interface.
 * @public
 * @returns {THREE.Mesh[]}
 */
Bend.prototype.GetMeshArray = function ()
{
    return this.meshArray_;
};

/**
 * Returns whether the mesh for bend needs to be updated or not.
 * This is to prevent updating the mesh on every frame.
 * It will be set to false after each frame render.
 * @public
 * @returns {boolean}
 */
Bend.prototype.IsMeshUpdateNeeded = function ()
{
    return this.isMeshUpdateNeeded_;
};

/**
 * See {@link Bend#IsMeshUpdateNeeded} for further information.
 * @public
 * @param {boolean} isMeshUpdateNeeded - Whether the mesh for the bend needs to
 * be updated or not.
 */
Bend.prototype.SetIsMeshUpdateNeeded = function (isMeshUpdateNeeded)
{
    this.isMeshUpdateNeeded_ = isMeshUpdateNeeded;
};

