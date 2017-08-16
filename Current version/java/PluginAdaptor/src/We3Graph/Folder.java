package We3Graph;

import We3Graph.Exceptions.AuthenicationException;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Hashtable;

/**
 * This class represents a folder
 */
public class Folder
{
    private String name_;

    public String GetName()
    {
        return name_;
    }

    public String toString()
    {
        return name_;
    }

    private int id_;

    public int GetID()
    {
        return id_;
    }

    private SystemManager systemManager_;

    public ArrayList<GraphInfo> GetChildren() throws AuthenicationException
    {
        ArrayList<GraphInfo> result = new ArrayList<GraphInfo>();

        String url = systemManager_.GetServiceURL() + "folders/" + id_;

        Integer userID = systemManager_.__GetUserID();
        String whoToken = systemManager_.__GetWhoToken();

        if (userID == null || whoToken == null)
            throw new AuthenicationException();

        Hashtable<String, String> urlParameters = new Hashtable<String, String>();
        urlParameters.put("UserID", userID.toString());
        urlParameters.put("WhoToken", whoToken);

        JSONObject bodyParameters = null;

        JSONObject response = RESTHelper.SendTypicalRequest(url, urlParameters,
                "Get", bodyParameters);
        JSONArray graphsArray = response.getJSONArray("Graphs");

        for (int i = 0; i < graphsArray.length(); i++)
        {
            JSONObject graphObject = graphsArray.getJSONObject(i);
            GraphInfo graphInfo = new GraphInfo(
                    graphObject.getInt("ID"),
                    graphObject.getString("Name"),
                    graphObject.getInt("CommandSetVersion"),
                    graphObject.getString("RenderEngineGUID"));
            result.add(graphInfo);
        }

        return result;
    }

    public int GetPermissionType() throws AuthenicationException
    {
        String url = systemManager_.GetServiceURL() + "folders/" + id_;

        Integer userID = systemManager_.__GetUserID();
        String whoToken = systemManager_.__GetWhoToken();

        if (userID == null || whoToken == null)
            throw new AuthenicationException();

        Hashtable<String, String> urlParameters = new Hashtable<String, String>();
        urlParameters.put("UserID", userID.toString());
        urlParameters.put("WhoToken", whoToken);

        JSONObject bodyParameters = null;

        JSONObject response = RESTHelper.SendTypicalRequest(url, urlParameters,
                "Get", bodyParameters);
        return response.getInt("PermissionType");
    }


    Folder(int id, String name, SystemManager systemManager)
    {
        name_ = name;
        id_ = id;
        systemManager_ = systemManager;
    }

}
