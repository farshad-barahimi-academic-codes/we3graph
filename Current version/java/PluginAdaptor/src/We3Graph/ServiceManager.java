package We3Graph;

import We3Graph.EventListeners.GraphLoadedEventListener;
import We3Graph.EventListeners.NewCommandsEventListener;
import We3Graph.Exceptions.AuthenicationException;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Hashtable;
import java.util.concurrent.ConcurrentLinkedQueue;

/**
 * A class to handle graph interactions with the web service.
 */
class ServiceManager
{
    private String serviceURL_;
    private ConcurrentLinkedQueue<Command> outgoingCommandsQueue_;
    private int clientID_;
    private Thread syncIncommingThread_;
    private Thread syncOutgoingThread_;
    private AutoResetEvent sendEvent_;
    private int lastCommandIDReceived_;
    private boolean isLoading_;
    private int graphID_;
    private Integer userID_;
    private String whoToken_;
    private String graphAccessToken_;

    NewCommandsEventListener __newCommandsReceived;
    GraphLoadedEventListener __graphLoaded;

    ServiceManager(SystemManager systemManager, int graphID)
    {
        serviceURL_ = systemManager.GetServiceURL();
        userID_ = systemManager.__GetUserID();
        whoToken_ = systemManager.__GetWhoToken();
        graphID_ = graphID;
        lastCommandIDReceived_ = 0;
        isLoading_ = true;
        sendEvent_ = new AutoResetEvent(false);

        outgoingCommandsQueue_ = new ConcurrentLinkedQueue<>();

        try
        {
            getGraphAccessToken();
            getClientID();
        } catch (Exception e)
        {

        }
    }


    void __start(boolean receiveCommands)
    {
        if (receiveCommands)
        {
            syncIncommingThread_ = new Thread(new Runnable()
            {
                public void run()
                {
                    try
                    {
                        syncIncommingCommands();
                    } catch (Exception e)
                    {
                    }
                }
            });
            syncIncommingThread_.start();
        }
        syncOutgoingThread_ = new Thread(new Runnable()
        {
            public void run()
            {
                try
                {
                    syncOutgoingCommands();
                } catch (Exception e)
                {
                }
            }
        });
        syncOutgoingThread_.start();
    }

    private void getGraphAccessToken() throws AuthenicationException
    {
        String url = serviceURL_ + "graph-access-tokens";

        if (userID_ == null || whoToken_ == null)
            throw new AuthenicationException();

        Hashtable<String, String> urlParameters = new Hashtable<String, String>();

        JSONObject bodyParameters = new JSONObject();
        bodyParameters.put("UserID", userID_);
        bodyParameters.put("WhoToken", whoToken_);
        bodyParameters.put("GraphID", graphID_);
        bodyParameters.put("PermissionType", 1);


        JSONObject response = RESTHelper.SendTypicalRequest(url, urlParameters,
                "Post", bodyParameters);

        graphAccessToken_ = response.getString("GraphAccessToken");
    }

    private void getClientID() throws AuthenicationException
    {
        String url = serviceURL_ + "clients";

        if (userID_ == null || whoToken_ == null)
            throw new AuthenicationException();

        Hashtable<String, String> urlParameters = new Hashtable<String, String>();

        JSONObject bodyParameters = new JSONObject();
        bodyParameters.put("UserID", userID_);
        bodyParameters.put("WhoToken", whoToken_);
        bodyParameters.put("GraphID", graphID_);
        bodyParameters.put("ClientName", "Plugin");
        bodyParameters.put("GraphAccessToken", graphAccessToken_);

        JSONObject response = RESTHelper.SendTypicalRequest(url, urlParameters,
                "Post", bodyParameters);
        clientID_ = response.getInt("CreatedClientID");
    }

    int __getClientID()
    {
        return clientID_;
    }

    void __stop()
    {
        if (syncIncommingThread_ != null)
            syncIncommingThread_.stop();
        if (syncOutgoingThread_ != null)
            syncOutgoingThread_.stop();
    }

    private void syncIncommingCommands() throws AuthenicationException
    {
        while (true)
        {
            String url = serviceURL_ + "commands";

            if (userID_ == null || whoToken_ == null)
                throw new AuthenicationException();

            Hashtable<String, String> urlParameters = new Hashtable<String, String>();
            urlParameters.put("UserID", userID_.toString());
            urlParameters.put("WhoToken", whoToken_);
            urlParameters.put("GraphID", "" + graphID_);
            urlParameters.put("LastCommandID", "" + lastCommandIDReceived_);
            urlParameters.put("GraphAccessToken", graphAccessToken_);

            JSONObject bodyParameters = null;

            JSONArray response = RESTHelper.SendTypicalArrayRequest(
                    url, urlParameters, "Get", bodyParameters);
            processResponse(response);

            try
            {
                Thread.sleep(20);
            } catch (Exception e)
            {
            }
        }
    }

    private void syncOutgoingCommands() throws InterruptedException
    {
        while (true)
        {
            sendEvent_.waitOne(20);

            while (!outgoingCommandsQueue_.isEmpty())
            {
                Command command;
                command = outgoingCommandsQueue_.peek();
                sendCommand(command);
                outgoingCommandsQueue_.poll();
            }
        }

    }

    private void processResponse(JSONArray responseArray)
    {

        if (responseArray.length() == 0)
        {
            if (isLoading_)
            {
                isLoading_ = false;
                if (__graphLoaded != null)
                    __graphLoaded.OnGraphLoadedEvent();
            }
            return;
        }


        ArrayList<Command> commands = new ArrayList<Command>();

        for (int i = 0; i < responseArray.length(); i++)
        {
            JSONObject commandObject = responseArray.getJSONObject(i);

            String commandName = commandObject.getString("Name");
            int commandID = commandObject.getInt("ID");
            int clientID = commandObject.getInt("ClientID");
            ArrayList<String> parameters = new ArrayList<String>();
            for (int j = 1; j <= 5; j++)
            {
                String parameter = commandObject.getString("Param" + j);
                parameters.add(parameter);
            }

            Command command = new Command(commandName, parameters);
            command.__setID(commandID);
            command.__setClientID(clientID);

            commands.add(command);
            lastCommandIDReceived_ = command.__getID();
        }

        if (__newCommandsReceived != null)
            __newCommandsReceived.OnNewCommandEvent(commands);
    }

    void __runCommand(Command command)
    {
        outgoingCommandsQueue_.add(command);
        sendEvent_.set();
    }

    private boolean sendCommand(Command command)
    {
        try
        {
            ArrayList<String> parameters = command.GetParameters();

            String url = serviceURL_ + "commands";

            Hashtable urlParameters = new Hashtable<String, String>();

            JSONObject bodyParameters = new JSONObject();
            bodyParameters.put("UserID", userID_);
            bodyParameters.put("WhoToken", whoToken_);
            bodyParameters.put("GraphID", graphID_);
            bodyParameters.put("CommandName", command.GetName());
            bodyParameters.put("ClientID", clientID_);
            bodyParameters.put("GraphAccessToken", graphAccessToken_);
            bodyParameters.put("Param1", parameters.get(0));
            bodyParameters.put("Param2", parameters.get(1));
            bodyParameters.put("Param3", parameters.get(2));
            bodyParameters.put("Param4", parameters.get(3));
            bodyParameters.put("Param5", parameters.get(4));

            JSONObject response = RESTHelper.SendTypicalRequest(
                    url, urlParameters, "Post", bodyParameters);

            return true;
        } catch (Exception e)
        {
            return false;
        }

    }

    boolean __isAllCommandsSent()
    {
        if (outgoingCommandsQueue_.size() == 0)
            return true;
        else
            return false;
    }
}

