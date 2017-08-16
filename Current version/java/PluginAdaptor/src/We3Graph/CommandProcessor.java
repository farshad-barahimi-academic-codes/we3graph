package We3Graph;

import We3Graph.IDSystem.FullID;
import We3Graph.IDSystem.FullIDHashDictionary;

import java.util.ArrayList;

/**
 * This class processes incoming commands and make necessary actions.
 */
class CommandProcessor
{
    private Graph graph_;

    CommandProcessor(Graph graph)
    {
        graph_ = graph;
    }

    void __processCommand(Command command)
    {
        String name = command.GetName();

        switch (name)
        {
            case "InsertVertex":
                processInsertVertexCommand(command);
                break;
            case "InsertEdge":
                processInsertEdgeCommand(command);
                break;
            case "BreakEdgeLine":
                processBreakEdgeLineCommand(command);
                break;
            case "RemoveVertex":
                processRemoveVertexCommand(command);
                break;
            case "RemoveEdge":
                processRemoveEdgeCommand(command);
                break;
            case "RemoveBend":
                processRemoveBendCommand(command);
                break;
            case "MoveVertex":
                processMoveVertexCommand(command);
                break;
            case "ChangeVertexScale":
                processChangeVertexScaleCommand(command);
                break;
            case "ChangeVertexRotation":
                processChangeVertexRotationCommand(command);
                break;
            case "MoveBend":
                processMoveBendCommand(command);
                break;
            case "ChangeCameraPosition":
                processChangeCameraPositionCommand(command);
                break;
            case "ChangeCameraRotation":
                processChangeCameraRotationCommand(command);
                break;
            case "SetVertexProperty":
                processSetVertexPropertyCommand(command);
                break;
            case "SetEdgeProperty":
                processSetEdgePropertyCommand(command);
                break;
        }
    }

    private void processInsertVertexCommand(Command command)
    {
        ArrayList<String> parameters = command.GetParameters();
        int commandClientID = command.__getClientID();


        Point3D position = new Point3D(Double.parseDouble(parameters.get(1)),
                Double.parseDouble(parameters.get(2)), Double.parseDouble(parameters.get(3)));
        FullID vertexFullID = new FullID(commandClientID, Integer.parseInt(parameters.get(0)));
        Vertex insertedVertex = graph_.__insertVertex(position, vertexFullID);
        if (graph_.IsLoading() && commandClientID == graph_.__getClientID())
            graph_.__setLastCreatedVertexID(vertexFullID.GetIDinCreator());

        graph_.__raiseVertexAddedEvent(insertedVertex);
    }

    private void processInsertEdgeCommand(Command command)
    {
        ArrayList<String> parameters = command.GetParameters();
        int commandClientID = command.__getClientID();
        FullIDHashDictionary<Vertex> verticesDictionary = graph_.__getVerticesDictionary();

        Vertex fromVertex = verticesDictionary.Find(FullID.FromString(parameters.get(0)));
        Vertex endVertex = verticesDictionary.Find(FullID.FromString(parameters.get(1)));

        if (fromVertex == null || endVertex == null)
            return;

        if (fromVertex.IsConnectedTo(endVertex))
            return;

        FullID edgeFullID = new FullID(commandClientID, Integer.parseInt(parameters.get(2)));

        Edge edge = fromVertex.__connectTo(endVertex, edgeFullID);
        if (graph_.IsLoading() && commandClientID == graph_.__getClientID())
            graph_.__setLastCreatedEdgeID(edgeFullID.GetIDinCreator());

        graph_.__raiseEdgeAddedEvent(edge);
    }

    private void processBreakEdgeLineCommand(Command command)
    {
        ArrayList<String> parameters = command.GetParameters();
        FullIDHashDictionary<Edge> edgesDictionary = graph_.__getEdgesDictionary();

        Edge edge = edgesDictionary.Find(FullID.FromString(parameters.get(0)));
        if (edge == null)
            return;

        Point3D position = new Point3D(Double.parseDouble(parameters.get(2)),
                Double.parseDouble(parameters.get(3)), Double.parseDouble(parameters.get(4)));

        Bend bend = edge.__breakEdgeLine(position, Integer.parseInt(parameters.get(1)));

        graph_.__raiseBendAddedEvent(bend);
    }

    private void processRemoveVertexCommand(Command command)
    {
        ArrayList<String> parameters = command.GetParameters();
        FullIDHashDictionary<Vertex> verticesDictionary = graph_.__getVerticesDictionary();

        Vertex vertex = verticesDictionary.Find(FullID.FromString(parameters.get(0)));

        graph_.__removeVertex(vertex);

        graph_.__raiseVertexRemovedEvent(vertex);
    }

    private void processRemoveEdgeCommand(Command command)
    {
        ArrayList<String> parameters = command.GetParameters();
        FullIDHashDictionary<Edge> edgesDictionary = graph_.__getEdgesDictionary();

        Edge edge = edgesDictionary.Find(FullID.FromString(parameters.get(0)));
        graph_.__removeEdge(edge);

        graph_.__raiseEdgeRemovedEvent(edge);
    }

    private void processRemoveBendCommand(Command command)
    {
        ArrayList<String> parameters = command.GetParameters();
        FullIDHashDictionary<Edge> edgesDictionary = graph_.__getEdgesDictionary();

        Edge edge = edgesDictionary.Find(FullID.FromString(parameters.get(0)));

        if (edge == null)
            return;

        Bend bend = edge.__removeBend(Integer.parseInt(parameters.get(1)));

        graph_.__raiseBendRemovedEvent(bend);
    }

    private void processMoveVertexCommand(Command command)
    {
        ArrayList<String> parameters = command.GetParameters();
        FullIDHashDictionary<Vertex> verticesDictionary = graph_.__getVerticesDictionary();

        Vertex vertex = verticesDictionary.Find(FullID.FromString(parameters.get(0)));

        if (vertex == null)
            return;

        Point3D position = new Point3D(Double.parseDouble(parameters.get(1)),
                Double.parseDouble(parameters.get(2)), Double.parseDouble(parameters.get(3)));

        vertex.__move(position);

        graph_.__raiseVertexMovedEvent(vertex);
    }

    private void processChangeVertexRotationCommand(Command command)
    {
        ArrayList<String> parameters = command.GetParameters();
        FullIDHashDictionary<Vertex> verticesDictionary = graph_.__getVerticesDictionary();

        Vertex vertex = verticesDictionary.Find(FullID.FromString(parameters.get(0)));

        if (vertex == null)
            return;

        Point4D rotation = new Point4D(
                Double.parseDouble(parameters.get(1)), Double.parseDouble(parameters.get(2)),
                Double.parseDouble(parameters.get(3)), Double.parseDouble(parameters.get(4)));

        vertex.__setRotation(rotation);

        graph_.__raiseVertexRotationChangedEvent(vertex);
    }

    private void processChangeVertexScaleCommand(Command command)
    {
        ArrayList<String> parameters = command.GetParameters();
        FullIDHashDictionary<Vertex> verticesDictionary = graph_.__getVerticesDictionary();

        Vertex vertex = verticesDictionary.Find(FullID.FromString(parameters.get(0)));

        if (vertex == null)
            return;

        double scale = Double.parseDouble(parameters.get(1));

        vertex.__setScale(scale);

        graph_.__raiseVertexScaleChangedEvent(vertex);
    }

    private void processMoveBendCommand(Command command)
    {
        ArrayList<String> parameters = command.GetParameters();
        FullIDHashDictionary<Edge> edgesDictionary = graph_.__getEdgesDictionary();

        Edge edge = edgesDictionary.Find(FullID.FromString(parameters.get(0)));
        if (edge == null)
            return;

        Point3D position = new Point3D(Double.parseDouble(parameters.get(2)),
                Double.parseDouble(parameters.get(3)), Double.parseDouble(parameters.get(4)));

        int index = Integer.parseInt(parameters.get(1));
        Bend bend = edge.GetEdgeLines().get(index).GetEndBend();
        bend.__move(position);

        graph_.__raiseBendMovedEvent(bend);
    }

    private void processChangeCameraPositionCommand(Command command)
    {
        ArrayList<String> parameters = command.GetParameters();

        Point3D position = new Point3D(Double.parseDouble(parameters.get(0)),
                Double.parseDouble(parameters.get(1)), Double.parseDouble(parameters.get(2)));
        graph_.GetCamera().__changePosition(position);

        graph_.__raiseCameraChangedEvent();
    }

    private void processChangeCameraRotationCommand(Command command)
    {
        ArrayList<String> parameters = command.GetParameters();

        Point4D quaternion = new Point4D(Double.parseDouble(parameters.get(0)),
                Double.parseDouble(parameters.get(1)), Double.parseDouble(parameters.get(2)),
                Double.parseDouble(parameters.get(3)));

        graph_.GetCamera().__changeRotation(quaternion);

        graph_.__raiseCameraChangedEvent();
    }

    private void processSetVertexPropertyCommand(Command command)
    {
        ArrayList<String> parameters = command.GetParameters();
        FullIDHashDictionary<Vertex> verticesDictionary = graph_.__getVerticesDictionary();

        Vertex vertex = verticesDictionary.Find(FullID.FromString(parameters.get(0)));

        if (vertex == null)
            return;

        vertex.__setProperty(parameters.get(1), parameters.get(2), parameters.get(3));

        graph_.__raiseVertexPropertyChangedEvent(vertex, parameters.get(1), parameters.get(2));
    }

    private void processSetEdgePropertyCommand(Command command)
    {
        ArrayList<String> parameters = command.GetParameters();
        FullIDHashDictionary<Edge> edgesDictionary = graph_.__getEdgesDictionary();

        Edge edge = edgesDictionary.Find(FullID.FromString(parameters.get(0)));

        if (edge == null)
            return;

        edge.__setProperty(parameters.get(1), parameters.get(2), parameters.get(3));

        graph_.__raiseEdgePropertyChangedEvent(edge, parameters.get(1), parameters.get(2));
    }
}
