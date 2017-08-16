/**
 * The KeyboardManager class.
 * The main class for handling keyboard interactions
 * @constructor
 */
function KeyboardManager()
{

    /** The index of last selected vertex , -1 if none
     * @private
     * @type {number} */
    this.tabIndex_ = -1; //

    /** The index of last edge when selecting first bend in edges around a
     * special vertex
     * @private
     * @type {number} */
    this.edgeAroundVertexIndex_ = -1;
}

/**
 * Starts handling keyboard events
 * @public
 */
KeyboardManager.prototype.Start = function ()
{
    var myclass = this;
    var elementToHandle = document.documentElement;

    $(elementToHandle).keydown(function (event)
    {
        myclass.onKeyDown(event);
    });
    $(elementToHandle).keyup(function (event)
    {
        myclass.onKeyUp(event);
    });
};

/**
 * Stops handling keyboard events
 * @public
 */
KeyboardManager.prototype.Stop = function ()
{
    var elementToHandle = document.documentElement;
    $(elementToHandle).unbind();
};

/**
 * This method is fire in response to key down event
 * @private
 */
KeyboardManager.prototype.onKeyDown = function (event)
{
    // the amount of movement when a move button is pressed
    var moveStep = 5;

    // the amount of rotation when a rotation button is pressed
    var rotateStep = 0.01;

    if (event.keyCode == 37 || event.keyCode == 38 ||
        event.keyCode == 39 || event.keyCode == 40 ||
        event.keyCode == 9 || event.keyCode == 79)
    {
        event.preventDefault();
        event.stopPropagation();
    }

    if (event.keyCode == 38)
    { // Up arrow
        if (event.ctrlKey)
            ACTION_MANAGER.RotateUp(rotateStep);
        else if (event.shiftKey)
            ACTION_MANAGER.MoveUp(moveStep);
        else
            ACTION_MANAGER.MoveForward(moveStep);
    }

    if (event.keyCode == 40)
    { // Down arrow
        if (event.ctrlKey)
            ACTION_MANAGER.RotateUp(-rotateStep);
        else if (event.shiftKey)
            ACTION_MANAGER.MoveUp(-moveStep);
        else
            ACTION_MANAGER.MoveForward(-moveStep);
    }

    if (event.keyCode == 39)
    { // Right arrow
        if (event.ctrlKey)
            ACTION_MANAGER.RotateRight(-rotateStep);
        else
            ACTION_MANAGER.MoveRight(moveStep);
    }

    if (event.keyCode == 37)
    { // Left arrow
        if (event.ctrlKey)
            ACTION_MANAGER.RotateRight(rotateStep);
        else
            ACTION_MANAGER.MoveRight(-moveStep);
    }
};

/**
 * This method is fire in response to key up event
 * @private
 */
KeyboardManager.prototype.onKeyUp = function (event)
{
    if (event.keyCode == 69 || event.keyCode == 87 ||
        event.keyCode == 81 || event.keyCode == 9 ||
        event.keyCode == 46)
    {
        event.preventDefault();
        event.stopPropagation();
    }

    if (event.keyCode == 79 && event.ctrlKey)
    { // Ctrl + O
        ACTION_MANAGER.ExistGraph();
    }

    if (START_PANEL_MANAGER.GetIsMerged() || START_PANEL_MANAGER.GetIsHistory())
        return;

    var selectionType = GRAPH.GetSelectionType();
    var selection = GRAPH.GetSelection();

    if (event.keyCode == 9)
    { // tab

        var lastItem = null;
        if (selection.length == 1 || selection.length == 2)
            if (selection[0] instanceof Vertex || selection[0] instanceof Bend)
                lastItem = selection[0];

        var vertices = GRAPH.GetVertices();
        this.tabIndex_ = (this.tabIndex_ + 1) % vertices.length;
        var vertex = vertices[this.tabIndex_];

        GRAPH.ClearSelection();

        if (event.shiftKey)
        {
            if (lastItem != null)
                GRAPH.Select(lastItem);
        }

        GRAPH.Select(vertex);
    }

    if (event.keyCode == 69)
    { // E
        if (selection.length > 0 && selection[0] instanceof Vertex)
        {
            if (selection.length > 2)
                return;

            var lastBend = null;
            if (selection.length == 2)
                if (selection[1] instanceof Bend)
                    lastBend = selection[1];
                else
                    return;

            var vertex = selection[0];
            var edges = vertex.GetEdges();
            this.edgeAroundVertexIndex_ = (this.edgeAroundVertexIndex_ + 1) %
                edges.length;
            var j = 0;
            while (edges[this.edgeAroundVertexIndex_].GetEdgeLines().length < 2 &&
                j < edges.length)
            {
                this.edgeAroundVertexIndex_ = (this.edgeAroundVertexIndex_ + 1) %
                    edges.length;
                j++;
            }
            if (j == edges.length) // no bends around the vertex
                return;

            var edge = edges[this.edgeAroundVertexIndex_];

            var bend = edge.GetEdgeLines()[0].GetEnd();
            if (edge.GetEndVertex().GetID() == vertex.GetID())
                bend = edge.GetEdgeLines()[edge.GetEdgeLines().length - 1].GetStart();

            if (lastBend == null)
                GRAPH.Select(bend);
            else
            {
                GRAPH.ClearSelection();
                GRAPH.Select(vertex);
                GRAPH.Select(bend);
            }
        }
    }

    if (event.keyCode == 87)
    { // W
        if (selection.length == 2)
        {
            if (selection[0] instanceof Vertex && selection[1] instanceof Bend)
            {
                var bend = selection[1];
                GRAPH.ClearSelection();
                GRAPH.Select(bend);
            }
            else
                return;
        }
        else if (selection.length == 1)
        {
            if (selection[0] instanceof Bend)
            {
                var bend = selection[0];
                var index = bend.GetIndex() + 1;
                if (index < bend.GetEdge().GetEdgeLines().length - 1)
                {
                    var newBend = bend.GetEdge().GetEdgeLines()[index].GetEnd();
                    if (!event.shiftKey)
                        GRAPH.ClearSelection();
                    GRAPH.Select(newBend);
                }
            }
        }
    }

    if (event.keyCode == 81)
    { // Q
        if (selection.length == 2)
        {
            if (selection[0] instanceof Vertex && selection[1] instanceof Bend)
            {
                var bend = selection[1];
                GRAPH.ClearSelection();
                GRAPH.Select(bend);
            }
            else
                return;
        }
        else if (selection.length == 1)
        {
            if (selection[0] instanceof Bend)
            {
                var bend = selection[0];
                var index = bend.GetIndex() - 1;
                if (index >= 0)
                {
                    var newBend = bend.GetEdge().GetEdgeLines()[index].GetEnd();
                    if (!event.shiftKey)
                        GRAPH.ClearSelection();
                    GRAPH.Select(newBend);
                }
            }
        }
    }

    if (event.keyCode == 32)
    { // Space
        if (selectionType == SELECTION_TYPE.None ||
            selectionType == SELECTION_TYPE.SingleVertex)
        {
            ACTION_MANAGER.SetInsertDistance(300);
            ACTION_MANAGER.InsertVertexFrom2D(RENDER_MANAGER.Width / 2,
                    RENDER_MANAGER.Height / 2);
        }
        else if (selectionType == SELECTION_TYPE.ConnectedBendBend ||
            selectionType == SELECTION_TYPE.ConnectedBendVertex ||
            selectionType == SELECTION_TYPE.SingleEdge)
        {
            var x = (selection[0].GetPosition().x + selection[1].GetPosition().x) / 2;
            var y = (selection[0].GetPosition().y + selection[1].GetPosition().y) / 2;
            var z = (selection[0].GetPosition().z + selection[1].GetPosition().z) / 2;

            if (selection[0] instanceof Vertex && selection[1] instanceof Vertex)
            {
                if (selection[0].IsConnectedTo(selection[1]))
                    ACTION_MANAGER.BendFrom3D(x, y, z);
                else
                    ACTION_MANAGER.ConnectTwoVertices();
            }
            else
                ACTION_MANAGER.BendFrom3D(x, y, z);
        }
    }

    if (event.keyCode == 46)
    { // Del
        ACTION_MANAGER.DeleteSelected();
    }

    if (event.keyCode == 80)
    { // P
        ACTION_MANAGER.NextEdge();
    }
};