<?php
namespace We3Graph\RestAPI;

require_once 'utilities.php';

/**
 * Class AuthManager
 * @package We3Graph\RestAPI
 * This static class handles rest request that are related to
 * authentication and authorization
 * The $arguments parameter passed to the most of function is the array of
 * request parameters and their values, either passed as query string in URL
 * for GET  and DELETE or as JSON in the body for POST and PUT
 */
class AuthManager
{
    public static function CreateUser($arguments)
    {
        $requiredArguments =
            array('Username', 'Password', 'FirstName', 'LastName', 'Email');
        Utilities::CheckRequiredArguments($requiredArguments, $arguments);

        $username = $arguments['Username'];
        $password = $arguments['Password'];
        $firstName = $arguments['FirstName'];
        $lastName = $arguments['LastName'];
        $email = $arguments['Email'];

        Utilities::ValidateUsername($username);
        Utilities::ValidatePassword($password);
        Utilities::ValidateFirstName($firstName);
        Utilities::ValidateLastName($lastName);
        Utilities::ValidateEmail($email);

        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);


        if ($hashedPassword === false)
        {
            $errorMessage = 'Unable to create a secure password';
            Utilities::FatalError(500, '1001', $errorMessage);
        }

        $mysqli = Utilities::getConnection();
        $query = 'Insert into users (Username,Password,FirstName,LastName,Email) values(?,?,?,?,?)';
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('sssss',
            $username, $hashedPassword, $firstName, $lastName, $email);

        if (!$stmt->execute())
        {
            $errorMessage = 'Error in executing MySQL query';
            Utilities::FatalError(500, 'E1002', $errorMessage);
        }

        $createdUserID = $mysqli->insert_id;

        $stmt->close();

        $defaultGroupID = 1;
        $query = 'Insert into memberships (UserID,GroupID) values(?,?)';
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('ii', $createdUserID, $defaultGroupID);

        if (!$stmt->execute())
        {
            $errorMessage = 'Error in executing MySQL query';
            Utilities::FatalError(500, 'E1003', $errorMessage);
        }


        echo json_encode(array('CreatedUserID' => $createdUserID));

        $stmt->close();
    }

    public static function UpdateUser($arguments)
    {
        $requiredArguments = array();
        Utilities::CheckRequiredArguments($requiredArguments, $arguments);

        $userID = $arguments['UserID'];
        $firstName = null;
        $lastName = null;
        $email = null;
        $hashedPassword = null;

        $isFirstNameProvided = false;
        if (isset($arguments['FirstName']))
        {
            $firstName = $arguments['FirstName'];
            Utilities::ValidateFirstName($firstName);
            $isFirstNameProvided = true;
        }

        $isLastNameProvided = false;
        if (isset($arguments['LastName']))
        {
            $lastName = $arguments['LastName'];
            Utilities::ValidateLastName($lastName);
            $isLastNameProvided = true;
        }

        $isEmailProvided = false;
        if (isset($arguments['Email']))
        {
            $email = $arguments['Email'];
            Utilities::ValidateEmail($email);
            $isEmailProvided = true;
        }

        $isPasswordProvided = false;
        if (isset($arguments['Password']))
        {
            $password = $arguments['Password'];
            Utilities::ValidatePassword($password);

            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);


            if ($hashedPassword === false)
            {
                $errorMessage = 'Unable to create a secure password';
                Utilities::FatalError(500, '1004', $errorMessage);
            }

            $isPasswordProvided = true;
        }

        $mysqli = Utilities::getConnection();

        $query = 'Select FirstName,LastName,Email,Password from users where ID=?';

        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('i', $userID);
        $stmt->bind_result($oldFirstName, $oldLastName,
            $oldEmail, $oldHashedPassword);

        if (!$stmt->execute())
        {
            $errorMessage = 'Error in executing MySQL query';
            Utilities::FatalError(500, 'E1005', $errorMessage);
        }

        if (!$stmt->fetch())
        {
            $errorMessage = 'Invalid UserID';
            Utilities::FatalError(400, 'E1006', $errorMessage);
        }

        if (!$isFirstNameProvided)
            $firstName = $oldFirstName;

        if (!$isLastNameProvided)
            $lastName = $oldLastName;

        if (!$isEmailProvided)
            $email = $oldEmail;

        if (!$isPasswordProvided)
            $hashedPassword = $oldHashedPassword;

        $stmt->close();

        $query = 'Update users set FirstName=?,LastName=?,Email=?,Password=? where ID=?';
        $stmt = $mysqli->prepare($query);

        $stmt->bind_param('ssssi', $firstName, $lastName,
            $email, $hashedPassword, $userID);

        if (!$stmt->execute())
        {
            $errorMessage = 'Error in executing MySQL query';
            Utilities::FatalError(500, 'E1007', $errorMessage);
        }

        echo json_encode('Done');
        $stmt->close();
    }

    public static function GetUser($arguments)
    {
        $userID = $arguments['UserID'];

        $mysqli = Utilities::getConnection();

        $query = 'Select FirstName,LastName,Email from users where ID=?';

        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('i', $userID);
        $stmt->bind_result($firstName, $lastName, $email);

        if (!$stmt->execute())
        {
            $errorMessage = 'Error in executing MySQL query';
            self::FatalError(500, 'E1008', $errorMessage);
        }

        if (!$stmt->fetch())
        {
            $errorMessage = 'Invalid UserID';
            self::FatalError(400, 'E1009', $errorMessage);
        }

        echo json_encode(['FirstName' => $firstName, 'LastName' => $lastName,
            'Email' => $email]);

        $stmt->close();
    }

    public static function SearchUsers($arguments)
    {
        AuthManager::CheckUserAdmin($arguments);

        $requiredArguments = array('Keyword');
        Utilities::CheckRequiredArguments($requiredArguments, $arguments);

        $keyword = $arguments['Keyword'];
        Utilities::ValidateString50Parameter($keyword, 'Keyword');
        $keyword = '%' . $keyword . '%';

        $mysqli = Utilities::getConnection();

        $query = 'Select ID,Username,FirstName,LastName,Email from users ' .
            'where Username like ? or FirstName like ? or LastName like ? ' .
            'order by Username limit 11';

        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('sss', $keyword, $keyword, $keyword);
        $stmt->bind_result($userID, $username, $firstName, $lastName, $email);

        if (!$stmt->execute())
        {
            $errorMessage = 'Error in executing MySQL query';
            Utilities::FatalError(500, 'E1010', $errorMessage);
        }

        $result = [];

        while ($stmt->fetch())
        {
            $result[] = ['ID' => $userID, 'Username' => $username,
                'FirstName' => $firstName, 'LastName' => $lastName,
                'Email' => $email];
        }

        echo json_encode($result);

        $stmt->close();
    }

    public static function Login($arguments)
    {
        $requiredArguments = array('Username', 'Password');
        Utilities::CheckRequiredArguments($requiredArguments, $arguments);

        $username = $arguments['Username'];
        $password = $arguments['Password'];

        Utilities::ValidateUsername($username);
        Utilities::ValidatePassword($password);

        $token = hash('sha256', self::CreateRandomStringWithCSPRNG());
        $validUntil = date('Y-m-d H:i:s', strtotime('+30 days'));

        $mysqli = Utilities::getConnection();

        $query = 'Select ID,Password from users where Username= ?';
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('s', $username);
        $stmt->bind_result($userID, $hashedPassword);

        if (!$stmt->execute())
        {
            $errorMessage = 'Error in executing MySQL query';
            Utilities::FatalError(400, 'E1011', $errorMessage);
        }

        if (!$stmt->fetch())
        {
            $errorMessage = 'Authenication failed.';
            Utilities::FatalError(401, 'E1012', $errorMessage);
        }

        $stmt->close();

        if (!password_verify($password, $hashedPassword))
        {
            $errorMessage = 'Authenication failed.';
            Utilities::FatalError(401, 'E1013', $errorMessage);
        }

        $query = 'Insert into `who-tokens` (UserID,Token,IsValid,ValidUntil) values(?,?,1,?)';
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('iss', $userID, $token, $validUntil);

        if (!$stmt->execute())
        {
            $errorMessage = 'Error in executing MySQL query';
            Utilities::FatalError(500, 'E1014', $errorMessage);
        }

        $stmt->close();

        echo json_encode(array('UserID' => $userID, 'WhoToken' => $token));

    }

    public static function StartGraphAccess($arguments)
    {
        $requiredArguments = array('GraphID', 'UserID', 'PermissionType');
        Utilities::CheckRequiredArguments($requiredArguments, $arguments);

        $graphID = $arguments['GraphID'];
        $userID = $arguments['UserID'];
        $permissionType = $arguments['PermissionType'];

        Utilities::ValidateInteger($graphID, 'GraphID');
        Utilities::ValidateInteger($userID, 'UserID');
        Utilities::ValidateInteger($permissionType, 'PermissionType');

        $token = hash('sha256', self::CreateRandomStringWithCSPRNG());
        $validUntil = date('Y-m-d H:i:s', strtotime('+30 days'));

        $mysqli = Utilities::getConnection();

        $query = 'Select FolderID from graphs where ID= ?';
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('i', $graphID);
        $stmt->bind_result($folderID);

        if (!$stmt->execute())
        {
            $errorMessage = 'Error in executing MySQL query';
            Utilities::FatalError(400, 'E1013', $errorMessage);
        }

        if (!$stmt->fetch())
        {
            $errorMessage = 'Invalid Graph ID.';
            Utilities::FatalError(400, 'E1014', $errorMessage);
        }

        $stmt->close();

        $arguments['FolderID'] = $folderID;

        self::VerifyFolderAccess($arguments);
        $mysqli = Utilities::getConnection();

        $query = 'Insert into `graph-access-tokens` (UserID,GraphID,Token,IsValid,ValidUntil,PermissionType) values(?,?,?,1,?,?)';
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('iissi', $userID, $graphID, $token,
            $validUntil, $permissionType);

        if (!$stmt->execute())
        {
            $errorMessage = 'Error in executing MySQL query';
            Utilities::FatalError(500, 'E1015', $errorMessage);
        }

        $stmt->close();

        echo json_encode(array('GraphAccessToken' => $token));

    }

    public static function CreateRandomStringWithCSPRNG()
    {
        if (function_exists('openssl_random_pseudo_bytes'))
        {
            $result = openssl_random_pseudo_bytes(32, $wasStrong);
            if (!$wasStrong)
                return $result;
        }

        if (function_exists('mcrypt_create_iv'))
        {
            $result = mcrypt_create_iv(32, MCRYPT_DEV_URANDOM);
            if ($result != false)
                return $result;
        }


        $errorMessage = 'Unable to create a secure random access token';
        Utilities::FatalError(500, 'E1016', $errorMessage);

    }

    public static function Logout($arguments)
    {
        $requiredArguments = array('WhoToken');
        Utilities::CheckRequiredArguments($requiredArguments, $arguments);

        $whoToken = $arguments['WhoToken'];

        $mysqli = Utilities::getConnection();

        $query = 'Update `who-tokens` SET IsValid=0 WHERE Token=?';
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('s', $whoToken);

        if (!$stmt->execute())
        {
            $errorMessage = 'Error in executing MySQL query';
            Utilities::FatalError(500, 'E1017', $errorMessage);
        }

        $stmt->close();
    }

    public static function EndGraphAccess($arguments)
    {
        $requiredArguments = array('WhoToken');
        Utilities::CheckRequiredArguments($requiredArguments, $arguments);

        $whoToken = $arguments['WhoToken'];

        $mysqli = Utilities::getConnection();

        $query = 'Update who-token SET IsValid=0 WHERE Token=?';
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('s', $whoToken);

        if (!$stmt->execute())
        {
            $errorMessage = 'Error in executing MySQL query';
            Utilities::FatalError(500, 'E1018', $errorMessage);
        }

        $stmt->close();

    }

    public static function VerifyWhoToken($arguments)
    {
        $userID = $arguments['UserID'];
        $whoToken = $arguments['WhoToken'];
        $now = date('Y-m-d H:i:s');

        $mysqli = Utilities::getConnection();

        $query = 'Select UserID from `who-tokens` where Token= ? and UserID=? and IsValid=1 and ValidUntil>?';
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('sis', $whoToken, $userID, $now);
        $stmt->bind_result($id);

        if (!$stmt->execute())
        {
            $errorMessage = 'Error in executing MySQL query';
            Utilities::FatalError(400, 'E1019', $errorMessage);
        }

        if (!$stmt->fetch())
        {
            $errorMessage = 'Authenication failed.';
            Utilities::FatalError(401, 'E1020', $errorMessage);
        }

        $stmt->close();

    }

    public static function VerifyGraphAccessToken($arguments, $minimumPermissionType)
    {
        $graphID = $arguments['GraphID'];

        $userID = $arguments['UserID'];
        $graphAccessToken = $arguments['GraphAccessToken'];
        $now = date('Y-m-d H:i:s');

        $mysqli = Utilities::getConnection();

        $query = 'Select PermissionType from `graph-access-tokens` where Token= ? and UserID=? and GraphID=? and IsValid=1 and ValidUntil>?';
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('siis', $graphAccessToken, $userID, $graphID, $now);
        $stmt->bind_result($permissionType);

        if (!$stmt->execute())
        {
            $errorMessage = 'Error in executing MySQL query';
            Utilities::FatalError(400, 'E1021', $errorMessage);
        }

        if (!$stmt->fetch())
        {
            $errorMessage = 'Authorization failed.';
            Utilities::FatalError(403, 'E1022', $errorMessage);
        }

        $stmt->close();

        if ($permissionType < $minimumPermissionType)
        {
            $errorMessage = 'Authorization failed.';
            Utilities::FatalError(403, 'E1023', $errorMessage);
        }
    }

    public static function VerifyFolderAccess($arguments)
    {
        $requiredArguments = array('PermissionType');
        Utilities::CheckRequiredArguments($requiredArguments, $arguments);

        $requestedPermissionType = $arguments['PermissionType'];

        Utilities::ValidateInteger($requestedPermissionType, 'PermissionType');

        $permissionType = self::GetFolderPermission($arguments);

        if ($permissionType < $requestedPermissionType)
        {
            $errorMessage = 'No permission to access this folder.';
            Utilities::FatalError(403, 'E1024', $errorMessage);
        }

    }

    public static function CheckFolderAccess($arguments, $requiredPermissionType)
    {
        $permissionType = self::GetFolderPermission($arguments);

        if ($permissionType < $requiredPermissionType)
        {
            $errorMessage = 'No permission to access this folder.';
            Utilities::FatalError(403, 'E1025', $errorMessage);
        }

    }

    public static function GetFolderPermission($arguments)
    {
        $requiredArguments = array('FolderID', 'UserID');
        Utilities::CheckRequiredArguments($requiredArguments, $arguments);

        $folderID = $arguments['FolderID'];
        $userID = $arguments['UserID'];

        Utilities::ValidateInteger($folderID, 'FolderID');
        Utilities::ValidateInteger($userID, 'UserID');

        $result = PermissionTypes::NO_ACCESS;

        $mysqli = Utilities::getConnection();

        $query = 'Select IFNULL(max(permissions.Type),-1) from permissions inner join memberships ' .
            'on permissions.GroupID=memberships.GroupID Where memberships.UserID=? and ' .
            'permissions.FolderID=?';
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('ii', $userID, $folderID);
        $stmt->bind_result($permissionType);

        if (!$stmt->execute())
        {
            $errorMessage = 'Error in executing MySQL query';
            Utilities::FatalError(400, '1026', $errorMessage);
        }

        if (!$stmt->fetch())
            $result = PermissionTypes::NO_ACCESS;
        else
            $result = $permissionType;


        $stmt->close();

        return $result;
    }

    public static function CheckUserAdmin($arguments)
    {
        $userID = $arguments['UserID'];
        if ($userID != 1)
        {
            $errorMessage = 'This action requires admin user';
            Utilities::FatalError(400, 'E1027', $errorMessage);
        }
    }

    public static function ResetPassword($arguments)
    {
        $requiredArguments = array('Username', 'Email');
        Utilities::CheckRequiredArguments($requiredArguments, $arguments);

        $username = $arguments['Username'];
        $email = $arguments['Email'];

        Utilities::ValidateUsername($username);
        Utilities::ValidateEmail($email);

        $token = hash('sha256', self::CreateRandomStringWithCSPRNG());
        $validUntil = date('Y-m-d H:i:s', strtotime('+1 day'));

        $code = '';

        $mysqli = Utilities::getConnection();

        $query = 'Select ID from users where Username= ? and Email=?';
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('ss', $username, $email);
        $stmt->bind_result($userID);

        if (!$stmt->execute())
        {
            $errorMessage = 'Error in executing MySQL query';
            Utilities::FatalError(400, 'E1028', $errorMessage);
        }

        if (!$stmt->fetch())
        {
            $errorMessage = 'Authenication failed.';
            Utilities::FatalError(401, 'E1029', $errorMessage);
        }

        $stmt->close();


        $query = 'Insert into `who-tokens` (UserID,Token,IsValid,ValidUntil) values(?,?,1,?)';
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('iss', $userID, $token, $validUntil);

        if (!$stmt->execute())
        {
            $errorMessage = 'Error in executing MySQL query';
            Utilities::FatalError(500, 'E1030', $errorMessage);
        }

        $stmt->close();
        $code = $userID . '-' . $token;

        try
        {
            $to = $email;
            $subject = 'Password reset link';
            $message = 'Use the following code to reset your password:\r\n' .
                $token;
            $headers = array('From: ' . RESET_EMAIL, 'Reply-To: ' . RESET_EMAIL,
                'X-Mailer: PHP/' . PHP_VERSION);
            $headers = implode('\r\n', $headers);
            mail($to, $subject, $message, $headers);
        } catch (Exception $e)
        {
            $errorMessage = 'Error in sending the email';
            Utilities::FatalError(500, 'E1031', $errorMessage);
        }
    }
}

?>