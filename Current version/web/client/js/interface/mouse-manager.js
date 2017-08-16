/**
 * The MouseManager class.
 * The main class for handling mouse interactions
 * @constructor
 */
function MouseManager()
{
    /** Whether the left mouse button is pressed
     * @private
     * @type {boolean} */
    this.isLeftMouseDown_ = false;

    /** Whether the selection has been moved
     * It is used to send move commands when necessary
     * @private
     * @type {boolean} */
    this.hasMoved_ = false;
}

/**
 * Starts handling mouse events
 * @public
 */
MouseManager.prototype.Start = function ()
{
    var myclass = this;

    $(document.documentElement).bind('contextmenu', function (e)
    {
        return false;
    });

    var elementToHandle = RENDER_MANAGER.GetRenderDiv();
    this.Offset = $(elementToHandle).offset();

    $(elementToHandle).mousedown(function (e)
    {
        myclass.onMouseDown.call(myclass, e);
    });

    $(elementToHandle).mouseup(function (e)
    {
        myclass.onMouseUp.call(myclass, e);
    });

    $(elementToHandle).mousemove(function (e)
    {
        myclass.onMouseMove.call(myclass, e);
    });

    $(elementToHandle).mouseout(function (e)
    {
        myclass.onMouseOut.call(myclass, e);
    });

    // IE9, Chrome, Safari, Opera
    elementToHandle.addEventListener('mousewheel', function (event)
    {
        myclass.onWheel(event);
    }, false);
    // Firefox
    elementToHandle.addEventListener('DOMMouseScroll', function (event)
    {
        myclass.onWheel(event);
    }, false);
};

/**
 * This method is fired on in response to the mouse wheel event
 * @private
 */
MouseManager.prototype.onWheel = function (e)
{
    e.preventDefault();
    e.stopPropagation();

    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

    if (ACTION_MANAGER.GetActionMode() == 'Insert' &&
        RENDER_MANAGER.GetIsInsertMode())
    {
        ACTION_MANAGER.SetInsertDistance(
                ACTION_MANAGER.GetInsertDistance() + delta * 10);
        RENDER_MANAGER.MoveDummyVertex(this.LastX, this.LastY,
            ACTION_MANAGER.GetInsertDistance());
    }
    else
        ACTION_MANAGER.MoveForward(delta * 10);

};

/**
 * This method is fired on in response to the mouse up event
 * @private
 */
MouseManager.prototype.onMouseUp = function (e)
{
    e.preventDefault();
    e.stopPropagation();

    if (e.which == 1)
    {
        if (this.hasMoved_)
            ACTION_MANAGER.SendSelectionMoves();
        this.hasMoved_ = false;
        this.isLeftMouseDown_ = false;
        $('.FloatingInfoDiv').css('display', 'none');
    }

};

/**
 * This method is fired on in response to the mouse out event
 * @private
 */
MouseManager.prototype.onMouseOut = function (e)
{
    e.preventDefault();
    e.stopPropagation();

    if (e.which == 1)
    {
        if (this.hasMoved_)
            ACTION_MANAGER.SendSelectionMoves();
        this.hasMoved_ = false;
        this.isLeftMouseDown_ = false;
        $('.FloatingInfoDiv').css('display', 'none');
    }
};

/**
 * This method is fired on in response to the mouse move event
 * @private
 */
MouseManager.prototype.onMouseMove = function (e)
{
    e.preventDefault();
    e.stopPropagation();

    var x = e.pageX - this.Offset.left;
    var y = e.pageY - this.Offset.top;

    ACTION_MANAGER.HighlightFrom2D(x, y);
    if (ACTION_MANAGER.GetActionMode() == 'Insert')
    {
        this.LastX = x;
        this.LastY = y;
        RENDER_MANAGER.SetIsInsertMode(true);
        RENDER_MANAGER.MoveDummyVertex(x, y, ACTION_MANAGER.GetInsertDistance());
    }
    else if (ACTION_MANAGER.GetActionMode() == 'None')
    {
        if (this.isLeftMouseDown_)
        {

            this.hasMoved_ = ACTION_MANAGER.MoveFrom2D(x, y);
            $('.FloatingInfoDiv').css('left', x + 10 + 'px');
            $('.FloatingInfoDiv').css('top', y + 10 + 'px');
        }
    }

};

/**
 * This method is fired on in response to the mouse down event
 * @private
 */
MouseManager.prototype.onMouseDown = function (e)
{
    e.preventDefault();
    e.stopPropagation();

    var x = e.pageX - this.Offset.left;
    var y = e.pageY - this.Offset.top;

    var selectionType = GRAPH.GetSelectionType();

    if (e.which == 1)
    {
        this.hasMoved_ = false;
        this.isLeftMouseDown_ = true;

        if (ACTION_MANAGER.GetActionMode() == 'Insert')
            ACTION_MANAGER.InsertVertexFrom2D(x, y);
        else if (ACTION_MANAGER.GetActionMode() == 'None')
        {
            ACTION_MANAGER.SelectFrom2D(x, y);
            $('.FloatingInfoDiv').css('left', x + 10 + 'px');
            $('.FloatingInfoDiv').css('top', y + 10 + 'px');
            $('.FloatingInfoDiv').css('display', 'block');
        }
        else if (ACTION_MANAGER.GetActionMode() == 'Connect')
        {
            if (selectionType == SELECTION_TYPE.None)
                ACTION_MANAGER.SelectFrom2D(x, y);
            else if (selectionType == SELECTION_TYPE.SingleVertex)
                ACTION_MANAGER.ConnectOrDisconnectFrom2D(x, y);
        }
        else if (ACTION_MANAGER.GetActionMode() == 'Bend')
        {
            if (GRAPH.GetHighlightedItem() != null)
                ACTION_MANAGER.SelectFrom2D(x, y);
            else if (selectionType == SELECTION_TYPE.ConnectedBendBend
                || selectionType == SELECTION_TYPE.ConnectedBendVertex ||
                selectionType == SELECTION_TYPE.SingleEdge)
                ACTION_MANAGER.BendFrom2D(x, y, 300);
        }
        return;
    }

    if (e.which == 3)
    {
        if (ACTION_MANAGER.GetActionMode() == 'None')
        {
            if (selectionType == SELECTION_TYPE.SingleVertex)
                ACTION_MANAGER.ConnectOrDisconnectFrom2D(x, y);
            else if (selectionType == SELECTION_TYPE.ConnectedBendBend
                || selectionType == SELECTION_TYPE.ConnectedBendVertex ||
                selectionType == SELECTION_TYPE.SingleEdge)
                ACTION_MANAGER.BendFrom2D(x, y, 300);
        }
        else
            ACTION_MANAGER.ChangeActionMode('None');
    }
};