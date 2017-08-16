using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace We3Graph.IDSystem
{
    /// <summary>
    /// A hash dictionary which use FullID as key.
    /// A vertex or an edge can be used as value.
    /// </summary>
    internal class FullIDHashDictionary<T>
        where T : class, IHasFullID
    {
        private int firstHashSize;
        private int secondHashSize;
        private List<T>[] buckets;
        private List<T> allItems;

        internal FullIDHashDictionary()
        {
            firstHashSize = 37;
            secondHashSize = 1543;

            buckets = new List<T>[firstHashSize * secondHashSize];
            allItems = new List<T>();
        }

        internal void Add(T item)
        {
            var fullID = item.GetFullID();
            int index = hashFunction(fullID.GetClientID(), fullID.GetIDinCreator());

            if (buckets[index] == null)
                buckets[index] = new List<T>();

            buckets[index].Add(item);
            allItems.Add(item);
        }

        internal T Find(FullID fullID)
        {
            return Find(fullID.GetClientID(), fullID.GetIDinCreator());
        }

        internal T Find(int clientID, int IDinCreator)
        {
            int index = this.hashFunction(clientID, IDinCreator);

            if (buckets[index] == null)
                return null;

            var items = buckets[index];
            foreach (T item in items)
            {
                var fullID = item.GetFullID();
                if (fullID.GetClientID() == clientID &&
                    fullID.GetIDinCreator() == IDinCreator)
                    return item;
            }

            return null;
        }

        internal void Remove(FullID fullID)
        {
            Remove(fullID.GetClientID(), fullID.GetIDinCreator());
        }

        internal void Remove(int clientID, int IDinCreator)
        {
            int index = hashFunction(clientID, IDinCreator);

            if (buckets[index] == null)
                return;

            var items = buckets[index];
            int itemIndex = -1;

            int i;
            for (i = 0; i < items.Count; i++)
            {
                var fullID = items[i].GetFullID();
                if (fullID.GetClientID() == clientID &&
                    fullID.GetIDinCreator() == IDinCreator)
                    itemIndex = i;
            }

            if (itemIndex != -1)
                buckets[index].RemoveAt(itemIndex);

            itemIndex = -1;
            for (i = 0; i < allItems.Count; i++)
            {
                var fullID = allItems[i].GetFullID();
                if (fullID.GetClientID() == clientID &&
                    fullID.GetIDinCreator() == IDinCreator)
                    itemIndex = i;
            }

            if (itemIndex != -1)
                allItems.RemoveAt(itemIndex);
        }

        internal List<T> GetAllItems()
        {
            return allItems;
        }

        internal void RemoveAll()
        {
            buckets = new List<T>[firstHashSize * secondHashSize];
            allItems = new List<T>();
        }

        private int hashFunction(int firstKey, int secondKey)
        {
            return (firstKey % firstHashSize) * secondHashSize +
                (secondKey % secondHashSize);
        }

    }
}
