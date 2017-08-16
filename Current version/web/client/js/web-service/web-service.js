/**
 * The WebService class
 * It connects to the Rest Web Service
 * @constructor
 * @param {string} serviceURL - The REST web service URL
 */
function WebService(serviceURL)
{
    /** @private
     * @type {string} */
    this.serviceURL_ = serviceURL;

    /** @private
     * @type {number} */
    this.graphID_ = null;

    /** @private
     * @type {number} */
    this.clientID_ = null;

    /** @private
     * @type {string} */
    this.whoToken_ = null;

    /** @private
     * @type {number} */
    this.userID_ = null;

    /** @private
     * @type {string} */
    this.graphAccessToken_ = null;

    /** The queue for outgoing commands
     * @private
     * @type {string} */
    this.outgoingCommandQueue_ = new Array();

    /** The status of sending a command in outgoing commands queue
     * Possible values are 'Sending', 'Finished' and 'Failure'
     * @private
     * @type {number} */
    this.sendResult_ = 'Finished';

    /** The last command that has been tried to be sent
     * @private
     * @type {Command} */
    this.lastCommandSent_ = null;

    /** The ID of last command received
     * @private
     * @type {number} */
    this.lastCommandIDRecieved_ = 0;

    /** The status of checking for new commands
     * Possible values are 'Checking' and 'Ready'
     * @private
     * @type {number} */
    this.checkStatus_ = 'Ready';

    /** Whether the graph has finished loading
     * @private
     * @type {boolean} */
    this.isLoading_ = true;

    /** The number of millisecond that the network is disconneced
     * 0 means the network is connected
     * @private
     * @type {number} */
    this.disconnectedStartTime_ = null;
    this.isSilent_ = false;

    /** The interval number for periodically checking new commands
     * @type {number}
     * @private */
    this.incommingIntervalNumber_ = null;

    /** This function will be called when new commands are received
     * @type {function}
     * @public */
    this.NewCommandsEvent = null;

    /** This function will be called when graph is loaded
     * @type {function}
     * @public */
    this.GraphLoadedEvent = null;

    /** This function will be called when network status is changed
     * @type {function}
     * @public */
    this.NetworkStatusChangeEvent = null;
}

/**
 * Logins using the username and password provided
 * @param{string} username
 * @param{string} password
 * @returns {ServiceResponse}
 * @public
 */
WebService.prototype.Login = function (username, password)
{
    var myclass = this;

    var request = this.createXMLHttpRequest();

    var url = this.serviceURL_ + 'who-tokens';

    var params = new Object();
    params.Username = username;
    params.Password = password;
    postBody = JSON.stringify(params);

    request.open('Post', url, false);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(postBody);

    if (request.status != 200)
    {
        if (request.status == 401)
            return new ServiceResponse(false, 'Invalid username or password');
        else
            return new ServiceResponse(false, 'Error in authenication process');
    }

    var responseObject = JSON.parse(request.responseText);
    this.userID_ = responseObject.UserID;
    this.whoToken_ = responseObject.WhoToken;

    return new ServiceResponse(true);
};

/**
 * Starts the web serivce and loops for incoming commands
 * @param{number} graphID - The ID of the graph to use
 * @public
 * @returns {ServiceResponse}
 */
WebService.prototype.StartGraph = function (graphID)
{
    var myclass = this;

    this.graphID_ = graphID;
    if (!this.getGraphAccessToken())
        return new ServiceResponse(false, 'Error in Starting the graph');

    if (!this.getClientID())
        return new ServiceResponse(false, 'Error in Starting the graph');

    this.incommingIntervalNumber_ = setInterval(function ()
    {
        myclass.syncIncomingCommands.call(myclass);
    }, 100);

    return new ServiceResponse(true);
};

/**
 * Stops process graphs and restarts to original state
 * @public
 */
WebService.prototype.StopGraph = function ()
{
    this.graphID_ = null;
    clearInterval(this.incommingIntervalNumber_);
    this.outgoingCommandQueue_ = new Array();
    this.sendResult_ = 'Finished';
    this.lastCommandSent_ = null;
    this.lastCommandIDRecieved_ = 0;
    this.checkStatus_ = 'Ready';
    this.isLoading_ = true;
    this.graphAccessToken_ = null;
    this.clientID_ = null;
    this.isSilent_ = false;
};

/**
 * Log out current user
 * @public
 * @return{ServiceResponse}
 */
WebService.prototype.Logout = function ()
{
    var request = this.createXMLHttpRequest();

    var url = this.serviceURL_ + '/who-tokens/' + this.whoToken_ + '?UserID=' + this.userID_;

    request.open('Delete', url, false);
    request.send();


    if (request.status != 200)
        return new ServiceResponse(false, 'Error in Logout process');

    this.userID_ = null;
    this.whoToken_ = null;
    return new ServiceResponse(true);
};

/**
 * Adds a command to outgoing commands queue and tries to send it
 * @param {string} name - The name of the command
 * @param {string} parameters - The name of parameters
 * @public
 */
WebService.prototype.RunCommand = function (name, parameters)
{
    var command = new Command(name, parameters);
    this.outgoingCommandQueue_.push(command);
    this.syncOutgoingQueue();
};

/**
 * Return the list of all folders
 * @private
 * @returns {ServiceResponse}
 */
WebService.prototype.GetFolders = function ()
{
    var request = this.createXMLHttpRequest();

    var url = this.serviceURL_ + 'folders?UserID=' + this.userID_ +
        '&WhoToken=' + this.whoToken_;

    request.open('Get', url, false);
    request.send();

    if (request.status != 200)
        return new ServiceResponse(false, 'Error in getting list of folders');

    var data = JSON.parse(request.responseText);
    return new ServiceResponse(true, null, data);
};

/**
 * return the folder permission as well as graphs in that folder
 * @param {number} folderID
 * @public
 * @returns {ServiceResponse}
 */
WebService.prototype.GetFolderInfo = function (folderID)
{
    var request = this.createXMLHttpRequest();

    var url = this.serviceURL_ + 'folders/' + folderID + '?UserID=' + this.userID_ +
        '&WhoToken=' + this.whoToken_;

    request.open('Get', url, false);
    request.send();


    if (request.status != 200)
        return new ServiceResponse(false, 'Error in getting folder information');

    var data = JSON.parse(request.responseText);
    return new ServiceResponse(true, null, data);
};

/**
 * Creates a new graph
 * @param{string} graphName - The name of graph
 * @param{number} folderID - The ID folder to create graph in
 * @param{string} renderEngineGUID - The GUID for the render engine of the graph
 * @returns {ServiceResponse}
 * @public
 */
WebService.prototype.CreateGraph = function (graphName, folderID, renderEngineGUID)
{
    var request = this.createXMLHttpRequest();

    var url = this.serviceURL_ + 'graphs';

    var params = new Object();
    params.UserID = this.userID_;
    params.WhoToken = this.whoToken_;
    params.GraphName = graphName;
    params.FolderID = folderID;
    params.RenderEngineGUID = renderEngineGUID;
    postBody = JSON.stringify(params);

    request.open('Post', url, false);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(postBody);

    if (request.status != 200)
        return new ServiceResponse(false, 'Error in creating the new graph');

    return new ServiceResponse(true);
};

/**
 * Renames a graph.
 * @param{number} graphID - The ID of teh graph to rename
 * @param{string} graphName - The new name
 * @returns {ServiceResponse}
 * @public
 */
WebService.prototype.RenameGraph = function (graphID, graphName)
{
    var request = this.createXMLHttpRequest();

    var url = this.serviceURL_ + 'graphs/' + graphID;

    var params = new Object();
    params.UserID = this.userID_;
    params.WhoToken = this.whoToken_;
    params.GraphName = graphName;
    postBody = JSON.stringify(params);

    request.open('Post', url, false);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(postBody);

    if (request.status != 200)
        return new ServiceResponse(false, 'Error in renaming the graph');


    return new ServiceResponse(true);
};

/**
 * Deletes a graph
 * @param{number} graphID - The ID of the graph to delete
 * @returns {ServiceResponse}
 * @public
 */
WebService.prototype.DeleteGraph = function (graphID)
{
    var request = this.createXMLHttpRequest();

    var url = this.serviceURL_ + 'graphs/' + graphID + '?UserID=' + this.userID_ + '&WhoToken=' + this.whoToken_;

    request.open('Delete', url, false);
    request.send();

    if (request.status != 200)
        return new ServiceResponse(false, 'Error in deleting the graph');


    return new ServiceResponse(true);
};

/**
 * Returns the current user information
 * @public
 * @returns {ServiceResponse}
 */
WebService.prototype.GetUserInfo = function ()
{
    var request = this.createXMLHttpRequest();

    var url = this.serviceURL_ + 'users/' + this.userID_ +
        '?WhoToken=' + this.whoToken_;

    request.open('Get', url, false);
    request.send();

    if (request.status != 200)
        return new ServiceResponse(false, 'Error in getting user information');

    var data = JSON.parse(request.responseText);
    return new ServiceResponse(true, null, data);
};

/**
 * Searches for a user based on a keyword
 * @param{string} keyword
 * @public
 * @returns {ServiceResponse}
 */
WebService.prototype.SearchUsers = function (keyword)
{
    var request = this.createXMLHttpRequest();

    var url = this.serviceURL_ + 'users?UserID=' + this.userID_ +
        '&WhoToken=' + this.whoToken_ + '&Keyword=' + keyword;

    request.open('Get', url, false);
    request.send();

    if (request.status != 200)
        return new ServiceResponse(false, 'Error in searching the users');

    var data = JSON.parse(request.responseText);
    return new ServiceResponse(true, null, data);
};

/**
 * Updates the user information
 * @param{(string|null)} firstName - null to keep unchanged
 * @param{(string|null)} lastName - null to keep unchanged
 * @param{(string|null)} email - null to keep unchanged
 * @param{(string|null)} password - null to keep unchanged
 * @param{(string|null)} userID - null to use WebService user ID
 * @param{(string|null)} whoToken - null to use WebService who token
 * @returns {ServiceResponse}
 * @public
 */
WebService.prototype.UpdateUser = function
    (firstName, lastName, email, password, userID, whoToken)
{
    var request = this.createXMLHttpRequest();

    if (userID == null)
        userID = this.userID_;
    var url = this.serviceURL_ + 'users/' + userID;


    var params = new Object();

    if (whoToken == null)
        params.WhoToken = this.whoToken_;
    else
        params.WhoToken = whoToken;

    if (firstName != null)
        params.FirstName = firstName;
    if (lastName != null)
        params.LastName = lastName;
    if (email != null)
        params.Email = email;
    if (password != null)
        params.Password = password;
    postBody = JSON.stringify(params);

    request.open('Put', url, false);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(postBody);

    if (request.status != 200)
        return new ServiceResponse(false, 'Error in updating the user');

    return new ServiceResponse(true);
};

/**
 * Return the number of milliseconds where network has been disconnected
 * @return{number} - 0 if connected, otherwise the number of milliseconds disconnected.
 * @private
 */
WebService.prototype.GetDisconnectedTime = function ()
{
    if (this.disconnectedStartTime_ == null)
        return 0;
    var date = new Date();
    return date.getTime() - this.disconnectedStartTime_;
};

/**
 * Creates a new user
 * @param{string} username
 * @param{string} password
 * @param{string} firstName
 * @param{string} lastName
 * @param{string} email
 * @returns {ServiceResponse}
 * @public
 */
WebService.prototype.CreateUser = function (username, password, firstName, lastName, email)
{
    var myclass = this;

    var request = this.createXMLHttpRequest();

    var url = this.serviceURL_ + 'users';

    var params = new Object();
    params.Username = username;
    params.Password = password;
    params.FirstName = firstName;
    params.LastName = lastName;
    params.Email = email;
    postBody = JSON.stringify(params);

    request.open('Post', url, false);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(postBody);

    if (request.status != 200)
        return new ServiceResponse(false, 'Error in creating the new user.');

    return new ServiceResponse(true);
};

/**
 * Determines whether the admin user is logged in or not
 * The user with ID 1 is considered as admin
 * @public
 * @return{boolean}
 */
WebService.prototype.IsAdmin = function ()
{
    if (this.userID_ == 1)
        return true;
    else
        return false;
};

/**
 * return the list of all groups
 * @returns {ServiceResponse}
 * @public
 */
WebService.prototype.GetGroups = function ()
{
    var request = this.createXMLHttpRequest();

    var url = this.serviceURL_ + 'groups?UserID=' + this.userID_ +
        '&WhoToken=' + this.whoToken_;

    request.open('Get', url, false);
    request.send();

    if (request.status != 200)
        return new ServiceResponse(false, 'Error in getting the list of groups');

    var data = JSON.parse(request.responseText);
    return new ServiceResponse(true, null, data);
};

/**
 * Creates a new folder
 * @param folderName
 * @returns {ServiceResponse}
 * @public
 */
WebService.prototype.CreateFolder = function (folderName)
{
    var request = this.createXMLHttpRequest();

    var url = this.serviceURL_ + 'folders';

    var params = new Object();
    params.UserID = this.userID_;
    params.WhoToken = this.whoToken_;
    params.FolderName = folderName;
    postBody = JSON.stringify(params);

    request.open('Post', url, false);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(postBody);

    if (request.status != 200)
        return new ServiceResponse(false, 'Error in creating the new folder');


    return new ServiceResponse(true);
};

/**
 * Creates a new group
 * @param{string} groupName
 * @returns{ServiceResponse}
 * @public
 */
WebService.prototype.CreateGroup = function (groupName)
{
    var request = this.createXMLHttpRequest();

    var url = this.serviceURL_ + 'groups';

    var params = new Object();
    params.UserID = this.userID_;
    params.WhoToken = this.whoToken_;
    params.GroupName = groupName;
    postBody = JSON.stringify(params);

    request.open('Post', url, false);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(postBody);

    if (request.status != 200)
        return new ServiceResponse(false, 'Error in creating the new group');


    return new ServiceResponse(true);
};

/**
 * Renames a folder
 * @param{string} folderID - The ID of the folder to rename
 * @param folderName - The new name
 * @returns {ServiceResponse}
 * @public
 */
WebService.prototype.RenameFolder = function (folderID, folderName)
{
    var request = this.createXMLHttpRequest();

    var url = this.serviceURL_ + 'folders/' + folderID;

    var params = new Object();
    params.UserID = this.userID_;
    params.WhoToken = this.whoToken_;
    params.FolderName = folderName;
    postBody = JSON.stringify(params);

    request.open('Post', url, false);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(postBody);

    if (request.status != 200)
        return new ServiceResponse(false, 'Error in renaming the folder');


    return new ServiceResponse(true);
};

/**
 * Renames a group
 * @param{string} groupID - The ID of the group to rename
 * @param{string} groupName - The new nameof the group
 * @returns {ServiceResponse}
 * @public
 */
WebService.prototype.RenameGroup = function (groupID, groupName)
{
    var request = this.createXMLHttpRequest();

    var url = this.serviceURL_ + 'groups/' + groupID;

    var params = new Object();
    params.UserID = this.userID_;
    params.WhoToken = this.whoToken_;
    params.GroupName = groupName;
    postBody = JSON.stringify(params);

    request.open('Post', url, false);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(postBody);

    if (request.status != 200)
        return new ServiceResponse(false, 'Error in renaming the group');


    return new ServiceResponse(true);
};

/**
 * Deletes a folder
 * @param folderID - The ID of teh folder to delete
 * @returns {ServiceResponse}
 * @public
 */
WebService.prototype.DeleteFolder = function (folderID)
{
    var request = this.createXMLHttpRequest();

    var url = this.serviceURL_ + 'folders/' + folderID + '?UserID=' + this.userID_ + '&WhoToken=' + this.whoToken_;

    request.open('Delete', url, false);
    request.send();

    if (request.status != 200)
        return new ServiceResponse(false, 'Error in deleting the folder');


    return new ServiceResponse(true);
};

/**
 * Deletes a group
 * @param groupID - The ID of the group to delete
 * @returns {ServiceResponse}
 * @public
 */
WebService.prototype.DeleteGroup = function (groupID)
{
    var request = this.createXMLHttpRequest();

    var url = this.serviceURL_ + 'groups/' + groupID + '?UserID=' + this.userID_ + '&WhoToken=' + this.whoToken_;

    request.open('Delete', url, false);
    request.send();

    if (request.status != 200)
        return new ServiceResponse(false, 'Error in deleting the group');


    return new ServiceResponse(true);
};

/**
 * Returns the permission of group on a folder
 * @param{number} groupID
 * @param{number} folderID
 * @public
 * @returns {ServiceResponse}
 */
WebService.prototype.GetPermission = function (groupID, folderID)
{
    var request = this.createXMLHttpRequest();

    var url = this.serviceURL_ + 'permissions?UserID=' + this.userID_ +
        '&WhoToken=' + this.whoToken_ + '&GroupID=' + groupID + '&FolderID=' + folderID;

    request.open('Get', url, false);
    request.send();

    if (request.status != 200)
        return new ServiceResponse(false, 'Error in finding out the permmision');

    var data = JSON.parse(request.responseText).PermissionType;
    return new ServiceResponse(true, null, data);
};

/**
 * Returns whether a user is memeber of group or not
 * @param{number} userID
 * @param{number} groupID
 * @public
 * @returns {ServiceResponse}
 */
WebService.prototype.GetMembership = function (userID, groupID)
{
    var request = this.createXMLHttpRequest();

    var url = this.serviceURL_ + 'memberships?UserID=' + this.userID_ +
        '&WhoToken=' + this.whoToken_ + '&TargetUserID=' + userID;

    request.open('Get', url, false);
    request.send();

    if (request.status != 200)
        return new ServiceResponse(false, 'Error in finding out the membership');

    var data = false;

    var results = JSON.parse(request.responseText);

    for (var i = 0; i < results.length; i++)
        if (results[i].ID == groupID)
            data = true;

    return new ServiceResponse(true, null, data);
};

/**
 * Sets the permission of group on a folder
 * @param{number} groupID
 * @param{number} folderID
 * @param{number} permissionType
 * @returns {ServiceResponse}
 * @public
 */
WebService.prototype.SetPermission = function (groupID, folderID, permissionType)
{
    var request = this.createXMLHttpRequest();

    var url = this.serviceURL_ + 'permissions';

    var params = new Object();
    params.UserID = this.userID_;
    params.WhoToken = this.whoToken_;
    params.GroupID = groupID;
    params.FolderID = folderID;
    params.Type = permissionType;
    postBody = JSON.stringify(params);

    request.open('Put', url, false);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(postBody);

    if (request.status != 200)
        return new ServiceResponse(false, 'Error in setting the permission');

    return new ServiceResponse(true);
};

/**
 * Sets whetehr a user is member of group or not
 * @param{number} userID
 * @param{number} groupID
 * @param{boolean} isMember - Whether the user is a member of the group
 * @returns {ServiceResponse}
 * @public
 */
WebService.prototype.SetMembership = function (userID, groupID, isMember)
{
    var request = this.createXMLHttpRequest();

    var url = this.serviceURL_ + 'memberships';

    var params = new Object();
    params.UserID = this.userID_;
    params.WhoToken = this.whoToken_;
    params.TargetUserID = userID;
    params.GroupID = groupID;
    params.IsMember = 'No';
    if (isMember)
        params.IsMember = 'Yes';
    postBody = JSON.stringify(params);

    request.open('Put', url, false);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(postBody);

    if (request.status != 200)
        return new ServiceResponse(false, 'Error in setting the membership');

    return new ServiceResponse(true);
};

/**
 * Set the web service to silent mode
 * The web service does not send or receive commands in silent mode
 * @param{boolean} isSilent
 * @public
 */
WebService.prototype.SetIsSilent = function (isSilent)
{
    this.isSilent_ = isSilent;
};

/**
 * Returns the client ID
 * @returns {number}
 * @public
 */
WebService.prototype.GetClientID = function ()
{
    return this.clientID_;
};

/**
 * Returns whether the web service is in loading phase or not
 * @returns {boolean}
 * @public
 */
WebService.prototype.GetIsLoading = function ()
{
    return this.isLoading_;
};

/**
 * Sends a reset password request
 * @param{string} username
 * @param{string} email
 * @returns {ServiceResponse}
 * @public
 */
WebService.prototype.SendResetPasswordRequest = function (username, email)
{
    var request = this.createXMLHttpRequest();

    var url = this.serviceURL_ + 'reset-password';

    var params = new Object();
    params.Username = username;
    params.Email = email;
    postBody = JSON.stringify(params);

    request.open('Post', url, false);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(postBody);

    if (request.status != 200)
        return new ServiceResponse(false, 'Error in requesting reset password');

    console.log(request.responseText);

    return new ServiceResponse(true);
};

/**
 * Loops through outgoing commands and sends any unsent command
 * @private
 */
WebService.prototype.syncOutgoingQueue = function ()
{
    if (this.isSilent_)
        return;

    if (this.sendResult_ == 'Finished' && this.outgoingCommandQueue_.length > 0)
    {
        this.lastCommandSent_ = this.outgoingCommandQueue_.shift();
        this.sendResult_ = 'Sending';
        this.sendCommand(this.lastCommandSent_);
    }
    else if (this.sendResult_ == 'Failure')
    {
        this.sendResult_ = 'Sending';
        this.sendCommand(this.lastCommandSent_);
    }
};

/**
 * Sends a command to the server using the web service
 * @param {Command} command
 * @private
 */
WebService.prototype.sendCommand = function (command)
{
    var myclass = this;

    var request = this.createXMLHttpRequest();

    var url = this.serviceURL_ + 'commands';

    var params = new Object();
    params.UserID = this.userID_;
    params.WhoToken = this.whoToken_;
    params.GraphID = this.graphID_;
    params.CommandName = command.GetName();
    params.ClientID = this.clientID_;
    params.GraphAccessToken = this.graphAccessToken_;
    params.Param1 = command.GetParameters()[0];
    params.Param2 = command.GetParameters()[1];
    params.Param3 = command.GetParameters()[2];
    params.Param4 = command.GetParameters()[3];
    params.Param5 = command.GetParameters()[4];

    postBody = JSON.stringify(params);

    request.open('Post', url, true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onreadystatechange = function ()
    {
        if (request.readyState != 4)
            return;

        if (request.status != 200)
        {
            myclass.sendResult_ = 'Failure';
            myclass.updateConnectionStatus(false);
            return;
        }

        myclass.updateConnectionStatus(true);


        myclass.sendResult_ = 'Finished';
        myclass.syncOutgoingQueue();
    };

    request.send(postBody);
};

/**
 * Loops to check if any new command is on server and
 * adds it to incoming commands queue
 * @private
 */
WebService.prototype.syncIncomingCommands = function ()
{
    var myclass = this;

    if (!this.isLoading_ && this.isSilent_)
        return;

    if (this.checkStatus_ != 'Ready')
        return;

    var request = this.createXMLHttpRequest();


    var url = this.serviceURL_ + 'commands?UserID=' + this.userID_ + '&WhoToken=' + this.whoToken_
        + '&GraphID=' + this.graphID_ + '&LastCommandID=' + this.lastCommandIDRecieved_ +
        '&GraphAccessToken=' + this.graphAccessToken_;

    if (START_PANEL_MANAGER.GetIsHistory())
        url += '&InEffective=Yes';

    request.open('Get', url, true);

    this.checkStatus_ = 'Checking';

    request.open('Get', url, true);

    request.timeout = 1000;

    request.onreadystatechange = function ()
    {
        if (request.readyState != 4)
            return;
        if (request.status != 200)
        {
            myclass.checkStatus_ = 'Ready';
            myclass.updateConnectionStatus(false);
            return;
        }


        myclass.updateConnectionStatus(true);

        var response = request.responseText;

        if (response[0] != '[' || response[response.length - 1] != ']')
        {
            myclass.checkStatus_ = 'Ready';
            return;
        }

        myclass.processResponse(response);
        myclass.checkStatus_ = 'Ready';
    };

    request.send();
};

/**
 * Processes the response coming from webservice for new commands
 * @param {string} response
 * @private
 */
WebService.prototype.processResponse = function (response)
{

    var inputCommands = JSON.parse(response);


    if (inputCommands.length == 0)
    {
        if (this.isLoading_ && this.graphID_ != null)
        {
            this.isLoading_ = false;
            if (this.GraphLoadedEvent != null)
                this.GraphLoadedEvent();
        }
        return;
    }

    var commands = [];

    for (var i = 0; i < inputCommands.length; i++)
    {
        var inputCommand = inputCommands[i];
        var params = [];
        params[0] = inputCommand.Param1;
        params[1] = inputCommand.Param2;
        params[2] = inputCommand.Param3;
        params[3] = inputCommand.Param4;
        params[4] = inputCommand.Param5;
        var command = new Command(inputCommand.Name, params);
        command.SetID(inputCommand.ID);
        command.SetClientID(inputCommand.ClientID);

        commands.push(command);
        this.lastCommandIDRecieved_ = command.GetID();
    }

    if (this.NewCommandsEvent != null)
        this.NewCommandsEvent(commands);
};

/**
 * Creates a cross-browser XMLHttpRequest object
 * @return {XMLHttpRequest} or equivalent
 * @private
 */
WebService.prototype.createXMLHttpRequest = function ()
{
    var xmlhttp;
    if (window.XMLHttpRequest) // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    else // code for IE6, IE5
        xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');

    return xmlhttp;
};

/**
 * Gets a graph access token from the server
 * @private
 * @return{boolean} true if successful
 */
WebService.prototype.getGraphAccessToken = function ()
{

    var request = this.createXMLHttpRequest();

    var url = this.serviceURL_ + 'graph-access-tokens';

    var params = new Object();
    params.UserID = this.userID_;
    params.WhoToken = this.whoToken_;
    params.GraphID = this.graphID_;
    params.PermissionType = 1;
    if (this.isSilent_)
        params.PermissionType = 0;
    postBody = JSON.stringify(params);

    request.open('Post', url, false);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(postBody);

    if (request.status != 200)
        return false;

    var result = JSON.parse(request.responseText);

    this.graphAccessToken_ = result.GraphAccessToken;
    return true;
};

/**
 * Gets a new client ID from the server
 * @private
 * @return{boolean} true if successful
 */
WebService.prototype.getClientID = function ()
{

    var request = this.createXMLHttpRequest();

    var url = this.serviceURL_ + 'clients';

    var params = new Object();
    params.UserID = this.userID_;
    params.WhoToken = this.whoToken_;
    params.GraphID = this.graphID_;
    params.ClientName = 'WebUI';
    params.GraphAccessToken = this.graphAccessToken_;
    postBody = JSON.stringify(params);

    request.open('Post', url, false);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(postBody);

    if (request.status != 200)
        return false;


    this.clientID_ = JSON.parse(request.responseText).CreatedClientID;
    return true;
};

/**
 * Updates the disconnected time based on current status of network
 * @param {boolean} isConnected - current status of network
 * @private
 */
WebService.prototype.updateConnectionStatus = function (isConnected)
{
    var wasConnected = false;
    if (this.disconnectedStartTime_ == null)
        wasConnected = true;

    if (isConnected)
        this.disconnectedStartTime_ = null;
    else if (wasConnected)
    {
        var date = new Date();
        this.disconnectedStartTime_ = date.getTime();
    }

    if (this.NetworkStatusChangeEvent != null)
    {
        if (isConnected && !wasConnected)
            this.NetworkStatusChangeEvent();
        if (!isConnected)
            this.NetworkStatusChangeEvent();
    }
};