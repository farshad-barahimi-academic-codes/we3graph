<?php
namespace We3Graph\RestAPI;

/**
 * Class PermissionTypes
 * @package We3Graph\RestAPI
 * An enum style class for different permission types on folders
 */
class PermissionTypes
{
    /**
     * No access on the folder
     */
    const NO_ACCESS = -1;

    /**
     * Read command for graphs of this folder
     */
    const READ_ONLY_ACCESS = 0;

    /**
     * Read and write commands for graphs of this folder
     */
    const WRITE_ACCESS = 1;

    /**
     * Read and write commands for graphs of this folder
     * Create, rename or delete graphs in this folder
     */
    const MODERATOR_ACCESS = 2;
}

?>