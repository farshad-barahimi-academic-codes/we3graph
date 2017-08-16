/**
 * The Graph class.
 * Represent a graph.
 * @constructor
 */
Graph = function Graph()
{
    /** The index of last created vertex ID
     * @private
     * @type {number} */
    this.lastCreatedVertexID_ = 0;

    /** The index of last created edge ID
     * @private
     * @type {number} */
    this.lastCreatedEdgeID_ = 0;

    /** The position of the camera
     * @private
     * @type {THREE.Vector3} */
    this.cameraPosition_ = new THREE.Vector3(0, 50, 300);

    /** The rotation of the camera
     * @private
     * @type {THREE.Quaternion} */
    this.cameraQuaternion_ = new THREE.Quaternion(0, 0, 0, 1);

    /** A hash dictionary of all vertices in the graph
     * @private
     * @type {IDHashDictionary} */
    this.verticesDictionary_ = new IDHashDictionary();

    /** A hash dictionary of all edges in the graph
     * @private
     * @type {IDHashDictionary} */
    this.edgesDictionary_ = new IDHashDictionary();

    /** The array of selected items
     * Each item can be a vertex or a bend
     * @private
     * @type {(Vertex|Bend)[]} */
    this.selection_ = [];

    /** The selected edge. null if no edge is selected
     * @private
     * @type {(Edge|null)} */
    this.selectedEdge_ = null;

    /** The highlighted item. null if no item is highlighted.
     * Item can be a vertex or bend
     * @private
     * @type {(Vertex|Bend|null)} */
    this.highlightedItem_ = null;

    /** Whether camera commands should be applied to the graph
     * @private
     * @type {boolean} */
    this.isReceiveCamera_ = false;

    /** List of commands in the history of graph
     * @private
     * @type {Command[]} */
    this.commandsHistory_ = [];

    /** The index of last command that has been applied
     * @private
     * @type {number} */
    this.historyIndex_ = -1;
};

/**
 * Returns an array of all vertices in graph
 * @public
 * @return {Vertex[]} the list of vertices
 */
Graph.prototype.GetVertices = function ()
{
    return this.verticesDictionary_.GetAllValues();
};

/**
 * Returns an array of all edges in graph
 * @public
 * @return {Edge[]} the list of edges
 */
Graph.prototype.GetEdges = function ()
{
    return this.edgesDictionary_.GetAllValues();
};

/**
 * processes an incoming command and apply it to the graph
 * @public
 * @param {Command} command - the command to be processed
 * @param {boolean} isLoading - whether the graph is loading
 * @param {boolean} keepHistory - whether should keep history of this command
 */
Graph.prototype.ProcessCommand = function (command, isLoading, keepHistory)
{
    if (!isLoading && command.GetClientID() == WEB_SERVICE.GetClientID())
        return;

    // Use false as default value
    if (typeof keepHistory == 'undefined')
        keepHistory = false;

    var params = command.GetParameters();

    switch (command.GetName())
    {
        case 'InsertVertex':
            var position = new THREE.Vector3(Number(params[1]),
                Number(params[2]), Number(params[3]));
            var result = this.insertVertex(position, command.GetClientID(), params[0]);
            if (isLoading && command.GetClientID() == WEB_SERVICE.GetClientID())
                this.lastCreatedVertexID_ = result;

            if (keepHistory)
            {
                var complementCommand =
                    new Command('RemoveVertex', [command.GetClientID() + '-' + result]);
                command.SetComplementCommand(complementCommand);
                this.commandsHistory_.push(command);
                this.historyIndex_++;
            }

            return result;
            break;
        case 'InsertEdge':
            var fromVertex = this.findVertex(params[0]);
            var endVertex = this.findVertex(params[1]);

            if (fromVertex == null || endVertex == null)
                return null;

            var clientID = command.GetClientID();
            var idInCreator = params[2];

            if (typeof clientID === "undefined")
            {
                clientID = WEB_SERVICE.GetClientID();
                idInCreator = ++(this.lastCreatedEdgeID_);
            }

            var edgeID = clientID + "-" + idInCreator;

            var edge = fromVertex.Connect(endVertex, edgeID);
            this.edgesDictionary_.Add(clientID, idInCreator, edge);
            if (isLoading && command.GetClientID() == WEB_SERVICE.GetClientID())
                this.lastCreatedEdgeID_ = idInCreator;

            if (keepHistory)
            {
                var complementCommand = new Command('RemoveEdge', [edgeID]);
                command.SetComplementCommand(complementCommand);
                this.commandsHistory_.push(command);
                this.historyIndex_++;
            }

            return idInCreator;
            break;
        case 'BreakEdgeLine':
            var edge = this.findEdge(params[0]);

            if (edge == null)
                return;

            var position = new THREE.Vector3(Number(params[2]),
                Number(params[3]), Number(params[4]));
            edge.BreakEdgeLine(position, Number(params[1]));

            if (keepHistory)
            {
                var complementCommand =
                    new Command('RemoveBend', [params[0], params[1]]);
                command.SetComplementCommand(complementCommand);
                this.commandsHistory_.push(command);
                this.historyIndex_++;
            }

            break;
        case 'RemoveVertex':
            var parts = params[0].split('-');
            var clientID = Number(parts[0]);
            var idInCreator = Number(parts[1]);
            var vertex = this.verticesDictionary_.Find(clientID, idInCreator);

            if (vertex == null)
                return;

            if (vertex.IsSelected())
                this.ClearSelection();

            this.verticesDictionary_.Remove(clientID, idInCreator);

            if (RENDER_MANAGER != null)
                RENDER_MANAGER.RemoveFromScene(vertex);

            var edges = [];
            for (var i = 0; i < vertex.GetEdges().length; i++)
                edges.push(vertex.GetEdges()[i]);

            for (var i = 0; i < edges.length; i++)
                this.removeEdge(edges[i].GetID());

            if (keepHistory)
            {
                var position = vertex.GetPosition();
                var complementCommand = new Command('InsertVertex',
                    [idInCreator.toString(), position.x.toString(),
                        position.y.toString(), position.z.toString()]);
                complementCommand.SetClientID(clientID);
                command.SetComplementCommand(complementCommand);
                this.commandsHistory_.push(command);
                this.historyIndex_++;
            }

            break;
        case 'RemoveEdge':
            var edge = this.removeEdge(params[0]);

            if (keepHistory)
            {
                var complementCommand = new Command('InsertEdge', [edge.GetID(),
                    edge.GetStartVertex().GetID(), edge.GetEndVertex().GetID()]);
                command.SetComplementCommand(complementCommand);
                this.commandsHistory_.push(command);
                this.historyIndex_++;
            }

            break;
        case 'RemoveBend':
            var parts = params[0].split('-');
            var clientID = Number(parts[0]);
            var idInCreator = Number(parts[1]);
            var edge = this.edgesDictionary_.Find(clientID, idInCreator);

            if (edge == null)
                return;

            var bend = edge.RemoveBend(Number(params[1]));

            if (keepHistory)
            {
                var position = bend.GetPosition();
                var complementCommand = new Command('BreakEdgeLine',
                    [params[0], params[1], position.x.toString(),
                        position.y.toString(), position.z.toString()]);
                command.SetComplementCommand(complementCommand);
                this.commandsHistory_.push(command);
                this.historyIndex_++;
            }

            break;
        case 'MoveVertex':
            var vertex = this.findVertex(params[0]);

            if (vertex == null)
                return;

            if (keepHistory)
            {
                var position = vertex.GetPosition();
                var complementCommand = new Command('MoveVertex',
                    [params[0], position.x.toString(),
                        position.y.toString(), position.z.toString()]);
                command.SetComplementCommand(complementCommand);
                this.commandsHistory_.push(command);
                this.historyIndex_++;
            }

            var position = new THREE.Vector3(Number(params[1]),
                Number(params[2]), Number(params[3]));
            vertex.SetPosition(position);

            break;
        case 'ChangeVertexScale':
            var vertex = this.findVertex(params[0]);

            if (vertex == null)
                return;


            if (keepHistory)
            {
                var scale = vertex.GetScale();
                var complementCommand = new Command('ChangeVertexScale',
                    [params[0], scale.toString()]);
                command.SetComplementCommand(complementCommand);
                this.commandsHistory_.push(command);
                this.historyIndex_++;
            }

            vertex.SetScale(Number(params[1]));

            break;
        case 'ChangeVertexRotation':
            var vertex = this.findVertex(params[0]);

            if (vertex == null)
                return;

            if (keepHistory)
            {
                var quaternion = vertex.GetRotation();
                var complementCommand = new Command('ChangeVertexRotation',
                    [params[0], quaternion.x.toString(), quaternion.y.toString(),
                        quaternion.z.toString(), quaternion.w.toString()]);
                command.SetComplementCommand(complementCommand);
                this.commandsHistory_.push(command);
                this.historyIndex_++;
            }

            var quaternion = new THREE.Quaternion(Number(params[1]),
                Number(params[2]), Number(params[3]), Number(params[4]));

            vertex.SetRotation(quaternion);

            break;
        case 'MoveBend':
            var edge = this.findEdge(params[0]);

            if (edge == null)
                return;

            var bend = edge.GetEdgeLines()[params[1]].GetEnd();

            if (keepHistory)
            {
                var position = bend.GetPosition();
                var complementCommand = new Command('MoveBend',
                    [params[0], params[1], position.x.toString(),
                        position.y.toString(), position.z.toString()]);
                command.SetComplementCommand(complementCommand);
                this.commandsHistory_.push(command);
                this.historyIndex_++;
            }

            var position = new THREE.Vector3(Number(params[2]),
                Number(params[3]), Number(params[4]));
            bend.SetPosition(position);
            break;
        case 'ChangeCameraPosition':
            if (this.isReceiveCamera_ || isLoading)
                this.cameraPosition_ = new THREE.Vector3(Number(params[0]),
                    Number(params[1]), Number(params[2]));
            break;
        case 'ChangeCameraRotation':
            if (this.isReceiveCamera_ || isLoading)
                this.cameraQuaternion_ = new THREE.Quaternion(Number(params[0]),
                    Number(params[1]), Number(params[2]), Number(params[3]));
            break;
        case 'SetVertexProperty':
            var vertex = this.findVertex(params[0]);

            if (vertex == null)
                return;

            if (keepHistory)
            {
                var oldValue = vertex.GetPropertyValue(params[1], params[2]);
                if (oldValue == null)
                    oldValue = '';
                var complementCommand = new Command('SetVertexProperty',
                    [params[0], params[1], params[2], oldValue, params[4]]);
                command.SetComplementCommand(complementCommand);
                this.commandsHistory_.push(command);
                this.historyIndex_++;
            }

            vertex.UpdateProperty(params[1], params[2], params[3]);

            vertex.SetIsTextureUpdateNeeded(true);
            for (var i = 0; i < vertex.GetEdges().length; i++)
                for (var j = 0; j < vertex.GetEdges()[i].GetEdgeLines().length; j++)
                    vertex.GetEdges()[i].GetEdgeLines()[j].SetIsTextureUpdateNeeded(true);

            if (params[4] != '0')
                vertex.SetIsMeshUpdateNeeded(true);

            break;
        case 'SetEdgeProperty':
            var edge = this.findEdge(params[0]);

            if (edge == null)
                return;

            if (keepHistory)
            {
                var oldValue = edge.GetPropertyValue(params[1], params[2]);
                if (oldValue == null)
                    oldValue = '';
                var complementCommand = new Command('SetEdgeProperty',
                    [params[0], params[1], params[2], oldValue, params[4]]);
                command.SetComplementCommand(complementCommand);
                this.commandsHistory_.push(command);
                this.historyIndex_++;
            }

            edge.UpdateProperty(params[1], params[2], params[3]);

            for (var i = 0; i < edge.GetEdgeLines().length; i++)
            {
                edge.GetEdgeLines()[i].SetIsTextureUpdateNeeded(true);
                if (params[4] != '0')
                    edge.GetEdgeLines()[i].SetIsMeshUpdateNeeded(true);
            }

            break;
    }
};

/**
 * Marks an item as selected
 * Item can be a vertex or bend
 * @public
 * @param {(Vertex|Bend)} item
 */
Graph.prototype.Select = function (item)
{
    if (item.IsSelected())
        return;

    this.selection_.push(item);
    item.SetIsSelected(true);

    if (this.selection_.length == 2 && this.selection_[0] instanceof Vertex &&
        this.selection_[1] instanceof Vertex)
    {
        var edge = this.selection_[0].GetConnectingEdge(this.selection_[1]);
        if (edge != null)
            this.selectedEdge_ = edge;
    }

    if (this.selection_.length == 3)
        this.selectedEdge_ = null;

};

/**
 * Deselects all selected items.
 * @public
 */
Graph.prototype.ClearSelection = function ()
{

    this.selectedEdge_ = null;

    for (var i = 0; i < this.selection_.length; i++)
        this.selection_[i].SetIsSelected(false);

    this.selection_ = [];
};

/**
 * Returns the selection type
 * @public
 * @return {SELECTION_TYPE}
 */
Graph.prototype.GetSelectionType = function ()
{

    var vertexCount = 0;
    var bendCount = 0;

    var vertex = null;
    var bend1 = null;
    var bend2 = null;

    for (var i = 0; i < this.selection_.length; i++)
    {
        var item = this.selection_[i];

        if (item instanceof Vertex)
        {
            vertex = item;
            vertexCount++;
        }
        else if (item instanceof Bend)
        {
            bend2 = bend1;
            bend1 = item;
            bendCount++;
        }
    }

    if (this.selection_.length == 0)
        return SELECTION_TYPE.None;

    if (this.selection_.length == 1)
    {
        if (vertexCount == 1)
            return SELECTION_TYPE.SingleVertex;
        else if (bendCount == 1)
            return SELECTION_TYPE.SingleBend;
    }

    if (this.selection_.length == 2)
    {
        if (vertexCount == 2)
            return SELECTION_TYPE.SingleEdge;
        else if (vertexCount == 1 && bendCount == 1)
        {
            if (bend1.GetEdge().GetStartVertex().GetID() == vertex.GetID() ||
                bend1.GetEdge().GetEndVertex().GetID() == vertex.GetID())
                return SELECTION_TYPE.ConnectedBendVertex;
            else
                return SELECTION_TYPE.Multiple;
        }
        else if (bendCount == 2)
        {
            if (bend1.GetEdge().GetID() == bend2.GetEdge().GetID())
                return SELECTION_TYPE.ConnectedBendBend;
            else
                return SELECTION_TYPE.Multiple;
        }
    }

    return SELECTION_TYPE.Multiple;
};

/**
 * Removes the graphical object of an item from the scene
 * Item can be a vertex, bend, or edgeLine
 * @public
 * @param {(Vertex|Bend|EdgeLine)} item
 */
Graph.prototype.RemoveFromScene = function (item)
{
    if (RENDER_MANAGER != null)
        RENDER_MANAGER.RemoveFromScene(item);
};

/**
 * Return the camera position
 * @public
 * @return {THREE.Vector3}
 */
Graph.prototype.GetCameraPosition = function ()
{
    return this.cameraPosition_;
};

/**
 * Sets the camera position
 * @public
 * @param{THREE.Vector3} cameraPosition
 */
Graph.prototype.SetCameraPosition = function (cameraPosition)
{
    this.cameraPosition_ = cameraPosition;
};


/**
 * Return the camera quaternion
 * @public
 * @return {THREE.Quaternion}
 */
Graph.prototype.GetCameraQuaternion = function ()
{
    return this.cameraQuaternion_;
};

/**
 * Sets the camera quaternion
 * @public
 * @param{THREE.Quaternion} cameraQuaternion
 */
Graph.prototype.SetCameraQuaternion = function (cameraQuaternion)
{
    this.cameraQuaternion_ = cameraQuaternion;
};

/**
 * Returns the array of selection. Each item of array can be a vertex or a bend
 * @public
 * @return {(Vertex|Bend)[]}
 */
Graph.prototype.GetSelection = function ()
{
    return this.selection_;
};

/**
 * Returns the selected edge. null if no edge is selected
 * @public
 * @return {(Edge|null)}
 */
Graph.prototype.GetSelectedEdge = function ()
{
    return this.selectedEdge_;
};

/**
 * Sets the selected edge. null if no edge is selected
 * @public
 * @param {(Edge|null)} selectedEdge
 */
Graph.prototype.SetSelectedEdge = function (selectedEdge)
{
    this.selectedEdge_ = selectedEdge;
};

/**
 * Returns the highlighted item. null if no item is highlighted.
 * Item can be a Vertex or a Bend
 * @public
 * @return {(Vertex|Bend|null)}
 */
Graph.prototype.GetHighlightedItem = function ()
{
    return this.highlightedItem_;
};

/**
 * Sets the highlighted item.
 * Item can be a Vertex or a Bend or null
 * @public
 * @param{(Vertex|Bend|null)} highlightedItem
 */
Graph.prototype.SetHighlightedItem = function (highlightedItem)
{
    this.highlightedItem_ = highlightedItem;
};

/**
 * Sets whether the camera commands should be applied to the graph
 * @public
 * @param{boolean} isReceiveCamera
 */
Graph.prototype.SetIsReceiveCamera = function (isReceiveCamera)
{
    this.isReceiveCamera_ = isReceiveCamera;
};

/**
 * Move back one command in the history of the graph
 * @public
 * @return{boolean} false if it can not move back further
 */
Graph.prototype.MoveBackInHistory = function ()
{
    if (this.historyIndex_ < 0)
        return false;

    this.ProcessCommand(
        this.commandsHistory_[this.historyIndex_].GetComplementCommand(), true, false);
    this.historyIndex_--;
    return true;
};

/**
 * Move forward one command in the history of the graph
 * @public
 * @return{boolean} false if it can not move forward further
 */
Graph.prototype.MoveForwardInHistory = function ()
{
    if (this.historyIndex_ > this.commandsHistory_.length - 2)
        return false;

    this.ProcessCommand(this.commandsHistory_[this.historyIndex_ + 1], true, false);
    this.historyIndex_++;
    return true;
};

/**
 * Finds a vertex with specified vertexID
 * @private
 * @param {string} vertexID
 * @return {Vertex} The found vertex. null if not found
 */
Graph.prototype.findVertex = function (vertexID)
{
    var parts = vertexID.split('-');
    var clientID = Number(parts[0]);
    var idInCreator = Number(parts[1]);
    return this.verticesDictionary_.Find(clientID, idInCreator);
};

/**
 * Finds an edge with specified edgeID
 * @private
 * @param {string} edgeID
 * @return {Edge} The found edge. null if not found
 */
Graph.prototype.findEdge = function (edgeID)
{
    var parts = edgeID.split('-');
    var clientID = Number(parts[0]);
    var idInCreator = Number(parts[1]);
    return this.edgesDictionary_.Find(clientID, idInCreator);
};

/**
 * Adds a new vertex to the graph
 * @private
 * @param {THREE.Vector3} position
 * @param {number} clientID - optional
 * @param {number} IDinCreator - optional
 * @return {number} The IDinCreator of added vertex
 */
Graph.prototype.insertVertex = function (position, clientID, IDinCreator)
{
    if (typeof clientID === "undefined")
    {
        clientID = WEB_SERVICE.GetClientID();
        IDinCreator = ++this.lastCreatedVertexID_;
    }

    var vertexID = clientID + "-" + IDinCreator;
    var vertex = new Vertex(this, vertexID, position);
    this.verticesDictionary_.Add(clientID, IDinCreator, vertex);

    return IDinCreator;
};

/**
 * Removes an edge with specified edgeID
 * @private
 * @param {string} edgeID
 * @return{(Edge|null)} The removed edge. null if not found.
 */
Graph.prototype.removeEdge = function (edgeID)
{
    var parts = edgeID.split('-');
    var clientID = Number(parts[0]);
    var idInCreator = Number(parts[1]);
    var edge = this.edgesDictionary_.Find(clientID, idInCreator);

    if (edge == null)
        return null;

    if (this.selectedEdge_ != null && this.selectedEdge_.GetID() == edge.GetID())
        this.ClearSelection();

    this.edgesDictionary_.Remove(clientID, idInCreator);
    if (RENDER_MANAGER != null)
    {
        for (var i = 0; i < edge.GetEdgeLines().length; i++)
        {
            var edgeLine = edge.GetEdgeLines()[i];
            RENDER_MANAGER.RemoveFromScene(edgeLine);
            if (edgeLine.GetStart() instanceof Bend)
                RENDER_MANAGER.RemoveFromScene(edgeLine.GetStart());
        }
    }

    var edges = edge.GetStartVertex().GetEdges();
    var index = -1;
    for (var i = 0; i < edges.length; i++)
        if (edges[i].GetID() == edge.GetID())
            index = i;

    if (index != -1)
        edge.GetStartVertex().GetEdges().splice(index, 1);

    var edges = edge.GetEndVertex().GetEdges();
    var index = -1;
    for (var i = 0; i < edges.length; i++)
        if (edges[i].GetID() == edge.GetID())
            index = i;

    if (index != -1)
        edge.GetEndVertex().GetEdges().splice(index, 1);

    return edge;
};
