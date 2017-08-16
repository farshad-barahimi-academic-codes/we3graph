/**
 * The IDHashDictionary class.
 * A hash based dictionary which takes 2 numbers as key and an object as value.
 * The 2 numbers for key represent an ID where the first number is a client ID and
 * the second number is a number unique per client.
 * The value can be a vertex or an edge.
 * @constructor
 */
IDHashDictionary = function IDHashDictionary()
{
    /** The bucket size for hashing the first key. It's a prime number.
     * It has lower size than secondHashSize_ since the number of client IDs are
     * smaller than the number of vertices or edges.
     * @private
     * @type {number} */
    this.firstHashSize_ = 37;

    /** The bucket size for hashing the second key. It's a prime number.
     * @private
     * @type {number} */
    this.secondHashSize_ = 1543;

    /** The hash buckets. It's a single dimension array representing a 2 dimensional array.
     * @private
     * @type {object[]} */
    this.buckets_ = new Array(this.firstHashSize_ * this.secondHashSize_);

    /** A duplicate array of all items. It is used to return all items faster.
     * @private
     * @type {object[]} */
    this.allItems_ = [];
};

/**
 * Adds a pair of key and value to the hash dictionary. The key itself consists of 2 numbers.
 * See {@link IDHashDictionary} for further information about the parameters.
 * @public
 * @param firstKey{number} - The first key.
 * @param secondKey{number} - The second key.
 * @param value{(Vertex|Edge)} - An object.
 */
IDHashDictionary.prototype.Add = function (firstKey, secondKey, value)
{
    var index = this.hashFunction(firstKey, secondKey);
    if (this.buckets_[index] == undefined || this.buckets_[index] == null)
        this.buckets_[index] = [];

    var item = {FirstKey: firstKey, SecondKey: secondKey, Value: value};

    this.buckets_[index].push(item);
    this.allItems_.push(value);
};

/**
 * Finds a key in the hash dictionary. The key itself consists of 2 numbers.
 * See {@link IDHashDictionary} for further information about the parameters.
 * @public
 * @param firstKey{number} - The first key.
 * @param secondKey{number} - The second key.
 * @return {(Vertex|Edge|null)} the value or null if not found.
 */
IDHashDictionary.prototype.Find = function (firstKey, secondKey)
{
    var index = this.hashFunction(firstKey, secondKey);
    if (this.buckets_[index] == undefined || this.buckets_[index] == null)
        return null;

    var items = this.buckets_[index];
    for (var i = 0; i < items.length; i++)
        if (items[i].FirstKey == firstKey && items[i].SecondKey == secondKey)
            return items[i].Value;

    return null;
};

/**
 * Removes a key in the hash dictionary. The key itself consists of 2 numbers.
 * Does nothing if key is not found.
 * See {@link IDHashDictionary} for further information about the parameters.
 * @public
 * @param firstKey{number} - The first key.
 * @param secondKey{number} - The second key.
 */
IDHashDictionary.prototype.Remove = function (firstKey, secondKey)
{
    var index = this.hashFunction(firstKey, secondKey);
    if (this.buckets_[index] == undefined || this.buckets_[index] == null)
        return;


    var items = this.buckets_[index];
    var itemIndex = -1;
    for (var i = 0; i < items.length; i++)
        if (items[i].FirstKey == firstKey && items[i].SecondKey == secondKey)
            itemIndex = i;

    if (itemIndex != -1)
        this.buckets_[index].splice(itemIndex, 1);

    var ID = firstKey + "-" + secondKey;
    var index = -1;
    for (var i = 0; i < this.allItems_.length; i++)
        if (this.allItems_[i].GetID() == ID)
            index = i;
    this.allItems_.splice(index, 1);
};

/**
 * Returns all values in the dictionary.
 * @public
 * @return {(Vertex|Edge)[]}
 */
IDHashDictionary.prototype.GetAllValues = function ()
{
    return this.allItems_;
};

/**
 * The hash function used for hashing the keys.
 * See {@link IDHashDictionary} for further information about the parameters.
 * @private
 * @param firstKey{number} - The first key.
 * @param secondKey{number} - The second key.
 * @return {number} An index for the buckets arrays.
 */
IDHashDictionary.prototype.hashFunction = function (firstKey, secondKey)
{
    return (firstKey % this.firstHashSize_) * this.secondHashSize_ +
        (secondKey % this.secondHashSize_);
};
