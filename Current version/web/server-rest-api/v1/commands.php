<?php
namespace We3Graph\RestAPI;

/**
 * Class Commands
 * @package We3Graph\RestAPI
 * A Static class that contains the list of commands and their parameters
 */
class Commands
{
    /**
     * List of commands and their parameter types
     * An array mapping command name to string specifying parameters
     * Each character of the string can be one of the following:
     * i : an id parameter in form of IDinCreator-ID (p-p)
     * p : An 18-digit non negative integer parameter
     * f : a double precision floating number parameter
     * s : a string parameter with at most 50 characters
     */
    public static $CommandsList = array(
        /**
         * InsertVertex(IDinCreator,x,y,z)
         * The ID of vertex will be creator user ID + IDinCreator. e.g. 10-32
         * x,y,z are the coordinates of the vertex
         */
        'InsertVertex' => 'pfff',

        /**
         * InsertEdge(fromVertexID,toVertexID, IDinCreator)
         * The ID of edge will be creator user ID + IDinCreator. e.g. 10-56
         */
        'InsertEdge' => 'iip',

        /**
         * BreakEdgeLine(edgeID,index,x,y,z)
         * Break an edgeLine specified by index with a bend with x,y,z coordinates.
         */
        'BreakEdgeLine' => 'ipfff',

        /**
         * RemoveVertex(vertexID)
         * The vertex is marked as removed.
         */
        'RemoveVertex' => 'i',

        /**
         * RemoveEdge(edgeID)
         * The Edge is marked as removed.
         */
        'RemoveEdge' => 'i',

        /**
         * RemoveBend(edgeID,index)
         * Marks the bend at specific index of the edge as removed.
         */
        'RemoveBend' => 'ip',

        /**
         * MoveVertex(vertexID,x,y,z)
         * Moves the vertex to specified coordinate
         */
        'MoveVertex' => 'ifff',

        /**
         * ChangeVertexScale(vertexID,scale)
         * Change the scale of the vertex to a single value.
         * The render engine can decide how to apply this value.
         */
        'ChangeVertexScale' => 'if',

        /**
         * ChangeVertexRotation(vertexID,x,y,z,w)
         * Changes vertex rotation using Quaternion values.
         * The render engine can decide how to apply this value.
         */
        'ChangeVertexRotation' => 'iffff',

        /**
         * MoveBend(edgeID,index,x,y,z)
         * Moves the bend at specific index of edge to the new coordinate
         */
        'MoveBend' => 'ipfff',

        /**
         * ChangeCameraPosition(x,y,z)
         */
        'ChangeCameraPosition' => 'fff',

        /**
         * ChangeCameraRotation(x,y,z,w)
         * Changes camera using Quaternion values
         */
        'ChangeCameraRotation' => 'ffff',

        /**
         * SetVertexProperty(vertexID,listName,name,value,needRenderUpdate)
         * Changes the value of key named "name" in a list named "listName" to "value"
         * An string empty value means remove
         * needRenderUpdate : 0 = false, otherwise true
         */
        'SetVertexProperty' => 'isssp',

        /**
         * SetVertexProperty(edgeID,listName,name,value,needRenderUpdate)
         * Changes the value of key named "name" in a list named "listName" to "value"
         * An empty string value means remove
         * needRenderUpdate : 0 = false, otherwise true
         */
        'SetEdgeProperty' => 'isssp',

        /**
         * CustomCommand(name,parameter)
         * This is used for any undefined command needed
         */
        'CustomCommand' => 'ss',

        /**
         * SelectVertex(vertexID)
         * Adds the vertex with specified vertexID to current selection
         * The user interface can choose to ignore this command
         */
        'SelectVertex' => 'i',

        /**
         * SelectBend(edgeID,index)
         * Adds the bend at specific index of the edge to current selection
         * The user interface can choose to ignore this command
         */
        'SelectBend' => 'ip',

        /**
         * ClearSelection(none)
         * Clears the selection.
         * The user interface can choose to ignore this command
         * This command doesn't have any parameter but provide string none as
         * parameter
         */
        'ClearSelection' => '',
    );

}

?>