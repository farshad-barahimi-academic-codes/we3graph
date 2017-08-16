<?php
namespace We3Graph\RestAPI;

require_once 'service-core.php';
require_once 'auth-manager.php';

/**
 * Class RESTRouter
 * @package We3Graph\RestAPI
 * This class help map each REST resource path to its appropriate function
 */
class RESTRouter
{
    private $mappings_;

    public function __construct()
    {
        $this->mappings_ = array();
    }

    /**
     * Add a mapping between a REST resource path and a static function of
     * a class
     * @param string $action REST request type: 'GET', 'Post', 'PUT' or 'DELETE'
     * @param string $route REST resource path, / is delimiter for resource parts
     * and colon in front of a name means use value in that position as
     * an argument specified by that name passed to the function
     * @param string $className The name of the class that has the function which
     * handles this request
     * @param string $function The name of the function the class above which
     * handles this request
     * @param bool $needAuthenication Whether this action needs authentication
     */
    public function AddMapping($action, $route, $className, $function, $needAuthenication = true)
    {
        $this->mappings_[] = array(
            'Action' => $action,
            'Route' => $route,
            'ClassName' => $className,
            'Function' => $function,
            'NeedAuthenication' => $needAuthenication);
    }

    /**
     * Sends the REST request to the first matched function
     * @param string $action REST request type: 'GET', 'Post', 'PUT' or 'DELETE'
     * @param [] $resourceParts The REST resource name split into a part array
     * @param [] $arguments The array of request parameters and their values,
     * either passed as query string in URL for GET  and DELETE or as JSON in
     * the body for POST and PUT
     */
    public function Route($action, $resourceParts, $arguments)
    {
        foreach ($this->mappings_ as $mapping)
        {
            if ($mapping['Action'] != $action)
                continue;

            $argumentsInResource = array();

            if ($this->isMatch($resourceParts, $mapping, $argumentsInResource))
            {
                foreach ($argumentsInResource as $argName => $argValue)
                    $arguments[$argName] = $argValue;

                if ($mapping['NeedAuthenication'])
                {
                    $requiredArguments = array('UserID', 'WhoToken');
                    Utilities::CheckRequiredArguments($requiredArguments, $arguments);
                    AuthManager::VerifyWhoToken($arguments);
                }

                $className = $mapping['ClassName'];
                $function = $mapping['Function'];
                call_user_func(array(__NAMESPACE__ . '\\' . $className, $function), $arguments);
                return;
            }
        }

        // No match
        $errorMessage = 'Request is not supported by API';
        Utilities::FatalError(400, 'E3001', $errorMessage);
    }

    private function isMatch($resourceParts, $mapping, & $argumentsInResource)
    {
        $route = $mapping['Route'];
        $route = rtrim($route, '/');
        $route = ltrim($route, '/');
        $routeParts = explode('/', $route);

        $partsCount = count($routeParts);
        if ($partsCount != count($resourceParts))
            return false;

        for ($index = 0; $index < $partsCount; $index++)
        {
            $routePart = $routeParts[$index];
            $resourcePart = $resourceParts[$index];
            if (strlen($routePart) > 1 && $routePart[0] == ':')
            {
                $key = substr($routePart, 1);
                $argumentsInResource[$key] = $resourcePart;
            }
            else if ($routePart != $resourcePart)
                return false;
        }

        return true;
    }
}

?>