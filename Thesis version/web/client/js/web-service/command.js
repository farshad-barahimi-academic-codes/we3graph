/**
 * The Command class.
 * Represent a command that is sent or received from the server.
 * @constructor
 * @param {string} name - The name of the command.
 * @param {string[]} parameters - The parameters of the command as an array of string.
 * If the command has less than 5 parameters empty string will be added to
 * the end of array to make it exactly 5 parameters.
 */
function Command(name, parameters)
{
    /** @private
     * @type {string} */
    this.name_ = name;

    /** @private
     * @type {string[]} */
    this.parameters_ = parameters;

    /** @private
     * @type {(number|undefined)} */
    this.id_ = undefined;

    /** The client ID for the sender of the command
     * @private
     * @type {(number|undefined)} */
    this.clientID_ = undefined;

    /** See {@link Command#GetComplementCommand} for further information.
     * @private
     * @type {Command} */
    this.complementCommand_ = undefined;

    for (var i = this.parameters_.length; i < 5; i++)
        this.parameters_.push("");
}

/**
 * Returns the name of the command
 * @returns {string}
 * @public
 */
Command.prototype.GetName = function ()
{
    return this.name_;
};

/**
 * Returns the paramters of the command
 * @returns {string[]}
 * @public
 */
Command.prototype.GetParameters = function ()
{
    return this.parameters_;
};

/**
 * Returns the ID of the command
 * @returns {(number|undefined)}
 * @public
 */
Command.prototype.GetID = function ()
{
    return this.id_;
};

/**
 * Sets the ID of the command
 * @param{number} id
 * @public
 */
Command.prototype.SetID = function (id)
{
    this.id_ = id;
};

/**
 * Returns the client ID of the sender of the command
 * @returns {(number|undefined)}
 * @public
 */
Command.prototype.GetClientID = function ()
{
    return this.clientID_;
};

/**
 * Sets the client ID of the sender of the command
 * @param{number} clientID
 * @public
 */
Command.prototype.SetClientID = function (clientID)
{
    this.clientID_ = clientID;
};

/**
 * Returns the complement of the command.
 * The complement of a command is a command that does reverse of that command.
 * It is used to move through history of graph.
 * @returns {(Command|undefined)}
 * @public
 */
Command.prototype.GetComplementCommand = function ()
{
    return this.complementCommand_;
};


/**
 * Sets the complement of the command
 * See {@link Command#GetComplementCommand} for further information.
 * @param{Command} complementCommand
 * @public
 */
Command.prototype.SetComplementCommand = function (complementCommand)
{
    this.complementCommand_ = complementCommand;
};