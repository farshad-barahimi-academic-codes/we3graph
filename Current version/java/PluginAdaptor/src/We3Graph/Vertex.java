package We3Graph;

import We3Graph.IDSystem.FullID;
import We3Graph.IDSystem.IHasFullID;

import java.util.ArrayList;
import java.util.Hashtable;

/**
 * This class represents a vertex
 */
public class Vertex implements IHasFullID
{

    private Graph graph_;

    private Hashtable<String, Hashtable<String, String>> properties_;

    private ArrayList<Edge> edges_;
    private Point3D position_;
    private Point4D rotation_;
    private double scale_;
    private FullID fullID_;
    private int index_;

    Vertex(Graph graph, Point3D position, FullID fullID, int index)
    {
        graph_ = graph;
        properties_ = new Hashtable<String, Hashtable<String, String>>();
        edges_ = new ArrayList<Edge>();
        position_ = position;
        rotation_ = new Point4D(0, 0, 1, 1);
        scale_ = 1;
        fullID_ = fullID;
        index_ = index;
    }

    void __setIndex(int index)
    {
        this.index_ = index;
    }

    Edge __connectTo(Vertex endVertex, FullID edgeFullID)
    {
        Edge edge = new Edge(this, endVertex, edgeFullID, graph_);
        graph_.__getEdgesDictionary().Add(edge);
        edges_.add(edge);
        endVertex.edges_.add(edge);

        return edge;
    }

    void __move(Point3D position)
    {
        this.position_ = position;
    }

    void __setRotation(Point4D rotation)
    {
        this.rotation_ = rotation;
    }

    void __setScale(double scale)
    {
        this.scale_ = scale;
    }

    void __setProperty(String listName, String key, String value)
    {

        if (!properties_.containsKey(listName))
            properties_.put(listName, new Hashtable<String, String>());

        if (value.equals(""))
            properties_.get(listName).remove(key);
        else
            properties_.get(listName).put(key, value);
    }

    public Edge ConnectTo(Vertex endVertex)
    {
        int edgeClientID = graph_.__getClientID();
        int edgeIDinCreator = graph_.__getLastCreatedEdgeID() + 1;
        graph_.__setLastCreatedEdgeID(edgeIDinCreator);

        Edge edge = __connectTo(endVertex, new FullID(edgeClientID, edgeIDinCreator));

        graph_.__getCommandSender().__sendInsertEdgeCommand(edge);

        return edge;
    }

    public void Move(Point3D position)
    {
        __move(position);
        graph_.__getCommandSender().__sendMoveVertexCommand(this);
    }

    public void SetRotation(Point4D rotation)
    {
        __setRotation(rotation);
        graph_.__getCommandSender().__sendChangeVertexRotationCommand(this);
    }

    public void SetScale(double scale)
    {
        __setScale(scale);
        graph_.__getCommandSender().__sendChangeVertexScaleCommand(this);
    }

    public void Remove()
    {
        graph_.__removeVertex(this);
        graph_.__getCommandSender().__sendRemoveVertexCommand(this);
    }

    public FullID GetFullID()
    {
        return fullID_;
    }

    public int GetIndex()
    {
        return index_;
    }

    public Point3D GetPosition()
    {
        return position_;
    }

    public Point4D GetRotation()
    {
        return rotation_;
    }

    public double GetScale()
    {
        return scale_;
    }

    public ArrayList<Edge> GetEdges()
    {
        return edges_;
    }

    public ArrayList<Vertex> GetAdjacentVertices()
    {
        return GetAdjacentVertices(false);
    }

    public ArrayList<Vertex> GetAdjacentVertices(boolean isDirected)
    {
        ArrayList<Vertex> result = new ArrayList<Vertex>();
        for (Edge edge : edges_)
        {
            Vertex startVertex = edge.GetStartVertex();
            Vertex endVertex = edge.GetEndVertex();
            if (startVertex.GetFullID().equals(fullID_))
                result.add(endVertex);
            else if (endVertex.GetFullID().equals(fullID_) && !isDirected)
                result.add(startVertex);
        }
        return result;
    }

    /**
     * Gets the value for a custom property of a vertex specified by a list name and a key
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
     * Gets the list for a custom property of a vertex specified by a list name
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
        graph_.__getCommandSender().__sendSetVertexPropertyCommand(this,
                listName, key, value, isRenderUpdateNeeded);
    }

    public boolean IsConnectedTo(Vertex vertex)
    {
        for (Edge edge : edges_)
            if (edge.GetStartVertex().GetFullID().equals(vertex.GetFullID()) ||
                    edge.GetEndVertex().GetFullID().equals(vertex.GetFullID()))
                return true;

        return false;
    }
}