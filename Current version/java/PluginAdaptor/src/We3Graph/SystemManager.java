package We3Graph;

import We3Graph.Exceptions.AuthenicationException;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Hashtable;

/**
 * A class as starting point to manage the interaction with the system.
 */
public class SystemManager
{
    private String serviceURL_;

    public String GetServiceURL()
    {
        return serviceURL_;
    }

    public void SetServiceURL(String serviceURL)
    {
        serviceURL_ = serviceURL;
    }

    private Integer userID_;

    Integer __GetUserID()
    {
        return userID_;
    }

    private String whoToken_ = null;

    String __GetWhoToken()
    {
        return whoToken_;
    }

    public SystemManager(String serviceURL)
    {
        serviceURL_ = serviceURL;
    }

    public void Login(String username, String password)
    {
        String url = serviceURL_ + "who-tokens";

        Hashtable<String, String> urlParameters = new Hashtable<String, String>();

        JSONObject bodyParameters = new JSONObject();
        bodyParameters.put("Username", username);
        bodyParameters.put("Password", password);

        JSONObject response = RESTHelper.SendTypicalRequest(url, urlParameters,
                "Post", bodyParameters);
        this.userID_ = response.getInt("UserID");
        this.whoToken_ = response.getString("WhoToken");
    }

    public int CreateGraph(String graphName, int folderID, String renderEngineGUID)
            throws AuthenicationException
    {
        String url = serviceURL_ + "graphs";

        if (userID_ == null || whoToken_ == null)
            throw new AuthenicationException();

        Hashtable<String, String> urlParameters = new Hashtable<String, String>();

        JSONObject bodyParameters = new JSONObject();
        bodyParameters.put("UserID", userID_);
        bodyParameters.put("WhoToken", whoToken_);
        bodyParameters.put("GraphName", graphName);
        bodyParameters.put("FolderID", folderID);
        bodyParameters.put("RenderEngineGUID", renderEngineGUID);

        JSONObject response = RESTHelper.SendTypicalRequest(url, urlParameters,
                "Post", bodyParameters);
        return response.getInt("CreatedGraphID");
    }

    public void DeleteGraph(int graphID) throws AuthenicationException
    {
        String url = serviceURL_ + "graphs/" + graphID;

        if (userID_ == null || whoToken_ == null)
            throw new AuthenicationException();

        Hashtable<String, String> urlParameters = new Hashtable<String, String>();
        urlParameters.put("UserID", userID_.toString());
        urlParameters.put("WhoToken", whoToken_);
        urlParameters.put("GraphID", "" + graphID);

        JSONObject bodyParameters = null;

        JSONObject response = RESTHelper.SendTypicalRequest(url, urlParameters,
                "Delete", bodyParameters);
    }

    public ArrayList<Folder> GetFolders() throws AuthenicationException
    {
        ArrayList<Folder> result = new ArrayList<Folder>();

        String url = serviceURL_ + "folders";

        if (userID_ == null || whoToken_ == null)
            throw new AuthenicationException();

        Hashtable<String, String> urlParameters = new Hashtable<String, String>();
        urlParameters.put("UserID", userID_.toString());
        urlParameters.put("WhoToken", whoToken_);

        JSONObject bodyParameters = null;

        JSONArray responseArray = RESTHelper.SendTypicalArrayRequest(
                url, urlParameters, "Get", bodyParameters);
        for (int i = 0; i < responseArray.length(); i++)
        {
            JSONObject folderObject = responseArray.getJSONObject(i);
            Folder folder = new Folder(folderObject.getInt("ID"),
                    folderObject.getString("Name"), this);
            result.add(folder);
        }

        return result;
    }

    public Graph StartGraph(int graphID) throws AuthenicationException
    {
        return StartGraph(graphID, true, true);
    }

    public Graph StartGraph(int graphID, boolean waitForLoadingToFinish,
                            boolean receiveCommands) throws AuthenicationException
    {
        if (userID_ == null || whoToken_ == null)
            throw new AuthenicationException();

        return new Graph(this, graphID, waitForLoadingToFinish, receiveCommands);
    }
}
