/**
 * The RenderManager class.
 * The main class to handle rendering except the customizable rendering features
 * that are provided using DefaultEngine class and classed derived from it
 * @constructor
 * @param {object} renderDiv - the DOM element for container div
 * @param {number} width - the rendering width in pixels
 * @param {number} height - the rendering height in pixels
 */
function RenderManager(renderDiv, width, height)
{
    /** @private
     * @type {number} */
    this.width_ = width;

    /** @private
     * @type {number} */
    this.height_ = height;

    /** Camera perspective parameter
     * @private
     * @type {number} */
    this.viewAngle_ = 45;

    /** Camera perspective parameter
     * @private
     * @type {number} */
    this.aspect_ = this.width_ / this.height_;

    /** Camera perspective parameter
     * @private
     * @type {number} */
    this.near_ = 0.1;

    /** Camera perspective parameter
     * @private
     * @type {number} */
    this.far_ = 10000;

    /** the DOM element for container div
     * @private
     * @type {object} */
    this.renderDiv_ = renderDiv;

    /** Whether in side by side 3D mode
     * @private
     * @type {boolean} */
    this.isSideBySide3D_ = START_PANEL_MANAGER.GetIsSideBySide();

    /** Whether to use world axis for movements instead of camera axis
     * @private
     * @type {boolean} */
    this.useWorldAxis_ = false;

    /** Whether insert mode is activated where a dummy vertex is shown
     * @private
     * @type {boolean} */
    this.isInsertMode_ = false;

    /** The render engine used
     * @private
     * @type {DefaultEngine} */
    this.engine_ = START_PANEL_MANAGER.GetGraphEngine();
    this.engine_.SetRenderQuality(START_PANEL_MANAGER.GetSelectedQuality());

    /** Whether in merged mode
     * @private
     * @type {DefaultEngine} */
    this.isMerged_ = START_PANEL_MANAGER.GetIsMerged();

    /** @private
     * @type {THREE.Scene} */
    this.scene_ = null;

    /** @private
     * @type {number} */
    this.refreshInterval_ = null;

    /** @private
     * @type {THREE.PerspectiveCamera} */
    this.camera_ = null;

    /** @private
     * @type {THREE.WebGLRenderer} */
    this.webGLRenderer_ = null;

    /** @private
     * @type {THREE.OculusRiftEffect} */
    this.oculusEffect_ = null;

    /** @private
     * @type {THREE.PerspectiveCamera} */
    this.leftCamera_ = null;

    /** @private
     * @type {THREE.PerspectiveCamera} */
    this.rightCamera_ = null;

    /** Separation between two cameras in side by side 3D mode
     * @private
     * @type {number} */
    this.cameraSeparation_ = 3;

    /** @private
     * @type {THREE.Line} */
    this.selectionAxisX_ = null;

    /** @private
     * @type {THREE.Line} */
    this.selectionAxisY_ = null;

    /** @private
     * @type {THREE.Line} */
    this.selectionAxisZ_ = null;

    /** @private
     * @type {THREE.Mesh} */
    this.dummyVertex_ = null;
}

/**
 * Whether to use world axis for movements instead of camera axis
 * @param{boolean} useWorldAxis - The new value
 * @public
 */
RenderManager.prototype.SetUseWorldAxis = function (useWorldAxis)
{
    this.useWorldAxis_ = useWorldAxis;
};

/**
 * Whether insert mode is activated where a dummy vertex is shown
 * @return{boolean}
 * @public
 */
RenderManager.prototype.GetIsInsertMode = function ()
{
    return this.isInsertMode_;
};

/**
 * Sets whether insert mode is activated where a dummy vertex is shown
 * @param{boolean} isInsertMode - The new value
 * @public
 */
RenderManager.prototype.SetIsInsertMode = function (isInsertMode)
{
    this.isInsertMode_ = isInsertMode;
};

/**
 * Returns the render engine
 * @return{DefaultEngine}
 * @public
 */
RenderManager.prototype.GetEngine = function ()
{
    return this.engine_;
};


/**
 * Returns the DOM div element of rendering
 * @return{object}
 * @public
 */
RenderManager.prototype.GetRenderDiv = function ()
{
    return this.renderDiv_;
};

/**
 * Initializes the rendering and starts the render loop
 * Also merges geometries for merged mode
 * @public
 */
RenderManager.prototype.Start = function ()
{

    this.init();

    this.setCameraPosition(new THREE.Vector3(0, 50, 300));

    this.initLights();

    // Merge geometries if in merge mode
    if (this.isMerged_)
    {
        this.updateGraph();
        var allGeometry = new THREE.Geometry();
        var allMaterials = [];
        var meshes = [];
        for (var i = 0; i < this.scene_.children.length; i++)
            if (this.scene_.children[i] instanceof THREE.Mesh)
                if (this.scene_.children[i].visible)
                    meshes.push(this.scene_.children[i]);

        for (var i = 0; i < meshes.length; i++)
        {
            var mesh = meshes[i];
            mesh.updateMatrix();
            var material = mesh.material.clone();
            allMaterials.push(material);
            allGeometry.merge(mesh.geometry, mesh.matrix, i);
        }

        for (var i = 0; i < meshes.length; i++)
            this.scene_.remove(meshes[i]);

        var mesh = new THREE.Mesh(allGeometry,
            new THREE.MeshFaceMaterial(allMaterials));
        this.scene_.add(mesh);
    }

    var fps = 24; //frames per second
    var myclass = this;
    this.refreshInterval_ = setInterval(function ()
    {
        myclass.refresh.call(myclass);
    }, 1000 / fps);
};

/**
 * Stops the render loop
 * @public
 */
RenderManager.prototype.Stop = function ()
{
    clearInterval(this.refreshInterval_);
};


/**
 * Resizes the rendering width and height
 * @param width - The new width in pixels
 * @param height - The new height in pixels
 * @public
 */
RenderManager.prototype.Resize = function (width, height)
{
    this.width_ = width;
    this.height_ = height;
    this.camera_.aspect = this.width_ / this.height_;
    this.camera_.updateProjectionMatrix();

    this.webGLRenderer_.setSize(this.width_, this.height_);
    if (START_PANEL_MANAGER.GetIsOculusRift())
        this.oculusEffect_.setSize(this.width_, this.height_);
};


/**
 * Moves the dummy vertex to a position based on a 2D point in a plane facing
 * the camera with a specified distance
 * @param{number} x - The x coordinate of the point
 * @param{number} y - The y coordinate of the point
 * @param{number} distance - The distance of plane from camera
 * @public
 */
RenderManager.prototype.MoveDummyVertex = function (x, y, distance)
{
    this.dummyVertex_.position.copy(this.Get3DPointFrom2D(x, y, distance));
};


/**
 * Returns the camera position
 * @return {THREE.Vector3}
 */
RenderManager.prototype.GetCameraPosition = function ()
{
    return this.camera_.position;
};

/**
 * Returns the camera rotation in degrees.
 * @public
 * @return {THREE.Vector3}
 */
RenderManager.prototype.GetCameraRotationDegrees = function ()
{
    var newEuler = new THREE.Euler(0, 0, 0);
    newEuler.setFromQuaternion(this.camera_.quaternion);
    var pi = 3.14;
    return new THREE.Vector3(newEuler.x * 180 / pi,
            newEuler.y * 180 / pi, newEuler.z * 180 / pi);
};


/**
 * Rotates the camera in the right direction
 * @param {number} angle - The amount of rotation in radians
 * @public
 */
RenderManager.prototype.RotateCameraRight = function (angle)
{
    var rotationQuaternion = new THREE.Quaternion();
    rotationQuaternion.set(0, angle, 0, 1).normalize();
    var result = new THREE.Quaternion().multiplyQuaternions(
        this.camera_.quaternion, rotationQuaternion);
    GRAPH.SetCameraQuaternion(result);
    this.setCameraRotationQuaternion(GRAPH.GetCameraQuaternion());
};


/**
 * Rotates the camera in the up direction
 * @param {number} angle - The amount of rotation in radians
 */
RenderManager.prototype.RotateCameraUp = function (angle)
{
    var rotationQuaternion = new THREE.Quaternion();
    rotationQuaternion.set(angle, 0, 0, 1).normalize();
    var result = new THREE.Quaternion().multiplyQuaternions(
        this.camera_.quaternion, rotationQuaternion);
    GRAPH.SetCameraQuaternion(result);
    this.setCameraRotationQuaternion(GRAPH.GetCameraQuaternion());
};


/**
 * Moves the camera in the forward direction
 * @param {number} distance - The amount of movement in pixels
 */
RenderManager.prototype.MoveCameraForward = function (distance)
{
    if (this.useWorldAxis_)
        this.camera_.position.z -= distance;
    else
        this.camera_.translateZ(-distance);
    GRAPH.SetCameraPosition(this.camera_.position);
};

/**
 * Rotates a vertex in right direction
 * @param {Vertex} vertex - The vertex to be rotated
 * @param {number} angle - The amount of rotation in radians
 * @public
 */
RenderManager.prototype.RotateVertexRight = function (vertex, angle)
{
    var rotationQuaternion = new THREE.Quaternion();
    rotationQuaternion.set(angle, 0, 0, 1).normalize();
    var currentQuaternion = vertex.GetRotation();
    var result = new THREE.Quaternion().multiplyQuaternions(
        currentQuaternion, rotationQuaternion);
    vertex.SetRotation(result);
};

/**
 * Rotates a vertex in up direction
 * @param {Vertex} vertex - The vertex to be rotated
 * @param {number} angle - The amount of rotation in radians
 * @public
 */
RenderManager.prototype.RotateVertexUp = function (vertex, angle)
{
    var rotationQuaternion = new THREE.Quaternion();
    rotationQuaternion.set(0, angle, 0, 1).normalize();
    var currentQuaternion = vertex.GetRotation();
    var result = new THREE.Quaternion().multiplyQuaternions(
        currentQuaternion, rotationQuaternion);
    vertex.SetRotation(result);
};

/**
 * Moves the camera in the right direction
 * @param {number} distance - The amount movement in pixels
 */
RenderManager.prototype.MoveCameraRight = function (distance)
{
    if (this.useWorldAxis_)
        this.camera_.position.x += distance;
    else
        this.camera_.translateX(distance);
    GRAPH.SetCameraPosition(this.camera_.position);
};

/**
 * Moves the camera in the up direction
 * @param {number} distance - The amount movement in pixels
 */
RenderManager.prototype.MoveCameraUp = function (distance)
{
    if (this.useWorldAxis_)
        this.camera_.position.y += distance;
    else
        this.camera_.translateY(distance);
    GRAPH.SetCameraPosition(this.camera_.position);
};

/**
 * Removes meshes of an item from scene
 * @param {(Vertex|Edge|Bend|EdgeLine)} item - The item to remove it's meshes
 */
RenderManager.prototype.RemoveFromScene = function (item)
{
    if (item != "undefined")
        this.scene_.remove(item);

    if (item.GetMeshArray() != "undefined")
        for (var i = 0; i < item.GetMeshArray().length; i++)
            this.scene_.remove(item.GetMeshArray()[i]);
};

/**
 * Returns 3D representation of a 2D point
 * It assumes that the 2D point is in the plane facing the camera with a specified distance
 * @param {number} x - the x coordinate of the point in pixels
 * @param {number} y - the y coordinate of the point in pixels
 * @param {number} distance - the distance of the plane from the camera
 * @return {THREE.Vector3}
 * @public
 */
RenderManager.prototype.Get3DPointFrom2D = function (x, y, distance)
{
    var forwardDirection = this.getForwardDirection();
    var rightDirection = this.getRightDirection();
    var upDirection = this.getUpDirection();

    var halfDisplayHeight = distance * Math.tan(this.viewAngle_ / 2 * (Math.PI / 180));
    var halfDisplayWidth = halfDisplayHeight * (this.width_ / this.height_);

    var halfHeight = this.height_ / 2;
    var halfWidth = this.width_ / 2;

    var cameraInUse = this.camera_;
    if (this.isSideBySide3D_)
    {
        if (x > halfWidth)
        {
            x -= halfWidth;
            cameraInUse = this.rightCamera_;
        }
        else
            cameraInUse = this.leftCamera_;

        halfWidth /= 2;
        halfDisplayWidth /= 2;
    }

    var diffY = halfHeight - y;
    var realDiffY = diffY * halfDisplayHeight / halfHeight;

    var diffX = x - halfWidth;
    var realDiffX = diffX * halfDisplayWidth / halfWidth;


    var moveVector = forwardDirection.multiplyScalar(distance);
    var centerPos = new THREE.Vector3().addVectors(cameraInUse.position, moveVector);

    var moveVector = rightDirection.multiplyScalar(realDiffX);
    var targetPos = new THREE.Vector3().addVectors(centerPos, moveVector);

    var moveVector = upDirection.multiplyScalar(realDiffY);
    targetPos = new THREE.Vector3().addVectors(targetPos, moveVector);

    return targetPos;

};

/**
 * Finds the nearest vertex or bend whose 2D representation is specified in parameters
 * @param {number} x - The x coordinate of the point in pixels
 * @param {number} y - The y coordinate of the point in pixels
 * @return {(Vertex|Bend)}
 */
RenderManager.prototype.SelectFrom2D = function (x, y)
{
    var vertices = GRAPH.GetVertices();

    var width = this.width_;
    var height = this.height_;

    var cameraInUse = this.camera_;

    if (this.isSideBySide3D_)
    {
        var halfWidth = width / 2;

        if (x > halfWidth)
        {
            x -= halfWidth;
            cameraInUse = this.rightCamera_;
        }
        else
            cameraInUse = this.leftCamera_;

        width /= 2;
    }

    var selectedItem = null;
    var selectedDistance = 1000000000;

    var forwardDirection = this.getForwardDirection();

    for (var i = 0; i < vertices.length; i++)
    {
        var vertex = vertices[i];
        var result = this.engine_.Is2DPointInVertexGeometry(vertex, x, y,
            cameraInUse, width, height, forwardDirection)
        if (result != null)
        {
            if (result < selectedDistance)
            {
                selectedItem = vertex;
                selectedDistance = result;
            }
        }
    }

    var edges = GRAPH.GetEdges();

    for (var i = 0; i < edges.length; i++)
    {
        var edge = edges[i];
        for (var j = 0; j < edge.GetEdgeLines().length; j++)
            if (edge.GetEdgeLines()[j].GetStart() instanceof Bend)
            {
                var bend = edge.GetEdgeLines()[j].GetStart();

                var result = this.engine_.Is2DPointInBendGeometry(bend, x, y,
                    cameraInUse, width, height, forwardDirection)
                if (result != null)
                {
                    if (result < selectedDistance)
                    {
                        selectedItem = bend;
                        selectedDistance = result;
                    }
                }
            }
    }

    return selectedItem;
};

/**
 * Moves a vertex or bend upward
 * @param {(Vertex|Bend)} item - The Vertex or Bend to be moved
 * @param {number} distance - the amount of movement in pixels
 * @public
 */
RenderManager.prototype.MoveItemUp = function (item, distance)
{
    var position = item.GetPosition();
    var upDirection = new THREE.Vector3(0, 1, 0);
    if (!this.useWorldAxis_)
        upDirection = this.getUpDirection();
    upDirection.multiplyScalar(distance);
    position.add(upDirection);
    item.SetPosition(position);
};

/**
 * Moves a vertex or bend right
 * @param {(Vertex|Bend)} item - The Vertex or Bend to be moved
 * @param {number} distance - the amount of movement in pixels
 * @public
 */
RenderManager.prototype.MoveItemRight = function (item, distance)
{
    var position = item.GetPosition();
    var rightDirection = new THREE.Vector3(1, 0, 0);
    if (!this.useWorldAxis_)
        rightDirection = this.getRightDirection();
    rightDirection.multiplyScalar(distance);
    position.add(rightDirection);
    item.SetPosition(position);
};

/**
 * Moves a vertex or bend forward
 * @param {(Vertex|Bend)} item - The Vertex or Bend to be moved
 * @param {number} distance - the amount of movement in pixels
 * @public
 */
RenderManager.prototype.MoveItemForward = function (item, distance)
{
    var position = item.GetPosition();
    var forwardDirection = new THREE.Vector3(0, 0, -1);
    if (!this.useWorldAxis_)
        forwardDirection = this.getForwardDirection();
    forwardDirection.multiplyScalar(distance);
    position.add(forwardDirection);
    item.SetPosition(position);
};

/**
 * Returns the distance from the plane facing the camera and containing a
 * Vertex or Bend from camera.
 * @param {(Vertex|Bend)} item - The Vertex or Bend
 * @return {number}
 * @public
 */
RenderManager.prototype.ItemPlaneDistance = function (item)
{
    var forwardDirection = this.getForwardDirection();
    var a = new THREE.Vector3().subVectors(this.camera_.position, item.GetPosition());
    var t = -a.dot(forwardDirection) / forwardDirection.length();
    var planeDistance = forwardDirection.length() * t;
    return planeDistance;
};

/**
 * Adds a mesh to the scene
 * @param mesh - The mesh to be added
 * @public
 */
RenderManager.prototype.AddMeshToScene = function (mesh)
{
    this.scene_.add(mesh);
};

/**
 * Removes a mesh from the scene
 * @param mesh - The mesh to be removed
 * @public
 */
RenderManager.prototype.RemoveMeshFromScene = function (mesh)
{
    this.scene_.remove(mesh);
};

/**
 * The loop function that updates graph 3D UI and renders the scene
 * @private
 */
RenderManager.prototype.refresh = function ()
{
    this.setCameraPosition(GRAPH.GetCameraPosition());

    this.setCameraRotationQuaternion(GRAPH.GetCameraQuaternion());
    if (!this.isMerged_)
        this.updateGraph();
    this.render();
};

/**
 * Initializes the 3D rendering environment using Three.js
 * @private
 */
RenderManager.prototype.init = function ()
{

    // Create a WebGL renderer
    this.webGLRenderer_ = new THREE.WebGLRenderer();
    var backgroundColor = new THREE.Color(START_PANEL_MANAGER.GetBackgroundColor());
    this.webGLRenderer_.setClearColorHex(backgroundColor.getHex(), 1);

    // Create camera
    this.camera_ =
        new THREE.PerspectiveCamera(
            this.viewAngle_,
            this.aspect_,
            this.near_,
            this.far_);

    this.camera_.useQuaternion = true;

    // Create scene
    this.scene_ = new THREE.Scene();

    // add the camera to the scene
    this.scene_.add(this.camera_);

    this.webGLRenderer_.setSize(this.width_, this.height_);

    if (START_PANEL_MANAGER.GetIsOculusRift())
    {
        var isDK1 = true; // DK2 if false
        var hmd = null;
        // If DK1 use the setting required for DK1,
        // otherwise use the default setting that are suitable for DK2
        if (isDK1)
        {
            hmd = {
                // DK1
                hResolution: 1280,
                vResolution: 800,
                hScreenSize: 0.14976,
                vScreenSize: 0.0936,
                interpupillaryDistance: 0.064,
                lensSeparationDistance: 0.064,
                eyeToScreenDistance: 0.041,
                distortionK: [1.0, 0.22, 0.24, 0.0],
                chromaAbParameter: [0.996, -0.004, 1.014, 0.0]
            };
        }
        this.oculusEffect_ =
            new THREE.OculusRiftEffect(this.webGLRenderer_,
                {worldScale: 1, HMD: hmd});
        this.oculusEffect_.setSize(this.width_, this.height_);
    }

    if (this.isSideBySide3D_)
    { // for side by side 3D output
        this.leftCamera_ = new THREE.PerspectiveCamera(
            this.viewAngle_, this.aspect_ / 2, this.near_, this.far_);
        this.leftCamera_.useQuaternion = true;

        this.rightCamera_ = new THREE.PerspectiveCamera(
            this.viewAngle_, this.aspect_ / 2, this.near_, this.far_);
        this.rightCamera_.useQuaternion = true;

        this.webGLRenderer_.autoClear = false;
    }

    // attach the render-supplied DOM element
    this.renderDiv_.appendChild(this.webGLRenderer_.domElement);

    // Ground plane
    if (START_PANEL_MANAGER.GetIsGroundEnabled())
    {
        var planeGeometry = new THREE.BoxGeometry(1000, 1000, 0.001, 20, 20, 1);

        var plane = THREE.SceneUtils.createMultiMaterialObject(planeGeometry, [
            new THREE.MeshBasicMaterial({
                color: 0x111111, wireframe: false,
                transparent: true, opacity: 0.2
            }),
            new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true})
        ]);

        plane.rotation.x = Math.PI / 2;

        this.scene_.add(plane);
    }

    // Create selection axis X
    var material = new THREE.LineBasicMaterial({color: 0x00CC00});
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0));
    this.selectionAxisX_ = new THREE.Line(geometry, material);
    this.selectionAxisX_.geometry.dynamic = true;
    this.selectionAxisX_.visible = false;
    this.scene_.add(this.selectionAxisX_);

    // Create selection axis Y
    var material = new THREE.LineBasicMaterial({color: 0xCC0000});
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0));
    this.selectionAxisY_ = new THREE.Line(geometry, material);
    this.selectionAxisY_.geometry.dynamic = true;
    this.selectionAxisY_.visible = false;
    this.scene_.add(this.selectionAxisY_);

    // Create selection axis Z
    var material = new THREE.LineBasicMaterial({color: 0x0000CC});
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0));
    this.selectionAxisZ_ = new THREE.Line(geometry, material);
    this.selectionAxisZ_.geometry.dynamic = true;
    this.selectionAxisZ_.visible = false;
    this.scene_.add(this.selectionAxisZ_);

    // Add dummy vertex
    this.dummyVertex_ = this.engine_.GetDummyVertexMesh();
    this.dummyVertex_.visible = false;
    this.dummyVertex_.position.copy(new THREE.Vector3(0, 0, 0));
    this.scene_.add(this.dummyVertex_);

};

/**
 * Initializes the lights
 * @private
 */
RenderManager.prototype.initLights = function ()
{
    // create directional lights

    var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    directionalLight.position.normalize();
    this.scene_.add(directionalLight);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(-1, -1, -1);
    directionalLight.position.normalize();
    this.scene_.add(directionalLight);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.1);
    directionalLight.position.set(0, 0, 1);
    directionalLight.position.normalize();
    this.scene_.add(directionalLight);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.1);
    directionalLight.position.set(0, 0, -1);
    directionalLight.position.normalize();
    this.scene_.add(directionalLight);
};

/**
 * Renders the scene
 * @private
 */
RenderManager.prototype.render = function ()
{
    if (this.isSideBySide3D_)
        this.renderSideBySide();
    else if (START_PANEL_MANAGER.GetIsOculusRift())
        this.oculusEffect_.render(this.scene_, this.camera_);
    else
        this.webGLRenderer_.render(this.scene_, this.camera_);
};

/**
 * Renders the scene using side by side 3D
 * @private
 */
RenderManager.prototype.renderSideBySide = function ()
{
    this.leftCamera_.updateProjectionMatrix();
    this.leftCamera_.position.copy(this.camera_.position);
    this.leftCamera_.quaternion.copy(this.camera_.quaternion);
    this.leftCamera_.translateX(this.cameraSeparation_);

    this.rightCamera_.updateProjectionMatrix();
    this.rightCamera_.position.copy(this.camera_.position);
    this.rightCamera_.quaternion.copy(this.camera_.quaternion);
    this.rightCamera_.translateX(-this.cameraSeparation_);

    var halfWidth = this.width_ / 2;
    var height = this.height_;

    this.webGLRenderer_.clear();

    this.webGLRenderer_.setViewport(0, 0, halfWidth, height);
    this.webGLRenderer_.render(this.scene_, this.leftCamera_);

    this.webGLRenderer_.setViewport(halfWidth, 0, halfWidth, height);
    this.webGLRenderer_.render(this.scene_, this.rightCamera_, false);
};


/**
 * Update the graph 3D UI
 * @private
 */
RenderManager.prototype.updateGraph = function ()
{
    if (this.isInsertMode_)
        this.dummyVertex_.visible = true;
    else
        this.dummyVertex_.visible = false;

    var edges = GRAPH.GetEdges();

    for (var i = 0; i < edges.length; i++)
        this.engine_.UpdateEdgeOffsets(edges[i]);

    var vertices = GRAPH.GetVertices();

    var isFirstSelectedFound = false;

    for (var i = 0; i < vertices.length; i++)
    {
        var vertex = vertices[i];
        this.updateGraphVertex(vertex);
        if (vertex.IsSelected() && !isFirstSelectedFound && !this.isInsertMode_)
        {
            this.showSelectionAxis(vertex.GetPosition());
            isFirstSelectedFound = true;
        }
    }

    if (this.isInsertMode_)
        this.showSelectionAxis(this.dummyVertex_.position);
    else if (!isFirstSelectedFound)
        this.hideSelectionAxis();

    for (var i = 0; i < edges.length; i++)
        this.updateGraphEdge(edges[i]);

    if (GRAPH.GetHighlightedItem() != null && !GRAPH.GetHighlightedItem().IsSelected())
    {
        if (GRAPH.GetHighlightedItem() instanceof Vertex)
            this.engine_.UpdateVertex(GRAPH.GetHighlightedItem(), false, true);
        else
            this.engine_.UpdateBend(GRAPH.GetHighlightedItem(), false, true);
    }
};

/**
 * Sets the camera position
 * @param {THREE.Vector3} position - The new position
 * @private
 */
RenderManager.prototype.setCameraPosition = function (position)
{
    this.camera_.position.copy(position);
};


/**
 * Sets the camera rotation quaternion
 * @param {THREE.Quaternion} quaternion - The new rotation quaternion
 */
RenderManager.prototype.setCameraRotationQuaternion = function (quaternion)
{
    this.camera_.quaternion.copy(quaternion);
    this.camera_.rotation.setFromQuaternion(this.camera_.quaternion,
        this.camera_.rotation.order);
};


/**
 * Show the selection axis at the specified position
 * @param{THREE.Vector3} position - The position of the selection axis
 * @private
 */
RenderManager.prototype.showSelectionAxis = function (position)
{
    var len = 1000;

    var direction = new THREE.Vector3(0, 0, 1);
    if (!this.useWorldAxis_)
        direction = this.getForwardDirection();
    var from = new THREE.Vector3().subVectors(position, direction.multiplyScalar(len));
    var to = new THREE.Vector3().subVectors(position, direction.multiplyScalar(-1));
    this.selectionAxisX_.geometry.vertices[0] = from;
    this.selectionAxisX_.geometry.vertices[1] = to;
    this.selectionAxisX_.geometry.verticesNeedUpdate = true;
    this.selectionAxisX_.visible = true;

    var direction = new THREE.Vector3(0, 1, 0);
    if (!this.useWorldAxis_)
        direction = this.getUpDirection();
    var from = new THREE.Vector3().subVectors(position, direction.multiplyScalar(len));
    var to = new THREE.Vector3().subVectors(position, direction.multiplyScalar(-1));
    this.selectionAxisY_.geometry.vertices[0] = from;
    this.selectionAxisY_.geometry.vertices[1] = to;
    this.selectionAxisY_.geometry.verticesNeedUpdate = true;
    this.selectionAxisY_.visible = true;

    var direction = new THREE.Vector3(1, 0, 0);
    if (!this.useWorldAxis_)
        direction = this.getRightDirection();
    var from = new THREE.Vector3().subVectors(position, direction.multiplyScalar(len));
    var to = new THREE.Vector3().subVectors(position, direction.multiplyScalar(-1));
    this.selectionAxisZ_.geometry.vertices[0] = from;
    this.selectionAxisZ_.geometry.vertices[1] = to;
    this.selectionAxisZ_.geometry.verticesNeedUpdate = true;
    this.selectionAxisZ_.visible = true;
};

/**
 * Hides the selection axis
 * @private
 */
RenderManager.prototype.hideSelectionAxis = function ()
{
    this.selectionAxisX_.visible = false;
    this.selectionAxisY_.visible = false;
    this.selectionAxisZ_.visible = false;
};


/**
 * Updates the 3D representation of a vertex
 * @param {Vertex} vertex
 * @private
 */
RenderManager.prototype.updateGraphVertex = function (vertex)
{
    if (vertex.IsSelected())
        this.engine_.UpdateVertex(vertex, true, false);
    else
        this.engine_.UpdateVertex(vertex, false, false);
    vertex.SetIsMeshUpdateNeeded(false);
    vertex.SetIsTextureUpdateNeeded(false);
};

/**
 * Updates the 3D representation of an edge
 * @param {Edge} edge
 * @private
 */
RenderManager.prototype.updateGraphEdge = function (edge)
{

    for (var i = 0; i < edge.GetEdgeLines().length; i++)
    {
        this.updateGraphEdgeLine(edge.GetEdgeLines()[i]);
    }
};

/**
 * Updates the 3D representation of a bend
 * @param {Bend} bend
 * @private
 */
RenderManager.prototype.updateGraphBend = function (bend)
{

    if (bend.IsSelected())
        this.engine_.UpdateBend(bend, true, false);
    else
        this.engine_.UpdateBend(bend, false, false);
    bend.SetIsMeshUpdateNeeded(false);
};

/**
 * Updates the 3D representation of an edgeLine
 * @param {EdgeLine} edgeLine
 * @private
 */
RenderManager.prototype.updateGraphEdgeLine = function (edgeLine)
{

    var startPoint = null;
    if (edgeLine.GetStart() instanceof Vertex)
        startPoint = edgeLine.GetStart().GetPosition().clone().add(
            edgeLine.GetEdge().GetStartOffset());
    else
        startPoint = edgeLine.GetStart().GetPosition();

    var endPoint = null;
    if (edgeLine.GetEnd() instanceof Vertex)
        endPoint = edgeLine.GetEnd().GetPosition().clone().add(
            edgeLine.GetEdge().GetEndOffset());
    else
        endPoint = edgeLine.GetEnd().GetPosition();

    this.engine_.UpdateEdgeLine(edgeLine, startPoint, endPoint);
    edgeLine.SetIsMeshUpdateNeeded(false);
    edgeLine.SetIsTextureUpdateNeeded(false);

    if (edgeLine.GetStart() instanceof Bend)
        this.updateGraphBend(edgeLine.GetStart());
};


/**
 * Returns a vector representing the forward direction
 * Forward direction is the direction that we are looking at
 * @return {THREE.Vector3}
 */
RenderManager.prototype.getForwardDirection = function ()
{
    var baseDirection = new THREE.Vector3(0, 0, -1);
    baseDirection.applyQuaternion(this.camera_.quaternion);
    return baseDirection;
};

/**
 * Returns a vector representing the right direction
 * @return {THREE.Vector3}
 */
RenderManager.prototype.getRightDirection = function ()
{
    var baseDirection = new THREE.Vector3(1, 0, 0);
    baseDirection.applyQuaternion(this.camera_.quaternion);
    return baseDirection;
};

/**
 * Returns a vector representing the up direction
 * @return {THREE.Vector3}
 */
RenderManager.prototype.getUpDirection = function ()
{
    var baseDirection = new THREE.Vector3(0, 1, 0);
    baseDirection.applyQuaternion(this.camera_.quaternion);
    return baseDirection;
};
