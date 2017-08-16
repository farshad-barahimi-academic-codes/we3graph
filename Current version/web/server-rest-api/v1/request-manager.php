<?php
namespace We3Graph\RestAPI;

header('Cache-Control: no-cache');
header('Access-Control-Allow-Origin: *');

require_once 'rest-router.php';

/**
 * Class RequestManager
 * @package We3Graph\RestAPI
 * The main class that handles the REST request, Defines REST resources and
 * using the RESTRouter class sends the request to its appropriate function in
 * ServiceCore or AuthManager
 */
class RequestManager
{
    private $router_;

    public function __construct()
    {
        $this->router_ = new RESTRouter();
        $this->router_->AddMapping('GET', '/commands', 'ServiceCore', 'GetCommands');
        $this->router_->AddMapping('POST', '/commands', 'ServiceCore', 'AddCommand');
        $this->router_->AddMapping('POST', '/graphs', 'ServiceCore', 'CreateGraph');
        $this->router_->AddMapping('POST', '/folders', 'ServiceCore', 'CreateFolder');
        $this->router_->AddMapping('GET', '/folders', 'ServiceCore', 'GetFolders');
        $this->router_->AddMapping('GET', '/folders/:FolderID', 'ServiceCore', 'GetFolderChildren');
        $this->router_->AddMapping('POST', '/clients', 'ServiceCore', 'CreateClientIDForGraph');
        $this->router_->AddMapping('GET', '/users/:UserID', 'AuthManager', 'GetUser');
        $this->router_->AddMapping('GET', '/users', 'AuthManager', 'SearchUsers');
        $this->router_->AddMapping('POST', '/users', 'AuthManager', 'CreateUser', false);
        $this->router_->AddMapping('PUT', '/users/:UserID', 'AuthManager', 'UpdateUser');
        $this->router_->AddMapping('POST', '/who-tokens', 'AuthManager', 'Login', false);
        $this->router_->AddMapping('DELETE', '/who-tokens/:WhoToken', 'AuthManager', 'Logout');
        $this->router_->AddMapping('POST', '/graph-access-tokens', 'AuthManager', 'StartGraphAccess');
        $this->router_->AddMapping('DELETE', '/graph-access-tokens', 'AuthManager', 'EndGraphAccess');
        $this->router_->AddMapping('POST', '/folders/:FolderID', 'ServiceCore', 'UpdateFolder');
        $this->router_->AddMapping('DELETE', '/folders/:FolderID', 'ServiceCore', 'DeleteFolder');
        $this->router_->AddMapping('POST', '/graphs/:GraphID', 'ServiceCore', 'UpdateGraph');
        $this->router_->AddMapping('DELETE', '/graphs/:GraphID', 'ServiceCore', 'Deletegraph');
        $this->router_->AddMapping('PUT', '/permissions', 'ServiceCore', 'UpdatePermission');
        $this->router_->AddMapping('GET', '/permissions', 'ServiceCore', 'GetPermission');
        $this->router_->AddMapping('PUT', '/memberships', 'ServiceCore', 'UpdateMembership');
        $this->router_->AddMapping('GET', '/memberships', 'ServiceCore', 'GetMemberships');
        $this->router_->AddMapping('GET', '/groups', 'ServiceCore', 'GetGroups');
        $this->router_->AddMapping('POST', '/groups', 'ServiceCore', 'CreateGroup');
        $this->router_->AddMapping('POST', '/groups/:GroupID', 'ServiceCore', 'UpdateGroup');
        $this->router_->AddMapping('DELETE', '/groups/:GroupID', 'ServiceCore', 'DeleteGroup');
        $this->router_->AddMapping('POST', '/reset-password', 'AuthManager', 'ResetPassword', false);
    }

    public function HandleRequest()
    {
        header('Content-Type: application/json');

        $action = $_SERVER['REQUEST_METHOD'];
        $action = strtoupper($action);

        if (!isset($_SERVER['REQUEST_URI']))
        {
            $errorMessage = 'Request is not supported by API';
            Utilities::FatalError(400, 'E2001', $errorMessage);
        }

        $resource = $_SERVER['REQUEST_URI'];
        $resource = str_replace('/server-rest-api/v1', '', $resource);
        $pos = strpos($resource, '?');
        $queryString = '';
        if ($pos !== False)
        {
            $queryString = substr($resource, $pos + 1);
            $resource = substr($resource, 0, $pos);
        }

        $resource = rtrim($resource, '/');
        $resource = ltrim($resource, '/');
        $resourceParts = explode('/', $resource);

        if (empty($_SERVER['HTTPS']) || $_SERVER['HTTPS'] == 'off')
        {
            $localIPlist = array('127.0.0.1', '::1');

            if (!in_array($_SERVER['REMOTE_ADDR'], $localIPlist))
            {
                $errorMessage = 'You should use SSL';
                Utilities::FatalError(400, 'E2001', $errorMessage);
                return;
            }
        }


        $arguments = array();

        if ($action == 'GET' || $action == 'DELETE')
        {
            // Save query string in the arguments for GET and DELETE

            if ($queryString != '')
            {
                parse_str($queryString, $arguments);
            }
        }
        else if ($action == 'POST' || $action == 'PUT')
        {
            // Save the JSON body in the arguments for POST and PUT
            if (!isset($_SERVER['CONTENT_TYPE']))
            {
                $errorMessage = 'Content type should be application/json but not specified';
                Utilities::FatalError(415, 'E2003', $errorMessage);
            }

            $contentType = $_SERVER['CONTENT_TYPE'];
            $contentType = strtolower($contentType);
            if (strpos($contentType, 'application/json') === false)
            {
                $errorMessage = 'Content type should be application/json';
                Utilities::FatalError(415, 'E2004', $errorMessage);
            }


            $requestBody = file_get_contents("php://input");
            $decodedJSONBody = json_decode($requestBody);
            if (json_last_error() != JSON_ERROR_NONE)
            {
                $errorMessage = 'Request body is not parsable JSON';
                Utilities::FatalError(400, 'E2005', $errorMessage);
            }

            if ($decodedJSONBody)
            {
                foreach ($decodedJSONBody as $argName => $argValue)
                    $arguments[$argName] = $argValue;
            }
        }
        else
        {
            $errorMessage = 'Action is not supported by api';
            Utilities::FatalError(400, 'E2006', $errorMessage);
        }

        $this->router_->Route($action, $resourceParts, $arguments);
    }
}

?>