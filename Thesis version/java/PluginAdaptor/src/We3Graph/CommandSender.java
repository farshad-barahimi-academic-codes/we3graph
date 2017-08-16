package We3Graph;

import java.util.ArrayList;

/**
 * This class helps sending different command to the server
 */
class CommandSender
{
    private ServiceManager serviceManager_;

    CommandSender(ServiceManager serviceManager)
    {
        serviceManager_ = serviceManager;
    }

    void __sendInsertVertexCommand(Vertex vertex)
    {
        Point3D position = vertex.GetPosition();
        ArrayList<String> parameters = new ArrayList<String>();
        parameters.add("" + vertex.GetFullID().GetIDinCreator());
        parameters.add("" + position.GetX());
        parameters.add("" + position.GetY());
        parameters.add("" + position.GetZ());

        Command command = new Command("InsertVertex", parameters);
        serviceManager_.__runCommand(command);
    }

    void __sendInsertEdgeCommand(Edge edge)
    {
        ArrayList<String> parameters = new ArrayList<String>();
        parameters.add(edge.GetStartVertex().GetFullID().ToString());
        parameters.add(edge.GetEndVertex().GetFullID().ToString());
        parameters.add("" + edge.GetFullID().GetIDinCreator());

        Command command = new Command("InsertEdge", parameters);
        serviceManager_.__runCommand(command);
    }

    void __sendBreakEdgeLineCommand(Edge edge, int index, Point3D position)
    {
        ArrayList<String> parameters = new ArrayList<String>();
        parameters.add(edge.GetFullID().ToString());
        parameters.add("" + index);
        parameters.add("" + position.GetX());
        parameters.add("" + position.GetY());
        parameters.add("" + position.GetZ());

        Command command = new Command("BreakEdgeLine", parameters);
        serviceManager_.__runCommand(command);
    }

    void __sendRemoveVertexCommand(Vertex vertex)
    {
        ArrayList<String> parameters = new ArrayList<String>();
        parameters.add(vertex.GetFullID().ToString());

        Command command = new Command("RemoveVertex", parameters);
        serviceManager_.__runCommand(command);
    }

    void __sendRemoveEdgeCommand(Edge edge)
    {
        ArrayList<String> parameters = new ArrayList<String>();
        parameters.add(edge.GetFullID().ToString());

        Command command = new Command("RemoveEdge", parameters);
        serviceManager_.__runCommand(command);
    }

    void __sendRemoveBendCommand(Edge edge, int index)
    {
        ArrayList<String> parameters = new ArrayList<String>();
        parameters.add(edge.GetFullID().ToString());
        parameters.add("" + index);

        Command command = new Command("RemoveBend", parameters);
        serviceManager_.__runCommand(command);
    }

    void __sendMoveVertexCommand(Vertex vertex)
    {
        Point3D position = vertex.GetPosition();
        ArrayList<String> parameters = new ArrayList<String>();
        parameters.add(vertex.GetFullID().ToString());
        parameters.add("" + position.GetX());
        parameters.add("" + position.GetY());
        parameters.add("" + position.GetZ());

        Command command = new Command("MoveVertex", parameters);
        serviceManager_.__runCommand(command);
    }

    void __sendChangeVertexRotationCommand(Vertex vertex)
    {
        Point4D rotation = vertex.GetRotation();
        ArrayList<String> parameters = new ArrayList<String>();
        parameters.add(vertex.GetFullID().ToString());
        parameters.add("" + rotation.GetX());
        parameters.add("" + rotation.GetY());
        parameters.add("" + rotation.GetZ());
        parameters.add("" + rotation.GetW());

        Command command = new Command("ChangeVertexRotation", parameters);
        serviceManager_.__runCommand(command);
    }

    void __sendChangeVertexScaleCommand(Vertex vertex)
    {
        double scale = vertex.GetScale();
        ArrayList<String> parameters = new ArrayList<String>();
        parameters.add(vertex.GetFullID().ToString());
        parameters.add("" + scale);

        Command command = new Command("ChangeVertexScale", parameters);
        serviceManager_.__runCommand(command);
    }

    void __sendMoveBendCommand(Bend bend)
    {
        Point3D position = bend.GetPosition();
        ArrayList<String> parameters = new ArrayList<String>();
        parameters.add(bend.GetEdge().GetFullID().ToString());
        parameters.add("" + bend.GetIndexAtEdge());
        parameters.add("" + position.GetX());
        parameters.add("" + position.GetY());
        parameters.add("" + position.GetZ());

        Command command = new Command("MoveBend", parameters);
        serviceManager_.__runCommand(command);
    }

    void __sendChangeCameraPositionCommand(Point3D position)
    {
        ArrayList<String> parameters = new ArrayList<String>();
        parameters.add("" + position.GetX());
        parameters.add("" + position.GetY());
        parameters.add("" + position.GetZ());

        Command command = new Command("ChangeCameraPosition", parameters);
        serviceManager_.__runCommand(command);
    }

    void __sendChangeCameraRotationCommand(Point4D rotation)
    {
        ArrayList<String> parameters = new ArrayList<String>();
        parameters.add("" + rotation.GetX());
        parameters.add("" + rotation.GetY());
        parameters.add("" + rotation.GetZ());
        parameters.add("" + rotation.GetW());

        Command command = new Command("ChangeCameraRotation", parameters);
        serviceManager_.__runCommand(command);
    }

    void __sendSetVertexPropertyCommand(Vertex vertex, String listName,
                                        String key, String value, boolean isRenderUpdateNeeded)
    {
        ArrayList<String> parameters = new ArrayList<String>();
        parameters.add(vertex.GetFullID().ToString());
        parameters.add(listName);
        parameters.add(key);
        parameters.add(value);
        if (isRenderUpdateNeeded)
            parameters.add("1");
        else
            parameters.add("0");

        Command command = new Command("SetVertexProperty", parameters);
        serviceManager_.__runCommand(command);
    }

    void __sendSetEdgePropertyCommand(Edge edge, String listName,
                                      String key, String value, boolean isRenderUpdateNeeded)
    {
        ArrayList<String> parameters = new ArrayList<String>();
        parameters.add(edge.GetFullID().ToString());
        parameters.add(listName);
        parameters.add(key);
        parameters.add(value);
        if (isRenderUpdateNeeded)
            parameters.add("1");
        else
            parameters.add("0");

        Command command = new Command("SetEdgeProperty", parameters);
        serviceManager_.__runCommand(command);
    }
}

