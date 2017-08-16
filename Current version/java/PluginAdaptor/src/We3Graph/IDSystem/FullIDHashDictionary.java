package We3Graph.IDSystem;

import java.util.ArrayList;

/**
 * A hash dictionary which use FullID as key.
 * A vertex or an edge can be used as value.
 */
public class FullIDHashDictionary<T extends IHasFullID>
{
    private int firstHashSize;
    private int secondHashSize;
    private ArrayList<ArrayList<T>> buckets;
    private ArrayList<T> allItems;

    public FullIDHashDictionary()
    {
        firstHashSize = 37;
        secondHashSize = 1543;
        buckets = new ArrayList<ArrayList<T>>();

        int bucketsCount = firstHashSize * secondHashSize;
        for (int i = 0; i < bucketsCount; i++)
            buckets.add(new ArrayList<T>());

        allItems = new ArrayList<T>();
    }

    public void Add(T item)
    {
        FullID fullID = item.GetFullID();
        int index = hashFunction(fullID.GetClientID(), fullID.GetIDinCreator());

        buckets.get(index).add(item);
        allItems.add(item);
    }

    public T Find(FullID fullID)
    {
        return Find(fullID.GetClientID(), fullID.GetIDinCreator());
    }

    public T Find(int clientID, int IDinCreator)
    {
        int index = this.hashFunction(clientID, IDinCreator);

        if (buckets.get(index) == null)
            return null;

        ArrayList<T> items = buckets.get(index);
        for (T item : items)
        {
            FullID fullID = item.GetFullID();
            if (fullID.GetClientID() == clientID &&
                    fullID.GetIDinCreator() == IDinCreator)
                return item;
        }

        return null;
    }

    public void Remove(FullID fullID)
    {
        Remove(fullID.GetClientID(), fullID.GetIDinCreator());
    }

    public void Remove(int clientID, int IDinCreator)
    {
        int index = hashFunction(clientID, IDinCreator);

        if (buckets.get(index) == null)
            return;

        ArrayList<T> items = buckets.get(index);
        int itemIndex = -1;

        int i;
        for (i = 0; i < items.size(); i++)
        {
            FullID fullID = items.get(i).GetFullID();
            if (fullID.GetClientID() == clientID &&
                    fullID.GetIDinCreator() == IDinCreator)
                itemIndex = i;
        }

        if (itemIndex != -1)
            buckets.get(index).remove(itemIndex);

        itemIndex = -1;
        for (i = 0; i < allItems.size(); i++)
        {
            FullID fullID = allItems.get(i).GetFullID();
            if (fullID.GetClientID() == clientID &&
                    fullID.GetIDinCreator() == IDinCreator)
                itemIndex = i;
        }

        if (itemIndex != -1)
            allItems.remove(itemIndex);
    }

    public ArrayList<T> GetAllItems()
    {
        return allItems;
    }

    public void RemoveAll()
    {
        int bucketsCount = firstHashSize * secondHashSize;
        for (int i = 0; i < bucketsCount; i++)
            buckets.add(new ArrayList<T>());
        allItems = new ArrayList<T>();
    }

    private int hashFunction(int firstKey, int secondKey)
    {
        return (firstKey % firstHashSize) * secondHashSize +
                (secondKey % secondHashSize);
    }

}

