package We3Graph;

/**
 * A class to provide basic information about a graph
 * But it is not intended for interaction with the graph
 */
public class GraphInfo
{
    private int id_;
    private String name_;
    private String renderEngineGUID_;
    private int commandSetVersion_;

    public int GetID()
    {
        return id_;
    }

    public String GetName()
    {
        return name_;
    }

    public String toString()
    {
        return name_;
    }

    public String GetRenderEngineGUID()
    {
        return renderEngineGUID_;
    }

    public int GetCommandSetVersion()
    {
        return commandSetVersion_;
    }

    public GraphInfo(int id, String name, int commandSetVersion, String renderEngineGUID)
    {
        id_ = id;
        name_ = name;
        commandSetVersion_ = commandSetVersion;
        renderEngineGUID_ = renderEngineGUID;
    }
}
