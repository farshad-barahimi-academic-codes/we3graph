/**
 * The AccordionManager class.
 * This class creates and manages the accordion based menu on the right side
 * that is used for main actions and properties of defined by
 * customized render engines.
 * @constructor
 */
function AccordionManager()
{
    /** The DOM div element for the accordion.
     * @private
     * @type{object|null} */
    this.accordionDiv_ = null;

    /** The DOM element of the text box for x axis movement.
     * @private
     * @type {object|null} */
    this.moveXTextBox_ = null;

    /** The DOM element of the text box for y axis movement.
     * @private
     * @type {object|null} */
    this.moveYTextBox_ = null;

    /** The DOM element of the text box for z axis movement.
     * @private
     * @type {object|null} */
    this.moveZTextBox_ = null;

    /** The DOM element of the movement group box.
     * @private
     * @type {object|null} */
    this.movementGroupBox_ = null;

    /** The DOM element of the scale group box.
     * @private
     * @type {object|null} */
    this.scaleGroupBox_ = null;

    /** The list of editable property descriptions in the render engine
     * @private
     * @type {PropertyDescription[]} */
    this.propertyDescriptions_ = [];

    /** The list of DOM div elements of list boxes for string list property descriptions
     * The indices match {@link AccordionManager#propertyDescriptions_}.
     * For properties other than string lists, null is inserted to maintain the indices.
     * @private
     * @type {object[]} */
    this.propertyListBoxDivs_ = [];

    this.addAccordion();
}

/**
 * Shows the accordion menu
 * @public
 */
AccordionManager.prototype.Show = function ()
{
    $('.AccordionContainer').show();
};

/**
 * Hides the accordion menu
 * @public
 */
AccordionManager.prototype.Hide = function ()
{
    $('.AccordionContainer').hide();
};

/**
 * Resize the height of accordion menu.
 * @public
 * @param{number} height - The new accordion height in pixels.
 */
AccordionManager.prototype.Resize = function (height)
{
    $('.AccordionContainer').css('height', height + 'px');
    $('.Accordion').accordion('refresh');
};

/**
 * Move the accordion to a new position.
 * @public
 * @param{number} top - The new top for accordion in pixels. null to leave unchanged.
 * @param{number} left - The new left for accordion in pixels. null to leave unchanged.
 */
AccordionManager.prototype.Relocate = function (top, left)
{
    if (top != null)
        $('.AccordionContainer').css('top', top + 'px');
    if (left != null)
        $('.AccordionContainer').css('left', left + 'px');
};

/**
 * This method is invoked when the main panel of accordion manager should be updated
 * @public
 */
AccordionManager.prototype.UpdateMainPanel = function ()
{
    if (START_PANEL_MANAGER.GetIsMerged() || START_PANEL_MANAGER.GetIsHistory())
        return;

    var selectionType = GRAPH.GetSelectionType();

    if (selectionType == SELECTION_TYPE.SingleVertex ||
        selectionType == SELECTION_TYPE.SingleBend)
    {
        var pos = GRAPH.GetSelection()[0].GetPosition();
        this.moveXTextBox_.value = pos.x.toFixed(0);
        this.moveYTextBox_.value = pos.y.toFixed(0);
        this.moveZTextBox_.value = pos.z.toFixed(0);
        $(this.movementGroupBox_).css('display', 'inline-block');
        $(this.moveButton_).css('display', 'inline-block');
        $(this.removeButton_).css('display', 'inline-block');
    }
    else if (selectionType == SELECTION_TYPE.SingleEdge ||
        selectionType == SELECTION_TYPE.Multiple)
    {
        $(this.movementGroupBox_).css('display', 'none');
        $(this.moveButton_).css('display', 'none');
        $(this.removeButton_).css('display', 'inline-block');
    }
    else
    {
        $(this.movementGroupBox_).css('display', 'none');
        $(this.moveButton_).css('display', 'none');
        $(this.removeButton_).css('display', 'none');
    }

    if (selectionType == SELECTION_TYPE.SingleVertex)
    {
        $(this.scaleGroupBox_).css('display', 'inline-block');
        $('.ScaleSlider').slider('option', 'value', GRAPH.GetSelection()[0].GetScale() * 10);
        $('.ScaleSpan').html('Scale: ' + GRAPH.GetSelection()[0].GetScale());
    }
    else
        $(this.scaleGroupBox_).css('display', 'none');
};

/**
 * This method is invoked when the custom property panels of
 * accordion manager should be updated
 * @public
 */
AccordionManager.prototype.UpdateCustomPropertyPanels = function ()
{
    if (START_PANEL_MANAGER.GetIsMerged() || START_PANEL_MANAGER.GetIsHistory())
        return;

    var selectionType = GRAPH.GetSelectionType();

    var item;
    if (selectionType == SELECTION_TYPE.SingleVertex)
    {
        $('.VertexPropertyPanel').css('display', 'block');
        $('.EdgePropertyPanel').css('display', 'none');
        item = GRAPH.GetSelection()[0];
    }
    else if (GRAPH.GetSelectedEdge() != null)
    {
        $('.VertexPropertyPanel').css('display', 'none');
        $('.EdgePropertyPanel').css('display', 'block');
        item = GRAPH.GetSelectedEdge();
    }
    else
    {
        $('.VertexPropertyPanel').css('display', 'none');
        $('.EdgePropertyPanel').css('display', 'none');
        return;
    }

    for (var i = 0; i < this.propertyDescriptions_.length; i++)
    {
        var description = this.propertyDescriptions_[i];
        if (description.GetType() == 'Enum')
        {
            var value = item.GetPropertyValue('None', description.GetName());
            if (value == null)
                value = description.GetEnumValues()[0];

            var name = 'enum-' + description.GetName();
            $('input[name="' + name + '"][value="' + value + '"]').prop('checked', true);
            $('input[name="' + name + '"][value="' + value + '"]').button('refresh');
        }
        else if (description.GetType() == 'String')
        {
            var value = item.GetPropertyValue('None', description.GetName());
            var name = 'stringBox-' + description.GetName();
            $('input[name="' + name + '"]').val(value);
        }
        else if (description.GetType() == 'StringList')
        {
            var listBoxDiv = this.propertyListBoxDivs_[i];
            $(listBoxDiv).empty();
            var list = item.GetPropertyList(description.GetName());
            for (var id in list)
            {
                var value = list[id];


                var radioButton = document.createElement('input');

                radioButton.type = 'radio';
                radioButton.name = 'enum-' + description.GetName();
                radioButton.value = value;
                radioButton.id = id;


                listBoxDiv.appendChild(radioButton);


                var label = document.createElement('label');
                $(label).attr('for', radioButton.id);
                label.innerHTML = value;
                listBoxDiv.appendChild(label);

                $(listBoxDiv).buttonset('refresh');

                $('input[name="stringBox-' + description.GetName() + '"]').val('');


                this.addStringListItemEvents(i, radioButton, value);

            }
        }
    }
};

/**
 * Adds the accordion to the body element of the page
 * @private
 */
AccordionManager.prototype.addAccordion = function ()
{
    var htmlBody = document.getElementsByTagName('body')[0];

    var container = document.createElement('div');
    container.className = 'AccordionContainer';
    htmlBody.appendChild(container);

    this.accordionDiv_ = document.createElement('div');
    this.accordionDiv_.className = 'Accordion';
    container.appendChild(this.accordionDiv_);

    this.addMainPanel();
    if (!START_PANEL_MANAGER.GetIsMerged() && !START_PANEL_MANAGER.GetIsHistory())
        this.addCustomPropertyPanels();

    $('.Accordion').accordion({heightStyle: 'content'});
};

/**
 * Adds the main panel to the accordion.
 * @private
 */
AccordionManager.prototype.addMainPanel = function ()
{
    var myclass = this;

    // The header for the panel
    var header = document.createElement('h3');
    header.innerHTML = 'Main';
    this.accordionDiv_.appendChild(header);

    // The panel
    var panel = document.createElement('div');
    panel.className = 'MainPanel';
    this.accordionDiv_.appendChild(panel);

    // Exit button
    button = document.createElement('a');
    button.href = '#';
    button.innerHTML = 'Exit';
    button.className = 'Button';
    button.onclick = function ()
    {
        myclass.onExistButtonClicked()
    };
    panel.appendChild(button);

    if (START_PANEL_MANAGER.GetIsHistory())
    {
        this.addHistoryGroup(panel);
        return;
    }

    if (START_PANEL_MANAGER.GetIsMerged())
        return;

    // Add the movement group
    this.addMovementGroup(panel);

    // Add the remove button
    button = document.createElement('a');
    button.href = '#';
    button.innerHTML = 'Remove';
    button.className = 'Button';
    button.onclick = function ()
    {
        ACTION_MANAGER.DeleteSelected();
    };
    panel.appendChild(button);
    this.removeButton_ = button;

    //Add the scale slider
    this.addScaleSlider(panel);

    // Add the engine variants
    this.addEngineVariantsList(panel);
};

/**
 * Adds the movement group to the main panel.
 * The movement group is used for single selections.
 * @private
 * @param {object} container - The DOM element of container (main panel).
 */
AccordionManager.prototype.addMovementGroup = function (container)
{
    var myclass = this;

    var groupBox = document.createElement('div');
    groupBox.className = 'AccordionGroupBox';
    container.appendChild(groupBox);
    this.movementGroupBox_ = groupBox;

    var span = document.createElement('span');
    span.innerHTML = 'X:';
    groupBox.appendChild(span);

    this.moveXTextBox_ = document.createElement('input');
    this.moveXTextBox_.type = 'text';
    this.moveXTextBox_.className = 'MoveTextBox';
    groupBox.appendChild(this.moveXTextBox_);

    var breakTag = document.createElement('br');
    groupBox.appendChild(breakTag);

    var span = document.createElement('span');
    span.innerHTML = 'Y:';
    groupBox.appendChild(span);

    this.moveYTextBox_ = document.createElement('input');
    this.moveYTextBox_.type = 'text';
    this.moveYTextBox_.className = 'MoveTextBox';
    groupBox.appendChild(this.moveYTextBox_);

    var breakTag = document.createElement('br');
    groupBox.appendChild(breakTag);

    var span = document.createElement('span');
    span.innerHTML = 'Z:';
    groupBox.appendChild(span);

    this.moveZTextBox_ = document.createElement('input');
    this.moveZTextBox_.type = 'text';
    this.moveZTextBox_.className = 'MoveTextBox';
    groupBox.appendChild(this.moveZTextBox_);

    // Move Button
    button = document.createElement('a');
    button.href = '#';
    button.innerHTML = 'Move';
    button.className = 'Button';
    button.onclick = function ()
    {
        myclass.onMoveButtonClicked();
    };
    container.appendChild(button);
    this.moveButton_ = button;

    $('.MoveTextBox').keypress(
        function (e)
        {
            if (e.keyCode == 13)
                myclass.onMoveButtonClicked();
            e.stopPropagation();
        });
    $('.MoveTextBox').keydown(function (e)
    {
        e.stopPropagation();
    });
    $('.MoveTextBox').keyup(function (e)
    {
        e.stopPropagation();
    });
};

/**
 * Adds the scale slider to the main panel.
 * @private
 * @param {object} container - The DOM element of container (main panel).
 */
AccordionManager.prototype.addScaleSlider = function (container)
{
    var groupBox = document.createElement('div');
    groupBox.className = 'AccordionGroupBox';
    container.appendChild(groupBox);
    this.scaleGroupBox_ = groupBox;

    var span = document.createElement('span');
    span.className = 'ScaleSpan';
    span.innerHTML = 'Scale: 1';
    groupBox.appendChild(span);

    var breakTag = document.createElement('br');
    groupBox.appendChild(breakTag);

    var scaleSlider = document.createElement('div');
    scaleSlider.className = 'ScaleSlider';
    groupBox.appendChild(scaleSlider);
    $(scaleSlider).slider({
        min: 1,
        max: 100,
        value: 10,
        slide: function (event, ui)
        {
            var scale = ui.value / 10;
            scale = scale.toFixed(1);
            $('.ScaleSpan').html('Scale: ' + scale);
            ACTION_MANAGER.ScaleSelected(scale);
        }
    });
};

/**
 * Adds the engine variants list to the main panel.
 * It is displayed only if the engine has more than one variant
 * @private
 * @param {object} container - The DOM element of container (main panel).
 */
AccordionManager.prototype.addEngineVariantsList = function (container)
{
    var engineVariants = RENDER_MANAGER.GetEngine().GetEngineVariants();
    if (engineVariants.length > 1)
    {
        var variantsDiv = document.createElement('div');
        variantsDiv.className = 'VariantsDiv';
        container.appendChild(variantsDiv);

        var span = document.createElement('span');
        span.innerHTML = 'Engine variant:';
        span.className = 'AccordionSpan';
        variantsDiv.appendChild(span);

        var breakTag = document.createElement('br');
        variantsDiv.appendChild(breakTag);

        var variantsListBoxDiv = document.createElement('div');
        variantsListBoxDiv.className = 'ListBoxDiv';
        variantsDiv.appendChild(variantsListBoxDiv);

        for (var i = 0; i < engineVariants.length; i++)
        {
            var radioButton = document.createElement('input');
            var id = 'variant-' + i;
            radioButton.type = 'radio';
            radioButton.name = 'variants';
            radioButton.value = engineVariants[i];
            radioButton.id = id;
            if (i === 0)
                radioButton.checked = 'checked';

            variantsListBoxDiv.appendChild(radioButton);
            var label = document.createElement('label');
            $(label).attr('for', id);
            label.innerHTML = engineVariants[i];
            variantsListBoxDiv.appendChild(label);

            $(radioButton).on(
                'change',
                function (event)
                {
                    var variantIndex = Number(this.id.substring(8));
                    RENDER_MANAGER.GetEngine().SetEngineVariantIndex(variantIndex);
                });
        }

        $(variantsListBoxDiv).buttonset();
    }
};

/**
 * Adds the history group to the main panel.
 * @private
 * @param {object} container - The DOM element of container (main panel).
 */
AccordionManager.prototype.addHistoryGroup = function (container)
{
    var myclass = this;

    var groupBox = document.createElement('div');
    groupBox.className = 'AccordionGroupBox';
    container.appendChild(groupBox);

    // backward 1 Button
    button = document.createElement('a');
    button.href = '#';
    button.innerHTML = '1 <';
    button.className = 'Button';
    button.onclick = function ()
    {
        myclass.onHistoryBackwardButtonClicked(1);
    };
    container.appendChild(button);

    // Forward 1 Button
    button = document.createElement('a');
    button.href = '#';
    button.innerHTML = '> 1';
    button.className = 'Button';
    button.onclick = function ()
    {
        myclass.onHistoryForwardButtonClicked(1);
    };
    container.appendChild(button);

    // backward 10 Button
    button = document.createElement('a');
    button.href = '#';
    button.innerHTML = '10 <';
    button.className = 'Button';
    button.onclick = function ()
    {
        myclass.onHistoryBackwardButtonClicked(10);
    };
    container.appendChild(button);

    // Forward 10 Button
    button = document.createElement('a');
    button.href = '#';
    button.innerHTML = '> 10';
    button.className = 'Button';
    button.onclick = function ()
    {
        myclass.onHistoryForwardButtonClicked(10);
    };
    container.appendChild(button);

    // backward 100 Button
    button = document.createElement('a');
    button.href = '#';
    button.innerHTML = '100 <';
    button.className = 'Button';
    button.onclick = function ()
    {
        myclass.onHistoryBackwardButtonClicked(100);
    };
    container.appendChild(button);

    // Forward 100 Button
    button = document.createElement('a');
    button.href = '#';
    button.innerHTML = '> 100';
    button.className = 'Button';
    button.onclick = function ()
    {
        myclass.onHistoryForwardButtonClicked(100);
    };
    container.appendChild(button);
};

/**
 * Adds the properties panel to the UI.
 * The panel contains custom properties for vertices or edges.
 * Each property has its own panel in the accordion
 * @private
 */
AccordionManager.prototype.addCustomPropertyPanels = function ()
{
    var myclass = this;

    this.propertyDescriptions_ = RENDER_MANAGER.GetEngine().GetEditablePropertyList();


    for (var i = 0; i < this.propertyDescriptions_.length; i++)
    {
        var description = this.propertyDescriptions_[i];
        this.propertyListBoxDivs_.push(null);

        var header = document.createElement('h3');
        header.innerHTML = description.GetName();
        this.accordionDiv_.appendChild(header);

        var panel = document.createElement('div');
        this.accordionDiv_.appendChild(panel);

        var innerPanel = document.createElement('div');
        if (description.GetTarget() == 'Vertex')
            innerPanel.className += ' VertexPropertyPanel';
        else if (description.GetTarget() == 'Edge')
            innerPanel.className += ' EdgePropertyPanel';
        panel.appendChild(innerPanel);

        if (description.GetType() == 'Enum')
        {
            var listBoxDiv = document.createElement('div');
            listBoxDiv.className = 'ListBoxDiv';
            innerPanel.appendChild(listBoxDiv);

            for (var j = 0; j < description.GetEnumValues().length; j++)
            {
                var radioButton = document.createElement('input');
                var value = description.GetEnumValues()[j];
                var id = 'enum-' + description.GetName() + '-' + value;
                radioButton.type = 'radio';
                radioButton.name = 'enum-' + description.GetName();
                radioButton.value = value;
                radioButton.id = id;
                if (i === 0)
                    radioButton.checked = 'checked';

                listBoxDiv.appendChild(radioButton);
                var label = document.createElement('label');
                $(label).attr('for', id);
                label.innerHTML = value;
                listBoxDiv.appendChild(label);

                this.addEnumEvents(i, radioButton);
            }
            $(listBoxDiv).buttonset();
        }
        else if (description.GetType() == 'String')
        {
            var textBox = document.createElement('input');
            textBox.type = 'text';

            var name = 'stringBox-' + description.GetName();
            textBox.name = name;

            textBox.value = '';
            innerPanel.appendChild(textBox);

            var id = 'stringButton-' + description.GetName();


            // Change Button
            var button = document.createElement('a');
            button.href = '#';
            button.innerHTML = 'Change';
            button.id = id;
            button.className = 'Button';
            innerPanel.appendChild(button);
            $(button).width('200px');

            $(textBox).keydown(function (e)
            {
                e.stopPropagation();
            });
            $(textBox).keyup(function (e)
            {
                e.stopPropagation();
            });

            this.addStringEvents(i, textBox, button);

        }
        else if (description.GetType() == 'StringList')
        {
            var listBoxDiv = document.createElement('div');
            listBoxDiv.className = 'ListBoxDiv';
            listBoxDiv.id = 'listBoxDiv-' + description.GetName();
            innerPanel.appendChild(listBoxDiv);
            this.propertyListBoxDivs_[i] = listBoxDiv;

            $(listBoxDiv).buttonset();

            var breakTag = document.createElement('br');
            innerPanel.appendChild(breakTag);

            var textBox = document.createElement('input');
            textBox.type = 'text';

            var name = 'stringBox-' + description.GetName();
            textBox.name = name;

            textBox.value = '';
            innerPanel.appendChild(textBox);

            $(textBox).keydown(function (e)
            {
                e.stopPropagation();
            });
            $(textBox).keyup(function (e)
            {
                e.stopPropagation();
            });


            // Add button
            var addButton = document.createElement('a');
            addButton.href = '#';
            addButton.innerHTML = 'Add';
            addButton.id = 'stringAddButton-' + description.GetName();
            addButton.className = 'Button';
            innerPanel.appendChild(addButton);
            $(addButton).width('60px');


            // Change Button
            var changeButton = document.createElement('a');
            changeButton.href = '#';
            changeButton.innerHTML = 'Change';
            changeButton.id = 'stringChangeButton-' + description.GetName();
            changeButton.className = 'Button';
            innerPanel.appendChild(changeButton);
            $(changeButton).width('80px');


            // Remove button
            var removeButton = document.createElement('a');
            removeButton.href = '#';
            removeButton.innerHTML = 'Remove';
            removeButton.id = 'stringRemoveButton-' + description.GetName();
            removeButton.className = 'Button';
            innerPanel.appendChild(removeButton);
            $(removeButton).width('80px');

            this.addStringListEvents(i, textBox, addButton, changeButton, removeButton, listBoxDiv);
        }
    }
};

/**
 * Adds the change event for a radio button of an enum property.
 * @param{number} descriptionIndex - The index of the property description in
 * the {@link AccordionManager#propertyDescriptions_}
 * @param{object} radioButton - The DOM element of the radio button.
 */
AccordionManager.prototype.addEnumEvents = function (descriptionIndex, radioButton)
{
    var myclass = this;
    var description = this.propertyDescriptions_[descriptionIndex];
    $(radioButton).on(
        'change',
        function (event)
        {
            var name = description.GetName();
            var needUpdate = description.GetIsMeshUpdateNeeded();

            if (GRAPH.GetSelectedEdge() != null)
                ACTION_MANAGER.ChangeProperty(GRAPH.GetSelectedEdge(),
                    'None', name, this.value, needUpdate);
            else if (GRAPH.GetSelection().length == 1 &&
                GRAPH.GetSelection()[0] instanceof Vertex)
                ACTION_MANAGER.ChangeProperty(GRAPH.GetSelection()[0],
                    'None', name, this.value, needUpdate);
        });
};

/**
 * Adds the button click event and the text box enter key event for a string property.
 * @private
 * @param{number} descriptionIndex - The index of the property description in
 * the {@link AccordionManager#propertyDescriptions_}
 * @param{object} textBox - The DOM element of the textBox.
 * @param{object} button - The DOM element of the button.
 */
AccordionManager.prototype.addStringEvents = function (descriptionIndex, textBox, button)
{
    var myclass = this;
    var description = this.propertyDescriptions_[descriptionIndex];
    button.onclick = function ()
    {
        var name = description.GetName();
        var needUpdate = description.GetIsMeshUpdateNeeded();

        var value = textBox.value;

        if (value == undefined || value == '')
            return;

        if (GRAPH.GetSelectedEdge() != null)
            ACTION_MANAGER.ChangeProperty(GRAPH.GetSelectedEdge(),
                'None', name, value, needUpdate);
        else if (GRAPH.GetSelection().length == 1 &&
            GRAPH.GetSelection()[0] instanceof Vertex)
            ACTION_MANAGER.ChangeProperty(GRAPH.GetSelection()[0],
                'None', name, value, needUpdate);
    };

    $(textBox).keypress(
        function (e)
        {
            if (e.keyCode == 13)
            {
                var name = description.GetName();
                var needUpdate = description.GetIsMeshUpdateNeeded();

                var value = this.value;

                if (value == undefined || value == '')
                    return;

                if (GRAPH.GetSelectedEdge() != null)
                    ACTION_MANAGER.ChangeProperty(GRAPH.GetSelectedEdge(),
                        'None', name, value, needUpdate);
                else if (GRAPH.GetSelection().length == 1 &&
                    GRAPH.GetSelection()[0] instanceof Vertex)
                    ACTION_MANAGER.ChangeProperty(GRAPH.GetSelection()[0],
                        'None', name, value, needUpdate);

            }
        });
};

/**
 * Adds the button click event for add,change and remove buttons of a string list property.
 * @private
 * @param{number} descriptionIndex - The index of the property description in
 * the {@link AccordionManager#propertyDescriptions_}
 * @param{object} textBox - The DOM element of the textBox.
 * @param{object} addButton - The DOM element of the add button.
 * @param{object} changeButton - The DOM element of the change button.
 * @param{object} removeButton - The DOM element of the remove button.
 * @param{object} listBoxDiv - The DOM element of the list box showing
 * the values in the list in the user interface.
 */
AccordionManager.prototype.addStringListEvents =
    function (descriptionIndex, textBox, addButton, changeButton, removeButton, listBoxDiv)
    {
        var myclass = this;
        var description = this.propertyDescriptions_[descriptionIndex];
        addButton.onclick = function ()
        {
            var name = description.GetName();
            var needUpdate = description.GetIsMeshUpdateNeeded();

            var value = textBox.value;

            if (value == undefined || value == '')
                return;

            var radioButton = document.createElement('input');

            radioButton.type = 'radio';
            radioButton.name = 'enum-' + name;
            radioButton.value = value;

            // Use the combination of jQuery UI uniqueId and client ID to create a
            // unique key name for the property.
            $(radioButton).uniqueId();
            var id = WEB_SERVICE.GetClientID() + '-' + radioButton.id;

            radioButton.id = id;

            listBoxDiv.appendChild(radioButton);

            var label = document.createElement('label');
            $(label).attr('for', radioButton.id);
            label.innerHTML = value;
            listBoxDiv.appendChild(label);


            $(listBoxDiv).buttonset('refresh');

            $(radioButton).on('change', function (event)
            {
                textBox.value = this.value;
            });

            if (GRAPH.GetSelectedEdge() != null)
                ACTION_MANAGER.ChangeProperty(GRAPH.GetSelectedEdge(),
                    name, id, value, needUpdate);
            else if (GRAPH.GetSelection().length == 1 &&
                GRAPH.GetSelection()[0] instanceof Vertex)
                ACTION_MANAGER.ChangeProperty(GRAPH.GetSelection()[0],
                    name, id, value, needUpdate);
        };

        changeButton.onclick = function ()
        {
            var name = description.GetName();
            var needUpdate = description.GetIsMeshUpdateNeeded();

            var value = textBox.value;

            if (value == undefined || value == '')
                return;

            var radioButton = $('input[name="enum-' + name + '"]:checked').get(0);
            if (radioButton == undefined || radioButton == null)
                return;

            var id = radioButton.id;

            var label = $('label[for="' + id + '"]').get(0);

            if (label == undefined || label == null)
                return;

            // the span inside the label
            label.children[0].innerHTML = value;

            $(listBoxDiv).buttonset('refresh');

            if (GRAPH.GetSelectedEdge() != null)
                ACTION_MANAGER.ChangeProperty(GRAPH.GetSelectedEdge(),
                    name, id, value, needUpdate);
            else if (GRAPH.GetSelection().length == 1 &&
                GRAPH.GetSelection()[0] instanceof Vertex)
                ACTION_MANAGER.ChangeProperty(GRAPH.GetSelection()[0],
                    name, id, value, needUpdate);

        };

        removeButton.onclick = function ()
        {
            var name = description.GetName();
            var needUpdate = description.GetIsMeshUpdateNeeded();

            var value = '';

            var radioButton = $('input[name="enum-' + name + '"]:checked').get(0);
            if (radioButton == undefined || radioButton == null)
                return;

            var id = radioButton.id;

            var label = $('label[for="' + id + '"]').get(0);

            if (label == undefined || label == null)
                return;

            $(radioButton).remove();
            $(label).remove();

            textBox.value = '';

            $(listBoxDiv).buttonset('refresh');

            if (GRAPH.GetSelectedEdge() != null)
                ACTION_MANAGER.ChangeProperty(GRAPH.GetSelectedEdge(),
                    name, id, value, needUpdate);
            else if (GRAPH.GetSelection().length == 1 &&
                GRAPH.GetSelection()[0] instanceof Vertex)
                ACTION_MANAGER.ChangeProperty(GRAPH.GetSelection()[0],
                    name, id, value, needUpdate);

        };
    };

/**
 * Adds the change event for a radio button of an string list property.
 * @private
 * @param{number} descriptionIndex - The index of the property description in
 * the {@link AccordionManager#propertyDescriptions_}
 * @param{object} radioButton - The DOM element of the radio button.
 * @param{number} value - the value of the radio button.
 */
AccordionManager.prototype.addStringListItemEvents =
    function (descriptionIndex, radioButton, value)
    {
        var description = this.propertyDescriptions_[descriptionIndex];

        $(radioButton).on('change', function (event)
        {
            var name = 'stringBox-' + description.GetName();
            $('input[name="' + name + '"]').val(value);
        });
    };

/**
 * Exists the current graph and shows the start panel manager.
 * @private
 */
AccordionManager.prototype.onExistButtonClicked = function ()
{
    ACTION_MANAGER.ExistGraph();
};

/**
 * Moves the current selection to the position specified by values in the movement group box.
 * @private
 */
AccordionManager.prototype.onMoveButtonClicked = function ()
{
    var position = new THREE.Vector3(Number(this.moveXTextBox_.value),
        Number(this.moveYTextBox_.value),
        Number(this.moveZTextBox_.value));

    ACTION_MANAGER.MoveSelected(position);
};

/**
 * Move the graph forward in history mode
 * @param{number} count - the number times to move forward
 * @private
 */
AccordionManager.prototype.onHistoryForwardButtonClicked = function (count)
{
    for (var i = 0; i < count; i++)
    {
        if (!GRAPH.MoveForwardInHistory())
        {
            MessageBox.Show('Reached the end of the history', 'End of history');
            break;
        }
    }

};

/**
 * Move the graph backward in history mode
 * @param{number} count - the number times to move backward
 * @private
 */
AccordionManager.prototype.onHistoryBackwardButtonClicked = function (count)
{
    for (var i = 0; i < count; i++)
    {
        if (!GRAPH.MoveBackInHistory())
        {
            MessageBox.Show('Reached the start of the history', 'Start of history');
            break;
        }
    }
};
