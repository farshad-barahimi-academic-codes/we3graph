/**
 * The MessageBox class.
 * A static class for displaying messages
 * @constructor
 */
function MessageBox()
{
}

/**
 * Shows a modal message box to inform the user of an error.
 * @param{string} message - The error message
 */
MessageBox.ShowError = function (message)
{

    $('<div title="Error">' + message + '</div>').dialog({
        resizable: false,
        modal: true,
        dialogClass: 'ErrorDiv',
        minHeight: 80,
        width: 400
    });
};

/**
 * Shows a modal message box to inform the user of success of an action.
 * @param{string} message - The success message
 */
MessageBox.ShowSuccess = function (message)
{
    $('<div title="Success">' + message + '</div>').dialog({
        resizable: false,
        modal: true,
        dialogClass: 'SuccessDiv',
        minHeight: 80,
        width: 400
    });
};

/**
 * Shows a general modal message box to the user.
 * @param{string} message - The message
 * @param{string} title - The title of message box
 */
MessageBox.Show = function (message, title)
{
    $('<div title="' + title + '">' + message + '</div>').dialog({
        resizable: false,
        modal: true,
        dialogClass: 'MessageDiv',
        minHeight: 80,
        width: 400
    });
};