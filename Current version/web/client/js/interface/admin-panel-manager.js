/**
 * The AdminPanelManager class.
 * The main class for administration user interface
 * @constructor
 */
function AdminPanelManager()
{
    /** The object containing information of the selected group.
     * The object has an ID and a Name field
     * @private
     * @type{object|null} */
    this.selectedGroup_ = null;

    /** The object containing information of the selected folder.
     * The object has an ID and a Name field
     * @private
     * @type{object|null} */
    this.selectedFolder_ = null;

    /** The object containing information of the selected user.
     * The object has an ID and a DisplayString field.
     * The DisplayString is a combination of username, first name and last name
     * @private
     * @type{object|null} */
    this.selectedUser_ = null;

    /** The DOM div element for the admin panel.
     * @private
     * @type{object|null} */
    this.adminPanel_ = null;

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

    /** The DOM div element for the groups list box.
     * @private
     * @type{object|null} */
    this.groupsListBoxDiv_ = null;

    /** The DOM div element for the users list box.
     * @private
     * @type{object|null} */
    this.usersListBoxDiv_ = null;

    /** The DOM input element for the users search text box.
     * @private
     * @type{object|null} */
    this.usersSearchTextBox_ = null;

    /** The DOM input element for the create folder text box.
     * @private
     * @type{object|null} */
    this.createFolderTextBox_ = null;

    /** The DOM input element for the create group text box.
     * @private
     * @type{object|null} */
    this.createGroupTextBox_ = null;

    /** The DOM input element for the rename folder text box.
     * @private
     * @type{object|null} */
    this.renameFolderTextBox_ = null;

    /** The DOM input element for the rename group text box.
     * @private
     * @type{object|null} */
    this.renameGroupTextBox_ = null;

    /** The DOM input element for the delete folder text box.
     * @private
     * @type{object|null} */
    this.deleteFolderTextBox_ = null;

    /** The DOM input element for the delete group text box.
     * @private
     * @type{object|null} */
    this.deleteGroupTextBox_ = null;

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
}

/**
 * Starts displaying the AdminPanelManager
 * @param {object} htmlBody - the DOM element of the HTML body element
 * @public
 */
AdminPanelManager.prototype.Display = function (htmlBody)
{
    this.selectedGroup_ = null;
    this.selectedFolder_ = null;
    this.selectedUser_ = null;

    this.adminPanel_ = document.createElement('div');
    this.adminPanel_.className = 'WidePanel';
    htmlBody.appendChild(this.adminPanel_);

    this.addFoldersListBox();
    this.addGroupsListBox();
    this.addUsersSearchBox();

    var clearDiv = document.createElement('div');
    clearDiv.className = 'Clear';
    this.adminPanel_.appendChild(clearDiv);

    this.addTabs();


    this.updateFoldersList();
    this.updateGroupsList();
};
/**
 * Adds the folders list box
 * @private
 */
AdminPanelManager.prototype.addFoldersListBox = function ()
{
    var foldersDiv = document.createElement('div');
    foldersDiv.className = 'FoldersDiv';
    this.adminPanel_.appendChild(foldersDiv);

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
 * Adds the groups list box
 * @private
 */
AdminPanelManager.prototype.addGroupsListBox = function ()
{
    var groupsDiv = document.createElement('div');
    groupsDiv.className = 'GroupsDiv';
    this.adminPanel_.appendChild(groupsDiv);

    var span = document.createElement('span');
    span.innerHTML = 'Groups:';
    groupsDiv.appendChild(span);

    var breakTag = document.createElement('br');
    groupsDiv.appendChild(breakTag);

    this.groupsListBoxDiv_ = document.createElement('div');
    this.groupsListBoxDiv_.className = 'ListBoxDiv';
    groupsDiv.appendChild(this.groupsListBoxDiv_);
};

/**
 * Adds the users list box
 * @private
 */
AdminPanelManager.prototype.addUsersSearchBox = function ()
{
    myclass = this;
    var groupsDiv = document.createElement('div');
    groupsDiv.className = 'UsersSearchDiv';
    this.adminPanel_.appendChild(groupsDiv);

    var span = document.createElement('span');
    span.innerHTML = 'Search users:';
    groupsDiv.appendChild(span);

    var breakTag = document.createElement('br');
    groupsDiv.appendChild(breakTag);

    this.usersSearchTextBox_ = document.createElement('input');
    this.usersSearchTextBox_.type = 'text';
    groupsDiv.appendChild(this.usersSearchTextBox_);

    // Search button
    var button = document.createElement('a');
    button.href = '#';
    button.innerHTML = 'Search';
    button.className = 'Button';
    $(button).css('margin-top', '10px');
    $(button).css('margin-left', '5px');
    $(button).css('margin-right', '0px');
    $(button).css('width', '80px');
    button.onclick = function ()
    {
        myclass.onSearchButtonClicked(myclass);
    };
    groupsDiv.appendChild(button);
    $(button).button();


    var breakTag = document.createElement('br');
    groupsDiv.appendChild(breakTag);

    this.usersListBoxDiv_ = document.createElement('div');
    this.usersListBoxDiv_.className = 'ListBoxDiv';
    groupsDiv.appendChild(this.usersListBoxDiv_);
    $(this.usersListBoxDiv_).css('height', '237px');
};


/**
 * Adds the tab based UI
 * @private
 */
AdminPanelManager.prototype.addTabs = function ()
{
    this.tabsDiv_ = document.createElement('div');
    this.adminPanel_.appendChild(this.tabsDiv_);

    this.tabsUL_ = document.createElement('ul');
    this.tabsDiv_.appendChild(this.tabsUL_);

    this.addCreateTab();
    this.addRenameTab();
    this.addDeleteTab();
    this.addUserTab();
    this.addPermissionsTab();
    this.addMembershipsTab();

    $(this.tabsDiv_).tabs({heightStyle: 'auto'});
};

/**
 * Adds the create tab
 * @private
 */
AdminPanelManager.prototype.addCreateTab = function ()
{
    var myclass = this;

    var createTab = document.createElement('li');
    createTab.innerHTML = '<a href="#create-tab-content">Create</a>';
    this.tabsUL_.appendChild(createTab);

    var createTabContent = document.createElement('div');
    createTabContent.id = 'create-tab-content';
    this.tabsDiv_.appendChild(createTabContent);

    // Create folder
    var groupBox = document.createElement('div');
    groupBox.className = 'WidePanelGroupBox';
    createTabContent.appendChild(groupBox);

    var headerDiv = document.createElement('div');
    headerDiv.innerHTML = 'Create a new folder';
    headerDiv.className = 'WidePanelGroupBoxHeader';
    groupBox.appendChild(headerDiv);
    $(groupBox).css('margin-bottom', '0px');


    var span = document.createElement('span');
    span.innerHTML = 'Folder name:';
    groupBox.appendChild(span);

    this.createFolderTextBox_ = document.createElement('input');
    this.createFolderTextBox_.type = 'text';
    groupBox.appendChild(this.createFolderTextBox_);

    // Create folder button

    var button = document.createElement('a');
    button.href = '#';
    button.innerHTML = 'Create';
    button.className = 'Button';
    $(button).css('margin-top', '10px');
    button.onclick = function ()
    {
        myclass.onCreateFolderButtonClicked(myclass);
    };
    groupBox.appendChild(button);

    $(button).button();

    var breakTag = document.createElement('br');
    createTabContent.appendChild(breakTag);

    // Create group
    var groupBox = document.createElement('div');
    groupBox.className = 'WidePanelGroupBox';
    createTabContent.appendChild(groupBox);

    var headerDiv = document.createElement('div');
    headerDiv.innerHTML = 'Create a new group';
    headerDiv.className = 'WidePanelGroupBoxHeader';
    groupBox.appendChild(headerDiv);
    $(groupBox).css('margin-bottom', '0px');


    var span = document.createElement('span');
    span.innerHTML = 'Group name:';
    groupBox.appendChild(span);

    this.createGroupTextBox_ = document.createElement('input');
    this.createGroupTextBox_.type = 'text';
    groupBox.appendChild(this.createGroupTextBox_);

    // Create group button

    var button = document.createElement('a');
    button.href = '#';
    button.innerHTML = 'Create';
    button.className = 'Button';
    $(button).css('margin-top', '10px');
    button.onclick = function ()
    {
        myclass.onCreateGroupButtonClicked(myclass);
    };
    groupBox.appendChild(button);

    $(button).button();

    var clearDiv = document.createElement('div');
    clearDiv.className = 'Clear';
    groupBox.appendChild(clearDiv);

};

/**
 * Adds the rename tab
 * @private
 */
AdminPanelManager.prototype.addRenameTab = function ()
{
    var myclass = this;

    var renameTab = document.createElement('li');
    renameTab.innerHTML = '<a href="#rename-tab-content">Rename</a>';
    this.tabsUL_.appendChild(renameTab);

    var renameTabContent = document.createElement('div');
    renameTabContent.id = 'rename-tab-content';
    this.tabsDiv_.appendChild(renameTabContent);

    // Rename a folder
    var groupBox = document.createElement('div');
    groupBox.className = 'WidePanelGroupBox';
    renameTabContent.appendChild(groupBox);

    var headerDiv = document.createElement('div');
    headerDiv.innerHTML = 'Rename the selected folder';
    headerDiv.className = 'WidePanelGroupBoxHeader';
    groupBox.appendChild(headerDiv);

    var span = document.createElement('span');
    span.innerHTML = 'Selected folder:';
    groupBox.appendChild(span);

    var div = document.createElement('span');
    div.innerHTML = '&nbsp;';
    div.className = 'ReadOnlyBox SelectedFolderName';
    groupBox.appendChild(div);

    var span = document.createElement('span');
    span.innerHTML = 'New name:';
    groupBox.appendChild(span);

    this.renameFolderTextBox_ = document.createElement('input');
    this.renameFolderTextBox_.type = 'text';
    groupBox.appendChild(this.renameFolderTextBox_);

    // Rename folder button

    var button = document.createElement('a');
    button.href = '#';
    button.innerHTML = 'Rename';
    button.className = 'Button';
    $(button).css('margin-top', '10px');
    button.onclick = function ()
    {
        myclass.onRenameFolderButtonClicked(myclass);
    };
    groupBox.appendChild(button);
    $(button).button();

    // Rename a group
    var groupBox = document.createElement('div');
    groupBox.className = 'WidePanelGroupBox';
    renameTabContent.appendChild(groupBox);

    var headerDiv = document.createElement('div');
    headerDiv.innerHTML = 'Rename the selected group';
    headerDiv.className = 'WidePanelGroupBoxHeader';
    groupBox.appendChild(headerDiv);

    var span = document.createElement('span');
    span.innerHTML = 'Selected group:';
    groupBox.appendChild(span);

    var div = document.createElement('span');
    div.innerHTML = '&nbsp;';
    div.className = 'ReadOnlyBox SelectedGroupName';
    groupBox.appendChild(div);

    var span = document.createElement('span');
    span.innerHTML = 'New name:';
    groupBox.appendChild(span);

    this.renameGroupTextBox_ = document.createElement('input');
    this.renameGroupTextBox_.type = 'text';
    groupBox.appendChild(this.renameGroupTextBox_);

    // Rename folder button

    var button = document.createElement('a');
    button.href = '#';
    button.innerHTML = 'Rename';
    button.className = 'Button';
    $(button).css('margin-top', '10px');
    button.onclick = function ()
    {
        myclass.onRenameGroupButtonClicked(myclass);
    };
    groupBox.appendChild(button);
    $(button).button();
};

/**
 * Adds the delete tab
 * @private
 */
AdminPanelManager.prototype.addDeleteTab = function ()
{
    var myclass = this;

    var deleteTab = document.createElement('li');
    deleteTab.innerHTML = '<a href="#delete-tab-content">Delete</a>';
    this.tabsUL_.appendChild(deleteTab);

    var deleteTabContent = document.createElement('div');
    deleteTabContent.id = 'delete-tab-content';
    this.tabsDiv_.appendChild(deleteTabContent);

    // Delete a folder
    var groupBox = document.createElement('div');
    groupBox.className = 'WidePanelGroupBox';
    deleteTabContent.appendChild(groupBox);

    var headerDiv = document.createElement('div');
    headerDiv.innerHTML = 'Delete the selected folder';
    headerDiv.className = 'WidePanelGroupBoxHeader';
    groupBox.appendChild(headerDiv);

    var span = document.createElement('span');
    span.innerHTML = 'Selected folder:';
    groupBox.appendChild(span);

    var div = document.createElement('span');
    div.innerHTML = '&nbsp;';
    div.className = 'ReadOnlyBox SelectedFolderName';
    groupBox.appendChild(div);

    var span = document.createElement('span');
    span.innerHTML = 'Type folder name:';
    groupBox.appendChild(span);

    this.deleteFolderTextBox_ = document.createElement('input');
    this.deleteFolderTextBox_.type = 'text';
    groupBox.appendChild(this.deleteFolderTextBox_);

    // Delete folder button

    var button = document.createElement('a');
    button.href = '#';
    button.innerHTML = 'Delete';
    button.className = 'Button';
    $(button).css('margin-top', '10px');
    button.onclick = function ()
    {
        myclass.onDeleteFolderButtonClicked(myclass);
    };
    groupBox.appendChild(button);
    $(button).button();

    // Delete a group
    var groupBox = document.createElement('div');
    groupBox.className = 'WidePanelGroupBox';
    deleteTabContent.appendChild(groupBox);

    var headerDiv = document.createElement('div');
    headerDiv.innerHTML = 'Delete the selected group';
    headerDiv.className = 'WidePanelGroupBoxHeader';
    groupBox.appendChild(headerDiv);

    var span = document.createElement('span');
    span.innerHTML = 'Selected group:';
    groupBox.appendChild(span);

    var div = document.createElement('span');
    div.innerHTML = '&nbsp;';
    div.className = 'ReadOnlyBox SelectedGroupName';
    groupBox.appendChild(div);

    var span = document.createElement('span');
    span.innerHTML = 'Type group name:';
    groupBox.appendChild(span);

    this.deleteGroupTextBox_ = document.createElement('input');
    this.deleteGroupTextBox_.type = 'text';
    groupBox.appendChild(this.deleteGroupTextBox_);

    // Delete group button

    var button = document.createElement('a');
    button.href = '#';
    button.innerHTML = 'Delete';
    button.className = 'Button';
    $(button).css('margin-top', '10px');
    button.onclick = function ()
    {
        myclass.onDeleteGroupButtonClicked(myclass);
    };
    groupBox.appendChild(button);
    $(button).button();
};

/**
 * Adds the admin user tab
 * @private
 */
AdminPanelManager.prototype.addUserTab = function ()
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
    userTab.innerHTML = '<a href="#user-tab-content">Admin user</a>';
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

    this._userNewPassswordTextBox_ = document.createElement('input');
    this._userNewPassswordTextBox_.type = 'password';
    groupBox.appendChild(this._userNewPassswordTextBox_);

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
 * Adds the permissions tab
 * @private
 */
AdminPanelManager.prototype.addPermissionsTab = function ()
{
    var myclass = this;

    var permissionsTab = document.createElement('li');
    permissionsTab.innerHTML = '<a href="#permissions-tab-content">Permissions</a>';
    this.tabsUL_.appendChild(permissionsTab);

    var permissionsTabContent = document.createElement('div');
    permissionsTabContent.id = 'permissions-tab-content';
    this.tabsDiv_.appendChild(permissionsTabContent);

    // Set permission
    var groupBox = document.createElement('div');
    groupBox.className = 'WidePanelGroupBox';
    permissionsTabContent.appendChild(groupBox);

    var headerDiv = document.createElement('div');
    headerDiv.innerHTML = 'Set permission';
    headerDiv.className = 'WidePanelGroupBoxHeader';
    groupBox.appendChild(headerDiv);

    var span = document.createElement('span');
    span.innerHTML = 'Selected folder:';
    groupBox.appendChild(span);

    var div = document.createElement('span');
    div.innerHTML = '&nbsp;';
    div.className = 'ReadOnlyBox SelectedFolderName';
    groupBox.appendChild(div);

    var span = document.createElement('span');
    span.innerHTML = 'Selected group:';
    groupBox.appendChild(span);

    var div = document.createElement('span');
    div.innerHTML = '&nbsp;';
    div.className = 'ReadOnlyBox SelectedGroupName';
    groupBox.appendChild(div);

    var breakTag = document.createElement('br');
    groupBox.appendChild(breakTag);

    var breakTag = document.createElement('br');
    groupBox.appendChild(breakTag);

    // buttons
    var span = document.createElement('span');
    span.innerHTML = 'Permission:';
    groupBox.appendChild(span);

    var permissionSpan = document.createElement('span');
    permissionSpan.id = 'PermissionSpan';
    groupBox.appendChild(permissionSpan);

    var choices = ['No access', 'Read only', 'Write', 'Moderator'];

    for (var i = 0; i < choices.length; i++)
    {
        var radioButton = document.createElement('input');
        // replace in the next line is for removing spaces using regular expressions
        var id = 'PermissionsRadio' + choices[i].replace(/\s+/g, '');
        radioButton.type = 'radio';
        radioButton.name = 'PermissionsRadio';
        radioButton.id = id;
        if (i === 0)
            radioButton.checked = 'checked';
        permissionSpan.appendChild(radioButton);
        var label = document.createElement('label');
        $(label).attr('for', id);
        label.innerHTML = choices[i];
        permissionSpan.appendChild(label);
        if (i == 2)
            $(label).css('width', '80px');
        else
            $(label).css('width', '120px');

        $(radioButton).on('change', function (event)
        {
            var permissionTypeString = this.id.substring(16);
            var permissionType = 0;
            for (var j = 0; j < choices.length; j++)
                if (permissionTypeString == choices[j].replace(/\s+/g, ''))
                    permissionType = j - 1;

            if (myclass.selectedGroup_ != null && myclass.selectedFolder_ != null)
            {
                var response = WEB_SERVICE.SetPermission(myclass.selectedGroup_.ID,
                    myclass.selectedFolder_.ID, permissionType);
                if (response.GetIsSuccess())
                    MessageBox.ShowSuccess('Done');
                else
                    MessageBox.ShowError(response.GetErrorMessage());
            }
        });
    }

    $(permissionSpan).buttonset();


};

/**
 * Adds the memberships tab
 * @private
 */
AdminPanelManager.prototype.addMembershipsTab = function ()
{
    var myclass = this;

    var membershipsTab = document.createElement('li');
    membershipsTab.innerHTML = '<a href="#memberships-tab-content">Memberships</a>';
    this.tabsUL_.appendChild(membershipsTab);

    var membershipsTabContent = document.createElement('div');
    membershipsTabContent.id = 'memberships-tab-content';
    this.tabsDiv_.appendChild(membershipsTabContent);

    // Set membership
    var groupBox = document.createElement('div');
    groupBox.className = 'WidePanelGroupBox';
    membershipsTabContent.appendChild(groupBox);

    var headerDiv = document.createElement('div');
    headerDiv.innerHTML = 'Set membership';
    headerDiv.className = 'WidePanelGroupBoxHeader';
    groupBox.appendChild(headerDiv);

    var span = document.createElement('span');
    span.innerHTML = 'Selected user:';
    groupBox.appendChild(span);

    var div = document.createElement('span');
    div.innerHTML = '&nbsp;';
    div.className = 'ReadOnlyBox SelectedUserDisplayString';
    groupBox.appendChild(div);

    var span = document.createElement('span');
    span.innerHTML = 'Selected group:';
    groupBox.appendChild(span);

    var div = document.createElement('span');
    div.innerHTML = '&nbsp;';
    div.className = 'ReadOnlyBox SelectedGroupName';
    groupBox.appendChild(div);

    var breakTag = document.createElement('br');
    groupBox.appendChild(breakTag);

    var breakTag = document.createElement('br');
    groupBox.appendChild(breakTag);

    // buttons
    var span = document.createElement('span');
    span.innerHTML = 'Member:';
    groupBox.appendChild(span);

    var membershipSpan = document.createElement('span');
    membershipSpan.id = 'membershipSpan';
    groupBox.appendChild(membershipSpan);

    var choices = ['Yes', 'No'];

    for (var i = 0; i < choices.length; i++)
    {
        var radioButton = document.createElement('input');
        var id = 'MembershipRadio' + choices[i];
        radioButton.type = 'radio';
        radioButton.name = 'MembershipRadio';
        radioButton.id = id;
        if (i === 1)
            radioButton.checked = 'checked';
        membershipSpan.appendChild(radioButton);
        var label = document.createElement('label');
        $(label).attr('for', id);
        label.innerHTML = choices[i];
        membershipSpan.appendChild(label);
        $(label).css('width', '60px');

        $(radioButton).on('change', function (event)
        {
            var isMemberString = this.id.substring(15);
            var isMember = false;
            if (isMemberString == 'Yes')
                isMember = true;

            if (myclass.selectedUser_ != null && myclass.selectedGroup_ != null)
            {
                var response = WEB_SERVICE.SetMembership(myclass.selectedUser_.ID,
                    myclass.selectedGroup_.ID, isMember);
                if (response.GetIsSuccess())
                    MessageBox.ShowSuccess('Done');
                else
                    MessageBox.ShowError(response.GetErrorMessage());
            }
        });
    }

    $(membershipSpan).buttonset();


};


/**
 * Update the folders list in the admin panel
 * @private
 */
AdminPanelManager.prototype.updateFoldersList = function ()
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
            myclass.updatePermissionButtons();
        });
    }

    $(this.foldersListBoxDiv_).buttonset();

    if (this.selectedFolder_ != null)
    {
        $('.SelectedFolderName').html(this.selectedFolder_.Name);
    }
    else
    {
        $('.SelectedFolderName').html('&nbsp;');
    }
    this.updatePermissionButtons();

};

/**
 * Update the groups list in the admin panel
 * @private
 */
AdminPanelManager.prototype.updateGroupsList = function ()
{
    var myclass = this;
    this.groupsListBoxDiv_.innerHTML = '';

    var response = WEB_SERVICE.GetGroups();
    if (!response.GetIsSuccess())
    {
        MessageBox.ShowError(response.GetErrorMessage());
        return;
    }

    var groups = response.GetData();

    this.selectedGroup_ = null;

    for (var i = 0; i < groups.length; i++)
    {
        var radioButton = document.createElement('input');
        var id = groups[i].ID;
        var id = 'group-' + id;
        radioButton.type = 'radio';
        radioButton.name = 'groups';
        radioButton.value = groups[i].Name;
        radioButton.id = id;
        if (i === 0)
        {
            radioButton.checked = 'checked';
            this.selectedGroup_ = new Object();
            this.selectedGroup_.ID = groups[0].ID;
            this.selectedGroup_.Name = groups[0].Name;
        }
        this.groupsListBoxDiv_.appendChild(radioButton);
        var label = document.createElement('label');
        $(label).attr('for', id);
        label.innerHTML = groups[i].Name;
        this.groupsListBoxDiv_.appendChild(label);

        $(radioButton).on('change', function (event)
        {
            myclass.selectedGroup_.ID = Number(this.id.substring(6));
            myclass.selectedGroup_.Name = this.value;
            $('.SelectedGroupName').html(myclass.selectedGroup_.Name);
            myclass.updatePermissionButtons();
            myclass.updateMembershipButtons();
        });
    }
    $(this.groupsListBoxDiv_).buttonset();
    if (this.selectedGroup_ != null)
    {
        $('.SelectedGroupName').html(this.selectedGroup_.Name);
    }
    else
    {
        $('.SelectedGroupName').html('&nbsp;');
    }

    this.updatePermissionButtons();
    this.updateMembershipButtons();
};


/**
 * Update the users list in the admin panel
 * @private
 */
AdminPanelManager.prototype.updateUsersList = function (users)
{
    var myclass = this;

    this.usersListBoxDiv_.innerHTML = '';
    this.selectedUser_ = null;

    for (var i = 0; i < users.length; i++)
    {
        var radioButton = document.createElement('input');
        var displayString = users[i].Username + ' (' + users[i].FirstName +
            ' ' + users[i].LastName + ')';
        var id = users[i].ID;
        var id = 'user-' + id;
        radioButton.type = 'radio';
        radioButton.name = 'users';
        radioButton.value = displayString;
        radioButton.id = id;
        if (i === 0)
        {
            radioButton.checked = 'checked';
            this.selectedUser_ = new Object();
            this.selectedUser_.ID = users[0].ID;
            this.selectedUser_.DisplayString = displayString;

        }
        this.usersListBoxDiv_.appendChild(radioButton);
        var label = document.createElement('label');
        $(label).attr('for', id);
        label.innerHTML = displayString;
        this.usersListBoxDiv_.appendChild(label);

        $(radioButton).on('change', function (event)
        {
            myclass.selectedUser_.ID = Number(this.id.substring(5));
            myclass.selectedUser_.DisplayString = this.value;
            $('.SelectedUserDisplayString').html(myclass.selectedUser_.DisplayString);
            myclass.updateMembershipButtons();
        });
    }

    $(this.usersListBoxDiv_).buttonset();

    if (this.selectedUser_ != null)
    {
        $('.SelectedUserDisplayString').html(this.selectedUser_.DisplayString);
    }
    else
    {
        $('.SelectedUserDisplayString').html('&nbsp;');
    }

    this.updateMembershipButtons();
};

/**
 * This method is fired when create folder button is clicked
 * @private
 */
AdminPanelManager.prototype.onCreateFolderButtonClicked = function ()
{
    var folderName = this.createFolderTextBox_.value;

    if (folderName.length == 0)
    {
        MessageBox.ShowError('Please specify folder name');
        return;
    }

    if (folderName.length > 50)
    {
        MessageBox.ShowError('Folder name should be at most 50 characters');
        return;
    }

    var response = WEB_SERVICE.CreateFolder(folderName);
    if (response.GetIsSuccess())
    {
        this.updateFoldersList();
        this.createFolderTextBox_.value = '';
        MessageBox.ShowSuccess('Done');
    }
    else
    {
        MessageBox.ShowError(response.GetErrorMessage());
    }
};

/**
 * This method is fired when create group button is clicked
 * @private
 */
AdminPanelManager.prototype.onCreateGroupButtonClicked = function ()
{
    var groupName = this.createGroupTextBox_.value;

    if (groupName.length == 0)
    {
        MessageBox.ShowError('Please specify group name');
        return;
    }

    if (groupName.length > 50)
    {
        MessageBox.ShowError('Group name should be at most 50 characters');
        return;
    }

    var response = WEB_SERVICE.CreateGroup(groupName);
    if (response.GetIsSuccess())
    {
        this.updateGroupsList();
        this.createGroupTextBox_.value = '';
        MessageBox.ShowSuccess('Done');
    }
    else
    {
        MessageBox.ShowError(response.GetErrorMessage());
    }
};

/**
 * This method is fired when rename folder button is clicked
 * @private
 */
AdminPanelManager.prototype.onRenameFolderButtonClicked = function ()
{
    if (this.selectedFolder_ == null)
    {
        MessageBox.ShowError('Please select a folder');
        return;
    }


    var folderName = this.renameFolderTextBox_.value;

    if (folderName.length == 0)
    {
        MessageBox.ShowError('Please specify folder name');
        return;
    }

    if (folderName.length > 50)
    {
        MessageBox.ShowError('Folder name should be at most 50 characters');
        return;
    }

    var response = WEB_SERVICE.RenameFolder(this.selectedFolder_.ID, folderName);
    if (response.GetIsSuccess())
    {
        this.updateFoldersList();
        this.renameFolderTextBox_.value = '';
        MessageBox.ShowSuccess('Done');
    }
    else
    {
        MessageBox.ShowError(response.GetErrorMessage());
    }
};

/**
 * This method is fired when rename group button is clicked
 * @private
 */
AdminPanelManager.prototype.onRenameGroupButtonClicked = function ()
{
    if (this.selectedFolder_ == null)
    {
        MessageBox.ShowError('Please select a group');
        return;
    }


    var groupName = this.renameGroupTextBox_.value;

    if (groupName.length == 0)
    {
        MessageBox.ShowError('Please specify group name');
        return;
    }

    if (groupName.length > 50)
    {
        MessageBox.ShowError('Group name should be at most 50 characters');
        return;
    }

    var response = WEB_SERVICE.RenameGroup(this.selectedGroup_.ID, groupName);
    if (response.GetIsSuccess())
    {
        this.updateGroupsList();
        this.renameGroupTextBox_.value = '';
        MessageBox.ShowSuccess('Done');
    }
    else
    {
        MessageBox.ShowError(response.GetErrorMessage());
    }
};

/**
 * This method is fired when delete folder button is clicked
 * @private
 */
AdminPanelManager.prototype.onDeleteFolderButtonClicked = function ()
{
    if (this.selectedFolder_ == null)
    {
        MessageBox.ShowError('Please select a folder');
        return;
    }


    var folderName = this.deleteFolderTextBox_.value;

    if (folderName.length == 0)
    {
        MessageBox.ShowError('Please type the folder name for confirmation');
        return;
    }

    if (folderName.length > 50)
    {
        MessageBox.ShowError('Folder name should be at most 50 characters');
        return;
    }

    if (folderName != this.selectedFolder_.Name)
    {
        MessageBox.ShowError("Typed folder name doesn't match");
        return;
    }

    var response = WEB_SERVICE.DeleteFolder(this.selectedFolder_.ID);
    if (response.GetIsSuccess())
    {
        this.updateFoldersList();
        this.deleteFolderTextBox_.value = '';
        MessageBox.ShowSuccess('Done');
    }
    else
    {
        MessageBox.ShowError(response.GetErrorMessage());
    }
};

/**
 * This method is fired when delete group button is clicked
 * @private
 */
AdminPanelManager.prototype.onDeleteGroupButtonClicked = function ()
{
    if (this.selectedGroup_ == null)
    {
        MessageBox.ShowError('Please select a group');
        return;
    }


    var groupName = this.deleteGroupTextBox_.value;

    if (groupName.length == 0)
    {
        MessageBox.ShowError('Please type the group name for confirmation');
        return;
    }

    if (groupName.length > 50)
    {
        MessageBox.ShowError('Group name should be at most 50 characters');
        return;
    }

    if (groupName != this.selectedGroup_.Name)
    {
        MessageBox.ShowError("Typed group name doesn't match");
        return;
    }

    var response = WEB_SERVICE.DeleteGroup(this.selectedGroup_.ID);
    if (response.GetIsSuccess())
    {
        this.updateGroupsList();
        this.deleteGroupTextBox_.value = '';
        MessageBox.ShowSuccess('Done');
    }
    else
    {
        MessageBox.ShowError(response.GetErrorMessage());
    }
};

/**
 * This method is fired when update user button is clicked
 * @private
 */
AdminPanelManager.prototype.onUpdateUserButtonClicked = function ()
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

    var newPassword = this._userNewPassswordTextBox_.value;

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
 * This method is fired when logout button is clicked
 * @private
 */
AdminPanelManager.prototype.onLogoutButtonClicked = function ()
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

/**
 * This method is fired when search button is clicked
 * @private
 */
AdminPanelManager.prototype.onSearchButtonClicked = function ()
{
    var keyword = this.usersSearchTextBox_.value;
    var response = WEB_SERVICE.SearchUsers(keyword);
    if (!response.GetIsSuccess())
    {
        MessageBox.ShowError(response.GetErrorMessage());
        return;
    }

    var result = response.GetData();
    if (result == null)
        MessageBox.ShowError('There was an error in search process');
    else if (result.length == 0)
    {
        MessageBox.Show('No matches', 'No matches');
    }
    else if (result.length > 10)
    {
        MessageBox.Show('More than 10 matches', 'Many matches');
    }
    else
    {
        this.updateUsersList(result);
    }
};

/**
 * This method updates the selected button of permission buttons
 * @private
 */
AdminPanelManager.prototype.updatePermissionButtons = function ()
{
    if (this.selectedFolder_ == null || this.selectedGroup_ == null)
    {
        $('#PermissionSpan').hide();
        return;
    }
    else
        $('#PermissionSpan').show();
    var folderID = this.selectedFolder_.ID;
    var groupID = this.selectedGroup_.ID;

    var response = WEB_SERVICE.GetPermission(groupID, folderID);
    if (!response.GetIsSuccess())
    {
        MessageBox.ShowError(response.GetErrorMessage());
        return;
    }

    var permission = response.GetData();

    if (permission == -1)
        $('#PermissionsRadioNoaccess').prop('checked', true);
    else if (permission == 0)
        $('#PermissionsRadioReadonly').prop('checked', true);
    else if (permission == 1)
        $('#PermissionsRadioWrite').prop('checked', true);
    else if (permission == 2)
        $('#PermissionsRadioModerator').prop('checked', true);

    $('#PermissionSpan').buttonset('refresh');
};

/**
 * This method update the selected button of membership buttons
 * @private
 */
AdminPanelManager.prototype.updateMembershipButtons = function ()
{
    if (this.selectedUser_ == null || this.selectedGroup_ == null)
    {
        $('#membershipSpan').hide();
        return;
    }
    else
        $('#membershipSpan').show();
    var userID = this.selectedUser_.ID;
    var groupID = this.selectedGroup_.ID;

    var response = WEB_SERVICE.GetMembership(userID, groupID);
    if (!response.GetIsSuccess())
    {
        MessageBox.ShowError(response.GetErrorMessage());
        return;
    }

    var isMember = response.GetData();

    if (isMember)
        $('#MembershipRadioYes').prop('checked', true);
    else
        $('#MembershipRadioNo').prop('checked', true);

    $('#membershipSpan').buttonset('refresh');
};
