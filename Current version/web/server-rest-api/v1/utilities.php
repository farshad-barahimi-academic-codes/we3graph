<?php
namespace We3Graph\RestAPI;

require_once('commands.php');
require_once('config.php');

use mysqli;

/**
 * Class Utilities
 * @package We3Graph\RestAPI
 * A static class for miscellaneous functions such as input validation,
 * database connection and Error reporting
 */
class Utilities
{
    public static function CheckRequiredArguments($requiredArguments, $arguments)
    {
        foreach ($requiredArguments as $requiredArgument)
            if (!isset($arguments[$requiredArgument]))
            {
                $errorMessage = $requiredArgument . ' is not specified';
                self::FatalError(400, 'E5001', $errorMessage);
            }
    }

    public static function FatalError($statusCode, $errorCode, $errorMessage)
    {
        http_response_code($statusCode);
        $error = array('Code' => $errorCode, 'Message' => $errorMessage);
        echo json_encode(array('Error' => $error));
        exit;
    }

    public static function GetConnection()
    {
        static $dbConection = null;
        if ($dbConection !== null)
            return $dbConection;

        $dbConection = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
        if (mysqli_connect_errno())
        {
            $errorMessage = 'MySQL connection error';
            self::FatalError(500, 'E5002', $errorMessage);
        }

        return $dbConection;
    }

    public static function CloseConnection()
    {
        $connection = self::GetConnection();
        $connection->close();
    }

    public static function ValidateCommand($commandName, $arguments)
    {
        if (!array_key_exists($commandName, Commands::$CommandsList))
        {
            $errorMessage = 'Invalid command name';
            self::FatalError(400, 'E5003', $errorMessage);
        }

        $paramTypes = Commands::$CommandsList[$commandName];

        $params = [];
        $len = strlen($paramTypes);
        for ($index = 0; $index < $len; $index++)
        {
            $paramType = $paramTypes[$index];

            $argumentName = 'Param' . ($index + 1);
            if (!isset($arguments[$argumentName]))
            {
                $errorMessage = $argumentName . ' is not specified';
                self::FatalError(400, 'E5004', $errorMessage);
            }

            $argument = $arguments[$argumentName];
            if (is_int($argument))
                $argument = strval($argument);
            else if (is_float($argument))
                $argument = number_format($argument, 17, '.', '');

            if ($paramType == 'i')
            {
                self::ValidateFullIDParameter($argument, $argumentName);
            }
            else if ($paramType == 'p')
            {
                self::ValidatePositiveParameter($argument, $argumentName);
            }
            else if ($paramType == 'f')
            {
                self::ValidateFloatParameter($argument, $argumentName);
            }
            else if ($paramType == 's')
            {
                self::ValidateString50Parameter($argument, $argumentName);
            }

            array_push($params, $argument);
        }

        return $params;
    }

    public static function ValidateFullIDParameter($variable, $variableName)
    {
        $pos = strpos($variable, '-');
        $len = strlen($variable);
        if ($pos === FALSE || $pos == $len - 1)
        {
            $errorMessage = $variableName . ' is not in correct format';
            self::FatalError(400, 'E5005', $errorMessage);
        }


        $part1 = substr($variable, 0, $pos);
        $part2 = substr($variable, $pos + 1);

        self::ValidatePositiveParameter($part1, $variableName);
        self::ValidatePositiveParameter($part2, $variableName);
    }

    public static function ValidatePositiveParameter($variable, $variableName)
    {
        if (!ctype_digit($variable))
        {
            $errorMessage = $variableName . ' is not in correct format';
            self::FatalError(400, 'E5006', $errorMessage);
        }

        $len = strlen($variable);

        if ($len < 1 || $len > 18)
        {
            $errorMessage = $variableName . ' is not in correct format';
            self::FatalError(400, 'E5007', $errorMessage);
        }
    }

    public static function ValidateFloatParameter($variable, $variableName)
    {
        if (filter_var($variable, FILTER_VALIDATE_FLOAT) === false)
        {
            $errorMessage = $variableName . ' is not in correct format';
            self::FatalError(400, 'E5008', $errorMessage);
        }
    }

    public static function ValidateString50Parameter($variable, $variableName)
    {
        if (strlen($variable) > 50)
        {
            $errorMessage = $variableName . ' is not in correct format';
            self::FatalError(400, 'E5009', $errorMessage);
        }
    }

    public static function ValidateInteger($variable, $variableName)
    {
        if (filter_var($variable, FILTER_VALIDATE_INT) === false)
        {
            $errorMessage = $variableName . ' is not in correct format';
            self::FatalError(400, 'E5010', $errorMessage);
        }
    }

    public static function ValidateAndConvertBoolean(& $variable, $variableName)
    {
        if ($variable == 'Yes')
        {
            $variable = 1;
        }
        else if ($variable == 'No')
        {
            $variable = 0;
        }
        else
        {
            $errorMessage = $variableName . ' is not in correct format';
            self::FatalError(400, 'E5011', $errorMessage);
        }
    }

    public static function ValidateGraphName($graphName)
    {
        if (strlen($graphName) > 50)
        {
            $errorMessage = 'Graph name is not in correct format';
            self::FatalError(400, 'E5012', $errorMessage);
        }
    }

    public static function ValidateFolderName($folderName)
    {
        if (strlen($folderName) > 50)
        {
            $errorMessage = 'Folder name is not in correct format';
            self::FatalError(400, 'E5013', $errorMessage);
        }
    }

    public static function ValidateClientName($clientName)
    {
        if (strlen($clientName) > 50)
        {
            $errorMessage = 'Graph name is not in correct format';
            self::FatalError(400, 'E5014', $errorMessage);
        }
    }

    public static function ValidateUsername($username)
    {
        if (!ctype_alnum($username) || strlen($username) > 50)
        {
            $errorMessage = 'Username is not in correct format';
            self::FatalError(400, 'E5015', $errorMessage);
        }
    }

    public static function ValidatePassword($password)
    {
        if (strlen($password) < 10 || strlen($password) > 30)
        {
            $errorMessage = 'Password is not in correct format';
            self::FatalError(400, 'E5016', $errorMessage);
        }
    }

    public static function ValidateFirstName($firstName)
    {
        if (strlen($firstName) > 50)
        {
            $errorMessage = 'First name is not in correct format';
            self::FatalError(400, 'E5017', $errorMessage);
        }
    }

    public static function ValidateLastName($lastName)
    {
        if (strlen($lastName) > 50)
        {
            $errorMessage = 'Last name is not in correct format';
            self::FatalError(400, 'E5018', $errorMessage);
        }
    }

    public static function ValidateEmail($email)
    {
        if (filter_var($email, FILTER_VALIDATE_EMAIL) === false)
        {
            $errorMessage = 'Email is not in correct format';
            self::FatalError(400, 'E5019', $errorMessage);
        }

        if (strlen($email) > 200)
        {
            $errorMessage = 'Email is not in correct format';
            self::FatalError(400, 'E5020', $errorMessage);
        }
    }

    public static function ValidatePermitionsType($variable, $variableName)
    {
        if (filter_var($variable, FILTER_VALIDATE_INT) === false)
        {
            $errorMessage = $variableName . ' is not in correct format';
            self::FatalError(400, 'E5021', $errorMessage);
        }

        if ($variable < PermissionTypes::NO_ACCESS || $variable > PermissionTypes::MODERATOR_ACCESS)
        {
            $errorMessage = $variableName . ' is not in correct format';
            self::FatalError(400, 'E5022', $errorMessage);
        }
    }
}

?>