package We3Graph.IDSystem;

/**
 * A full ID represent an ID in form of clientID-IDinCreator
 * It can be used as a unique ID for vertices or edges
 */
public class FullID
{
    private int clientID;
    private int IDinCreator;

    public FullID(int clientID, int IDinCreator)
    {
        this.clientID = clientID;
        this.IDinCreator = IDinCreator;
    }

    public static FullID FromString(String IDString)
    {
        String[] parts = IDString.split("-");
        int clientID = Integer.parseInt(parts[0]);
        int IDinCreator = Integer.parseInt(parts[1]);
        return new FullID(clientID, IDinCreator);
    }

    public String ToString()
    {
        return clientID + "-" + IDinCreator;
    }

    public int GetClientID()
    {
        return clientID;
    }

    public int GetIDinCreator()
    {
        return IDinCreator;
    }

    public boolean equals(Object o)
    {
        if (o == null)
            return false;

        if (this == o)
            return true;

        if (!(o instanceof FullID))
            return false;

        FullID ID = (FullID) o;

        if (this.GetClientID() == ID.GetClientID() &&
                this.GetIDinCreator() == ID.GetIDinCreator())
            return true;

        return false;
    }
}

