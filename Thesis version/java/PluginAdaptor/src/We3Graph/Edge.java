package We3Graph;

import We3Graph.IDSystem.FullID;
import We3Graph.IDSystem.IHasFullID;

import java.util.ArrayList;
import java.util.Hashtable;

/**
 * This class represents an edge.
 */
public class Edge implements IHasFullID
{
    private Hashtable<String, Hashtable<String, String>> properties_;

    private Vertex startVertex_;
    private Vertex endVertex_;
    private ArrayList<EdgeLine> edgeLines_;
    private FullID fullID_;
    private Graph graph_;

    void __setProperty(String listName, String key, String value)
    {
        if (!properties_.containsKey(listName))
            properties_.put(listName, new Hashtable<String, String>());

        if (value.equals(""))
            properties_.get(listName).remove(key);
        else
            properties_.get(listName).put(key, value);
    }

    Bend __breakEdgeLine(Point3D position, int index)
    {
        Bend newBend = new Bend(position, this, graph_);
        EdgeLine edgeLine = edgeLines_.get(index);
        EdgeLine edgeLine1 = new EdgeLine(this, newBend, edgeLine.GetEndBend());
        edgeLine.SetEndBend(newBend);

        edgeLines_.add(index + 1, edgeLine1);

        return newBend;
    }

    Bend __removeBend(int index)
    {
        EdgeLine beforeEdgeLine = edgeLines_.get(index);
        EdgeLine afterEdgeLine = edgeLines_.get(index + 1);
        Bend removedBend = beforeEdgeLine.GetEndBend();

        beforeEdgeLine.SetEndBend(afterEdgeLine.GetEndBend());
        edgeLines_.remove(index + 1);

        return removedBend;
    }

    Edge(Vertex startVertex, Vertex endVertex, FullID fullID, Graph graph)
    {
        startVertex_ = startVertex;
        endVertex_ = endVertex;
        edgeLines_ = new ArrayList<EdgeLine>();
        edgeLines_.add(new EdgeLine(this, null, null));
        fullID_ = fullID;
        graph_ = graph;
        properties_ = new Hashtable<String, Hashtable<String, String>>();
    }


    public void Remove()
    {
        graph_.__removeEdge(this);
        graph_.__getCommandSender().__sendRemoveEdgeCommand(this);
    }

    public Vertex GetStartVertex()
    {
        return startVertex_;
    }

    public Vertex GetEndVertex()
    {
        return endVertex_;
    }

    public ArrayList<EdgeLine> GetEdgeLines()
    {
        return edgeLines_;
    }

    public ArrayList<Bend> GetBends()
    {
        ArrayList<Bend> result = new ArrayList<Bend>();
        for (EdgeLine edgeLine : edgeLines_)
            if (edgeLine.GetStartBend() != null)
                result.add(edgeLine.GetStartBend());
        return result;
    }

    /**
     * Gets the value for a custom property of an edge specified by a list name and a key
     *
     * @param listName The list name. Use 'None' if there is no list.
     * @param key      The key for the property.
     * @return null if not found
     */
    public String GetPropertyValue(String listName, String key)
    {
        if (!properties_.containsKey(listName))
            return null;
        if (!properties_.get(listName).containsKey(key))
            return null;

        return properties_.get(listName).get(key);
    }

    /**
     * Gets the list for a custom property of an list specified by a list name
     *
     * @param listName The list name.
     * @return null if not found
     */
    public Hashtable<String, String> GetPropertyList(String listName)
    {
        if (properties_.containsKey(listName))
            return properties_.get(listName);
        else
            return null;
    }

    /**
     * Updates the value for a custom property of a vertex specified by a list name and a key
     *
     * @param listName             The list name. Will be created if doesn't exist.
     * @param key                  The key for the property.
     * @param value                The value for the property. An empty value indicates removing.
     * @param isRenderUpdateNeeded Whether this change requires an update in rendering
     */
    public void SetProperty(String listName, String key, String value,
                            boolean isRenderUpdateNeeded)
    {
        __setProperty(listName, key, value);
        graph_.__getCommandSender().__sendSetEdgePropertyCommand(this,
                listName, key, value, isRenderUpdateNeeded);
    }

    public FullID GetFullID()
    {
        return fullID_;
    }

    public Bend BreakEdgeLine(Point3D position, int index)
    {
        Bend bend = __breakEdgeLine(position, index);

        graph_.__getCommandSender().__sendBreakEdgeLineCommand(this, index, position);

        return bend;
    }

    public Bend RemoveBend(int index)
    {
        Bend bend = __removeBend(index);

        graph_.__getCommandSender().__sendRemoveBendCommand(this, index);

        return bend;
    }
}