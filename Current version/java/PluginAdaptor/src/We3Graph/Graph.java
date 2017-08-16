package We3Graph;

import We3Graph.EventListeners.*;
import We3Graph.IDSystem.FullID;
import We3Graph.IDSystem.FullIDHashDictionary;

import java.util.ArrayList;

/**
 * This class represents a graph.
 */
public class Graph implements NewCommandsEventListener, GraphLoadedEventListener
{
    private int clientID_;
    private FullIDHashDictionary<Vertex> verticesDictionary_;
    private FullIDHashDictionary<Edge> edgesDictionary_;
    private Camera camera_;
    private int lastCreatedVertexID_;
    private int lastCreatedEdgeID_;
    private boolean isLoading_;
    private ServiceManager serviceManager_;
    private CommandSender commandSender_;

    CommandSender __getCommandSender()
    {
        return commandSender_;
    }

    int __getClientID()
    {
        return clientID_;
    }

    int __getLastCreatedEdgeID()
    {
        return lastCreatedEdgeID_;
    }

    void __setLastCreatedEdgeID(int edgeID)
    {
        lastCreatedEdgeID_ = edgeID;
    }

    void __setLastCreatedVertexID(int vertexID)
    {
        lastCreatedVertexID_ = vertexID;
    }

    FullIDHashDictionary<Edge> __getEdgesDictionary()
    {
        return edgesDictionary_;
    }

    FullIDHashDictionary<Vertex> __getVerticesDictionary()
    {
        return verticesDictionary_;
    }

    Vertex __insertVertex(Point3D position, FullID fullID)
    {
        Vertex vertex = new Vertex(this, position, fullID, verticesDictionary_.GetAllItems().size());
        verticesDictionary_.Add(vertex);

        return vertex;
    }

    void __removeEdge(Edge edge)
    {
        if (edge == null)
            return;

        edgesDictionary_.Remove(edge.GetFullID());

        ArrayList<Edge> startVertexEdges = edge.GetStartVertex().GetEdges();
        ArrayList<Edge> endVertexEdges = edge.GetEndVertex().GetEdges();

        int i;
        int index = -1;
        for (i = 0; i < startVertexEdges.size(); i++)
            if (startVertexEdges.get(i).GetFullID().equals(edge.GetFullID()))
                index = i;
        if (index != -1)
            startVertexEdges.remove(index);

        index = -1;
        for (i = 0; i < endVertexEdges.size(); i++)
            if (endVertexEdges.get(i).GetFullID().equals(edge.GetFullID()))
                index = i;
        if (index != -1)
            endVertexEdges.remove(index);
    }

    void __removeVertex(Vertex vertex)
    {
        if (vertex == null)
            return;

        int index = vertex.GetIndex();
        ArrayList<Vertex> vertices = GetVertices();
        for (int i = index + 1; i < vertices.size(); i++)
            vertices.get(i).__setIndex(vertices.get(i).GetIndex() - 1);

        verticesDictionary_.Remove(vertex.GetFullID());

        ArrayList<Edge> edges = vertex.GetEdges();
        ArrayList<Edge> edgesCopy = new ArrayList<Edge>();
        for (Edge edge : edges)
            edgesCopy.add(edge);

        for (Edge edge : edgesCopy)
            __removeEdge(edge);


    }

    void __raiseVertexAddedEvent(Vertex vertex)
    {
        if (VertexAdded != null)
            VertexAdded.OnVertexEvent(vertex);
    }

    void __raiseVertexMovedEvent(Vertex vertex)
    {
        if (VertexMoved != null)
            VertexMoved.OnVertexEvent(vertex);
    }

    void __raiseVertexRotationChangedEvent(Vertex vertex)
    {
        if (VertexRotationChanged != null)
            VertexRotationChanged.OnVertexEvent(vertex);
    }

    void __raiseVertexScaleChangedEvent(Vertex vertex)
    {
        if (VertexScaleChanged != null)
            VertexScaleChanged.OnVertexEvent(vertex);
    }

    void __raiseVertexRemovedEvent(Vertex vertex)
    {
        if (VertexRemoved != null)
            VertexRemoved.OnVertexEvent(vertex);
    }

    void __raiseVertexPropertyChangedEvent(Vertex vertex, String listName, String key)
    {
        if (VertexPropertyChanged != null)
            VertexPropertyChanged.OnVertexPropertyEvent(vertex, listName, key);
    }

    void __raiseEdgeAddedEvent(Edge edge)
    {
        if (EdgeAdded != null)
            EdgeAdded.OnEdgeEvent(edge);
    }

    void __raiseEdgeRemovedEvent(Edge edge)
    {
        if (EdgeRemoved != null)
            EdgeRemoved.OnEdgeEvent(edge);
    }

    void __raiseEdgePropertyChangedEvent(Edge edge, String listName, String key)
    {
        if (EdgePropertyChanged != null)
            EdgePropertyChanged.OnEdgePropertyEvent(edge, listName, key);
    }

    void __raiseBendAddedEvent(Bend bend)
    {
        if (BendAdded != null)
            BendAdded.OnBendEvent(bend);
    }

    void __raiseBendMovedEvent(Bend bend)
    {
        if (BendMoved != null)
            BendMoved.OnBendEvent(bend);
    }

    void __raiseBendRemovedEvent(Bend bend)
    {
        if (BendRemoved != null)
            BendRemoved.OnBendEvent(bend);
    }

    void __raiseCameraChangedEvent()
    {
        if (CameraChanged != null)
            CameraChanged.OnCameraEvent(camera_);
    }

    void __raiseGraphChangedEvent()
    {
        if (GraphChanged != null)
            GraphChanged.OnGraphEvent(this);
    }

    public VertexEventListener VertexAdded;
    public VertexEventListener VertexMoved;
    public VertexEventListener VertexRotationChanged;
    public VertexEventListener VertexScaleChanged;
    public VertexEventListener VertexRemoved;
    public VertexPropertyEventListener VertexPropertyChanged;

    public EdgeEventListener EdgeAdded;
    public EdgeEventListener EdgeRemoved;
    public EdgePropertyEventListener EdgePropertyChanged;

    public BendEventListener BendAdded;
    public BendEventListener BendMoved;
    public BendEventListener BendRemoved;

    public CameraEventListener CameraChanged;

    public GraphEventListener GraphChanged;

    Graph(SystemManager systemManager, int graphID)
    {
        this(systemManager, graphID, true, true);
    }


    Graph(SystemManager systemManager, int graphID,
          boolean waitForLoadingToFinish, boolean receiveCommands)
    {
        verticesDictionary_ = new FullIDHashDictionary<Vertex>();
        edgesDictionary_ = new FullIDHashDictionary<Edge>();
        lastCreatedVertexID_ = 0;
        lastCreatedEdgeID_ = 0;
        isLoading_ = true;
        camera_ = new Camera(this);

        serviceManager_ = new ServiceManager(systemManager, graphID);
        clientID_ = serviceManager_.__getClientID();
        serviceManager_.__newCommandsReceived = (NewCommandsEventListener) this;
        serviceManager_.__graphLoaded = (GraphLoadedEventListener) this;

        commandSender_ = new CommandSender(serviceManager_);

        serviceManager_.__start(receiveCommands);

        if (waitForLoadingToFinish)
        {
            while (IsLoading())
                try
                {
                    Thread.sleep(20);
                } catch (Exception e)
                {
                }
        }

    }

    public ArrayList<Vertex> GetVertices()
    {
        return verticesDictionary_.GetAllItems();
    }

    public Camera GetCamera()
    {
        return camera_;
    }

    public Vertex AddVertex(Point3D position)
    {
        int IDinCreator = ++lastCreatedVertexID_;
        FullID fullID = new FullID(clientID_, IDinCreator);

        Vertex vertex = __insertVertex(position, fullID);

        commandSender_.__sendInsertVertexCommand(vertex);

        return vertex;
    }

    public boolean IsAllCommandsSent()
    {
        return serviceManager_.__isAllCommandsSent();
    }

    public boolean IsLoading()
    {
        return isLoading_;
    }

    public void Finish()
    {
        Finish(true);
    }

    public void Finish(boolean waitForAllCommandsToBeSent)
    {
        if (waitForAllCommandsToBeSent)
        {
            while (!serviceManager_.__isAllCommandsSent())
                try
                {
                    Thread.sleep(20);
                } catch (Exception e)
                {
                }
        }

        serviceManager_.__stop();
    }

    public void OnGraphLoadedEvent()
    {
        isLoading_ = false;
    }

    public void OnNewCommandEvent(ArrayList<Command> commands)
    {
        CommandProcessor commandProcesor = new CommandProcessor(this);
        for (Command command : commands)
            commandProcesor.__processCommand(command);

        if (commands.size() > 0)
            __raiseGraphChangedEvent();
    }
}
