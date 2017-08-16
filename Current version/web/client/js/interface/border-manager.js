/**
 * The BorderManager class.
 * This class is used to represent the rectangular toolbar on the border
 * @constructor
 * @param {object} container - the DOM element of the container element
 */
function BorderManager(container)
{
    this.buttons_ = [];

    /** The amount of movement when move buttons are pressed
     * @private
     * @type{number} */
    this.moveStep_ = 5;

    /** The amount of rotation when rotation buttons are pressed
     * @private
     * @type{number} */
    this.rotateStep_ = 0.005;


    ACCORDION_MANAGER = new AccordionManager();

    var mainDiv = document.createElement('div');
    mainDiv.className = 'BordersDiv';
    container.appendChild(mainDiv);

    $(mainDiv).css('top', 5 + 'px');
    $(mainDiv).css('left', 5 + 'px');


    this.UpdateSize();

    this.initTopElements(mainDiv);
    this.initLeftElements(mainDiv);
    this.initRightElements(mainDiv);
    this.initBottomElements(mainDiv);

    var myclass = this;
    setInterval(function ()
    {
        myclass.reactToButtons.call(myclass);
    }, 1000 / 24);

};

/**
 * Update the size border manager
 * @public
 */
BorderManager.prototype.UpdateSize = function ()
{
    $('.BordersDiv').css('width', INTERFACE_MANAGER.GetRenderWidth() - 2 * 5 + 'px');

    $('.BorderLeft,.BorderRight').css('height',
            INTERFACE_MANAGER.GetRenderHeight() - 2 * (60 + 5) + 'px');

    var accordionHeight = INTERFACE_MANAGER.GetRenderHeight() - 2 * (60 + 5) - 1;
    ACCORDION_MANAGER.Resize(accordionHeight);


    var accordionLeft = INTERFACE_MANAGER.GetRenderWidth() - 60 - 5 - 300;
    ACCORDION_MANAGER.Relocate(null, accordionLeft);


    var width = INTERFACE_MANAGER.GetRenderWidth() - 60 - 5;
    width = Math.round(width * 38 / 100 - 60);
    $('.StatusInfoDiv').css('width', width + 'px');
};

/**
 * Updates the action mode
 * See {@link ActionManager#ChangeActionMode} for more information
 * @public
 */
BorderManager.prototype.UpdateActionMode = function ()
{
    if (ACTION_MANAGER.GetActionMode() == 'None')
    {
        this.NoneModeButton.SetIsOn(true);
        this.NoneModeButton.SetIsReverseOn(false);
        this.NoneModeButton.Update();
        this.InsertModeButton.SetIsOn(false);
        this.InsertModeButton.SetIsReverseOn(false);
        this.InsertModeButton.Update();
        this.ConnectModeButton.SetIsOn(false);
        this.ConnectModeButton.SetIsReverseOn(false);
        this.ConnectModeButton.Update();
        this.BendModeButton.SetIsOn(false);
        this.BendModeButton.SetIsReverseOn(false);
        this.BendModeButton.Update();
    }
    else if (ACTION_MANAGER.GetActionMode() == 'Insert')
    {
        this.NoneModeButton.SetIsOn(false);
        this.NoneModeButton.SetIsReverseOn(false);
        this.NoneModeButton.Update();
        this.InsertModeButton.SetIsOn(true);
        this.InsertModeButton.SetIsReverseOn(false);
        this.InsertModeButton.Update();
        this.ConnectModeButton.SetIsOn(false);
        this.ConnectModeButton.SetIsReverseOn(false);
        this.ConnectModeButton.Update();
        this.BendModeButton.SetIsOn(false);
        this.BendModeButton.SetIsReverseOn(false);
        this.BendModeButton.Update();
    }
    else if (ACTION_MANAGER.GetActionMode() == 'Connect')
    {
        this.NoneModeButton.SetIsOn(false);
        this.NoneModeButton.SetIsReverseOn(false);
        this.NoneModeButton.Update();
        this.InsertModeButton.SetIsOn(false);
        this.InsertModeButton.SetIsReverseOn(false);
        this.InsertModeButton.Update();
        this.ConnectModeButton.SetIsOn(true);
        this.ConnectModeButton.SetIsReverseOn(false);
        this.ConnectModeButton.Update();
        this.BendModeButton.SetIsOn(false);
        this.BendModeButton.SetIsReverseOn(false);
        this.BendModeButton.Update();
    }
    else if (ACTION_MANAGER.GetActionMode() == 'Bend')
    {
        this.NoneModeButton.SetIsOn(false);
        this.NoneModeButton.SetIsReverseOn(false);
        this.NoneModeButton.Update();
        this.InsertModeButton.SetIsOn(false);
        this.InsertModeButton.SetIsReverseOn(false);
        this.InsertModeButton.Update();
        this.ConnectModeButton.SetIsOn(false);
        this.ConnectModeButton.SetIsReverseOn(false);
        this.ConnectModeButton.Update();
        this.BendModeButton.SetIsOn(true);
        this.BendModeButton.SetIsReverseOn(false);
        this.BendModeButton.Update();
    }

};


/**
 * Changes the network information
 * @param isConnected - Whether the network is connected or not
 * @param text - The text to be displayed
 * @public
 */
BorderManager.prototype.ChangeNetworkInfo = function (isConnected, text)
{
    this.NetworkInfoText.innerHTML = text;
    if (isConnected)
        $(this.ConnectedBox).css('background-color', 'green');
    else
        $(this.ConnectedBox).css('background-color', 'red');
};


/**
 * Changes the status info text
 * @param text - The status text
 * @public
 */
BorderManager.prototype.ChangeStatusInfo = function (text)
{
    this.StatusInfoDiv.innerHTML = text;
};


/**
 * Updates the zoom buttons
 * @public
 */
BorderManager.prototype.UpdateZoomButtons = function ()
{
    var selectionType = GRAPH.GetSelectionType();

    if (selectionType == SELECTION_TYPE.None || ACTION_MANAGER.GetIsPerformOnCamera())
    {
        this.ZoomInButton.ChangeIcon('images/icons/super-mono/zoom-in.png');
        this.ZoomOutButton.ChangeIcon('images/icons/super-mono/zoom-out.png');
    }
    else
    {
        this.ZoomInButton.ChangeIcon('images/icons/super-mono/navigation-up-frame.png');
        this.ZoomOutButton.ChangeIcon('images/icons/super-mono/navigation-down-frame.png');
    }
};

/**
 * Initializes the elements in the top side of the borders
 * @param mainDiv - the DOM elements of the main div of the border
 * @private
 */
BorderManager.prototype.initTopElements = function (mainDiv)
{
    var myclass = this;

    var container = document.createElement('div');
    container.className = 'BorderTop';
    mainDiv.appendChild(container);

    var buttonDiv = document.createElement('div');
    buttonDiv.className = 'BorderHorizontalButton';
    container.appendChild(buttonDiv);
    var button = new BorderButton(buttonDiv, true, false, this);
    this.buttons_.push(button);
    button.ToggleOnFunction = function ()
    {
        myclass.onWorldAxisButtonToggleOn.call(myclass);
    };
    button.ToggleOffFunction = function ()
    {
        myclass.onWorldAxisButtonToggleOff.call(myclass);
    };
    button.ChangeIcon('images/icons/super-mono/web.png');
    $(buttonDiv).css('position', 'absolute');
    $(buttonDiv).css('width', '60px');
    $(buttonDiv).css('left', '0px');
    $(buttonDiv).css('border-top-left-radius', '10px');
    button.EnableTooltip('World axis or camera axis movement');
    button.SetTooltipWidth(250);


    var buttonDiv = document.createElement('div');
    buttonDiv.className = 'BorderHorizontalButton';
    container.appendChild(buttonDiv);

    var button = new BorderButton(buttonDiv, true, false, this);
    this.buttons_.push(button);
    button.ToggleOnFunction = function ()
    {
        myclass.onNoneModeButtonToggleOn.call(myclass);
    };
    button.ToggleOffFunction = function ()
    {
        myclass.onInsertModeButtonToggleOff.call(myclass);
    };
    button.ChangeIcon('images/icons/super-mono/mouse.png');
    $(buttonDiv).css('position', 'absolute');
    $(buttonDiv).css('margin-left', 60 + 1 + 'px');
    $(buttonDiv).css('left', '0%');
    button.EnableTooltip('Normal mode');
    this.NoneModeButton = button;
    if (START_PANEL_MANAGER.GetIsMerged() || START_PANEL_MANAGER.GetIsHistory())
        $(buttonDiv).hide();

    var buttonDiv = document.createElement('div');
    buttonDiv.className = 'BorderHorizontalButton';
    container.appendChild(buttonDiv);
    var button = new BorderButton(buttonDiv, true, false, this);
    this.buttons_.push(button);
    button.ToggleOnFunction = function ()
    {
        myclass.onInsertModeButtonToggleOn.call(myclass);
    };
    button.ToggleOffFunction = function ()
    {
        myclass.onInsertModeButtonToggleOff.call(myclass);
    };
    button.ChangeIcon('images/icons/super-mono/button-add.png');
    $(buttonDiv).css('position', 'absolute');
    $(buttonDiv).css('margin-left', 60 + 2 + 'px');
    $(buttonDiv).css('left', '8%');
    button.EnableTooltip('Insert mode');
    this.InsertModeButton = button;
    if (START_PANEL_MANAGER.GetIsMerged() || START_PANEL_MANAGER.GetIsHistory())
        $(buttonDiv).hide();


    var buttonDiv = document.createElement('div');
    buttonDiv.className = 'BorderHorizontalButton';
    container.appendChild(buttonDiv);
    var button = new BorderButton(buttonDiv, false, true, this);
    this.buttons_.push(button);
    button.DirectFunction = function ()
    {
        myclass.onRotateUp.call(myclass);
    };
    button.ReverseFunction = function ()
    {
        myclass.onRotateDown.call(myclass);
    };
    button.ChangeIcon('images/icons/super-mono/button-rotate-ccw.png');
    $(buttonDiv).css('border-left', '1px solid black');

    var buttonDiv = document.createElement('div');
    buttonDiv.className = 'BorderHorizontalButton';
    container.appendChild(buttonDiv);
    var button = new BorderButton(buttonDiv, false, true, this);
    this.buttons_.push(button);
    button.DirectFunction = function ()
    {
        myclass.onMoveUp.call(myclass);
    };
    button.ReverseFunction = function ()
    {
        myclass.onMoveDown.call(myclass);
    };
    button.ChangeIcon('images/icons/super-mono/arrow-up.png');

    var buttonDiv = document.createElement('div');
    buttonDiv.className = 'BorderHorizontalButton';
    container.appendChild(buttonDiv);
    var button = new BorderButton(buttonDiv, false, true, this);
    this.buttons_.push(button);
    button.DirectFunction = function ()
    {
        myclass.onMoveForward.call(myclass);
    };
    button.ReverseFunction = function ()
    {
        myclass.onMoveBackward.call(myclass);
    };
    button.ChangeIcon('images/icons/super-mono/zoom-in.png');
    this.ZoomInButton = button;

    var buttonDiv = document.createElement('div');
    buttonDiv.className = 'BorderHorizontalButton';
    container.appendChild(buttonDiv);
    var button = new BorderButton(buttonDiv, true, false, this);
    this.buttons_.push(button);
    button.ToggleOnFunction = function ()
    {
        myclass.onBendModeButtonToggleOn.call(myclass);
    };
    button.ToggleOffFunction = function ()
    {
        myclass.onInsertModeButtonToggleOff.call(myclass);
    };
    button.ChangeIcon('images/icons/fatcow/draw_vertex.png');
    $(buttonDiv).css('border-left', '1px solid black');
    $(buttonDiv).css('border-right', 'none');
    $(buttonDiv).css('position', 'absolute');
    $(buttonDiv).css('margin-right', 60 + 1 + 'px');
    $(buttonDiv).css('right', '8%');
    button.EnableTooltip('Bend mode used for touch<br/>Use normal mode for mouse');
    button.SetTooltipWidth(200);
    //button.AlignTooltipRight();
    this.BendModeButton = button;
    if (START_PANEL_MANAGER.GetIsMerged() || START_PANEL_MANAGER.GetIsHistory())
        $(buttonDiv).hide();

    var buttonDiv = document.createElement('div');
    buttonDiv.className = 'BorderHorizontalButton';
    container.appendChild(buttonDiv);
    var button = new BorderButton(buttonDiv, true, false, this);
    this.buttons_.push(button);
    button.ToggleOnFunction = function ()
    {
        myclass.onConnectModeButtonToggleOn.call(myclass);
    };
    button.ToggleOffFunction = function ()
    {
        myclass.onInsertModeButtonToggleOff.call(myclass);
    };
    button.ChangeIcon('images/icons/super-mono/link.png');
    $(buttonDiv).css('border-left', '1px solid black');
    $(buttonDiv).css('border-right', 'none');
    $(buttonDiv).css('position', 'absolute');
    $(buttonDiv).css('margin-right', 60 + 'px');
    $(buttonDiv).css('right', '0px');
    button.EnableTooltip('Connect mode used for touch<br/>Use normal mode for mouse');
    button.SetTooltipWidth(200);
    button.AlignTooltipRight();
    this.ConnectModeButton = button;
    if (START_PANEL_MANAGER.GetIsMerged() || START_PANEL_MANAGER.GetIsHistory())
        $(buttonDiv).hide();

    var buttonDiv = document.createElement('div');
    buttonDiv.className = 'BorderHorizontalButton';
    container.appendChild(buttonDiv);
    var button = new BorderButton(buttonDiv, true, false, this);
    this.buttons_.push(button);
    button.ToggleOnFunction = function ()
    {
        myclass.onPinButtonToggleOn.call(myclass);
    };
    button.ToggleOffFunction = function ()
    {
        myclass.onPinButtonToggleOff.call(myclass);
    };
    button.ChangeIcon('images/icons/super-mono/pin.png');
    $(buttonDiv).css('position', 'absolute');
    $(buttonDiv).css('width', '60px');
    $(buttonDiv).css('right', '0px');
    $(buttonDiv).css('border-top-right-radius', '10px');
    $(buttonDiv).css('border-left', '1px solid black');
    $(buttonDiv).css('border-right', 'none');
    button.EnableTooltip('Click me');
    button.SetTooltipWidth(80);
    button.AlignTooltipRight();
    this.PinButton = button;
};

/**
 * Initializes the elements in the left side of the borders
 * @param mainDiv - the DOM elements of the main div of the border
 * @private
 */
BorderManager.prototype.initLeftElements = function (mainDiv)
{
    var myclass = this;

    var container = document.createElement('div');
    container.className = 'BorderLeft';
    mainDiv.appendChild(container);

    var buttonDiv = document.createElement('div');
    buttonDiv.className = 'BorderVerticalButton';
    container.appendChild(buttonDiv);
    var button = new BorderButton(buttonDiv, false, true, this);
    this.buttons_.push(button);
    button.DirectFunction = function ()
    {
        myclass.onRotateLeft.call(myclass);
    };
    button.ReverseFunction = function ()
    {
        myclass.onRotateRight.call(myclass);
    };
    button.ChangeIcon('images/icons/super-mono/button-rotate-ccw.png');
    $(buttonDiv).css('position', 'absolute');
    $(buttonDiv).css('left', '0px');
    $(buttonDiv).css('top', '36%');
    $(buttonDiv).css('border-top', '1px solid black');

    var buttonDiv = document.createElement('div');
    buttonDiv.className = 'BorderVerticalButton';
    container.appendChild(buttonDiv);
    var button = new BorderButton(buttonDiv, false, true, this);
    this.buttons_.push(button);
    button.DirectFunction = function ()
    {
        myclass.onMoveLeft.call(myclass);
    };
    button.ReverseFunction = function ()
    {
        myclass.onMoveRight.call(myclass);
    };
    button.ChangeIcon('images/icons/super-mono/arrow-left.png');
    $(buttonDiv).css('position', 'absolute');
    $(buttonDiv).css('left', '0px');
    $(buttonDiv).css('top', '50%');
    $(buttonDiv).css('border-top', '1px solid black');

    var buttonDiv = document.createElement('div');
    buttonDiv.className = 'BorderVerticalButton NextEdgeButton';
    container.appendChild(buttonDiv);
    var button = new BorderButton(buttonDiv, false, false, this);
    this.buttons_.push(button);
    button.DirectFunction = function ()
    {
        myclass.onNextEdge.call(myclass);
    };
    button.ReverseFunction = function ()
    {
        myclass.onNextEdge.call(myclass);
    };
    button.ChangeIcon('images/icons/fatcow/link_go.png');
    $(buttonDiv).css('position', 'absolute');
    $(buttonDiv).css('left', '0px');
    $(buttonDiv).css('top', '0px');
    $(buttonDiv).css('height', '60px');
    button.EnableTooltip('Next edge<br/>For multi edges');
    button.SetTooltipWidth(100);
    button.SetIsPress(true);


};

/**
 * Initializes the elements in the right side of the borders
 * @param mainDiv - the DOM elements of the main div of the border
 * @private
 */
BorderManager.prototype.initRightElements = function (mainDiv)
{
    var myclass = this;

    var container = document.createElement('div');
    container.className = 'BorderRight';
    mainDiv.appendChild(container);

    var buttonDiv = document.createElement('div');
    buttonDiv.className = 'BorderVerticalButton';
    container.appendChild(buttonDiv);
    var button = new BorderButton(buttonDiv, false, true, this);
    this.buttons_.push(button);
    button.DirectFunction = function ()
    {
        myclass.onRotateRight.call(myclass);
    };
    button.ReverseFunction = function ()
    {
        myclass.onRotateLeft.call(myclass);
    };
    button.ChangeIcon('images/icons/super-mono/button-rotate-ccw.png');
    $(buttonDiv).css('position', 'absolute');
    $(buttonDiv).css('left', '0px');
    $(buttonDiv).css('top', '36%');
    $(buttonDiv).css('border-top', '1px solid black');

    var buttonDiv = document.createElement('div');
    buttonDiv.className = 'BorderVerticalButton';
    container.appendChild(buttonDiv);
    var button = new BorderButton(buttonDiv, false, true, this);
    this.buttons_.push(button);
    button.DirectFunction = function ()
    {
        myclass.onMoveRight.call(myclass);
    };
    button.ReverseFunction = function ()
    {
        myclass.onMoveLeft.call(myclass);
    };
    button.ChangeIcon('images/icons/super-mono/arrow-right.png');
    $(buttonDiv).css('position', 'absolute');
    $(buttonDiv).css('left', '0px');
    $(buttonDiv).css('top', '50%');
    $(buttonDiv).css('border-top', '1px solid black');
};

/**
 * Initializes the elements in the bottom side of the borders
 * @param mainDiv - the DOM elements of the main div of the border
 * @private
 */
BorderManager.prototype.initBottomElements = function (mainDiv)
{
    var myclass = this;

    var clearDiv = document.createElement('div');
    clearDiv.className = 'Clear';
    mainDiv.appendChild(clearDiv);

    var container = document.createElement('div');
    container.className = 'BorderBottom';
    mainDiv.appendChild(container);

    var buttonDiv = document.createElement('div');
    buttonDiv.className = 'BorderHorizontalButton';
    container.appendChild(buttonDiv);
    var button = new BorderButton(buttonDiv, true, false, this);
    this.buttons_.push(button);

    $(buttonDiv).css('position', 'absolute');
    $(buttonDiv).css('width', '60px');
    $(buttonDiv).css('left', '0px');
    $(buttonDiv).css('border-bottom-left-radius', '10px');
    if (!START_PANEL_MANAGER.GetIsMerged() && !START_PANEL_MANAGER.GetIsHistory())
    {
        button.ToggleOnFunction = function ()
        {
            myclass.onMultipleSelectionButtonToggleOn.call(myclass);
        };
        button.ToggleOffFunction = function ()
        {
            myclass.OnMultipleSelectionButtonToggleOff.call(myclass);
        };
        button.ChangeIcon('images/icons/fatcow/draw_points.png');
        button.EnableTooltip('Multiple selection');
        button.SetTooltipWidth(150);
        button.SetTooltipTop(-98);
    }
    else
        button.Freeze();

    this.addNetworkInfoDiv(container);

    var buttonDiv = document.createElement('div');
    buttonDiv.className = 'BorderHorizontalButton';
    container.appendChild(buttonDiv);
    var button = new BorderButton(buttonDiv, false, true, this);
    this.buttons_.push(button);
    button.DirectFunction = function ()
    {
        myclass.onRotateDown.call(myclass);
    };
    button.ReverseFunction = function ()
    {
        myclass.onRotateUp.call(myclass);
    };
    button.ChangeIcon('images/icons/super-mono/button-rotate-ccw.png');
    $(buttonDiv).css('border-left', '1px solid black');

    var buttonDiv = document.createElement('div');
    buttonDiv.className = 'BorderHorizontalButton';
    container.appendChild(buttonDiv);
    var button = new BorderButton(buttonDiv, false, true, this);
    this.buttons_.push(button);
    button.DirectFunction = function ()
    {
        myclass.onMoveDown.call(myclass);
    };
    button.ReverseFunction = function ()
    {
        myclass.onMoveUp.call(myclass);
    };
    button.ChangeIcon('images/icons/super-mono/arrow-down.png');

    var buttonDiv = document.createElement('div');
    buttonDiv.className = 'BorderHorizontalButton';
    container.appendChild(buttonDiv);
    var button = new BorderButton(buttonDiv, false, true, this);
    this.buttons_.push(button);
    button.DirectFunction = function ()
    {
        myclass.onMoveBackward.call(myclass);
    };
    button.ReverseFunction = function ()
    {
        myclass.onMoveForward.call(myclass);
    };
    button.ChangeIcon('images/icons/super-mono/zoom-out.png');
    this.ZoomOutButton = button;

    this.addStatusInfoDiv(container);

    var buttonDiv = document.createElement('div');
    buttonDiv.className = 'BorderHorizontalButton';
    container.appendChild(buttonDiv);
    var button = new BorderButton(buttonDiv, true, false, this);
    this.buttons_.push(button);

    $(buttonDiv).css('position', 'absolute');
    $(buttonDiv).css('width', '60px');
    $(buttonDiv).css('right', '0px');
    $(buttonDiv).css('border-bottom-right-radius', '10px');
    $(buttonDiv).css('border-left', '1px solid black');
    $(buttonDiv).css('border-right', 'none');
    if (!START_PANEL_MANAGER.GetIsMerged() && !START_PANEL_MANAGER.GetIsHistory())
    {
        button.ToggleOnFunction = function ()
        {
            myclass.onCameraButtonToggleOn.call(myclass);
        };
        button.ToggleOffFunction = function ()
        {
            myclass.onCameraButtonToggleOff.call(myclass);
        };
        button.ChangeIcon('images/icons/super-mono/camcorder.png');
        button.EnableTooltip('Camera movement despite selected object');
        button.SetTooltipWidth(150);
        button.AlignTooltipRight(150);
        button.SetTooltipTop(-115);
    }
    else
        button.Freeze();
};

/**
 * Adds the DOM div element for network information
 * @param container - The container DOM element
 * @private
 */
BorderManager.prototype.addNetworkInfoDiv = function (container)
{
    var networkInfoDiv = document.createElement('div');
    $(networkInfoDiv).css('position', 'absolute');
    $(networkInfoDiv).css('display', 'inline-block');
    $(networkInfoDiv).css('width', '20%');
    $(networkInfoDiv).css('height', '40px');
    $(networkInfoDiv).css('text-align', 'left');
    $(networkInfoDiv).css('top', '20px');
    $(networkInfoDiv).css('margin-left', '60px');
    $(networkInfoDiv).css('left', '0%');
    networkInfoDiv.className = 'NetworkInfoDiv';
    this.NetworkInfoDiv = networkInfoDiv;
    container.appendChild(networkInfoDiv);

    var connectedBox = document.createElement('div');
    $(connectedBox).css('width', '15px');
    $(connectedBox).css('height', '15px');
    $(connectedBox).css('margin-left', '20px');
    $(connectedBox).css('background-color', 'green');
    $(connectedBox).css('border', '1px solid black');
    $(connectedBox).css('display', 'inline-block');
    this.ConnectedBox = connectedBox;
    networkInfoDiv.appendChild(connectedBox);

    var networkInfoText = document.createElement('span');
    $(networkInfoText).css('display', 'inline-block');
    $(networkInfoText).css('position', 'fixed');
    $(networkInfoText).css('height', '15px');
    $(networkInfoText).css('line-height', '15px');
    $(networkInfoText).css('margin-left', '5px');
    networkInfoText.innerHTML = 'Connected';
    this.NetworkInfoText = networkInfoText;
    networkInfoDiv.appendChild(networkInfoText);
};

/**
 * Adds the DOM div element for status information
 * @param container - The container DOM element
 * @private
 */
BorderManager.prototype.addStatusInfoDiv = function (container)
{
    var width = INTERFACE_MANAGER.GetRenderWidth() - 60 - 5;
    width = Math.round(width * 38 / 100 - 60);
    var statusInfoDiv = document.createElement('div');
    $(statusInfoDiv).css('position', 'absolute');
    $(statusInfoDiv).css('display', 'inline-block');
    $(statusInfoDiv).css('width', width + 'px');
    $(statusInfoDiv).css('height', '40px');
    $(statusInfoDiv).css('text-align', 'center');
    $(statusInfoDiv).css('top', '20px');
    $(statusInfoDiv).css('right', '0%');
    $(statusInfoDiv).css('margin-right', '60px');
    statusInfoDiv.className = 'StatusInfoDiv';
    this.StatusInfoDiv = statusInfoDiv;
    container.appendChild(statusInfoDiv);
};

/**
 * This function is called at regular interval to reaction to buttons
 * @private
 */
BorderManager.prototype.reactToButtons = function ()
{
    for (var i = 0; i < this.buttons_.length; i++)
    {
        if (this.buttons_[i].GetIsOn() &&
            this.buttons_[i].DirectFunction != null)
            this.buttons_[i].DirectFunction();
        else if (this.buttons_[i].GetIsReverseOn() &&
            this.buttons_[i].ReverseFunction != null)
            this.buttons_[i].ReverseFunction();
    }
};

BorderManager.prototype.onPinButtonToggleOn = function ()
{
    var accordionTop = 60 + 5 + 2;
    var accordionLeft = INTERFACE_MANAGER.GetRenderWidth() - 60 - 5 - 300;
    ACCORDION_MANAGER.Relocate(accordionTop, accordionLeft);
    ACCORDION_MANAGER.Show();
};

BorderManager.prototype.onPinButtonToggleOff = function ()
{
    ACCORDION_MANAGER.Hide();
};

BorderManager.prototype.onMoveUp = function ()
{
    ACTION_MANAGER.MoveUp(this.moveStep_);
};

BorderManager.prototype.onMoveDown = function ()
{
    ACTION_MANAGER.MoveUp(-this.moveStep_);
};

BorderManager.prototype.onMoveForward = function ()
{
    ACTION_MANAGER.MoveForward(this.moveStep_);
};

BorderManager.prototype.onMoveBackward = function ()
{
    ACTION_MANAGER.MoveForward(-this.moveStep_);
};

BorderManager.prototype.onRotateUp = function ()
{
    ACTION_MANAGER.RotateUp(this.rotateStep_);
};

BorderManager.prototype.onRotateDown = function ()
{
    ACTION_MANAGER.RotateUp(-this.rotateStep_);
};

BorderManager.prototype.onNextEdge = function ()
{
    ACTION_MANAGER.NextEdge();
};

BorderManager.prototype.onWorldAxisButtonToggleOn = function ()
{
    RENDER_MANAGER.SetUseWorldAxis(true);
};

BorderManager.prototype.onWorldAxisButtonToggleOff = function ()
{
    RENDER_MANAGER.SetUseWorldAxis(false);
};

BorderManager.prototype.onCameraButtonToggleOn = function ()
{
    ACTION_MANAGER.SetIsPerformOnCamera(true);
    this.UpdateZoomButtons();
};

BorderManager.prototype.onCameraButtonToggleOff = function ()
{
    ACTION_MANAGER.SetIsPerformOnCamera(false);
    this.UpdateZoomButtons();
};

BorderManager.prototype.onMultipleSelectionButtonToggleOn = function ()
{
    ACTION_MANAGER.SetIsMultipleSelectionMode(true);
    this.UpdateZoomButtons();
};

BorderManager.prototype.OnMultipleSelectionButtonToggleOff = function ()
{
    ACTION_MANAGER.SetIsMultipleSelectionMode(false);
    this.UpdateZoomButtons();
};

BorderManager.prototype.onMoveRight = function ()
{
    ACTION_MANAGER.MoveRight(this.moveStep_);
};

BorderManager.prototype.onMoveLeft = function ()
{
    ACTION_MANAGER.MoveRight(-this.moveStep_);
};

BorderManager.prototype.onRotateRight = function ()
{
    ACTION_MANAGER.RotateRight(-this.rotateStep_);
};

BorderManager.prototype.onRotateLeft = function ()
{
    ACTION_MANAGER.RotateRight(this.rotateStep_);
};

BorderManager.prototype.onNoneModeButtonToggleOn = function ()
{
    ACTION_MANAGER.ChangeActionMode('None');
    this.UpdateActionMode();
};

BorderManager.prototype.onInsertModeButtonToggleOn = function ()
{
    ACTION_MANAGER.ChangeActionMode('Insert');
    this.UpdateActionMode();
};

BorderManager.prototype.onInsertModeButtonToggleOff = function ()
{
    ACTION_MANAGER.ChangeActionMode('None');
    this.UpdateActionMode();
};

BorderManager.prototype.onConnectModeButtonToggleOn = function ()
{
    ACTION_MANAGER.ChangeActionMode('Connect');
    this.UpdateActionMode();
};

BorderManager.prototype.onBendModeButtonToggleOn = function ()
{
    ACTION_MANAGER.ChangeActionMode('Bend');
    this.UpdateActionMode();
};