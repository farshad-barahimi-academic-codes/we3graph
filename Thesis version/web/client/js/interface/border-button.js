/**
 * The BorderButton class.
 * This class is used to represent each button on the border
 * @constructor
 * @param {object} element - The DOM element of the button
 * @param {boolean} isToggle - Specifies if the button should maintain its state
 * like a toggle button
 * @param {boolean} isDark - Specifies if the button should have a dark background
 */
function BorderButton(element, isToggle, isDark)
{
    this.element_ = element;

    this.isToggle_ = isToggle;
    this.isDark_ = isDark;
    this.isHover_ = false;
    this.isOn_ = false;
    this.isReverseOn_ = false;
    this.toolTipDiv_ = null;
    this.isPress_ = false;

    this.DirectFunction = null;
    this.ReverseFunction = null;
    this.ToggleOnFunction = null;
    this.ToggleOffFunction = null;

    this.addIconDiv();
    this.Update();

    this.initMouseEvents();
    this.initTouchEvents();
}

/**
 * Sets whether the button is pressed for direct action
 * @public
 * @param {boolean} isOn - Whether the button is on
 */
BorderButton.prototype.SetIsOn = function (isOn)
{
    this.isOn_ = isOn;
};

/**
 * Determines whether the button is pressed for direct action or not.
 * @public
 * @returns {boolean}
 */
BorderButton.prototype.GetIsOn = function ()
{
    return this.isOn_;
};

/**
 * Sets whether the button is pressed for reverse action
 * @public
 * @param {boolean} isReverseOn - Whether the button is reverse on
 */
BorderButton.prototype.SetIsReverseOn = function (isReverseOn)
{
    this.isReverseOn_ = isReverseOn;
};

/**
 * Determines whether the button is pressed for reverse action or not.
 * @public
 * @returns {boolean}
 */
BorderButton.prototype.GetIsReverseOn = function ()
{
    return this.isReverseOn_;
};

/**
 * Updates the colors and the tooltip
 * @public
 */
BorderButton.prototype.Update = function ()
{
    if (this.isOn_ || this.isReverseOn_)
        $(this.element_).css('background-color', 'rgba(0, 0, 0, 0.5)');
    else if (this.isHover_)
        $(this.element_).css('background-color', 'rgba(255, 164 , 0, 0.7)');
    else if (this.isDark_)
        $(this.element_).css('background-color', 'rgba(0, 0, 0, 0.7)');
    else
        $(this.element_).css('background-color', 'inherit');

    if (this.toolTipDiv_ != null)
    {
        if (this.isHover_)
            $(this.toolTipDiv_).css('display', 'inline-block');
        else
            $(this.toolTipDiv_).css('display', 'none');
    }

};

/**
 * Changes the icon of the button
 * @param imageURL - the url of the image to be used for the icon
 * @public
 */
BorderButton.prototype.ChangeIcon = function (imageURL)
{
    $(this.element_).children('.BorderIcon').css('background-image', "url('" + imageURL + "')");
};

/**
 * Enables tooltip and initializes it with specified text
 * @param{string} text - The text of tooltip
 * @public
 */
BorderButton.prototype.EnableTooltip = function (text)
{
    if (this.toolTipDiv_ == null)
    {
        var relativeContainer = document.createElement('div');
        $(relativeContainer).css('position', 'relative');
        this.element_.appendChild(relativeContainer);

        this.toolTipDiv_ = document.createElement('div');
        this.toolTipDiv_.innerHTML = text;
        $(this.toolTipDiv_).css('display', 'none');
        $(this.toolTipDiv_).css('position', 'absolute');
        $(this.toolTipDiv_).css('z-index', '1000');
        $(this.toolTipDiv_).css('width', '100px');
        $(this.toolTipDiv_).css('left', '10px');
        $(this.toolTipDiv_).css('top', '5px');
        $(this.toolTipDiv_).css('padding', '5px');
        $(this.toolTipDiv_).css('background-color', '#fec55f');
        $(this.toolTipDiv_).css('border', '1px solid black');
        relativeContainer.appendChild(this.toolTipDiv_);
    }
};

/**
 * Changes the width of tooltip
 * @param{number} width - The width of tooltip in pixels
 * @public
 */
BorderButton.prototype.SetTooltipWidth = function (width)
{
    if (this.toolTipDiv_ != null)
        $(this.toolTipDiv_).css('width', width + 'px');
};

/**
 * Changes the top offset of tooltip
 * @param{number} top - The top offset of tooltip in pixels
 * @public
 */
BorderButton.prototype.SetTooltipTop = function (top)
{
    if (this.toolTipDiv_ != null)
        $(this.toolTipDiv_).css('top', top + 'px');
};

/**
 * Alignes the tooltip to the right
 * @public
 */
BorderButton.prototype.AlignTooltipRight = function ()
{
    if (this.toolTipDiv_ != null)
    {
        $(this.toolTipDiv_).css('left', 'auto');
        $(this.toolTipDiv_).css('right', '10px');
    }
};

/**
 * Freezes the button, so that it doesn't react to events
 * @public
 */
BorderButton.prototype.Freeze = function ()
{
    $(this.element_).unbind();
    $(this.element_).mouseover(function (e)
    {
        e.stopPropagation();
    });

    $(this.element_).mouseout(function (e)
    {
        e.stopPropagation();
    });

    $(this.element_).mousedown(function (e)
    {
        e.preventDefault();
        e.stopPropagation();
    });

    $(this.element_).mouseup(function (e)
    {
        e.preventDefault();
        e.stopPropagation();
    });

    $(this.element_).on({
        'touchstart': function (e)
        {
            e.preventDefault();
            e.stopPropagation();
        },

        'touchend': function (e)
        {
            e.preventDefault();
            e.stopPropagation();
        },

        'touchmove': function (e)
        {
            e.preventDefault();
            e.stopPropagation();
        }
    });
};

/**
 * Sets whether the button is a press button.
 * A press button only reacts once if it remains pressed
 * @public
 * @param {boolean} isPress - Whether the button is a press button
 */
BorderButton.prototype.SetIsPress = function (isPress)
{
    this.isPress_ = isPress;
};

/**
 * Initializes the mouse events for the button
 * @private
 */
BorderButton.prototype.initMouseEvents = function ()
{
    var myclass = this;

    $(this.element_).mouseover(function (e)
    {
        e.stopPropagation();
        myclass.isHover_ = true;
        myclass.Update.call(myclass);
    });

    $(this.element_).mouseout(function (e)
    {
        e.stopPropagation();
        myclass.isHover_ = false;
        if (!myclass.isToggle_)
        {
            myclass.isOn_ = false;
            myclass.isReverseOn_ = false;
        }

        myclass.Update.call(myclass);
    });

    $(this.element_).mousedown(function (e)
    {
        e.preventDefault();
        e.stopPropagation();
        if (myclass.isToggle_)
        {
            myclass.isOn_ = !myclass.isOn_;

            if (myclass.isOn_)
                myclass.ToggleOnFunction();
            else
                myclass.ToggleOffFunction();
        }
        else if (myclass.isPress_)
            myclass.DirectFunction();
        else
        {
            if (e.which == 1)
            {
                myclass.isOn_ = true;
                myclass.isReverseOn_ = false;
            }
            else
            {
                myclass.isOn_ = false;
                myclass.isReverseOn_ = true;
            }
        }

        myclass.Update.call(myclass);
    });

    $(this.element_).mouseup(function (e)
    {
        e.preventDefault();
        e.stopPropagation();
        if (!myclass.isToggle_)
        {
            myclass.isOn_ = false;
            myclass.isReverseOn_ = false;
        }

        myclass.Update.call(myclass);
    });
};

/**
 * Initializes the touch events for the button
 * @private
 */
BorderButton.prototype.initTouchEvents = function ()
{
    var myclass = this;

    $(this.element_).on({
        'touchstart': function (e)
        {
            e.preventDefault();
            e.stopPropagation();
            if (myclass.isToggle_)
            {
                myclass.isOn_ = !myclass.isOn_;

                if (myclass.isOn_)
                    myclass.ToggleOnFunction();
                else
                    myclass.ToggleOffFunction();
            }
            else if (myclass.isPress_)
                myclass.DirectFunction();
            else
                myclass.isOn_ = true;

            myclass.Update.call(myclass);
        },

        'touchend': function (e)
        {
            e.preventDefault();
            e.stopPropagation();
            if (!myclass.isToggle_)
                myclass.isOn_ = false;

            myclass.Update.call(myclass);
        },

        'touchmove': function (e)
        {
            e.preventDefault();
            e.stopPropagation();
        }
    });
};

/**
 * Adds the DOM div element for the icon
 * @private
 */
BorderButton.prototype.addIconDiv = function ()
{
    var imageDiv = document.createElement('div');
    $(imageDiv).css('display', 'inline-block');
    $(imageDiv).css('width', '100%');
    $(imageDiv).css('height', '100%');
    $(imageDiv).css('background-size', '48px 48px');
    $(imageDiv).css('background-repeat', 'no-repeat');
    $(imageDiv).css('background-position', 'center center');
    imageDiv.className = 'BorderIcon';
    this.element_.appendChild(imageDiv);
};
