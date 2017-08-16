/**
 * Creates an InterfaceManager.
 * The main class for user interface
 * @constructor
 */
function InterfaceManager()
{

    var HTMLBody = document.getElementsByTagName('body')[0];

    /** The minimum rendering width in pixels, if window width is smaller than
     * this width, scrollbars will be added instead of adjusting to window size.
     * @private
     * @type {number} */
    this.minimumRenderWidth_ = 800;

    /** The minimum rendering height in pixels, if window height is smaller than
     * this height, scrollbars will be added instead of adjusting to window size.
     * @private
     * @type {number} */
    this.minimumRenderHeight_ = 600;

    /** The rendering width in pixels
     * @private
     * @type {number} */
    this.renderWidth_ = this.minimumRenderWidth_;

    /** The rendering height in pixels
     * @private
     * @type {number} */
    this.renderHeight_ = this.minimumRenderHeight_;

    /** Whether the user interface has a rectangular border toolbar.
     * Oculus rift and side by side 3D modes don't have rectangular border toolbar.
     * @private
     * @type {boolean} */
    this.isBorderLess_ = false;

    /** The DOM input element for the username text box of login panel.
     * @private
     * @type{object|null} */
    this.loginUsernameTextBox_ = null;

    /** The DOM input element for the password text box of login panel.
     * @private
     * @type{object|null} */
    this.loginPasswordTextBox_ = null;

    /** The DOM input element for the username text box of new user panel.
     * @private
     * @type{object|null} */
    this.newUserUsernameTextBox_ = null;

    /** The DOM input element for the password text box of new user panel.
     * @private
     * @type{object|null} */
    this.newUserPasswordTextBox_ = null;

    /** The DOM input element for the repeat password text box of new user panel.
     * @private
     * @type{object|null} */
    this.newUserRepeatPasswordTextBox_ = null;

    /** The DOM input element for the first name text box of new user panel.
     * @private
     * @type{object|null} */
    this.newUserFirstnameTextBox_ = null;

    /** The DOM input element for the last name text box of new user panel.
     * @private
     * @type{object|null} */
    this.newUserLastnameTextBox_ = null;

    /** The DOM input element for the email text box of new user panel.
     * @private
     * @type{object|null} */
    this.newUserEmailTextBox_ = null;

    /** The DOM input element for the username text box of forgot password panel.
     * @private
     * @type{object|null} */
    this.forgotPasswrodUsernameTextBox_ = null;

    /** The DOM input element for the password text box of forgot password panel.
     * @private
     * @type{object|null} */
    this.forgotPasswordEmailTextBox_ = null;

    /** The DOM div element for showing information when mouse is pressed over a
     * vertex, or bend or empty space.
     * @private
     * @type{object|null} */
    this.floatingInfoDiv_ = null;

    this.ResizeRender($(window).width(), $(window).height());
	this.AddLoginPanel(HTMLBody);
    var myclass = this;
    window.onresize = function ()
    {
        myclass.ResizeRender(window.innerWidth, window.innerHeight);
    }
}

/**
 * Adds the login panel, It also adds the title and description.
 * @param {object} htmlBody - the DOM element of the HTML body element
 * @public
 */
InterfaceManager.prototype.AddLoginPanel = function (htmlBody)
{
    var myclass = this;
	
	var titleDiv = document.createElement('div');
	titleDiv.innerHTML = 'We3Graph';
    titleDiv.className = 'TitleDiv';
    htmlBody.appendChild(titleDiv);
	
	var descriptionDiv = document.createElement('div');
	descriptionDiv.innerHTML = 'Web-based drawing software for graphs in 3D';
    descriptionDiv.className = 'DescriptionDiv';
    htmlBody.appendChild(descriptionDiv);

    var loginPanel = document.createElement('div');
    loginPanel.className = 'NarrowPanel';
    htmlBody.appendChild(loginPanel);

    // Username
    var span = document.createElement('span');
    span.innerHTML = 'Username:';
    loginPanel.appendChild(span);

    var breakTag = document.createElement('br');
    loginPanel.appendChild(breakTag);

    this.loginUsernameTextBox_ = document.createElement('input');
    this.loginUsernameTextBox_.type = 'text';
    loginPanel.appendChild(this.loginUsernameTextBox_);

    var breakTag = document.createElement('br');
    loginPanel.appendChild(breakTag);

    // Password
    var span = document.createElement('span');
    span.innerHTML = 'Password:';
    loginPanel.appendChild(span);

    var breakTag = document.createElement('br');
    loginPanel.appendChild(breakTag);

    this.loginPasswordTextBox_ = document.createElement('input');
    this.loginPasswordTextBox_.type = 'password';
    loginPanel.appendChild(this.loginPasswordTextBox_);

    var breakTag = document.createElement('br');
    loginPanel.appendChild(breakTag);


    // Login button
    var button = document.createElement('a');
    button.href = '#';
    button.innerHTML = 'Login';
    button.className = 'Button';
    button.onclick = function ()
    {
        myclass.onLoginButtonClicked(myclass);
    };
    loginPanel.appendChild(button);
    $(button).button({icons: {primary: 'LoginIcon'}});

    // Help Button
    var button = document.createElement('a');
    button.href = 'manual.pdf';
    button.target = '_blank';
    button.innerHTML = 'Help';
    button.className = 'Button';
    loginPanel.appendChild(button);
    $(button).button();

    // New user button
    var button = document.createElement('a');
    button.href = '#';
    button.innerHTML = 'New user';
    button.className = 'Button';
    button.onclick = function ()
    {
        myclass.onNewUserButtonClicked();
    };
    loginPanel.appendChild(button);
    $(button).button();

    // About button
    var button = document.createElement('a');
    button.href = '#';
    button.innerHTML = 'About';
    button.className = 'Button';
    button.onclick = function ()
    {
        myclass.onAboutButtonClicked()
    };
    loginPanel.appendChild(button);
    $(button).button();


    // Forgot password link
    var link = document.createElement('a');
    link.href = '#';
    link.innerHTML = 'Forgot password';
    link.className = 'ForgotPasswordLink';
    link.onclick = function ()
    {
        myclass.onForgotPasswordButtonClicked();
    };
    loginPanel.appendChild(link);
    $(link).css('display', 'inline-block');
    $(link).css('margin-top', '10px');
};

/**
 * This function is fired by StartPanelManger after start button is pressed and
 * processed by StartPanelManger.
 * @public
 */
InterfaceManager.prototype.OnStartButtonClicked = function ()
{
    var myclass = this;

    var graphID = START_PANEL_MANAGER.GetSelectedGraphID();

    this.isBorderLess_ = START_PANEL_MANAGER.GetIsSideBySide() ||
        START_PANEL_MANAGER.GetIsOculusRift();

    var HTMLBody = document.getElementsByTagName('body')[0];
    $(HTMLBody).empty();

    var loadingDiv = document.createElement('div');
    loadingDiv.innerHTML = 'Loading...';
    loadingDiv.className = 'LoadingDiv';
    HTMLBody.appendChild(loadingDiv);

    if (START_PANEL_MANAGER.GetIsFullScreen())
    {
        var el = document.documentElement;
        var rfs = el.requestFullScreen || el.webkitRequestFullScreen ||
            el.mozRequestFullScreen;
        rfs.call(el);

        var width = screen.width;
        var height = screen.height;
        this.ResizeRender(width, height);
    }
    else
    {
        var width = $(window).width();
        var height = $(window).height();
        this.ResizeRender(width, height);
    }

    GRAPH.SetIsReceiveCamera(START_PANEL_MANAGER.GetIsReceiveCamera());

    WEB_SERVICE.NewCommandsEvent = function (commands)
    {
        for (var i = 0; i < commands.length; i++)
        {
            GRAPH.ProcessCommand(commands[i], WEB_SERVICE.GetIsLoading(),
                START_PANEL_MANAGER.GetIsHistory());
            if (!WEB_SERVICE.GetIsLoading())
                myclass.UpdateInformation();
        }
    };

    WEB_SERVICE.GraphLoadedEvent = function ()
    {
        myclass.onGraphLoaded_.call(myclass);
    };

    if (START_PANEL_MANAGER.GetIsSilent() ||
        START_PANEL_MANAGER.GetIsMerged() ||
        START_PANEL_MANAGER.GetIsHistory())
        WEB_SERVICE.SetIsSilent(true);

    var response = WEB_SERVICE.StartGraph(graphID);
    if (!response.GetIsSuccess())
        MessageBox.ShowError(response.GetErrorMessage());
};

/**
 * changes the render size
 * @param{number} width - The width in pixels
 * @param{number} height - The height in pixels
 * @public
 */
InterfaceManager.prototype.ResizeRender = function (width, height)
{
    width -= 2;
    height -= 3;
    if (width > this.minimumRenderWidth_)
        this.renderWidth_ = width;
    else
        this.renderWidth_ = this.minimumRenderWidth_;

    if (height > this.minimumRenderHeight_)
        this.renderHeight_ = height;
    else
        this.renderHeight_ = this.minimumRenderHeight_;

    $('RenderDiv').css('width', this.renderWidth_);
    $('RenderDiv').css('height', this.renderHeight_);
    if (RENDER_MANAGER != null)
        RENDER_MANAGER.Resize(this.renderWidth_, this.renderHeight_);

    if (BORDER_MANAGER != null)
        BORDER_MANAGER.UpdateSize();
};

/**
 * Returns the render width in pixels
 * @public
 * @returns {number}
 */
InterfaceManager.prototype.GetRenderWidth = function ()
{
    return this.renderWidth_;
};

/**
 * Returns the render height in pixels
 * @public
 * @returns {number}
 */
InterfaceManager.prototype.GetRenderHeight = function ()
{
    return this.renderHeight_;
};

/**
 * Updates the user interface with respect to selection or camera information
 * @public
 */
InterfaceManager.prototype.UpdateInformation = function ()
{
    if (!this.isBorderLess_)
    {
        BORDER_MANAGER.UpdateZoomButtons.call(BORDER_MANAGER);
        ACCORDION_MANAGER.UpdateMainPanel();
        ACCORDION_MANAGER.UpdateCustomPropertyPanels();
    }

    var selectionType = GRAPH.GetSelectionType();
    var selection = GRAPH.GetSelection();

    if (selectionType == SELECTION_TYPE.None)
    {
        var pos = RENDER_MANAGER.GetCameraPosition();
        var rot = RENDER_MANAGER.GetCameraRotationDegrees();

        var posText = pos.x.toFixed(0) + ',' +
            pos.y.toFixed(0) + ',' + pos.z.toFixed(0);
        var rotText = rot.x.toFixed(0) + ',' +
            rot.y.toFixed(0) + ',' + rot.z.toFixed(0);

        var text = 'Camera | ' + posText + ' | ' + rotText;
        this.floatingInfoDiv_.innerHTML = text;
        if (!this.isBorderLess_)
            BORDER_MANAGER.ChangeStatusInfo(text);
    }
    else if (selectionType == SELECTION_TYPE.SingleVertex)
    {
        var pos = selection[0].GetPosition();
        var text = 'Vertex: ' + pos.x.toFixed(0) + ',' +
            pos.y.toFixed(0) + ',' + pos.z.toFixed(0);
        this.floatingInfoDiv_.innerHTML = text;
        if (!this.isBorderLess_)
            BORDER_MANAGER.ChangeStatusInfo(text);
    }
    else if (selectionType == SELECTION_TYPE.SingleBend)
    {
        var pos = selection[0].GetPosition();
        var text = 'Bend: ' + pos.x.toFixed(0) + ',' +
            pos.y.toFixed(0) + ',' + pos.z.toFixed(0);
        this.floatingInfoDiv_.innerHTML = text;
        if (!this.isBorderLess_)
            BORDER_MANAGER.ChangeStatusInfo(text);
    }
    else if (selectionType == SELECTION_TYPE.SingleEdge)
    {
        var pos = selection[0].GetPosition();
        var text = 'Edge';
        this.floatingInfoDiv_.innerHTML = text;
        if (!this.isBorderLess_)
            BORDER_MANAGER.ChangeStatusInfo(text);
    }
    else
    {
        this.floatingInfoDiv_.innerHTML = 'Multiple selection';
        if (!this.isBorderLess_)
            BORDER_MANAGER.ChangeStatusInfo('Multiple selection');
    }
};

/**
 * This function is fired when graph has finished loading phase
 * @private
 */
InterfaceManager.prototype.onGraphLoaded_ = function ()
{
    var myclass = this;

    var HTMLBody = document.getElementsByTagName('body')[0];
    $(HTMLBody).empty();

    this.floatingInfoDiv_ = document.createElement('div');
    this.floatingInfoDiv_.className = 'FloatingInfoDiv';
    this.floatingInfoDiv_.innerHTML = '&nbsp;';
    HTMLBody.appendChild(this.floatingInfoDiv_);

    renderDiv = document.createElement('div');
    renderDiv.className = 'RenderDiv';
    HTMLBody.appendChild(renderDiv);


    RENDER_MANAGER = new RenderManager(renderDiv, this.renderWidth_, this.renderHeight_);
    RENDER_MANAGER.Start();

    ACTION_MANAGER = new ActionManager();

    if (!this.isBorderLess_)
        BORDER_MANAGER = new BorderManager(renderDiv);

    if (!this.isBorderLess_)
    {
        BORDER_MANAGER.UpdateActionMode();
        BORDER_MANAGER.UpdateZoomButtons();
        BORDER_MANAGER.UpdateSize();
        if (!RENDER_MANAGER.GetEngine().IsMultipleEdgesAllowed() ||
            START_PANEL_MANAGER.GetIsMerged() || START_PANEL_MANAGER.GetIsHistory())
        {
            $('.NextEdgeButton').css('display', 'none');
        }
    }

    WEB_SERVICE.NetworkStatusChangeEvent = function ()
    {
        myclass.updateNetworkInfo.call(myclass);
    };

    if (KEYBOARD_MANAGER != null)
        KEYBOARD_MANAGER.Start();

    var mouseManager = new MouseManager();
    mouseManager.Start();

    var touchManager = new TouchManager();
    touchManager.Start();


    $('.Button').button();

    this.UpdateInformation();
};

/**
 * Updates the user interface with respect to network connection status
 * @private
 */
InterfaceManager.prototype.updateNetworkInfo = function ()
{
    if (this.isBorderLess_)
        return;

    var text = 'Connected';
    var isConnected = true;

    var disconnectedTime = WEB_SERVICE.GetDisconnectedTime();

    disconnectedTime = (disconnectedTime / 1000).toFixed(1);

    if (disconnectedTime > 0)
    {
        text = 'Disconnected for ' + disconnectedTime + ' seconds';
        isConnected = false;
    }
    BORDER_MANAGER.ChangeNetworkInfo(isConnected, text);
};


/**
 * This method is fired when login button is clicked
 * @private
 */
InterfaceManager.prototype.onLoginButtonClicked = function ()
{

    var username = this.loginUsernameTextBox_.value;
    var password = this.loginPasswordTextBox_.value;

    if (username.length < 1)
    {
        MessageBox.ShowError('Please enter the username');
        return;
    }

    if (password.length < 1)
    {
        MessageBox.ShowError('Please enter the password');
        return;
    }

    if (password.length < 10)
    {
        MessageBox.ShowError('Password should be at least 10 character');
        return;
    }

    if (password.length > 30)
    {
        MessageBox.ShowError('Password should be at most 30 character');
        return;
    }

    var response = WEB_SERVICE.Login(username, password);

    if (response.GetIsSuccess())
    {
        var HTMLBody = document.getElementsByTagName('body')[0];
        $(HTMLBody).empty();

        if (WEB_SERVICE.IsAdmin())
        {
            ADMIN_PANEL_MANAGER = new AdminPanelManager(this);
            ADMIN_PANEL_MANAGER.Display(HTMLBody);
        }
        else
        {
            START_PANEL_MANAGER = new StartPanelManager(this);
            START_PANEL_MANAGER.Display(HTMLBody);
        }
    }
    else
        MessageBox.ShowError(response.GetErrorMessage());
};

/**
 * This method is fired when about button is clicked
 * @private
 */
InterfaceManager.prototype.onAboutButtonClicked = function ()
{
    MessageBox.Show('<br/>We3Graph<br/><br/>Version 1.1<br/><br/>' +
            'Copyright &#169; 2015-2017 Farshad Barahimi<br/><br/>' +
            'License: The MIT License<br/><br/>' +
            'Github repository: <br/><a href="https://github.com/farshad-barahimi/we3graph">https://github.com/farshad-barahimi/we3graph</a><br/><br/>'
        , 'About We3Graph');
};

/**
 * Adds the new user panel
 * @param {object} htmlBody - the DOM element of the HTML body element
 * @private
 */
InterfaceManager.prototype.addNewUserPanel = function (htmlBody)
{
    var myclass = this;

    var newUserPanel = document.createElement('div');
    newUserPanel.className = 'NarrowPanel';
    htmlBody.appendChild(newUserPanel);

    // Username
    var span = document.createElement('span');
    span.innerHTML = 'Username:';
    newUserPanel.appendChild(span);

    var breakTag = document.createElement('br');
    newUserPanel.appendChild(breakTag);

    this.newUserUsernameTextBox_ = document.createElement('input');
    this.newUserUsernameTextBox_.type = 'text';
    newUserPanel.appendChild(this.newUserUsernameTextBox_);

    var breakTag = document.createElement('br');
    newUserPanel.appendChild(breakTag);

    // Password
    var span = document.createElement('span');
    span.innerHTML = 'Password:';
    newUserPanel.appendChild(span);

    var breakTag = document.createElement('br');
    newUserPanel.appendChild(breakTag);

    this.newUserPasswordTextBox_ = document.createElement('input');
    this.newUserPasswordTextBox_.type = 'password';
    newUserPanel.appendChild(this.newUserPasswordTextBox_);

    var breakTag = document.createElement('br');
    newUserPanel.appendChild(breakTag);

    // Repeat Password
    var span = document.createElement('span');
    span.innerHTML = 'Repeat password:';
    newUserPanel.appendChild(span);

    var breakTag = document.createElement('br');
    newUserPanel.appendChild(breakTag);

    this.newUserRepeatPasswordTextBox_ = document.createElement('input');
    this.newUserRepeatPasswordTextBox_.type = 'password';
    newUserPanel.appendChild(this.newUserRepeatPasswordTextBox_);

    var breakTag = document.createElement('br');
    newUserPanel.appendChild(breakTag);

    // First name
    var span = document.createElement('span');
    span.innerHTML = 'First name:';
    newUserPanel.appendChild(span);

    var breakTag = document.createElement('br');
    newUserPanel.appendChild(breakTag);

    this.newUserFirstnameTextBox_ = document.createElement('input');
    this.newUserFirstnameTextBox_.type = 'text';
    newUserPanel.appendChild(this.newUserFirstnameTextBox_);

    var breakTag = document.createElement('br');
    newUserPanel.appendChild(breakTag);

    // Last name
    var span = document.createElement('span');
    span.innerHTML = 'Last name:';
    newUserPanel.appendChild(span);

    var breakTag = document.createElement('br');
    newUserPanel.appendChild(breakTag);

    this.newUserLastnameTextBox_ = document.createElement('input');
    this.newUserLastnameTextBox_.type = 'text';
    newUserPanel.appendChild(this.newUserLastnameTextBox_);

    var breakTag = document.createElement('br');
    newUserPanel.appendChild(breakTag);

    // Email
    var span = document.createElement('span');
    span.innerHTML = 'Email:';
    newUserPanel.appendChild(span);

    var breakTag = document.createElement('br');
    newUserPanel.appendChild(breakTag);

    this.newUserEmailTextBox_ = document.createElement('input');
    this.newUserEmailTextBox_.type = 'text';
    newUserPanel.appendChild(this.newUserEmailTextBox_);

    var breakTag = document.createElement('br');
    newUserPanel.appendChild(breakTag);


    // Create user button
    var button = document.createElement('a');
    button.href = '#';
    button.innerHTML = 'Create';
    button.className = 'Button';
    button.onclick = function ()
    {
        myclass.onCreateUserButtonClicked(myclass);
    };
    newUserPanel.appendChild(button);
    $(button).button();

    // Cancel create user button
    var button = document.createElement('a');
    button.href = '#';
    button.innerHTML = 'Cancel';
    button.className = 'Button';
    button.onclick = function ()
    {
        myclass.onCancelCreateUserButtonClicked(myclass);
    };
    newUserPanel.appendChild(button);
    $(button).button();
};

/**
 * This method is fired when new user button is clicked
 * @private
 */
InterfaceManager.prototype.onNewUserButtonClicked = function ()
{
    var HTMLBody = document.getElementsByTagName('body')[0];
    $(HTMLBody).empty();
    INTERFACE_MANAGER.addNewUserPanel(HTMLBody);
};

/**
 * This method is fired when cancel button is clicked in create user panel
 * @private
 */
InterfaceManager.prototype.onCancelCreateUserButtonClicked = function ()
{
    var HTMLBody = document.getElementsByTagName('body')[0];
    $(HTMLBody).empty();
    INTERFACE_MANAGER.AddLoginPanel(HTMLBody);
};

/**
 * This method is fired when create user button is clicked
 * @private
 */
InterfaceManager.prototype.onCreateUserButtonClicked = function ()
{

    var username = this.newUserUsernameTextBox_.value;
    var password = this.newUserPasswordTextBox_.value;
    var repeatPassword = this.newUserRepeatPasswordTextBox_.value;
    var firstName = this.newUserFirstnameTextBox_.value;
    var lastName = this.newUserLastnameTextBox_.value;
    var email = this.newUserEmailTextBox_.value;

    if (username.length < 1)
    {
        MessageBox.ShowError('Please enter the username');
        return;
    }

    if (password != repeatPassword)
    {
        MessageBox.ShowError('The passwords entered do not match');
        return;
    }

    if (password.length < 1)
    {
        MessageBox.ShowError('Please enter the password');
        return;
    }

    if (password.length < 10)
    {
        MessageBox.ShowError('Password should be at least 10 character');
        return;
    }

    if (password.length > 30)
    {
        MessageBox.ShowError('Password should be at most 30 character');
        return;
    }

    if (firstName.length < 1)
    {
        MessageBox.ShowError('Please enter the first name');
        return;
    }

    if (lastName.length < 1)
    {
        MessageBox.ShowError('Please enter the last name');
        return;
    }

    if (email.length < 1)
    {
        MessageBox.ShowError('Please enter the email');
        return;
    }

    var response = WEB_SERVICE.CreateUser(username, password, firstName, lastName, email);

    if (response.GetIsSuccess())
    {
        MessageBox.Show('User created successfully');
        var HTMLBody = document.getElementsByTagName('body')[0];
        $(HTMLBody).empty();
        INTERFACE_MANAGER.AddLoginPanel(HTMLBody);
    }
    else
        MessageBox.ShowError(response.GetErrorMessage());
};

/**
 * Adds the forgot password panel
 * @param {object} htmlBody - the DOM element of the HTML body element
 * @private
 */
InterfaceManager.prototype.addForgotPasswordPanel = function (htmlBody)
{
    var myclass = this;

    var forgotPasswordPanel = document.createElement('div');
    forgotPasswordPanel.className = 'NarrowPanel';
    htmlBody.appendChild(forgotPasswordPanel);

    // Username
    var span = document.createElement('span');
    span.innerHTML = 'Username:';
    forgotPasswordPanel.appendChild(span);

    var breakTag = document.createElement('br');
    forgotPasswordPanel.appendChild(breakTag);

    this.forgotPasswrodUsernameTextBox_ = document.createElement('input');
    this.forgotPasswrodUsernameTextBox_.type = 'text';
    forgotPasswordPanel.appendChild(this.forgotPasswrodUsernameTextBox_);

    var breakTag = document.createElement('br');
    forgotPasswordPanel.appendChild(breakTag);

    // Email
    var span = document.createElement('span');
    span.innerHTML = 'Email:';
    forgotPasswordPanel.appendChild(span);

    var breakTag = document.createElement('br');
    forgotPasswordPanel.appendChild(breakTag);

    this.forgotPasswordEmailTextBox_ = document.createElement('input');
    this.forgotPasswordEmailTextBox_.type = 'text';
    forgotPasswordPanel.appendChild(this.forgotPasswordEmailTextBox_);

    var breakTag = document.createElement('br');
    forgotPasswordPanel.appendChild(breakTag);


    // Ok button
    var button = document.createElement('a');
    button.href = '#';
    button.innerHTML = 'OK';
    button.className = 'Button';
    button.onclick = function ()
    {
        myclass.OnForgotPasswordOKButtonClicked(myclass);
    };
    forgotPasswordPanel.appendChild(button);
    $(button).button();

    // Cancel create user button
    var button = document.createElement('a');
    button.href = '#';
    button.innerHTML = 'Cancel';
    button.className = 'Button';
    button.onclick = function ()
    {
        myclass.onCancelForgotPasswordButtonClicked(myclass);
    };
    forgotPasswordPanel.appendChild(button);
    $(button).button();
};

/**
 * This method is fired when cancel button is clicked in forgot password panel
 * @private
 */
InterfaceManager.prototype.onCancelForgotPasswordButtonClicked = function ()
{
    var HTMLBody = document.getElementsByTagName('body')[0];
    $(HTMLBody).empty();
    INTERFACE_MANAGER.AddLoginPanel(HTMLBody);
};

/**
 * This method is fired when forgot password button is clicked
 * @private
 */
InterfaceManager.prototype.onForgotPasswordButtonClicked = function ()
{
    var HTMLBody = document.getElementsByTagName('body')[0];
    $(HTMLBody).empty();
    INTERFACE_MANAGER.addForgotPasswordPanel(HTMLBody);
};

/**
 * This method is fired when OK button is clicked in forgot password panel
 * @private
 */
InterfaceManager.prototype.OnForgotPasswordOKButtonClicked = function ()
{
    var username = this.forgotPasswrodUsernameTextBox_.value;
    var email = this.forgotPasswordEmailTextBox_.value;

    if (username.length < 1)
    {
        MessageBox.ShowError('Please enter the username');
        return;
    }

    if (email.length < 1)
    {
        MessageBox.ShowError('Please enter the email');
        return;
    }


    var response = WEB_SERVICE.SendResetPasswordRequest(username, email);

    if (response.GetIsSuccess())
    {
        var HTMLBody = document.getElementsByTagName('body')[0];
        $(HTMLBody).empty();
        this.addResetPasswordPanel(HTMLBody);
        MessageBox.ShowSuccess('A code has been sent to your email<br/>' +
            'Enter that code in the code box and change your password');
    }
    else
        MessageBox.ShowError(response.GetErrorMessage());
};

/**
 * Adds the reset password panel
 * @param {object} htmlBody - the DOM element of the HTML body element
 * @private
 */
InterfaceManager.prototype.addResetPasswordPanel = function (htmlBody)
{
    var myclass = this;

    var resetPasswordPanel = document.createElement('div');
    resetPasswordPanel.className = 'NarrowPanel';
    htmlBody.appendChild(resetPasswordPanel);
    $(resetPasswordPanel).css('width', '550px');

    // Code
    var span = document.createElement('span');
    span.innerHTML = 'Code:';
    resetPasswordPanel.appendChild(span);

    var breakTag = document.createElement('br');
    resetPasswordPanel.appendChild(breakTag);

    this.resetPasswordCodeTextBox_ = document.createElement('input');
    this.resetPasswordCodeTextBox_.type = 'text';
    resetPasswordPanel.appendChild(this.resetPasswordCodeTextBox_);
    $(this.resetPasswordCodeTextBox_).css('width', '550px');

    var breakTag = document.createElement('br');
    resetPasswordPanel.appendChild(breakTag);

    // New password
    var span = document.createElement('span');
    span.innerHTML = 'New password:';
    resetPasswordPanel.appendChild(span);

    var breakTag = document.createElement('br');
    resetPasswordPanel.appendChild(breakTag);

    this.resetPasswordNewPasswordTextBox_ = document.createElement('input');
    this.resetPasswordNewPasswordTextBox_.type = 'password';
    resetPasswordPanel.appendChild(this.resetPasswordNewPasswordTextBox_);

    var breakTag = document.createElement('br');
    resetPasswordPanel.appendChild(breakTag);

    // Change button
    var button = document.createElement('a');
    button.href = '#';
    button.innerHTML = 'Change';
    button.className = 'Button';
    button.onclick = function ()
    {
        myclass.OnResetPasswordChangeButtonClicked(myclass);
    };
    resetPasswordPanel.appendChild(button);
    $(button).button();

    // Cancel reset password button
    var button = document.createElement('a');
    button.href = '#';
    button.innerHTML = 'Cancel';
    button.className = 'Button';
    button.onclick = function ()
    {
        myclass.onCancelForgotPasswordButtonClicked(myclass);
    };
    resetPasswordPanel.appendChild(button);
    $(button).button();

};

/**
 * This method is fired when change button is clicked in reset password panel
 * @private
 */
InterfaceManager.prototype.OnResetPasswordChangeButtonClicked = function ()
{
    var code = this.resetPasswordCodeTextBox_.value;
    var newPassword = this.resetPasswordNewPasswordTextBox_.value;

    if (code.length < 1)
    {
        MessageBox.ShowError('Please enter the code');
        return;
    }

    var index = code.indexOf('-');
    if (index < 1 || index == code.length - 1)
    {
        MessageBox.ShowError('Code is not in correct format');
        return;
    }

    var userID = code.substring(0, index);
    var whoToken = code.substring(index + 1);

    if (newPassword.length < 1)
    {
        MessageBox.ShowError('Please enter the new password');
        return;
    }

    if (newPassword.length < 10)
    {
        MessageBox.ShowError('Password should be at least 10 characters');
        return;
    }

    var response = WEB_SERVICE.UpdateUser(null, null, null, newPassword, userID, whoToken);
    if (response.GetIsSuccess())
        MessageBox.ShowError(response.GetErrorMessage());

    var HTMLBody = document.getElementsByTagName('body')[0];
    $(HTMLBody).empty();
    INTERFACE_MANAGER.AddLoginPanel(HTMLBody);
    MessageBox.ShowSuccess('Done');
};