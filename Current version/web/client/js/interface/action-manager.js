/**
 * The ActionManager class.
 * This class is used to handle UI actions common between mouse,keyboard,touch
 * or other input devices
 * @constructor
 */
function ActionManager()
{
    /** See {@link ActionManager#SetIsPerformOnCamera} for further information.
     * @type {boolean}
     * @private */
    this.isPerformOnCamera_ = false;

    /** See {@link ActionManager#SetIsMultipleSelectionMode} for further information.
     * @type {boolean}
     * @private */
    this.isMultipleSelectionMode_ = false;

    /** See {@link ActionManager#ChangeActionMode} for further information.
     * @type {string}
     * @private */
    this.actionMode_ = 'None';

    /** See {@link ActionManager#SetInsertDistance} for further information.
     * @type {number}
     * @private */
    this.insertDistance_ = 300;
}

/**
 * Sets whether movement actions should be applied to the camera even when
 * there are one or more selected items.
 * @param{boolean} isPerformOnCamera
 * @public
 */
ActionManager.prototype.SetIsPerformOnCamera = function (isPerformOnCamera)
{
    this.isPerformOnCamera_ = isPerformOnCamera;
};

/**
 * Returns whether movement actions should be applied to the camera even when
 * there are one or more selected items.
 * @return{boolean}
 * @public
 */
ActionManager.prototype.GetIsPerformOnCamera = function ()
{
    return this.isPerformOnCamera_;
};

/**
 * Sets whether actions are made in multiple selection mode.
 * In multiple selection mode selecting an item will add it to the selection.
 * If set to false selecting a new item will deselect previously selected item.
 * @param{boolean} isMultipleSelectionMode
 * @public
 */
ActionManager.prototype.SetIsMultipleSelectionMode = function (isMultipleSelectionMode)
{
    this.isMultipleSelectionMode_ = isMultipleSelectionMode;
};

/**
 * Sets the distance between the plane used for inserting a new vertex and the camera.
 * @param{number} insertDistance
 * @public
 */
ActionManager.prototype.SetInsertDistance = function (insertDistance)
{
    this.insertDistance_ = insertDistance;
};

/**
 * Returns the distance between the plane used for inserting a new vertex and the camera.
 * @return{number}
 * @public
 */
ActionManager.prototype.GetInsertDistance = function ()
{
    return this.insertDistance_;
};

/**
 * Given a 2D point, it will Insert a vertex at the equivalent 3D point
 * It assumes that the 2D point is in the plane facing the camera with a
 * distance specified by {@link ActionManager#insertDistance_}
 * @param{number} x - The x coordinate of the point
 * @param{number} y - The y coordinate of the point
 * @public
 */
ActionManager.prototype.InsertVertexFrom2D = function (x, y)
{
    if (START_PANEL_MANAGER.GetIsMerged() || START_PANEL_MANAGER.GetIsHistory())
        return;

    // Get the equivalent 3D point
    var targetPoint = RENDER_MANAGER.Get3DPointFrom2D(x, y, this.insertDistance_);

    var commandName = 'InsertVertex';
    var params = [];
    params.push('');
    params.push(targetPoint.x);
    params.push(targetPoint.y);
    params.push(targetPoint.z);

    var command = new Command(commandName, params);
    var result = GRAPH.ProcessCommand(command, false);
    INTERFACE_MANAGER.UpdateInformation();

    params[0] = result;
    WEB_SERVICE.RunCommand(commandName, params);
};

/**
 * Given a 2D point, it will select a vertex or bend shown in that point
 * If no vertex or bend is in that position, the selection is cleared.
 * @param{number} x - The x coordinate of the point
 * @param{number} y - The y coordinate of the point
 * @public
 */
ActionManager.prototype.SelectFrom2D = function (x, y)
{
    if (START_PANEL_MANAGER.GetIsMerged() || START_PANEL_MANAGER.GetIsHistory())
        return;

    var itemToSelect = RENDER_MANAGER.SelectFrom2D(x, y);
    if (itemToSelect != null)
    {
        if (!this.isMultipleSelectionMode_)
            this.ClearSelection();

        GRAPH.Select(itemToSelect);
        INTERFACE_MANAGER.UpdateInformation();
    }
    else
        this.ClearSelection();
};

/**
 * Given a 2D point, it will highlight a vertex or bend shown in that point
 * @param{number} x - The x coordinate of the point
 * @param{number} y - The y coordinate of the point
 * @public
 */
ActionManager.prototype.HighlightFrom2D = function (x, y)
{
    if (START_PANEL_MANAGER.GetIsMerged() || START_PANEL_MANAGER.GetIsHistory())
        return;

    var itemToSelect = RENDER_MANAGER.SelectFrom2D(x, y);
    if (itemToSelect != null)
        GRAPH.SetHighlightedItem(itemToSelect);
    else
        GRAPH.SetHighlightedItem(null);
};

/**
 * Given a 2D point, connects or disconnects the previously vertex to the vertex
 * shown at this point. If multiple edges are not allowed and the two vertices
 * are currently connected, they will be disconnected, otherwise a new edge is
 * added between them.
 * @param{number} x - The x coordinate of the point
 * @param{number} y - The y coordinate of the point
 * @public
 */
ActionManager.prototype.ConnectOrDisconnectFrom2D = function (x, y)
{
    if (START_PANEL_MANAGER.GetIsMerged() || START_PANEL_MANAGER.GetIsHistory())
        return;

    var currentVertex = GRAPH.GetSelection()[0];
    var itemToConnect = RENDER_MANAGER.SelectFrom2D(x, y);

    if (itemToConnect == null)
        return;
    if (!(itemToConnect instanceof Vertex))
        return;
    if (itemToConnect.GetID() == currentVertex.GetID())
        return;

    var isMultipleEdgesAllowed = RENDER_MANAGER.GetEngine().IsMultipleEdgesAllowed();

    if (!isMultipleEdgesAllowed)
    {
        var edge = itemToConnect.GetConnectingEdge(currentVertex);
        if (edge != null)
        {
            var edgeID = edge.GetID();
            this.ClearSelection();

            var commandName = 'RemoveEdge';
            var params = [];
            params.push(edgeID);

            var command = new Command(commandName, params);
            var result = GRAPH.ProcessCommand(command, false);
            INTERFACE_MANAGER.UpdateInformation();

            params[2] = result;
            WEB_SERVICE.RunCommand(commandName, params);
            return;
        }
    }

    this.ClearSelection();

    var commandName = 'InsertEdge';
    var params = [];
    params.push(currentVertex.GetID());
    params.push(itemToConnect.GetID());
    params.push('');

    var command = new Command(commandName, params);
    var result = GRAPH.ProcessCommand(command, false);
    INTERFACE_MANAGER.UpdateInformation();

    params[2] = result;
    WEB_SERVICE.RunCommand(commandName, params);
};

/**
 * Connects the first two selected vertices
 * @public
 */
ActionManager.prototype.ConnectTwoVertices = function ()
{
    if (START_PANEL_MANAGER.GetIsMerged() || START_PANEL_MANAGER.GetIsHistory())
        return;

    var currentVertex = GRAPH.GetSelection()[0];
    var itemToConnect = GRAPH.GetSelection()[1];

    this.ClearSelection();

    var commandName = 'InsertEdge';
    var params = [];
    params.push(currentVertex.GetID());
    params.push(itemToConnect.GetID());
    params.push('');

    var command = new Command(commandName, params);
    var result = GRAPH.ProcessCommand(command, false);
    INTERFACE_MANAGER.UpdateInformation();

    params[2] = result;
    WEB_SERVICE.RunCommand(commandName, params);
};

/**
 * Given a 2D point, moves the selected vertex or bend to the equivalent 3D point
 * It assumes that the 2D point is in a plane facing
 * @param{number} x - The x coordinate of the point
 * @param{number} y - The y coordinate of the point
 * @return{boolean} whether any move has been made
 * @public
 */
ActionManager.prototype.MoveFrom2D = function (x, y)
{
    if (START_PANEL_MANAGER.GetIsMerged() || START_PANEL_MANAGER.GetIsHistory())
        return false;

    var selectionType = GRAPH.GetSelectionType();

    if (selectionType == SELECTION_TYPE.SingleVertex ||
        selectionType == SELECTION_TYPE.SingleBend)
    {
        var item = GRAPH.GetSelection()[0];
        var planeDistance = RENDER_MANAGER.ItemPlaneDistance(item);
        item.SetPosition(RENDER_MANAGER.Get3DPointFrom2D(x, y, planeDistance));
        INTERFACE_MANAGER.UpdateInformation();
        return true;
    }

    return false;
};

/**
 * Send the moves for the selection to the server
 * @public
 */
ActionManager.prototype.SendSelectionMoves = function ()
{
    if (START_PANEL_MANAGER.GetIsMerged() || START_PANEL_MANAGER.GetIsHistory())
        return;

    for (var i = 0; i < GRAPH.GetSelection().length; i++)
    {
        var item = GRAPH.GetSelection()[i];

        var params = [];
        var commandName = 'MoveVertex';
        if (item instanceof Bend)
        {
            commandName = 'MoveBend';
            params.push(item.GetEdge().GetID());
            params.push(item.GetIndex());
        }
        else
            params.push(item.GetID());

        var position = item.GetPosition();

        params.push(position.x);
        params.push(position.y);
        params.push(position.z);

        WEB_SERVICE.RunCommand(commandName, params);
    }
};

/**
 * Clears the selection
 * @public
 */
ActionManager.prototype.ClearSelection = function ()
{
    if (START_PANEL_MANAGER.GetIsMerged() || START_PANEL_MANAGER.GetIsHistory())
        return;

    GRAPH.ClearSelection();
    INTERFACE_MANAGER.UpdateInformation();
};

/**
 * Moves selection or camera up or down.
 * @param{number} moveStep - The amount of movement. It can be negative.
 * @public
 */
ActionManager.prototype.MoveUp = function (moveStep)
{
    var selectionType = GRAPH.GetSelectionType();

    if (this.isPerformOnCamera_ || selectionType == SELECTION_TYPE.None)
    {
        RENDER_MANAGER.MoveCameraUp(moveStep);
        INTERFACE_MANAGER.UpdateInformation();

        if (START_PANEL_MANAGER.GetIsSendCamera())
        {
            var params = [];
            var commandName = 'ChangeCameraPosition';
            var position = GRAPH.GetCameraPosition();
            params.push(position.x);
            params.push(position.y);
            params.push(position.z);

            WEB_SERVICE.RunCommand(commandName, params);
        }
    }
    else if (!START_PANEL_MANAGER.GetIsMerged() && !START_PANEL_MANAGER.GetIsHistory())
    {
        for (var i = 0; i < GRAPH.GetSelection().length; i++)
        {
            var item = GRAPH.GetSelection()[i];
            RENDER_MANAGER.MoveItemUp(item, moveStep);
            INTERFACE_MANAGER.UpdateInformation();
        }

        this.SendSelectionMoves();
    }
};

/**
 * Moves selection or camera right or left.
 * @param{number} moveStep - The amount of movement. It can be negative.
 * @public
 */
ActionManager.prototype.MoveRight = function (moveStep)
{

    var selectionType = GRAPH.GetSelectionType();

    if (this.isPerformOnCamera_ || selectionType == SELECTION_TYPE.None)
    {
        RENDER_MANAGER.MoveCameraRight(moveStep);
        INTERFACE_MANAGER.UpdateInformation();

        if (START_PANEL_MANAGER.GetIsSendCamera())
        {
            var params = [];
            var commandName = 'ChangeCameraPosition';
            var position = GRAPH.GetCameraPosition();
            params.push(position.x);
            params.push(position.y);
            params.push(position.z);

            WEB_SERVICE.RunCommand(commandName, params);
        }
    }
    else if (!START_PANEL_MANAGER.GetIsMerged() && !START_PANEL_MANAGER.GetIsHistory())
    {
        for (var i = 0; i < GRAPH.GetSelection().length; i++)
        {
            var item = GRAPH.GetSelection()[i];
            RENDER_MANAGER.MoveItemRight(item, moveStep);
            INTERFACE_MANAGER.UpdateInformation();
        }

        this.SendSelectionMoves();
    }
};

/**
 * Rotates selection or camera up or down.
 * @param{number} angle - The amount of rotation. It can be negative.
 * @public
 */
ActionManager.prototype.RotateUp = function (angle)
{
    var selectionType = GRAPH.GetSelectionType();

    if (this.isPerformOnCamera_ || selectionType == SELECTION_TYPE.None)
    {
        RENDER_MANAGER.RotateCameraUp(angle);
        INTERFACE_MANAGER.UpdateInformation();

        if (START_PANEL_MANAGER.GetIsSendCamera())
        {
            var params = [];
            var commandName = 'ChangeCameraRotation';
            var quaternion = GRAPH.GetCameraQuaternion();
            params.push(quaternion.x);
            params.push(quaternion.y);
            params.push(quaternion.z);
            params.push(quaternion.w);

            WEB_SERVICE.RunCommand(commandName, params);
        }
    }
    else if (selectionType == SELECTION_TYPE.SingleVertex && !START_PANEL_MANAGER.GetIsMerged() && !START_PANEL_MANAGER.GetIsHistory())
    {
        var vertex = GRAPH.GetSelection()[0];
        RENDER_MANAGER.RotateVertexUp(vertex, angle);
        INTERFACE_MANAGER.UpdateInformation();
        var params = [];
        var commandName = 'ChangeVertexRotation';
        var quaternion = vertex.GetRotation();
        params.push(vertex.GetID());
        params.push(quaternion.x);
        params.push(quaternion.y);
        params.push(quaternion.z);
        params.push(quaternion.w);

        WEB_SERVICE.RunCommand(commandName, params);
    }
};

/**
 * Rotates selection or camera right or left.
 * @param{number} angle - The amount of rotation. It can be negative.
 * @public
 */
ActionManager.prototype.RotateRight = function (angle)
{
    var selectionType = GRAPH.GetSelectionType();

    if (this.isPerformOnCamera_ || selectionType == SELECTION_TYPE.None)
    {
        RENDER_MANAGER.RotateCameraRight(angle);
        INTERFACE_MANAGER.UpdateInformation();

        if (START_PANEL_MANAGER.GetIsSendCamera())
        {
            var params = [];
            var commandName = 'ChangeCameraRotation';
            var quaternion = GRAPH.GetCameraQuaternion();
            params.push(quaternion.x);
            params.push(quaternion.y);
            params.push(quaternion.z);
            params.push(quaternion.w);

            WEB_SERVICE.RunCommand(commandName, params);
        }
    }
    else if (selectionType == SELECTION_TYPE.SingleVertex && !START_PANEL_MANAGER.GetIsMerged() && !START_PANEL_MANAGER.GetIsHistory())
    {
        var vertex = GRAPH.GetSelection()[0];
        RENDER_MANAGER.RotateVertexRight(vertex, angle);
        INTERFACE_MANAGER.UpdateInformation();
        var params = [];
        var commandName = 'ChangeVertexRotation';
        var quaternion = vertex.GetRotation();
        params.push(vertex.GetID());
        params.push(quaternion.x);
        params.push(quaternion.y);
        params.push(quaternion.z);
        params.push(quaternion.w);

        WEB_SERVICE.RunCommand(commandName, params);
    }
};

/**
 * Moves selection or camera forward or backward.
 * @param{number} moveStep - The amount of movement. It can be negative.
 * @public
 */
ActionManager.prototype.MoveForward = function (moveStep)
{
    var selectionType = GRAPH.GetSelectionType();

    if (this.isPerformOnCamera_ || selectionType == SELECTION_TYPE.None)
    {
        RENDER_MANAGER.MoveCameraForward(moveStep);
        INTERFACE_MANAGER.UpdateInformation();

        if (START_PANEL_MANAGER.GetIsSendCamera())
        {
            var params = [];
            var commandName = 'ChangeCameraPosition';
            var position = GRAPH.GetCameraPosition();
            params.push(position.x);
            params.push(position.y);
            params.push(position.z);

            WEB_SERVICE.RunCommand(commandName, params);
        }
    }
    else if (!START_PANEL_MANAGER.GetIsMerged() && !START_PANEL_MANAGER.GetIsHistory())
    {
        for (var i = 0; i < GRAPH.GetSelection().length; i++)
        {
            var item = GRAPH.GetSelection()[i];
            RENDER_MANAGER.MoveItemForward(item, moveStep);
            INTERFACE_MANAGER.UpdateInformation();
        }

        this.SendSelectionMoves();
    }
};

/**
 * Given a 2D point, it will Insert a bend at the equivalent 3D point
 * It assumes that the 2D point is in the plane facing the camera with a specified distance
 * @param{number} x - The x coordinate of the point
 * @param{number} y - The y coordinate of the point
 * @param{number} distance - The distance of the plane from camera
 * @public
 */
ActionManager.prototype.BendFrom2D = function (x, y, distance)
{
    if (START_PANEL_MANAGER.GetIsMerged() || START_PANEL_MANAGER.GetIsHistory())
        return;

    var start = GRAPH.GetSelection()[0];
    var end = GRAPH.GetSelection()[1];
    var targetPoint = RENDER_MANAGER.Get3DPointFrom2D(x, y, distance);

    var startIndex = -1;
    if (start instanceof Bend)
        startIndex = start.GetIndex();

    var endIndex = -1;
    if (end instanceof Bend)
        endIndex = end.GetIndex();

    var edge = null;
    var index = 0;
    if (startIndex != -1)
    {
        edge = start.GetEdge();
        if (endIndex != -1)
            index = Math.min(startIndex, endIndex) + 1;
        else if (edge.GetStartVertex().GetID() == end.GetID())
            index = startIndex;
        else
            index = startIndex + 1;
    }
    else if (endIndex != -1)
    {
        edge = end.GetEdge();
        if (edge.GetStartVertex().GetID() == start.GetID())
            index = endIndex;
        else
            index = endIndex + 1;
    }
    else
    {
        edge = GRAPH.GetSelectedEdge();
    }

    if (edge == null)
        return;


    var commandName = 'BreakEdgeLine';
    var params = [];
    params.push(edge.GetID());
    params.push(index);
    params.push(targetPoint.x);
    params.push(targetPoint.y);
    params.push(targetPoint.z);

    var command = new Command(commandName, params);
    GRAPH.ProcessCommand(command, false);

    WEB_SERVICE.RunCommand(commandName, params);

    var bend = edge.GetEdgeLines()[index].GetEnd();
    this.ChangeActionMode('None');
    GRAPH.Select(bend);
    INTERFACE_MANAGER.UpdateInformation();

};

/**
 * Given a 3D point, it will Insert a bend at that point
 * @param{number} x - The x coordinate of the point
 * @param{number} y - The y coordinate of the point
 * @param{number} z - The z coordinate of the point
 * @public
 */
ActionManager.prototype.BendFrom3D = function (x, y, z)
{
    if (START_PANEL_MANAGER.GetIsMerged() || START_PANEL_MANAGER.GetIsHistory())
        return;

    var start = GRAPH.GetSelection()[0];
    var end = GRAPH.GetSelection()[1];
    var targetPoint = new THREE.Vector3(x, y, z);

    var startIndex = -1;
    if (start instanceof Bend)
        startIndex = start.GetIndex();

    var endIndex = -1;
    if (end instanceof Bend)
        endIndex = end.GetIndex();

    var edge = null;
    var index = 0;
    if (startIndex != -1)
    {
        edge = start.GetEdge();
        if (endIndex != -1)
            index = Math.min(startIndex, endIndex) + 1;
        else if (edge.GetStartVertex().GetID() == end.GetID())
            index = startIndex;
        else
            index = startIndex + 1;
    }
    else if (endIndex != -1)
    {
        edge = end.GetEdge();
        if (edge.GetStartVertex().GetID() == start.GetID())
            index = endIndex;
        else
            index = endIndex + 1;
    }
    else
    {
        edge = GRAPH.GetSelectedEdge();
    }

    if (edge == null)
        return;


    var commandName = 'BreakEdgeLine';
    var params = [];
    params.push(edge.GetID());
    params.push(index);
    params.push(targetPoint.x);
    params.push(targetPoint.y);
    params.push(targetPoint.z);

    var command = new Command(commandName, params);
    GRAPH.ProcessCommand(command, false);
    INTERFACE_MANAGER.UpdateInformation();

    WEB_SERVICE.RunCommand(commandName, params);
};

/**
 * Removes the selected vertices, bends or edges
 * @public
 */
ActionManager.prototype.DeleteSelected = function ()
{
    if (START_PANEL_MANAGER.GetIsMerged() || START_PANEL_MANAGER.GetIsHistory())
        return;

    if (GRAPH.GetSelectedEdge() != null)
    {
        var edgeID = GRAPH.GetSelectedEdge().GetID();
        this.ClearSelection();

        var commandName = 'RemoveEdge';
        var params = [];
        params.push(edgeID);

        var command = new Command(commandName, params);
        var result = GRAPH.ProcessCommand(command, false);
        INTERFACE_MANAGER.UpdateInformation();

        params[2] = result;
        WEB_SERVICE.RunCommand(commandName, params);
        return;
    }

    var selection = [];
    for (var i = 0; i < GRAPH.GetSelection().length; i++)
        selection.push(GRAPH.GetSelection()[i]);

    for (var i = 0; i < selection.length; i++)
    {
        var item = selection[i];
        var commandName = '';
        var params = [];
        if (item instanceof Vertex)
        {
            commandName = 'RemoveVertex';
            params.push(item.GetID());
        }
        else if (item instanceof Edge)
        {
            commandName = 'RemoveEdge';
            params.push(item.GetID());
        }
        else if (item instanceof Bend)
        {
            commandName = 'RemoveBend';
            params.push(item.GetEdge().GetID());
            params.push(item.GetIndex());
        }
        else
            continue;

        var command = new Command(commandName, params);
        GRAPH.ProcessCommand(command, false);
        INTERFACE_MANAGER.UpdateInformation();

        WEB_SERVICE.RunCommand(commandName, params);
    }
};

/**
 * Changes the action mode. Possible modes are:
 *
 * None: The default mode. Clicking an item will select that item.
 * Right clicking a second vertex wil connect the first one to it.
 * If it is possible to add a bend between current selection,
 * right click will add a new bend.
 *
 * Insert: Insertion mode. A dummy vertex is shown to depict the position
 * of the new vertex.
 *
 * Connect: Used for input devices other than mouse. Clicking the second vertex,
 * will connect the first one to it.
 *
 * Bend : Used for input devices other than mouse. If it is possible to add a
 * bend between current selection, click will add a new bend.
 *
 * @param{string} mode
 * @public
 */
ActionManager.prototype.ChangeActionMode = function (mode)
{
    this.actionMode_ = mode;
    if (this.actionMode_ != 'Insert')
        RENDER_MANAGER.SetIsInsertMode(false);

    if (this.actionMode_ != 'Bend')
        this.ClearSelection();

    if (BORDER_MANAGER != null)
        BORDER_MANAGER.UpdateActionMode();
};

/**
 * Returns the action mode for the ActionManager.
 * See {@link ActionManager#ChangeActionMode} for further information.
 * @return{string}
 * @public
 */
ActionManager.prototype.GetActionMode = function ()
{
    return this.actionMode_;
};

/**
 * If multiple edges are allowed, selects the next edge between two vertices
 * @public
 */
ActionManager.prototype.NextEdge = function ()
{
    if (START_PANEL_MANAGER.GetIsMerged() || START_PANEL_MANAGER.GetIsHistory())
        return;

    if (GRAPH.GetSelectedEdge() != null)
        GRAPH.GetSelectedEdge().SelectNextEdge();
};

/**
 * Changes a property of a vertex or an edge. See {@link Vertex#UpdateProperty}
 * for more details.
 * @param{(Vertex|Edge)} item - The vertex or edge to change the property of
 * @param{string} listName - See {@link Vertex#UpdateProperty}
 * @param{string} name - See {@link Vertex#UpdateProperty}
 * @param{(string|null)} value - See {@link Vertex#UpdateProperty}
 * @param{boolean} needUpdate - Whether the change requires render update
 * @public
 */
ActionManager.prototype.ChangeProperty = function (item, listName, name, value, needUpdate)
{
    if (START_PANEL_MANAGER.GetIsMerged() || START_PANEL_MANAGER.GetIsHistory())
        return;


    item.UpdateProperty(listName, name, value);

    var commandName = 'SetVertexProperty';
    if (item instanceof Edge)
        commandName = 'SetEdgeProperty';

    var params = [];
    params.push(item.GetID());
    params.push(listName);
    params.push(name);
    params.push(value);
    if (needUpdate)
        params.push('1');
    else
        params.push('0');

    var command = new Command(commandName, params);
    GRAPH.ProcessCommand(command, false);

    WEB_SERVICE.RunCommand(commandName, params);
};

/**
 * Scale the selected vertex to the specified value
 * @param{number} scale - The new scale value
 * @public
 */
ActionManager.prototype.ScaleSelected = function (scale)
{
    if (START_PANEL_MANAGER.GetIsMerged() || START_PANEL_MANAGER.GetIsHistory())
        return;

    var selectionType = GRAPH.GetSelectionType();
    if (selectionType == SELECTION_TYPE.SingleVertex)
    {
        var vertex = GRAPH.GetSelection()[0];
        vertex.SetScale(scale);

        var commandName = 'ChangeVertexScale';
        var params = [];
        params.push(vertex.GetID());
        params.push(vertex.GetScale());

        WEB_SERVICE.RunCommand(commandName, params);
    }
};

/**
 * Moves the selected vertex or bend to a new position
 * @param{THREE.Vector3} position - The new position
 * @public
 */
ActionManager.prototype.MoveSelected = function (position)
{
    if (START_PANEL_MANAGER.GetIsMerged() || START_PANEL_MANAGER.GetIsHistory())
        return;

    var selectionType = GRAPH.GetSelectionType();
    if (selectionType == SELECTION_TYPE.SingleVertex ||
        selectionType == SELECTION_TYPE.SingleBend)
    {
        GRAPH.GetSelection()[0].SetPosition(position);
        INTERFACE_MANAGER.UpdateInformation();
        this.SendSelectionMoves();
    }
};

/**
 * Exists the current graph and shows the start panel manager.
 * @public
 */
ActionManager.prototype.ExistGraph = function ()
{
    WEB_SERVICE.StopGraph();
    RENDER_MANAGER.Stop();
    GRAPH = new Graph();
    if (KEYBOARD_MANAGER != null)
        KEYBOARD_MANAGER.Stop();
    var HTMLBody = document.getElementsByTagName('body')[0];
    $(HTMLBody).empty();
    START_PANEL_MANAGER.Display(HTMLBody);
};

/**
 * Changes the camera roatation quaternion
 * @param{number} x - The x element of quaternion
 * @param{number} y - The y element of quaternion
 * @param{number} z - The z element of quaternion
 * @param{number} w - The w element of quaternion
 * @public
 */
ActionManager.prototype.ChangeCameraQuaternion = function (x, y, z, w)
{
    var quaternion = new THREE.Quaternion(x, y, z, w);
    GRAPH.SetCameraQuaternion(quaternion);
    INTERFACE_MANAGER.UpdateInformation();

    if (START_PANEL_MANAGER.GetIsSendCamera())
    {
        var params = [];
        var commandName = "ChangeCameraRotation";
        params.push(quaternion.x);
        params.push(quaternion.y);
        params.push(quaternion.z);
        params.push(quaternion.w);

        WEB_SERVICE.RunCommand(commandName, params);
    }
};

/**
 * Moves selection or camera forward or backward.
 * @param{number} moveStep - The amount of movement. It can be negative.
 * @public
 */
ActionManager.prototype.MoveCameraForward = function (moveStep)
{
    RENDER_MANAGER.MoveCameraForward(moveStep);
    INTERFACE_MANAGER.UpdateInformation();

    if (START_PANEL_MANAGER.GetIsSendCamera())
    {
        var params = [];
        var commandName = "ChangeCameraPosition";
        var position = GRAPH.GetCameraPosition();
        params.push(position.x);
        params.push(position.y);
        params.push(position.z);

        WEB_SERVICE.RunCommand(commandName, params);
    }
};