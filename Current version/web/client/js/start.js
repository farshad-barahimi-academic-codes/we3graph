/**
 * Starts We3Graph
 */
function Start()
{
    if (getParameterByName('isKeyboardEnabled') != 'false')
        KEYBOARD_MANAGER = new KeyboardManager();

    GRAPH = new Graph();
    WEB_SERVICE = new WebService(WEB_SERVICE_URL);
    INTERFACE_MANAGER = new InterfaceManager();
}

/**
 * Returns the value of URL query parameter
 * @param{string} name - the name of parameter
 * @returns {string}
 */
function getParameterByName(name)
{
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
        results = regex.exec(location.search);
    return results == null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

/**
 * Calls a method on an object where both method and object are specified by string
 * @param{string} objectName - The name of the object
 * @param{string} methodName - The name of the method
 * @param{[...]} methodArgs - variable number of arguments passed as method arguments
 * @constructor
 */
function CallMethodOnObject(objectName, methodName)
{

    argsArray = [];
    for (var i = 2; i < arguments.length; i++)
        argsArray.push(arguments[i]);

    if (window[objectName] == null)
        return;

    window[objectName][methodName].apply(this, argsArray);
}