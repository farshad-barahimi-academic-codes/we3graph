/**
 * Creates an StartPanelManager.
 * The main class for start panel in the user interface
 * @constructor
 */
function StartPanelManager()
{
    /** The object containing information of the selected graph.
     * The object has an ID, a Name and a render engine GUID field
     * @private
     * @type{object|null} */
    this.selectedGraph_ = null;

    /** The object containing information of the selected folder.
     * The object has an ID and a Name field
     * @private
     * @type{object|null} */
    this.selectedFolder_ = null;

    /** The selected engine.
     * @private
     * @type{DefaultEngine|null} */
    this.selectedEngine_ = null;

    /** The DOM div element for the start panel.
     * @private
     * @type{object|null} */
    this.startPanel_ = null;

    /** The DOM div element for the tabs.
     * @private
     * @type{object|null} */
    this.tabsDiv_ = null;

    /** The DOM ul element for the tabs.
     * @private
     * @type{object|null} */
    this.tabsUL_ = null;

    /** The DOM div element for the folders list box.
     * @private
     * @type{object|null} */
    this.foldersListBoxDiv_ = null;

    /** The DOM div element for the graphs list box.
     * @private
     * @type{object|null} */
    this.graphsListBoxDiv_ = null;

    /** The DOM div element for the render engines list box.
     * @private
     * @type{object|null} */
    this.enginesListBoxDiv_ = null;


    /** The DOM input element for the create graph text box.
     * @private
     * @type{object|null} */
    this.createGraphTextBox_ = null;

    /** The DOM input element for the rename graph text box.
     * @private
     * @type{object|null} */
    this.renameGraphTextBox_ = null;

    /** The DOM input element for the delete graph text box.
     * @private
     * @type{object|null} */
    this.deleteGraphTextBox_ = null;


    /** The DOM input element for the user first name text box.
     * @private
     * @type{object|null} */
    this.userFirstNameTextBox_ = null;

    /** The DOM input element for the user last name text box.
     * @private
     * @type{object|null} */
    this.userLastNameTextBox_ = null;

    /** The DOM input element for the user email text box.
     * @private
     * @type{object|null} */
    this.userEmailTextBox_ = null;

    /** The DOM input element for the user new password text box.
     * @private
     * @type{object|null} */
    this._userNewPassswordTextBox_ = null;

    /** See {@link StartPanelManager#GetGraphEngine} for further information.
     * @private
     * @type {DefaultEngine} */
    this.graphEngine_ = null;

    /** See {@link StartPanelManager#GetSelectedQuality} for further information.
     * @private
     * @type {number} */
    this.selectedQuality_ = null;

    /** See {@link StartPanelManager#GetIsSideBySide} for further information.
     * @private
     * @type {boolean} */
    this.isSidebySide_ = null;

    /** See {@link StartPanelManager#GetIsOculusRift} for further information.
     * @private
     * @type {boolean} */
    this.isOculusRift_ = null;

    /** See {@link StartPanelManager#GetIsGroundEnabled} for further information.
     * @private
     * @type {boolean} */
    this.isGroundEnabled_ = null;

    /** See {@link StartPanelManager#GetIsSilent} for further information.
     * @private
     * @type {boolean} */
    this.isSilent_ = null;

    /** See {@link StartPanelManager#GetIsMerged} for further information.
     * @private
     * @type {boolean} */
    this.isMerged_ = null;

    /** See {@link StartPanelManager#GetIsHistory} for further information.
     * @private
     * @type {boolean} */
    this.isHistory_ = null;

    /** See {@link StartPanelManager#GetIsSendCamera} for further information.
     * @private
     * @type {boolean} */
    this.isSendCamera_ = null;

    /** See {@link StartPanelManager#GetIsReceiveCamera} for further information.
     * @private
     * @type {boolean} */
    this.isReceiveCamera_ = null;

    /** See {@link StartPanelManager#GetIsFullScreen} for further information.
     * @private
     * @type {boolean} */
    this.isFullScreen_ = null;

    /** See {@link StartPanelManager#GetBackgroundColor} for further information.
     * @private
     * @type {string} */
    this.backgroundColor_ = null;
}

/**
 * Returns the ID of the selected graph when the start button was pressed
 * @return {number}
 * @public
 */
StartPanelManager.prototype.GetSelectedGraphID = function ()
{
    return this.selectedGraph_.ID;
};

/**
 * Returns the graph engine of the selected graph when the start button was pressed
 * @return {DefaultEngine}
 * @public
 */
StartPanelManager.prototype.GetGraphEngine = function ()
{
    return this.graphEngine_;
};

/**
 * Returns the selected quality when the start button was pressed.
 * It can be used to gain performance with low quality graphics.
 * @return {number} - 1:Low, 2:Normal, 3:High
 * @public
 */
StartPanelManager.prototype.GetSelectedQuality = function ()
{
    return this.selectedQuality_;
};

/**
 * Returns true if side by side 3D mode was selected when the start button was pressed
 * @return {boolean}
 * @public
 */
StartPanelManager.prototype.GetIsSideBySide = function ()
{
    return this.isSidebySide_;
};

/**
 * Returns true if oculus rift mode was selected when the start button was pressed
 * @return {boolean}
 * @public
 */
StartPanelManager.prototype.GetIsOculusRift = function ()
{
    return this.isOculusRift_;
};

/**
 * Returns true if ground plane option was enabled when the start button was pressed
 * @return {boolean}
 * @public
 */
StartPanelManager.prototype.GetIsGroundEnabled = function ()
{
    return this.isGroundEnabled_;
};

/**
 * Returns true if the silent mode was selected when the start button was pressed
 * @return {boolean}
 * @public
 */
StartPanelManager.prototype.GetIsSilent = function ()
{
    return this.isSilent_;
};

/**
 * Return true if merged mode was selected when the start button was pressed
 * @return {boolean}
 * @public
 */
StartPanelManager.prototype.GetIsMerged = function ()
{
    return this.isMerged_;
};

/**
 * Returns true if history mode was selected when the start button was pressed
 * @return {boolean}
 * @public
 */
StartPanelManager.prototype.GetIsHistory = function ()
{
    return this.isHistory_;
};

/**
 * Returns true if camera mode that was selected when start button was pressed,
 * indicated that camera changes should be sent to the server
 * @return {boolean}
 * @public
 */
StartPanelManager.prototype.GetIsSendCamera = function ()
{
    return this.isSendCamera_;
};

/**
 * Returns true if camera mode that was selected when start button was pressed,
 * indicated that camera changes received from server should be applied to the graph
 * @return {boolean}
 * @public
 */
StartPanelManager.prototype.GetIsReceiveCamera = function ()
{
    return this.isReceiveCamera_;
};

/**
 * Returns true if full screen mode was selected when the start button was pressed
 * @return {boolean}
 * @public
 */
StartPanelManager.prototype.GetIsFullScreen = function ()
{
    return this.isFullScreen_;
};

/**
 * Returns the chosen background color when start button was pressed.
 * @return {string} A CSS style background color e.g. rgb(85, 85, 85)
 * @public
 */
StartPanelManager.prototype.GetBackgroundColor = function ()
{
    return this.backgroundColor_;
};

/**
 * Starts displaying the StartPanelManager
 * @param {object} htmlBody - the DOM element of the HTML body element
 * @public
 */
StartPanelManager.prototype.Display = function (htmlBody)
{
    this.selectedGraph_ = null;
    this.selectedFolder_ = null;

    this.startPanel_ = document.createElement('div');
    this.startPanel_.className = 'WidePanel';
    htmlBody.appendChild(this.startPanel_);

    this.addFoldersListBox();
    this.addGraphsListBox();
    this.addStartButton();
    this.addInfoBox();
    this.addTabs();


    this.updateFoldersList();
    this.updateEnginesList();
};
/**
 * Adds the folders list box
 * @private
 */
StartPanelManager.prototype.addFoldersListBox = function ()
{
    var foldersDiv = document.createElement('div');
    foldersDiv.className = 'FoldersDiv';
    this.startPanel_.appendChild(foldersDiv);

    var span = document.createElement('span');
    span.innerHTML = 'Folders:';
    foldersDiv.appendChild(span);

    var breakTag = document.createElement('br');
    foldersDiv.appendChild(breakTag);

    this.foldersListBoxDiv_ = document.createElement('div');
    this.foldersListBoxDiv_.className = 'ListBoxDiv';
    foldersDiv.appendChild(this.foldersListBoxDiv_);
};

/**
 * Adds the graphs list box
 * @private
 */
StartPanelManager.prototype.addGraphsListBox = function ()
{
    var graphsDiv = document.createElement('div');
    graphsDiv.className = 'GraphsDiv';
    this.startPanel_.appendChild(graphsDiv);

    var span = document.createElement('span');
    span.innerHTML = 'Graph:';
    graphsDiv.appendChild(span);

    var breakTag = document.createElement('br');
    graphsDiv.appendChild(breakTag);

    this.graphsListBoxDiv_ = document.createElement('div');
    this.graphsListBoxDiv_.className = 'ListBoxDiv';
    graphsDiv.appendChild(this.graphsListBoxDiv_);
};

/**
 * Adds the information box
 * @private
 */
StartPanelManager.prototype.addInfoBox = function ()
{
    var infoDiv = document.createElement('div');
    infoDiv.className = 'WidePanelInfoDiv';
    this.startPanel_.appendChild(infoDiv);

    var div = document.createElement('div');
    div.innerHTML = 'Folder name:';
    infoDiv.appendChild(div);

    var div = document.createElement('div');
    div.innerHTML = '&nbsp;';
    div.className = 'SelectedFolderName';
    infoDiv.appendChild(div);
    $(div).css('color', 'black');

    var div = document.createElement('div');
    div.innerHTML = 'Folder access:';
    infoDiv.appendChild(div);

    var div = document.createElement('div');
    div.innerHTML = '&nbsp;';
    div.className = 'SelectedFolderAccess';
    infoDiv.appendChild(div);
    $(div).css('color', 'black');

    var div = document.createElement('div');
    div.innerHTML = 'Graph name:';
    infoDiv.appendChild(div);

    var div = document.createElement('div');
    div.innerHTML = '&nbsp;';
    div.className = 'SelectedGraphName';
    infoDiv.appendChild(div);
    $(div).css('color', 'black');

    var div = document.createElement('div');
    div.innerHTML = 'Render engine:';
    infoDiv.appendChild(div);

    var div = document.createElement('div');
    div.innerHTML = '&nbsp;';
    div.className = 'SelectedEngineName';
    infoDiv.appendChild(div);
    $(div).css('color', 'black');


    var clearDiv = document.createElement('div');
    clearDiv.className = 'Clear';
    this.startPanel_.appendChild(clearDiv);
};

/**
 * Adds the start button
 * @private
 */
StartPanelManager.prototype.addStartButton = function ()
{
    var myclass = this;
    var button = document.createElement('a');
    button.href = '#';
    button.innerHTML = 'Start';
    button.className = 'Button';
    $(button).css('margin-top', '40px');
    $(button).css('margin-bottom', '20px');
    $(button).css('margin-left', '80px');
    $(button).css('width', '140px');
    button.onclick = function ()
    {
        myclass.onStartButtonClicked(myclass);
    };
    this.startPanel_.appendChild(button);

    $(button).button({icons: {primary: 'StartIcon'}});

    var breakTag = document.createElement('br');
    this.startPanel_.appendChild(breakTag);
};

/**
 * Adds the tab based UI
 * @private
 */
StartPanelManager.prototype.addTabs = function ()
{
    this.tabsDiv_ = document.createElement('div');
    this.startPanel_.appendChild(this.tabsDiv_);

    this.tabsUL_ = document.createElement('ul');
    this.tabsDiv_.appendChild(this.tabsUL_);

    this.addCreateTab();
    this.addRenameTab();
    this.addDeleteTab();
    this.addUserTab();
    this.addOptionsTab();

    $(this.tabsDiv_).tabs({heightStyle: 'auto'});
};

/**
 * Adds the create tab
 * @private
 */
StartPanelManager.prototype.addCreateTab = function ()
{
    var myclass = this;

    var createTab = document.createElement('li');
    createTab.innerHTML = '<a href="#create-tab-content">Create</a>';
    this.tabsUL_.appendChild(createTab);

    var createTabContent = document.createElement('div');
    createTabContent.id = 'create-tab-content';
    this.tabsDiv_.appendChild(createTabContent);

    // Create graph
    var groupBox = document.createElement('div');
    groupBox.className = 'WidePanelGroupBox';
    createTabContent.appendChild(groupBox);

    var headerDiv = document.createElement('div');
    headerDiv.innerHTML = 'Create a new graph';
    headerDiv.className = 'WidePanelGroupBoxHeader';
    groupBox.appendChild(headerDiv);
    $(groupBox).css('margin-bottom', '0px');

    var breakTag = document.createElement('br');
    groupBox.appendChild(breakTag);

    var enginesDiv = document.createElement('div');
    enginesDiv.className = 'EnginesDiv';
    groupBox.appendChild(enginesDiv);

    var span = document.createElement('span');
    span.innerHTML = 'Render engine:';
    enginesDiv.appendChild(span);

    var breakTag = document.createElement('br');
    enginesDiv.appendChild(breakTag);

    this.enginesListBoxDiv_ = document.createElement('div');
    this.enginesListBoxDiv_.className = 'ListBoxDiv';
    enginesDiv.appendChild(this.enginesListBoxDiv_);
    $(this.enginesListBoxDiv_).css('height', '220px');
    $(this.enginesListBoxDiv_).css('margin-bottom', '10px');

    var clearDiv = document.createElement('div');
    clearDiv.className = 'Clear';
    this.startPanel_.appendChild(clearDiv);

    var createDiv = document.createElement('div');
    groupBox.appendChild(createDiv);
    $(createDiv).css('float', 'left');
    $(createDiv).css('width', '350px');
    $(createDiv).css('margin-top', '20px');

    var span = document.createElement('span');
    span.innerHTML = 'Selected folder:';
    createDiv.appendChild(span);

    var div = document.createElement('span');
    div.innerHTML = '&nbsp;';
    div.className = 'ReadOnlyBox SelectedFolderName';
    createDiv.appendChild(div);

    var breakTag = document.createElement('br');
    createDiv.appendChild(breakTag);

    var breakTag = document.createElement('br');
    createDiv.appendChild(breakTag);

    var span = document.createElement('span');
    span.innerHTML = 'Graph name:';
    createDiv.appendChild(span);

    this.createGraphTextBox_ = document.createElement('input');
    this.createGraphTextBox_.type = 'text';
    createDiv.appendChild(this.createGraphTextBox_);

    // Create graph button

    var button = document.createElement('a');
    button.href = '#';
    button.innerHTML = 'Create';
    button.className = 'Button';
    $(button).css('margin-top', '10px');
    button.onclick = function ()
    {
        myclass.onCreateGraphButtonClicked(myclass);
    };
    createDiv.appendChild(button);

    $(button).button();

    var clearDiv = document.createElement('div');
    clearDiv.className = 'Clear';
    groupBox.appendChild(clearDiv);


};

/**
 * Adds the rename tab
 * @private
 */
StartPanelManager.prototype.addRenameTab = function ()
{
    var myclass = this;

    var renameTab = document.createElement('li');
    renameTab.innerHTML = '<a href="#rename-tab-content">Rename</a>';
    this.tabsUL_.appendChild(renameTab);

    var renameTabContent = document.createElement('div');
    renameTabContent.id = 'rename-tab-content';
    this.tabsDiv_.appendChild(renameTabContent);

    // Rename a graph
    var groupBox = document.createElement('div');
    groupBox.className = 'WidePanelGroupBox';
    renameTabContent.appendChild(groupBox);

    var headerDiv = document.createElement('div');
    headerDiv.innerHTML = 'Rename the selected graph';
    headerDiv.className = 'WidePanelGroupBoxHeader';
    groupBox.appendChild(headerDiv);

    var span = document.createElement('span');
    span.innerHTML = 'Selected graph:';
    groupBox.appendChild(span);

    var div = document.createElement('span');
    div.innerHTML = '&nbsp;';
    div.className = 'ReadOnlyBox SelectedGraphName';
    groupBox.appendChild(div);

    var span = document.createElement('span');
    span.innerHTML = 'New name:';
    groupBox.appendChild(span);

    this.renameGraphTextBox_ = document.createElement('input');
    this.renameGraphTextBox_.type = 'text';
    groupBox.appendChild(this.renameGraphTextBox_);

    // Rename graph button

    var button = document.createElement('a');
    button.href = '#';
    button.innerHTML = 'Rename';
    button.className = 'Button';
    $(button).css('margin-top', '10px');
    button.onclick = function ()
    {
        myclass.onRenameGraphButtonClicked(myclass);
    };
    groupBox.appendChild(button);
    $(button).button();
};

/**
 * Adds the delete tab
 * @private
 */
StartPanelManager.prototype.addDeleteTab = function ()
{
    var myclass = this;

    var deleteTab = document.createElement('li');
    deleteTab.innerHTML = '<a href="#delete-tab-content">Delete</a>';
    this.tabsUL_.appendChild(deleteTab);

    var deleteTabContent = document.createElement('div');
    deleteTabContent.id = 'delete-tab-content';
    this.tabsDiv_.appendChild(deleteTabContent);

    // Delete a graph
    var groupBox = document.createElement('div');
    groupBox.className = 'WidePanelGroupBox';
    deleteTabContent.appendChild(groupBox);

    var headerDiv = document.createElement('div');
    headerDiv.innerHTML = 'Delete the selected graph';
    headerDiv.className = 'WidePanelGroupBoxHeader';
    groupBox.appendChild(headerDiv);

    var span = document.createElement('span');
    span.innerHTML = 'Selected graph:';
    groupBox.appendChild(span);

    var div = document.createElement('span');
    div.innerHTML = '&nbsp;';
    div.className = 'ReadOnlyBox SelectedGraphName';
    groupBox.appendChild(div);

    var span = document.createElement('span');
    span.innerHTML = 'Type graph name:';
    groupBox.appendChild(span);

    this.deleteGraphTextBox_ = document.createElement('input');
    this.deleteGraphTextBox_.type = 'text';
    groupBox.appendChild(this.deleteGraphTextBox_);

    // Delete graph button

    var button = document.createElement('a');
    button.href = '#';
    button.innerHTML = 'Delete';
    button.className = 'Button';
    $(button).css('margin-top', '10px');
    button.onclick = function ()
    {
        myclass.onDeleteGraphButtonClicked(myclass);
    };
    groupBox.appendChild(button);
    $(button).button();
};

/**
 * Adds the user tab
 * @private
 */
StartPanelManager.prototype.addUserTab = function ()
{
    var myclass = this;

    var response = WEB_SERVICE.GetUserInfo();
    if (!response.GetIsSuccess())
    {
        MessageBox.ShowError(response.GetErrorMessage());
        return;
    }

    var user = response.GetData();

    var userTab = document.createElement('li');
    userTab.innerHTML = '<a href="#user-tab-content">User</a>';
    this.tabsUL_.appendChild(userTab);

    var userTabContent = document.createElement('div');
    userTabContent.id = 'user-tab-content';
    this.tabsDiv_.appendChild(userTabContent);

    // Update user
    var groupBox = document.createElement('div');
    groupBox.className = 'WidePanelGroupBox';
    $(groupBox).css('width', '630px');
    $(groupBox).css('display', 'inline-block');
    $(groupBox).css('margin-left', '7px');
    userTabContent.appendChild(groupBox);

    var headerDiv = document.createElement('div');
    headerDiv.innerHTML = 'Update user information';
    headerDiv.className = 'WidePanelGroupBoxHeader';
    groupBox.appendChild(headerDiv);

    var breakTag = document.createElement('br');
    groupBox.appendChild(breakTag);

    var span = document.createElement('span');
    span.innerHTML = 'First name:';
    groupBox.appendChild(span);

    this.userFirstNameTextBox_ = document.createElement('input');
    this.userFirstNameTextBox_.type = 'text';
    this.userFirstNameTextBox_.value = user.FirstName;
    groupBox.appendChild(this.userFirstNameTextBox_);

    var span = document.createElement('span');
    span.innerHTML = 'Last name:';
    groupBox.appendChild(span);

    this.userLastNameTextBox_ = document.createElement('input');
    this.userLastNameTextBox_.type = 'text';
    this.userLastNameTextBox_.value = user.LastName;
    groupBox.appendChild(this.userLastNameTextBox_);

    var breakTag = document.createElement('br');
    groupBox.appendChild(breakTag);

    var breakTag = document.createElement('br');
    groupBox.appendChild(breakTag);

    var span = document.createElement('span');
    span.innerHTML = 'Email:';
    groupBox.appendChild(span);

    this.userEmailTextBox_ = document.createElement('input');
    this.userEmailTextBox_.type = 'text';
    this.userEmailTextBox_.value = user.Email;
    groupBox.appendChild(this.userEmailTextBox_);

    var breakTag = document.createElement('br');
    groupBox.appendChild(breakTag);

    var breakTag = document.createElement('br');
    groupBox.appendChild(breakTag);

    var span = document.createElement('span');
    span.innerHTML = 'New password:';
    groupBox.appendChild(span);

    this.userNewPassswordTextBox_ = document.createElement('input');
    this.userNewPassswordTextBox_.type = 'password';
    groupBox.appendChild(this.userNewPassswordTextBox_);

    var span = document.createElement('span');
    span.innerHTML = "(Leave blank if you don't want to change it)";
    groupBox.appendChild(span);

    var breakTag = document.createElement('br');
    groupBox.appendChild(breakTag);

    // Update button

    var button = document.createElement('a');
    button.href = '#';
    button.innerHTML = 'Update';
    button.className = 'Button';
    $(button).css('margin-top', '10px');
    button.onclick = function ()
    {
        myclass.onUpdateUserButtonClicked(myclass);
    };
    groupBox.appendChild(button);
    $(button).button();

    // Logout
    var groupBox = document.createElement('div');
    groupBox.className = 'WidePanelGroupBox';
    $(groupBox).css('width', '105px');
    $(groupBox).css('margin-right', '7px');
    $(groupBox).css('display', 'inline-block');
    $(groupBox).css('float', 'right');
    $(groupBox).css('height', '235px');
    userTabContent.appendChild(groupBox);

    var headerDiv = document.createElement('div');
    headerDiv.innerHTML = 'Logout';
    headerDiv.className = 'WidePanelGroupBoxHeader';
    groupBox.appendChild(headerDiv);

    var button = document.createElement('a');
    button.href = '#';
    button.innerHTML = 'Logout';
    button.className = 'Button';
    $(button).css('margin-top', '10px');
    button.onclick = function ()
    {
        myclass.onLogoutButtonClicked(myclass);
    };
    groupBox.appendChild(button);
    $(button).button();

};

/**
 * Adds the options tab
 * @private
 */
StartPanelManager.prototype.addOptionsTab = function ()
{
    var myclass = this;

    var optionsTab = document.createElement('li');
    optionsTab.innerHTML = '<a href="#options-tab-content">Options</a>';
    this.tabsUL_.appendChild(optionsTab);

    var optionsTabContent = document.createElement('div');
    optionsTabContent.id = 'options-tab-content';
    this.tabsDiv_.appendChild(optionsTabContent);

    var groupBox = document.createElement('div');
    groupBox.className = 'WidePanelGroupBox';
    optionsTabContent.appendChild(groupBox);

    var headerDiv = document.createElement('div');
    headerDiv.innerHTML = 'Options';
    headerDiv.className = 'WidePanelGroupBoxHeader';
    groupBox.appendChild(headerDiv);

    var breakTag = document.createElement('br');
    groupBox.appendChild(breakTag);

    // Usage mode
    var span = document.createElement('span');
    span.innerHTML = 'Usage mode:';
    groupBox.appendChild(span);

    var usageModeSpan = document.createElement('span');
    groupBox.appendChild(usageModeSpan);

    var choices = ['Real time', 'Silent', 'Merged', 'History'];

    for (var i = 0; i < choices.length; i++)
    {
        var radioButton = document.createElement('input');
        // replace in the next line is for removing spaces using regular expressions
        var id = 'UsageModeRadio' + choices[i].replace(/\s+/g, '');
        radioButton.type = 'radio';
        radioButton.name = 'UsageModeRadio';
        radioButton.id = id;
        if (i === 0)
            radioButton.checked = 'checked';
        usageModeSpan.appendChild(radioButton);
        var label = document.createElement('label');
        $(label).attr('for', id);
        label.innerHTML = choices[i];

        usageModeSpan.appendChild(label);
        if (i == 0)
            $(label).css('width', '100px');
        else if (i == 1)
            $(label).css('width', '70px');
        else
            $(label).css('width', '80px');

    }

    $(usageModeSpan).buttonset();

    // Full screen
    var span = document.createElement('span');
    span.innerHTML = 'Full screen:';
    groupBox.appendChild(span);

    var isFullScreenSpan = document.createElement('span');
    groupBox.appendChild(isFullScreenSpan);

    var choices = ['Yes', 'No'];

    for (var i = 0; i < choices.length; i++)
    {
        var radioButton = document.createElement('input');
        var id = 'IsFullScreenRadio' + choices[i];
        radioButton.type = 'radio';
        radioButton.name = 'IsFullScreenRadio';
        radioButton.id = id;
        if (i === 1)
            radioButton.checked = 'checked';
        isFullScreenSpan.appendChild(radioButton);
        var label = document.createElement('label');
        $(label).attr('for', id);
        label.innerHTML = choices[i];
        isFullScreenSpan.appendChild(label);
        $(label).css('width', '60px');
    }

    $(isFullScreenSpan).buttonset();

    var breakTag = document.createElement('br');
    groupBox.appendChild(breakTag);

    var breakTag = document.createElement('br');
    groupBox.appendChild(breakTag);


    // quality

    var span = document.createElement('span');
    span.innerHTML = 'Quality:';
    groupBox.appendChild(span);

    var qualitySpan = document.createElement('span');
    groupBox.appendChild(qualitySpan);

    var qualities = ['Low', 'Normal', 'High'];

    for (var i = 0; i < qualities.length; i++)
    {
        var radioButton = document.createElement('input');
        var id = 'QualityRadio' + qualities[i];
        radioButton.type = 'radio';
        radioButton.name = 'QualityRadio';
        radioButton.id = id;
        if (i === 1)
            radioButton.checked = 'checked';
        qualitySpan.appendChild(radioButton);
        var label = document.createElement('label');
        $(label).attr('for', id);
        label.innerHTML = qualities[i];
        qualitySpan.appendChild(label);
        $(label).css('width', '80px');
    }

    $(qualitySpan).buttonset();

    // Camera
    var span = document.createElement('span');
    span.innerHTML = 'Camera:';
    groupBox.appendChild(span);

    var cameraSpan = document.createElement('span');
    groupBox.appendChild(cameraSpan);

    var choices = ['None', 'Receive', 'Send', 'Both'];

    for (var i = 0; i < choices.length; i++)
    {
        var radioButton = document.createElement('input');
        var id = 'CameraRadio' + choices[i];
        radioButton.type = 'radio';
        radioButton.name = 'CameraRadio';
        radioButton.id = id;
        if (i === 0)
            radioButton.checked = 'checked';
        cameraSpan.appendChild(radioButton);
        var label = document.createElement('label');
        $(label).attr('for', id);
        label.innerHTML = choices[i];
        cameraSpan.appendChild(label);
        if (i == 1)
            $(label).css('width', '80px');
        else
            $(label).css('width', '60px');
    }

    $(cameraSpan).buttonset();


    var breakTag = document.createElement('br');
    groupBox.appendChild(breakTag);

    var breakTag = document.createElement('br');
    groupBox.appendChild(breakTag);

    // Background color
    // From http://jqueryui.com/slider/#colorpicker


    var backgroundDiv = document.createElement('div');
    groupBox.appendChild(backgroundDiv);
    $(backgroundDiv).css('float', 'left');
    $(backgroundDiv).css('width', '420px');

    var div = document.createElement('div');
    div.innerHTML = 'Background color';
    backgroundDiv.appendChild(div);
    $(div).css('margin-bottom', '10px');

    var BGColorBox = document.createElement('div');
    BGColorBox.className = 'BGColorBox';
    backgroundDiv.appendChild(BGColorBox);


    var redSlider = document.createElement('div');
    redSlider.className = 'RedSlider';
    backgroundDiv.appendChild(redSlider);

    var span = document.createElement('span');
    span.innerHTML = 'Red';
    backgroundDiv.appendChild(span);
    $(span).css('float', 'left');
    $(span).css('margin-top', '15px');

    var greenSlider = document.createElement('div');
    greenSlider.className = 'GreenSlider';
    backgroundDiv.appendChild(greenSlider);

    var span = document.createElement('span');
    span.innerHTML = 'Green';
    backgroundDiv.appendChild(span);
    $(span).css('float', 'left');
    $(span).css('margin-top', '15px');

    var blueSlider = document.createElement('div');
    blueSlider.className = 'BlueSlider';
    backgroundDiv.appendChild(blueSlider);

    var span = document.createElement('span');
    span.innerHTML = 'Blue';
    backgroundDiv.appendChild(span);
    $(span).css('float', 'left');
    $(span).css('margin-top', '15px');

    // 3D
    var span = document.createElement('span');
    span.innerHTML = '3D:';
    groupBox.appendChild(span);

    var _3DOptionsSpan = document.createElement('span');
    groupBox.appendChild(_3DOptionsSpan);

    var choices = ['None', 'SideBySide', 'OculusRift'];

    for (var i = 0; i < choices.length; i++)
    {
        var radioButton = document.createElement('input');
        var id = '3DOptionsRadio' + choices[i];
        radioButton.type = 'radio';
        radioButton.name = '3DOptionsRadio';
        radioButton.value = choices[i];
        radioButton.id = id;
        if (i === 0)
            radioButton.checked = 'checked';
        _3DOptionsSpan.appendChild(radioButton);
        var label = document.createElement('label');
        $(label).attr('for', id);
        label.innerHTML = choices[i];
        _3DOptionsSpan.appendChild(label);
        if (i == 0)
            $(label).css('width', '70px');
        else
            $(label).css('width', '120px');
    }

    $(_3DOptionsSpan).buttonset();

    var breakTag = document.createElement('br');
    groupBox.appendChild(breakTag);

    var breakTag = document.createElement('br');
    groupBox.appendChild(breakTag);

    // Ground
    var span = document.createElement('span');
    span.innerHTML = 'Ground:';
    groupBox.appendChild(span);

    var isGroundEnabledSpan = document.createElement('span');
    groupBox.appendChild(isGroundEnabledSpan);

    var choices = ['Enabled', 'Disabled'];

    for (var i = 0; i < choices.length; i++)
    {
        var radioButton = document.createElement('input');
        var id = 'IsGroundEnabledRadio' + choices[i];
        radioButton.type = 'radio';
        radioButton.name = 'IsGroundEnabledRadio';
        radioButton.id = id;
        if (i === 0)
            radioButton.checked = 'checked';
        isGroundEnabledSpan.appendChild(radioButton);
        var label = document.createElement('label');
        $(label).attr('for', id);
        label.innerHTML = choices[i];
        isGroundEnabledSpan.appendChild(label);
        $(label).css('width', '90px');
    }

    $(isGroundEnabledSpan).buttonset();


    var clearDiv = document.createElement('div');
    clearDiv.className = 'Clear';
    groupBox.appendChild(clearDiv);


    var refreshBGColorBox = function ()
    {
        var red = $('.RedSlider').slider('value');
        var green = $('.GreenSlider').slider('value');
        var blue = $('.BlueSlider').slider('value');
        $('.BGColorBox').css('background-color', 'rgb(' +
            red + ',' + green + ',' + blue + ')');
    };

    $('.RedSlider, .GreenSlider, .BlueSlider').slider({
        orientation: 'horizontal',
        range: 'min',
        max: 255,
        value: 85,
        slide: refreshBGColorBox,
        change: refreshBGColorBox
    });

};

/**
 * This method is fired when create graph button is clicked
 * @private
 */
StartPanelManager.prototype.onCreateGraphButtonClicked = function ()
{
    if (this.selectedFolder_ == null)
    {
        MessageBox.ShowError('Please select a folder');
        return;
    }


    if (this.selectedEngine_ == null)
    {
        MessageBox.ShowError('Please select a render engine');
        return;
    }

    var graphName = this.createGraphTextBox_.value;

    if (graphName.length == 0)
    {
        MessageBox.ShowError('Please specify graph name');
        return;
    }

    if (graphName.length > 50)
    {
        MessageBox.ShowError('Graph name should be at most 50 characters');
        return;
    }

    var response = WEB_SERVICE.CreateGraph(graphName, this.selectedFolder_.ID,
        this.selectedEngine_.GetGUID());
    if (response.GetIsSuccess())
    {
        this.updateGraphsList(this.selectedFolder_.ID);
        this.createGraphTextBox_.value = '';
        MessageBox.ShowSuccess('Done');
    }
    else
    {
        MessageBox.ShowError(response.GetErrorMessage());
    }
};


/**
 * Update the folders list in the start panel
 * @private
 */
StartPanelManager.prototype.updateFoldersList = function ()
{
    var myclass = this;

    var response = WEB_SERVICE.GetFolders();
    if (!response.GetIsSuccess())
    {
        MessageBox.ShowError(response.GetErrorMessage());
        return;
    }

    var folders = response.GetData();

    this.foldersListBoxDiv_.innerHTML = '';
    this.selectedFolder_ = null;

    for (var i = 0; i < folders.length; i++)
    {
        var radioButton = document.createElement('input');
        var id = folders[i].ID;
        var id = 'folder-' + id;
        radioButton.type = 'radio';
        radioButton.name = 'folders';
        radioButton.value = folders[i].Name;
        radioButton.id = id;
        if (i === 0)
        {
            radioButton.checked = 'checked';
            this.selectedFolder_ = new Object();
            this.selectedFolder_.ID = folders[0].ID;
            this.selectedFolder_.Name = folders[0].Name;

        }
        this.foldersListBoxDiv_.appendChild(radioButton);
        var label = document.createElement('label');
        $(label).attr('for', id);
        label.innerHTML = folders[i].Name;
        this.foldersListBoxDiv_.appendChild(label);

        $(radioButton).on('change', function (event)
        {
            myclass.selectedFolder_.ID = Number(this.id.substring(7));
            myclass.selectedFolder_.Name = this.value;
            $('.SelectedFolderName').html(myclass.selectedFolder_.Name);
            myclass.updateGraphsList(myclass.selectedFolder_.ID);
        });
    }

    $(this.foldersListBoxDiv_).buttonset();

    if (this.selectedFolder_ != null)
    {
        $('.SelectedFolderName').html(this.selectedFolder_.Name);
        this.updateGraphsList(this.selectedFolder_.ID);
    }
    else
    {
        $('.SelectedFolderName').html('&nbsp;');
        $('.SelectedGraphName').html('&nbsp;');
        this.selectedGraph_ = null;
    }

};

/**
 * Update the graph list in the start panel
 * @private
 */
StartPanelManager.prototype.updateGraphsList = function (folderID)
{
    var myclass = this;
    this.graphsListBoxDiv_.innerHTML = '';

    var response = WEB_SERVICE.GetFolderInfo(folderID);
    if (!response.GetIsSuccess())
    {
        MessageBox.ShowError(response.GetErrorMessage());
        return;
    }

    var folderInfo = response.GetData();
    var folderAccess = 'No access';

    if (folderInfo.PermissionType == 0)
        folderAccess = 'Read only';
    else if (folderInfo.PermissionType == 1)
        folderAccess = 'Write';
    else if (folderInfo.PermissionType == 2)
        folderAccess = 'Moderator';

    $('.SelectedFolderAccess').html(folderAccess);
    var graphs = folderInfo.Graphs;

    this.selectedGraph_ = null;

    for (var i = 0; i < graphs.length; i++)
    {
        var radioButton = document.createElement('input');
        var id = graphs[i].ID;
        var id = 'graph-' + id;
        radioButton.type = 'radio';
        radioButton.name = 'graphs';
        radioButton.value = graphs[i].Name + '|' + graphs[i].RenderEngineGUID;
        radioButton.id = id;
        if (i === 0)
        {
            radioButton.checked = 'checked';
            this.selectedGraph_ = new Object();
            this.selectedGraph_.ID = graphs[0].ID;
            this.selectedGraph_.Name = graphs[0].Name;
            this.selectedGraph_.RenderEngineGUID = graphs[0].RenderEngineGUID;
        }
        this.graphsListBoxDiv_.appendChild(radioButton);
        var label = document.createElement('label');
        $(label).attr('for', id);
        label.innerHTML = graphs[i].Name;
        this.graphsListBoxDiv_.appendChild(label);

        $(radioButton).on('change', function (event)
        {
            myclass.selectedGraph_.ID = Number(this.id.substring(6));
            var index = this.value.indexOf('|');
            myclass.selectedGraph_.Name = this.value.substring(0, index);
            myclass.selectedGraph_.RenderEngineGUID = this.value.substring(index + 1);
            $('.SelectedGraphName').html(myclass.selectedGraph_.Name);
            var engineName = 'Not found';
            for (var j = 0; j < RENDER_ENGINES.length; j++)
                if (RENDER_ENGINES[j].GetGUID() == myclass.selectedGraph_.RenderEngineGUID)
                    engineName = RENDER_ENGINES[j].GetName();
            $('.SelectedEngineName').html(engineName);
        });
    }
    $(this.graphsListBoxDiv_).buttonset();
    if (this.selectedGraph_ != null)
    {
        $('.SelectedGraphName').html(this.selectedGraph_.Name);
        var engineName = 'Not found';
        for (var j = 0; j < RENDER_ENGINES.length; j++)
            if (RENDER_ENGINES[j].GetGUID() == this.selectedGraph_.RenderEngineGUID)
                engineName = RENDER_ENGINES[j].GetName();
        $('.SelectedEngineName').html(engineName);
    }
    else
    {
        $('.SelectedGraphName').html('&nbsp;');
        $('.SelectedEngineName').html('&nbsp;');
    }
};

/**
 * Update the render engines list in the start panel
 * @private
 */
StartPanelManager.prototype.updateEnginesList = function ()
{
    var myclass = this;
    this.enginesListBoxDiv_.innerHTML = '';

    this.selectedEngine_ = null;

    for (var i = 0; i < RENDER_ENGINES.length; i++)
    {
        var radioButton = document.createElement('input');
        var id = RENDER_ENGINES[i].constructor.name;
        var id = 'engine-' + i;
        radioButton.type = 'radio';
        radioButton.name = 'engines';
        radioButton.value = i;
        radioButton.id = id;
        if (i === 0)
        {
            radioButton.checked = 'checked';
            this.selectedEngine_ = RENDER_ENGINES[0];
        }
        this.enginesListBoxDiv_.appendChild(radioButton);
        var label = document.createElement('label');
        $(label).attr('for', id);
        label.innerHTML = RENDER_ENGINES[i].GetName();
        this.enginesListBoxDiv_.appendChild(label);

        $(radioButton).on('change', function (event)
        {
            myclass.selectedEngine_ = RENDER_ENGINES[this.value];
        });
    }
    $(this.enginesListBoxDiv_).buttonset();
};

/**
 * This function is fired when the start button is clicked
 * @private
 */
StartPanelManager.prototype.onStartButtonClicked = function ()
{
    var myclass = this;

    if (this.selectedGraph_ == null)
    {
        MessageBox.ShowError('Please select a graph');
        return;
    }

    this.graphEngine_ = null;

    for (var i = 0; i < RENDER_ENGINES.length; i++)
        if (RENDER_ENGINES[i].GetGUID() == this.selectedGraph_.RenderEngineGUID)
            this.graphEngine_ = RENDER_ENGINES[i];

    if (this.graphEngine_ == null)
    {
        MessageBox.ShowError('Graph engine not supported');
        return;
    }

    this.selectedQuality_ = 1;
    if ($('#QualityRadioNormal').is(':checked'))
        this.selectedQuality_ = 2;
    else if ($('#QualityRadioHigh').is(':checked'))
        this.selectedQuality_ = 3;

    this.isSidebySide_ = false;
    if ($('#3DOptionsRadioSideBySide').is(':checked'))
        this.isSidebySide_ = true;

    this.isOculusRift_ = false;
    if ($('#3DOptionsRadioOculusRift').is(':checked'))
        this.isOculusRift_ = true;

    this.isGroundEnabled_ = false;
    if ($('#IsGroundEnabledRadioEnabled').is(':checked'))
        this.isGroundEnabled_ = true;

    this.isSilent_ = false;
    if ($('#UsageModeRadioSilent').is(':checked'))
        this.isSilent_ = true;

    this.isMerged_ = false;
    if ($('#UsageModeRadioMerged').is(':checked'))
        this.isMerged_ = true;

    this.isHistory_ = false;
    if ($('#UsageModeRadioHistory').is(':checked'))
        this.isHistory_ = true;

    this.isSendCamera_ = false;
    this.isReceiveCamera_ = false;

    if ($('#CameraRadioSend').is(':checked'))
        this.isSendCamera_ = true;
    else if ($('#CameraRadioReceive').is(':checked'))
        this.isReceiveCamera_ = true;
    else if ($('#CameraRadioBoth').is(':checked'))
    {
        this.isSendCamera_ = true;
        this.isReceiveCamera_ = true;
    }

    this.isFullScreen_ = false;
    if ($('#IsFullScreenRadioYes').is(':checked'))
        this.isFullScreen_ = true;

    this.backgroundColor_ = $('.BGColorBox').css('background-color');

    var folderAccess = $('.SelectedFolderAccess')[0].innerHTML;
    if (folderAccess == 'No Access')
    {
        MessageBox.ShowError('Access denied');
        return;
    }

    if (folderAccess == 'Read only' && !this.isSilent_ && !this.isMerged_ && !this.isHistory_)
    {
        MessageBox.ShowError('You only have read only access to this folder');
        return;
    }

    INTERFACE_MANAGER.OnStartButtonClicked();
};

/**
 * This function is fired when the rename graph button is clicked
 * @private
 */
StartPanelManager.prototype.onRenameGraphButtonClicked = function ()
{
    if (this.selectedGraph_ == null)
    {
        MessageBox.ShowError('Please select a graph');
        return;
    }


    var graphName = this.renameGraphTextBox_.value;

    if (graphName.length == 0)
    {
        MessageBox.ShowError('Please specify graph name');
        return;
    }

    if (graphName.length > 50)
    {
        MessageBox.ShowError('Graph name should be at most 50 characters');
        return;
    }

    var response = WEB_SERVICE.RenameGraph(this.selectedGraph_.ID, graphName);
    if (response.GetIsSuccess())
    {
        this.updateGraphsList(this.selectedFolder_.ID);
        this.renameGraphTextBox_.value = '';
        MessageBox.ShowSuccess('Done');
    }
    else
    {
        MessageBox.ShowError(response.GetErrorMessage());
    }
};

/**
 * This function is fired when the delete graph button is clicked
 * @private
 */
StartPanelManager.prototype.onDeleteGraphButtonClicked = function ()
{
    if (this.selectedGraph_ == null)
    {
        MessageBox.ShowError('Please select a graph');
        return;
    }


    var graphName = this.deleteGraphTextBox_.value;

    if (graphName.length == 0)
    {
        MessageBox.ShowError('Please type the graph name for confirmation');
        return;
    }

    if (graphName.length > 50)
    {
        MessageBox.ShowError('Graph name should be at most 50 characters');
        return;
    }

    if (graphName != this.selectedGraph_.Name)
    {
        MessageBox.ShowError("Typed graph name doesn't match");
        return;
    }

    var response = WEB_SERVICE.DeleteGraph(this.selectedGraph_.ID);
    if (response.GetIsSuccess())
    {
        this.updateGraphsList(this.selectedFolder_.ID);
        this.deleteGraphTextBox_.value = '';
        MessageBox.ShowSuccess('Done');
    }
    else
    {
        MessageBox.ShowError(response.GetErrorMessage());
    }
};

/**
 * This function is fired when the update user button is clicked
 * @private
 */
StartPanelManager.prototype.onUpdateUserButtonClicked = function ()
{

    var firstName = this.userFirstNameTextBox_.value;

    if (firstName.length == 0)
    {
        MessageBox.ShowError('Please specify first name');
        return;
    }

    if (firstName.length > 50)
    {
        MessageBox.ShowError('First name should be at most 50 characters');
        return;
    }

    var lastName = this.userLastNameTextBox_.value;

    if (lastName.length == 0)
    {
        MessageBox.ShowError('Please specify last name');
        return;
    }

    if (lastName.length > 50)
    {
        MessageBox.ShowError('Last name should be at most 50 characters');
        return;
    }

    var email = this.userEmailTextBox_.value;

    if (email.length == 0)
    {
        MessageBox.ShowError('Please specify email');
        return;
    }

    if (email.length > 200)
    {
        MessageBox.ShowError('Email should be at most 50 characters');
        return;
    }

    var newPassword = this.userNewPassswordTextBox_.value;

    if (newPassword.length != 0 && newPassword.length < 10)
    {
        MessageBox.ShowError('Password should be at least 10 characters');
        return;
    }

    if (newPassword.length == 0)
        newPassword = null;

    var response = WEB_SERVICE.UpdateUser(firstName, lastName, email,
        newPassword, null, null);
    if (response.GetIsSuccess())
    {
        MessageBox.ShowSuccess('Done');
    }
    else
    {
        MessageBox.ShowError(response.GetErrorMessage());
    }
};

/**
 * This function is fired when the logout button is clicked
 * @private
 */
StartPanelManager.prototype.onLogoutButtonClicked = function ()
{
    var response = WEB_SERVICE.Logout();
    if (response.GetIsSuccess())
    {
        var HTMLBody = document.getElementsByTagName('body')[0];
        $(HTMLBody).empty();
        INTERFACE_MANAGER.AddLoginPanel(HTMLBody);
    }
    else
        MessageBox.ShowError(response.GetErrorMessage());
};