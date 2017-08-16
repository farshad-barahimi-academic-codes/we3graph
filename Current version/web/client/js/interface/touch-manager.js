/**
 * The TouchManager class.
 * The main class for handling touch interactions
 * @constructor
 */
function TouchManager()
{
    /** Whether the selection has been moved
     * It is used to send move commands when necessary
     * @private
     * @type {boolean} */
    this.hasMoved_ = false;
}

/**
 * Starts handling touch events
 * @public
 */
TouchManager.prototype.Start = function ()
{
    var myclass = this;

    $(document.documentElement).bind('contextmenu', function (e)
    {
        return false;
    });

    var elementToHandle = RENDER_MANAGER.GetRenderDiv();
    this.Offset = $(elementToHandle).offset();

    $(elementToHandle).on({
        'touchstart': function (e)
        {
            myclass.onTouchStart.call(myclass, e);
        }
    });

    $(elementToHandle).on({
        'touchmove': function (e)
        {
            myclass.onTouchMove.call(myclass, e);
        }
    });

    $(elementToHandle).on({
        'touchend': function (e)
        {
            myclass.onTouchEnd.call(myclass, e);
        }
    });
};

/**
 * This method is fired on in response to the touch start event
 * @private
 */
TouchManager.prototype.onTouchStart = function (e)
{
    e.preventDefault();
    e.stopPropagation();

    var touches = e.originalEvent.touches;

    var x = -1;
    var y = -1;
    for (var i = 0; i < touches.length; i++)
    {
        var x1 = touches[i].pageX - this.Offset.left;
        var y1 = touches[i].pageY - this.Offset.top;
        if (x1 >= 0 && y1 >= 0 && x1 <= RENDER_MANAGER.Width &&
            y1 <= RENDER_MANAGER.Height)
        {
            x = x1;
            y = y1;
        }
    }

    if (x < 0 && y < 0)
        return;

    this.hasMoved_ = false;

    var selectionType = GRAPH.GetSelectionType();

    if (ACTION_MANAGER.GetActionMode() == 'Insert')
        ACTION_MANAGER.InsertVertexFrom2D(x, y);
    else if (ACTION_MANAGER.GetActionMode() == 'None')
        ACTION_MANAGER.SelectFrom2D(x, y);
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
};

/**
 * This method is fired on in response to the touch move event
 * @private
 */
TouchManager.prototype.onTouchMove = function (e)
{
    e.preventDefault();
    e.stopPropagation();

    if (ACTION_MANAGER.GetActionMode() != 'None')
        return;

    var touches = e.originalEvent.touches;

    var x = -1;
    var y = -1;
    for (var i = 0; i < touches.length; i++)
    {
        var x1 = touches[i].pageX - this.Offset.left;
        var y1 = touches[i].pageY - this.Offset.top;
        if (x1 >= 0 && y1 >= 0 && x1 <= RENDER_MANAGER.Width &&
            y1 <= RENDER_MANAGER.Height)
        {
            x = x1;
            y = y1;
        }
    }

    if (x < 0 && y < 0)
        return;

    this.hasMoved_ = ACTION_MANAGER.MoveFrom2D(x, y);
};

/**
 * This method is fired on in response to the touch end event
 * @private
 */
TouchManager.prototype.onTouchEnd = function (e)
{
    e.preventDefault();
    e.stopPropagation();

    if (this.hasMoved_)
    {
        ACTION_MANAGER.SendSelectionMoves();
        this.hasMoved_ = false;
    }
};