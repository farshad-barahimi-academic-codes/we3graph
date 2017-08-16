<?php
namespace We3Graph\RestAPI;

require_once 'utilities.php';
require_once 'permission-types.php';
require_once 'auth-manager.php';

/**
 * Class ServiceCore
 * @package We3Graph\RestAPI
 * This static class handles most of  the rest request except those that are
 * related to authentication and authorization
 * The $arguments parameter passed to the most of function is the array of
 * request parameters and their values, either passed as query string in URL
 * for GET  and DELETE or as JSON in the body for POST and PUT
 */
class ServiceCore
{
    public static function AddCommand($arguments)
    {
        $requiredArguments = array('CommandName', 'GraphID', 'ClientID',
            'GraphAccessToken');
        Utilities::CheckRequiredArguments($requiredArguments, $arguments);

        AuthManager::VerifyGraphAccessToken($arguments, PermissionTypes::WRITE_ACCESS);

        $commandName = $arguments['CommandName'];
        $graphID = $arguments['GraphID'];
        $clientID = $arguments['ClientID'];

        $params = Utilities::ValidateCommand($commandName, $arguments);
        Utilities::ValidateInteger($graphID, 'GraphID');
        Utilities::ValidateInteger($clientID, 'ClientID');

        $userID = $arguments['UserID'];

        $mysqli = Utilities::getConnection();

        $query = 'Select ID from clients where ID= ? and UserID= ? and GraphID = ?';
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('isi', $clientID, $userID, $graphID);
        $stmt->bind_result($id);

        if (!$stmt->execute())
        {
            $errorMessage = 'Error in executing MySQL query';
            Utilities::FatalError(400, 'E4001', $errorMessage);
        }

        if (!$stmt->fetch())
        {
            $errorMessage = 'Access denied.';
            Utilities::FatalError(403, 'E4002', $errorMessage);
        }

        $stmt->close();


        $paramsCount = count($params);
        for ($index = $paramsCount; $index < 5; $index++)
            array_push($params, '');

        $query = 'Insert into commands (GraphID,Name,ClientID,Param1,Param2,Param3,Param4,Param5) values(?,?,?,?,?,?,?,?)';
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('isisssss', $graphID, $commandName, $clientID,
            $params[0], $params[1], $params[2], $params[3], $params[4]);

        if (!$stmt->execute())
        {
            $errorMessage = 'Error in executing MySQL query';
            Utilities::FatalError(500, 'E4003', $errorMessage);
        }

        $commandID = $mysqli->insert_id;

        $stmt->close();

        self::quickCompact($mysqli, $commandID, $commandName, $params);

        echo json_encode(array('Result' => 'Finished successfully'));
    }

    public static function GetCommands($arguments)
    {
        $requiredArguments = array('GraphID', 'LastCommandID', 'GraphAccessToken');
        Utilities::CheckRequiredArguments($requiredArguments, $arguments);

        AuthManager::VerifyGraphAccessToken($arguments, PermissionTypes::READ_ONLY_ACCESS);

        $graphID = $arguments['GraphID'];
        $lastCommandID = $arguments['LastCommandID'];

        Utilities::ValidateInteger($graphID, 'GraphID');
        Utilities::ValidateInteger($lastCommandID, 'LastCommandID');

        $shouldProcessInEffective = false;
        if (isset($arguments['InEffective']))
        {
            if ($arguments['InEffective'] == 'Yes')
                $shouldProcessInEffective = true;
        }

        $mysqli = Utilities::getConnection();


        $query = 'Select CommandID,Name,ClientID,Param1,Param2,Param3,Param4,Param5 from commands where GraphID=? and CommandID>? and IsEffective=1 order by CommandID limit 0,100';
        if ($shouldProcessInEffective)
            $query = 'Select CommandID,Name,ClientID,Param1,Param2,Param3,Param4,Param5 from commands where GraphID=? and CommandID>? order by CommandID limit 0,100';

        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('ii', $graphID, $lastCommandID);
        $stmt->bind_result($commandID, $name, $clientID, $param1, $param2,
            $param3, $param4, $param5);

        if (!$stmt->execute())
        {
            $errorMessage = 'Error in executing MySQL query';
            Utilities::FatalError(500, 'E4004', $errorMessage);
        }

        $result = array();

        while ($stmt->fetch())
        {
            $result[] = array('ID' => $commandID, 'Name' => $name,
                'ClientID' => $clientID, 'Param1' => $param1,
                'Param2' => $param2, 'Param3' => $param3,
                'Param4' => $param4, 'Param5' => $param5);
        }

        $stmt->close();
        echo json_encode($result);
    }

    public static function CreateGraph($arguments)
    {
        $requiredArguments = array('GraphName', 'FolderID', 'RenderEngineGUID');
        Utilities::CheckRequiredArguments($requiredArguments, $arguments);

        $graphName = $arguments['GraphName'];
        $folderID = $arguments['FolderID'];
        $renderEngineGUID = $arguments['RenderEngineGUID'];

        Utilities::ValidateGraphName($graphName);
        Utilities::ValidateInteger($folderID, 'FolderID');
        Utilities::ValidateString50Parameter($renderEngineGUID, 'RenderEngineGUID');

        AuthManager::CheckFolderAccess($arguments, PermissionTypes::MODERATOR_ACCESS);

        $commandSetVersion = 1;

        $mysqli = Utilities::getConnection();
        $query = 'Insert into graphs (Name,FolderID,CommandSetVersion,RenderEngineGUID) values(?,?,?,?)';
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('siis', $graphName, $folderID, $commandSetVersion,
            $renderEngineGUID);

        if (!$stmt->execute())
        {
            $errorMessage = 'Error in executing MySQL query';
            Utilities::FatalError(500, 'E4005', $errorMessage);
        }

        $createdGraphID = $mysqli->insert_id;

        echo json_encode(array('CreatedGraphID' => $createdGraphID));

        $stmt->close();
    }

    public static function CreateClientIDForGraph($arguments)
    {
        $requiredArguments = array('GraphID', 'ClientName', 'GraphAccessToken');
        Utilities::CheckRequiredArguments($requiredArguments, $arguments);

        AuthManager::VerifyGraphAccessToken($arguments, PermissionTypes::READ_ONLY_ACCESS);

        $userID = $arguments['UserID'];
        $graphID = $arguments['GraphID'];
        $clientName = $arguments['ClientName'];

        Utilities::ValidateInteger($graphID, 'GraphID');
        Utilities::ValidateClientName($clientName);

        $mysqli = Utilities::getConnection();
        $query = 'Insert into clients (Name,UserID,GraphID) values(?,?,?)';
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('ssi', $clientName, $userID, $graphID);

        if (!$stmt->execute())
        {
            $errorMessage = 'Error in executing MySQL query';
            Utilities::FatalError(500, 'E4006', $errorMessage);
        }

        $createdClientID = $mysqli->insert_id;

        echo json_encode(array('CreatedClientID' => $createdClientID));

        $stmt->close();

    }

    public static function GetFolders($arguments)
    {
        $mysqli = Utilities::getConnection();

        $query = 'Select ID,Name from folders';

        $stmt = $mysqli->prepare($query);
        $stmt->bind_result($ID, $name);

        if (!$stmt->execute())
        {
            $errorMessage = 'Error in executing MySQL query';
            self::FatalError(500, 'E4007', $errorMessage);
        }

        $folders = array();

        while ($stmt->fetch())
        {
            $folders[] = array('ID' => $ID, 'Name' => $name);
        }

        $stmt->close();


        echo json_encode($folders);
    }

    public static function GetFolderChildren($arguments)
    {
        $requiredArguments = array('FolderID');
        Utilities::CheckRequiredArguments($requiredArguments, $arguments);

        $folderID = $arguments['FolderID'];
        Utilities::ValidateInteger($folderID, 'FolderID');

        $permissionType = AuthManager::GetFolderPermission($arguments);

        if ($permissionType == PermissionTypes::NO_ACCESS)
        {
            echo json_encode(['PermissionType' => $permissionType,
                'Graphs' => []]);
            return;
        }

        $mysqli = Utilities::getConnection();

        $query = 'Select ID,Name,CommandSetVersion,RenderEngineGUID' .
            ' from graphs where FolderID=? order by Name';

        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('i', $folderID);
        $stmt->bind_result($ID, $name, $commandSetVersion, $preferredEngine);

        if (!$stmt->execute())
        {
            $errorMessage = 'Error in executing MySQL query';
            self::FatalError(500, 'E4008', $errorMessage);
        }

        $graphs = array();

        while ($stmt->fetch())
        {
            $graphs[] = array('ID' => $ID, 'Name' => $name,
                'CommandSetVersion' => $commandSetVersion,
                'RenderEngineGUID' => $preferredEngine);
        }

        $stmt->close();


        echo json_encode(['PermissionType' => $permissionType, 'Graphs' => $graphs]);
    }

    public static function CreateFolder($arguments)
    {
        $requiredArguments = array('FolderName');
        Utilities::CheckRequiredArguments($requiredArguments, $arguments);

        AuthManager::CheckUserAdmin($arguments);

        $folderName = $arguments['FolderName'];

        Utilities::ValidateFolderName($folderName);

        $mysqli = Utilities::getConnection();
        $query = 'Insert into folders (Name) values(?)';
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('s', $folderName);

        if (!$stmt->execute())
        {
            $errorMessage = 'Error in executing MySQL query';
            Utilities::FatalError(500, 'E4009', $errorMessage);
        }

        $createdFolderID = $mysqli->insert_id;

        echo json_encode(array('CreatedFolderID' => $createdFolderID));

        $stmt->close();
    }

    public static function DeleteFolder($arguments)
    {
        $requiredArguments = array('FolderID');
        Utilities::CheckRequiredArguments($requiredArguments, $arguments);

        AuthManager::CheckUserAdmin($arguments);

        $folderID = $arguments['FolderID'];
        Utilities::ValidateInteger($folderID, 'FolderID');

        $mysqli = Utilities::getConnection();

        $query = 'Select ID from graphs where FolderID= ?';
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('i', $folderID);

        if (!$stmt->execute())
        {
            $errorMessage = 'Error in executing MySQL query';
            Utilities::FatalError(500, 'E4010', $errorMessage);
        }

        if ($stmt->fetch())
        {
            $errorMessage = 'Folder should be empty.';
            Utilities::FatalError(400, 'E4011', $errorMessage);
        }

        $stmt->close();


        $query = 'Delete from folders where ID=?';
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('i', $folderID);

        if (!$stmt->execute())
        {
            $errorMessage = 'Error in executing MySQL query';
            Utilities::FatalError(500, 'E4012', $errorMessage);
        }

        echo json_encode(array('Result' => 'Finished successfully'));

        $stmt->close();
    }

    public static function UpdateFolder($arguments)
    {
        $requiredArguments = array('FolderID', 'FolderName');
        Utilities::CheckRequiredArguments($requiredArguments, $arguments);

        AuthManager::CheckUserAdmin($arguments);

        $folderID = $arguments['FolderID'];
        $folderName = $arguments['FolderName'];

        Utilities::ValidateInteger($folderID, 'FolderID');
        Utilities::ValidateFolderName($folderName);

        $mysqli = Utilities::getConnection();

        $query = 'Update folders set Name=? where ID=?';
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('si', $folderName, $folderID);

        if (!$stmt->execute())
        {
            $errorMessage = 'Error in executing MySQL query';
            Utilities::FatalError(500, 'E4013', $errorMessage);
        }

        echo json_encode('Done');

        $stmt->close();
    }

    public static function UpdateGraph($arguments)
    {
        $requiredArguments = array('GraphID', 'GraphName');
        Utilities::CheckRequiredArguments($requiredArguments, $arguments);

        $graphID = $arguments['GraphID'];
        $graphName = $arguments['GraphName'];

        Utilities::ValidateInteger($graphID, 'GraphID');
        Utilities::ValidateGraphName($graphName);

        $mysqli = Utilities::getConnection();

        $query = 'Select FolderID from graphs where ID= ?';
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('i', $graphID);
        $stmt->bind_result($folderID);

        if (!$stmt->execute())
        {
            $errorMessage = 'Error in executing MySQL query';
            Utilities::FatalError(400, 'E4014', $errorMessage);
        }

        if (!$stmt->fetch())
        {
            $errorMessage = 'Invalid Graph ID.';
            Utilities::FatalError(400, 'E4015', $errorMessage);
        }

        $stmt->close();

        $arguments['FolderID'] = $folderID;

        AuthManager::CheckFolderAccess($arguments, PermissionTypes::MODERATOR_ACCESS);


        $query = 'Update graphs set Name=? where ID=?';
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('si', $graphName, $graphID);

        if (!$stmt->execute())
        {
            $errorMessage = 'Error in executing MySQL query';
            Utilities::FatalError(500, 'E4016', $errorMessage);
        }

        echo json_encode('Done');

        $stmt->close();
    }

    public static function DeleteGraph($arguments)
    {
        $requiredArguments = array('GraphID');
        Utilities::CheckRequiredArguments($requiredArguments, $arguments);

        $graphID = $arguments['GraphID'];

        Utilities::ValidateInteger($graphID, 'GraphID');

        $mysqli = Utilities::getConnection();

        $query = 'Select FolderID from graphs where ID= ?';
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('i', $graphID);
        $stmt->bind_result($folderID);

        if (!$stmt->execute())
        {
            $errorMessage = 'Error in executing MySQL query';
            Utilities::FatalError(400, 'E4017', $errorMessage);
        }

        if (!$stmt->fetch())
        {
            $errorMessage = 'Invalid Graph ID.';
            Utilities::FatalError(400, 'E4018', $errorMessage);
        }

        $stmt->close();

        $arguments['FolderID'] = $folderID;

        AuthManager::CheckFolderAccess($arguments, PermissionTypes::MODERATOR_ACCESS);

        $query = 'Delete from commands where GraphID=?';
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('i', $graphID);

        if (!$stmt->execute())
        {
            $errorMessage = 'Error in executing MySQL query';
            Utilities::FatalError(500, 'E4019', $errorMessage);
        }


        $query = 'Delete from graphs where ID=?';
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('i', $graphID);

        if (!$stmt->execute())
        {
            $errorMessage = 'Error in executing MySQL query';
            Utilities::FatalError(500, 'E4020', $errorMessage);
        }

        echo json_encode(array('Result' => 'Finished successfully'));

        $stmt->close();
    }

    public static function UpdatePermission($arguments)
    {
        $requiredArguments = array('GroupID', 'FolderID', 'Type');
        Utilities::CheckRequiredArguments($requiredArguments, $arguments);

        AuthManager::CheckUserAdmin($arguments);

        $groupID = $arguments['GroupID'];
        $folderID = $arguments['FolderID'];
        $type = $arguments['Type'];

        Utilities::ValidateInteger($groupID, 'GroupID');
        Utilities::ValidateInteger($folderID, 'FolderID');
        Utilities::ValidatePermitionsType($type, 'Type');

        $mysqli = Utilities::getConnection();

        $query = 'Select GroupID from permissions where GroupID=? and FolderID=?';
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('ii', $groupID, $folderID);

        if (!$stmt->execute())
        {
            $errorMessage = 'Error in executing MySQL query';
            Utilities::FatalError(500, 'E4021', $errorMessage);
        }

        $doesExist = false;
        if ($stmt->fetch())
            $doesExist = true;

        $stmt->close();

        if ($doesExist)
        {
            $query = 'Update permissions set `Type`=? where GroupID=? and FolderID=?';
            $stmt = $mysqli->prepare($query);
            $stmt->bind_param('iii', $type, $groupID, $folderID);

            if (!$stmt->execute())
            {
                $errorMessage = 'Error in executing MySQL query';
                Utilities::FatalError(500, 'E4022', $errorMessage);
            }
        }
        else
        {
            $query = 'Insert into permissions (GroupID,FolderID,`Type`) values(?,?,?)';
            $stmt = $mysqli->prepare($query);
            $stmt->bind_param('iii', $groupID, $folderID, $type);

            if (!$stmt->execute())
            {
                $errorMessage = 'Error in executing MySQL query';
                Utilities::FatalError(500, 'E4023', $errorMessage);
            }
        }

        echo json_encode('Done');

        $stmt->close();
    }

    public static function GetPermission($arguments)
    {
        $requiredArguments = array('GroupID', 'FolderID');
        Utilities::CheckRequiredArguments($requiredArguments, $arguments);

        AuthManager::CheckUserAdmin($arguments);


        $groupID = $arguments['GroupID'];
        $folderID = $arguments['FolderID'];

        Utilities::ValidateInteger($groupID, 'GroupID');
        Utilities::ValidateInteger($folderID, 'FolderID');

        $result = PermissionTypes::NO_ACCESS;

        $mysqli = Utilities::getConnection();

        $query = 'Select IFNULL(max(`Type`),-1) from permissions where GroupID=? and FolderID=?';
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('ii', $groupID, $folderID);
        $stmt->bind_result($permissionType);

        if (!$stmt->execute())
        {
            $errorMessage = 'Error in executing MySQL query';
            Utilities::FatalError(400, '4024', $errorMessage);
        }

        if (!$stmt->fetch())
            $result = PermissionTypes::NO_ACCESS;
        else
            $result = $permissionType;


        $stmt->close();

        echo json_encode(array('PermissionType' => $result));
    }

    public static function UpdateMembership($arguments)
    {
        $requiredArguments = array('TargetUserID', 'GroupID', 'IsMember');
        Utilities::CheckRequiredArguments($requiredArguments, $arguments);

        AuthManager::CheckUserAdmin($arguments);

        $targetUserID = $arguments['TargetUserID'];
        $groupID = $arguments['GroupID'];
        $isMember = $arguments['IsMember'];

        Utilities::ValidateInteger($targetUserID, 'TargetUserID');
        Utilities::ValidateInteger($groupID, 'GroupID');

        if ($isMember == 'Yes')
        {
            $mysqli = Utilities::getConnection();

            $query = 'Select UserID from memberships where UserID=? and GroupID=?';
            $stmt = $mysqli->prepare($query);
            $stmt->bind_param('ii', $targetUserID, $groupID);

            if (!$stmt->execute())
            {
                $errorMessage = 'Error in executing MySQL query';
                Utilities::FatalError(500, 'E4025', $errorMessage);
            }

            $doesExist = false;
            if ($stmt->fetch())
                $doesExist = true;

            $stmt->close();

            if (!$doesExist)
            {

                $query = 'Insert into memberships (UserID,GroupID) values(?,?)';
                $stmt = $mysqli->prepare($query);
                $stmt->bind_param('ii', $targetUserID, $groupID);

                if (!$stmt->execute())
                {
                    $errorMessage = 'Error in executing MySQL query';
                    Utilities::FatalError(500, 'E4026', $errorMessage);
                }
                $stmt->close();
            }

            echo json_encode(array('Result' => 'Finished successfully'));
        }
        else
        {
            $mysqli = Utilities::getConnection();
            $query = 'Delete from memberships where UserID=? and GroupID=?';
            $stmt = $mysqli->prepare($query);
            $stmt->bind_param('ii', $targetUserID, $groupID);

            if (!$stmt->execute())
            {
                $errorMessage = 'Error in executing MySQL query';
                Utilities::FatalError(500, 'E4027', $errorMessage);
            }

            $stmt->close();
            echo json_encode(array('Result' => 'Finished successfully'));
        }
    }

    public static function GetMemberships($arguments)
    {
        $requiredArguments = array('TargetUserID');
        Utilities::CheckRequiredArguments($requiredArguments, $arguments);

        AuthManager::CheckUserAdmin($arguments);


        $targetUserID = $arguments['TargetUserID'];
        Utilities::ValidateInteger($targetUserID, 'TargetUserID');

        $mysqli = Utilities::getConnection();

        $query = 'Select GroupID from memberships where UserID=?';

        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('i', $targetUserID);
        $stmt->bind_result($groupID);

        if (!$stmt->execute())
        {
            $errorMessage = 'Error in executing MySQL query';
            self::FatalError(500, 'E4028', $errorMessage);
        }

        $groups = array();

        while ($stmt->fetch())
        {
            $groups[] = array('ID' => $groupID);
        }

        $stmt->close();


        echo json_encode($groups);
    }

    public static function GetGroups($arguments)
    {
        AuthManager::CheckUserAdmin($arguments);

        $mysqli = Utilities::getConnection();

        $query = 'Select ID,Name from groups';

        $stmt = $mysqli->prepare($query);
        $stmt->bind_result($ID, $name);

        if (!$stmt->execute())
        {
            $errorMessage = 'Error in executing MySQL query';
            self::FatalError(500, 'E4029', $errorMessage);
        }

        $groups = array();

        while ($stmt->fetch())
        {
            $groups[] = array('ID' => $ID, 'Name' => $name);
        }

        $stmt->close();
        echo json_encode($groups);
    }

    public static function CreateGroup($arguments)
    {
        $requiredArguments = array('GroupName');
        Utilities::CheckRequiredArguments($requiredArguments, $arguments);

        AuthManager::CheckUserAdmin($arguments);

        $groupName = $arguments['GroupName'];

        Utilities::ValidateFolderName($groupName);

        $mysqli = Utilities::getConnection();
        $query = 'Insert into groups (Name) values(?)';
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('s', $groupName);

        if (!$stmt->execute())
        {
            $errorMessage = 'Error in executing MySQL query';
            Utilities::FatalError(500, 'E4030', $errorMessage);
        }

        $createdGroupID = $mysqli->insert_id;

        echo json_encode(array('CreatedGroupID' => $createdGroupID));

        $stmt->close();
    }

    public static function UpdateGroup($arguments)
    {
        $requiredArguments = array('GroupID', 'GroupName');
        Utilities::CheckRequiredArguments($requiredArguments, $arguments);

        AuthManager::CheckUserAdmin($arguments);

        $groupID = $arguments['GroupID'];
        $groupName = $arguments['GroupName'];

        Utilities::ValidateInteger($groupID, 'GroupID');
        Utilities::ValidateFolderName($groupName);

        $mysqli = Utilities::getConnection();

        $query = 'Update groups set Name=? where ID=?';
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('si', $groupName, $groupID);

        if (!$stmt->execute())
        {
            $errorMessage = 'Error in executing MySQL query';
            Utilities::FatalError(500, 'E4031', $errorMessage);
        }

        echo json_encode('Done');

        $stmt->close();

    }

    public static function DeleteGroup($arguments)
    {
        $requiredArguments = array('GroupID');
        Utilities::CheckRequiredArguments($requiredArguments, $arguments);

        AuthManager::CheckUserAdmin($arguments);

        $groupID = $arguments['GroupID'];
        Utilities::ValidateInteger($groupID, 'GroupID');
        if ($groupID == 1)
        {
            $errorMessage = 'Default group ID can not be deleted';
            Utilities::FatalError(400, 'E4032', $errorMessage);
        }

        $mysqli = Utilities::getConnection();

        $query = 'Select UserID from memberships where GroupID= ?';
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('i', $groupID);

        if (!$stmt->execute())
        {
            $errorMessage = 'Error in executing MySQL query';
            Utilities::FatalError(500, 'E4033', $errorMessage);
        }

        if ($stmt->fetch())
        {
            $errorMessage = 'Group should be empty.';
            Utilities::FatalError(400, 'E4034', $errorMessage);
        }

        $stmt->close();

        $query = 'Select GroupID from permissions where GroupID= ?';
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('i', $groupID);

        if (!$stmt->execute())
        {
            $errorMessage = 'Error in executing MySQL query';
            Utilities::FatalError(500, 'E4035', $errorMessage);
        }

        if ($stmt->fetch())
        {
            $errorMessage = 'Group should not be used in any permission.';
            Utilities::FatalError(400, 'E4036', $errorMessage);
        }

        $stmt->close();


        $query = 'Delete from groups where ID=?';
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('i', $groupID);

        if (!$stmt->execute())
        {
            $errorMessage = 'Error in executing MySQL query';
            Utilities::FatalError(500, 'E4037', $errorMessage);
        }

        echo json_encode(array('Result' => 'Finished successfully'));

        $stmt->close();
    }

    private static function quickCompact($mysqli, $commandID, $commandName, $params)
    {
        if ($commandName == 'MoveVertex')
        {
            $query = 'Update commands set IsEffective=0 Where IsEffective=1 and CommandID<? and Param1=? and Name=?';
            $stmt = $mysqli->prepare($query);
            $stmt->bind_param('iss', $commandID, $params[0], $commandName);

            if (!$stmt->execute())
            {
                $errorMessage = 'Error in executing MySQL query';
                Utilities::FatalError(500, 'E4038', $errorMessage);
            }

            $stmt->close();
        }
        else if ($commandName == 'MoveBend')
        {
            $query = 'Update commands set IsEffective=0 Where IsEffective=1 and CommandID<? and Param1=? and Param2=? and Name=?';
            $stmt = $mysqli->prepare($query);
            $stmt->bind_param('isss', $commandID, $params[0], $params[1], $commandName);

            if (!$stmt->execute())
            {
                $errorMessage = 'Error in executing MySQL query';
                Utilities::FatalError(500, 'E4039', $errorMessage);
            }

            $stmt->close();
        }
        else if ($commandName == 'ChangeCameraPosition' ||
            $commandName == 'ChangeCameraRotation'
        )
        {
            $query = 'Update commands set IsEffective=0 Where IsEffective=1 and CommandID<? and Name=?';
            $stmt = $mysqli->prepare($query);
            $stmt->bind_param('is', $commandID, $commandName);

            if (!$stmt->execute())
            {
                $errorMessage = 'Error in executing MySQL query';
                Utilities::FatalError(500, 'E4040', $errorMessage);
            }

            $stmt->close();
        }
    }

}

?>