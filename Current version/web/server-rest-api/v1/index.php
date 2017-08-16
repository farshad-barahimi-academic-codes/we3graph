<?php
namespace We3Graph\RestAPI;

require_once 'request-manager.php';

$requestManager = new RequestManager;
$requestManager->HandleRequest();

Utilities::CloseConnection();

?>