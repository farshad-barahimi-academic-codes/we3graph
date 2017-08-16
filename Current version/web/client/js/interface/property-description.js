/**
 * Creates a PropertyDescription.
 * This class is used to represent a description of a property
 * @param {string} target - Possible values 'Vertex' or 'Edge'
 * @param {string} name - The name of property
 * @param {string} type - Possible values 'String', 'Enum' or 'StringList'
 * @param {string[]} enumValues - Contains possible values for enums. Only for enums.
 * @param {boolean} isMeshUpdateNeeded - Whether changes to this property require
 * mesh update
 * @constructor
 */
function PropertyDescription(target, name, type, enumValues, isMeshUpdateNeeded)
{
    this.target_ = target;
    this.name_ = name;
    this.type_ = type;
    this.enumValues_ = enumValues;
    this.isMeshUpdateNeeded_ = isMeshUpdateNeeded;
}

/**
 * Returns the target of property description.
 * @public
 * @returns {string}
 */
PropertyDescription.prototype.GetTarget = function ()
{
    return this.target_;
};

/**
 * Returns the name of property description.
 * @public
 * @returns {string}
 */
PropertyDescription.prototype.GetName = function ()
{
    return this.name_;
};

/**
 * Returns the type of property description.
 * @public
 * @returns {string}
 */
PropertyDescription.prototype.GetType = function ()
{
    return this.type_;
};

/**
 * Returns possible values for an enum property description.
 * @public
 * @returns {string[]}
 */
PropertyDescription.prototype.GetEnumValues = function ()
{
    return this.enumValues_;
};

/**
 * Returns whether changes to this property require mesh update
 * @public
 * @returns {boolean}
 */
PropertyDescription.prototype.GetIsMeshUpdateNeeded = function ()
{
    return this.isMeshUpdateNeeded_;
};
