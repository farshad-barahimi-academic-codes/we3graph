using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Concurrent;
using System.Net;
using System.IO;
using System.Threading;

namespace We3Graph
{
    /// <summary>
    /// A class to handle graph interactions with the web service.
    /// </summary>
    internal class ServiceManager
    {
        private string serviceURL_;
        private ConcurrentQueue<Command> outgoingCommandsQueue_;
        private int clientID_;
        private Thread syncIncommingThread_;
        private Thread syncOutgoingThread_;
        private AutoResetEvent sendEvent_;
        private int lastCommandIDReceived_;
        private bool isLoading_;
        private int graphID_;
        private int userID_;
        private string whoToken_;
        private string graphAccessToken_;

        internal event NewCommandsEventHandler __newCommandsReceived;
        internal event GraphLoadedEventHandler __graphLoaded;

        internal ServiceManager(SystemManager systemManager, int graphID)
        {
            serviceURL_ = systemManager.GetServiceURL();
            userID_ = systemManager.__GetUserID().Value;
            whoToken_ = systemManager.__GetWhoToken();
            graphID_ = graphID;
            lastCommandIDReceived_ = 0;
            isLoading_ = true;
            sendEvent_ = new AutoResetEvent(false);

            outgoingCommandsQueue_ = new ConcurrentQueue<Command>();

            getGraphAccessToken();
            getClientID();
        }

        internal void __start(bool receiveCommands)
        {
            if (receiveCommands)
            {
                syncIncommingThread_ = new Thread(syncIncommingCommands);
                syncIncommingThread_.Start();
            }
            syncOutgoingThread_ = new Thread(syncOutgoingCommands);
            syncOutgoingThread_.Start();
        }

        private void getGraphAccessToken()
        {
            string url = serviceURL_ + "graph-access-tokens";

            if (userID_ == null || whoToken_ == null)
                throw new AuthenicationException();

            var urlParameters = new Dictionary<string, string>();

            var bodyParameters = new
            {
                UserID = userID_,
                WhoToken = whoToken_,
                GraphID = graphID_,
                PermissionType = 1
            };

            var response = RESTHelper.SendTypicalRequest(url, urlParameters,
                "Post", bodyParameters);
            var responseDic = (Dictionary<string, object>)response;
            graphAccessToken_ = (string)responseDic["GraphAccessToken"];
        }

        private void getClientID()
        {
            string url = serviceURL_ + "clients";

            if (userID_ == null || whoToken_ == null)
                throw new AuthenicationException();

            var urlParameters = new Dictionary<string, string>();

            var bodyParameters = new
            {
                UserID = userID_,
                WhoToken = whoToken_,
                GraphID = graphID_,
                ClientName = "Plugin",
                GraphAccessToken = graphAccessToken_
            };

            var response = RESTHelper.SendTypicalRequest(url, urlParameters,
                "Post", bodyParameters);
            var responseDic = (Dictionary<string, object>)response;
            clientID_ = (int)responseDic["CreatedClientID"];
        }

        internal int __getClientID()
        {
            return clientID_;
        }

        /// <summary>
        /// Stops the sync thread
        /// </summary>
        internal void __stop()
        {
            if (syncIncommingThread_ != null)
                syncIncommingThread_.Abort();
            if (syncOutgoingThread_ != null)
                syncOutgoingThread_.Abort();
        }

        /// <summary>
        /// receives incomming commands from the server
        /// </summary>
        private void syncIncommingCommands()
        {
            while (true)
            {
                string url = serviceURL_ + "commands";

                if (userID_ == null || whoToken_ == null)
                    throw new AuthenicationException();

                var urlParameters = new Dictionary<string, string>();
                urlParameters["UserID"] = userID_.ToString();
                urlParameters["WhoToken"] = whoToken_;
                urlParameters["GraphID"] = graphID_.ToString();
                urlParameters["LastCommandID"] = lastCommandIDReceived_.ToString();
                urlParameters["GraphAccessToken"] = graphAccessToken_;

                var bodyParameters = new { };

                var response = RESTHelper.SendTypicalRequest(url, urlParameters,
                    "Get", bodyParameters);
                processResponse(response);

                Thread.Sleep(20);
            }
        }

        /// <summary>
        /// sends outgoing commands to the server
        /// </summary>
        private void syncOutgoingCommands()
        {
            while (true)
            {
                sendEvent_.WaitOne(20);

                while (!outgoingCommandsQueue_.IsEmpty)
                {
                    Command command;
                    outgoingCommandsQueue_.TryPeek(out command);
                    sendCommand(command);
                    outgoingCommandsQueue_.TryDequeue(out command);
                }
            }

        }

        /// <summary>
        /// processes http response from the server and adds the corresponding commands 
        /// to the incomming queue
        /// </summary>
        private void processResponse(object response)
        {

            var responseArray = (object[])response;

            if (responseArray.Length == 0)
            {
                if (isLoading_)
                {
                    isLoading_ = false;
                    if (__graphLoaded != null)
                        __graphLoaded();
                }
                return;
            }


            List<Command> commands = new List<Command>();

            foreach (var item in responseArray)
            {
                var commandItem = (Dictionary<string, object>)item;

                string commandName = (string)commandItem["Name"];
                int commandID = (int)commandItem["ID"];
                int clientID = (int)commandItem["ClientID"];
                List<string> parameters = new List<string>();
                for (int i = 1; i <= 5; i++)
                {
                    var parameter = (string)commandItem["Param" + i.ToString()];
                    parameters.Add(parameter);
                }

                var command = new Command(commandName, parameters);
                command.__setID(commandID);
                command.__setClientID(clientID);

                commands.Add(command);
                lastCommandIDReceived_ = command.__getID();
            }

            if (__newCommandsReceived != null)
                __newCommandsReceived(commands);
        }

        /// <summary>
        /// Adds a commands to outgoing queue
        /// </summary>
        internal void __runCommand(Command command)
        {
            outgoingCommandsQueue_.Enqueue(command);
            sendEvent_.Set();
        }

        /// <summary>
        /// sends a commands to the server
        /// </summary>
        private bool sendCommand(Command command)
        {
            try
            {
                var parameters = command.GetParameters();

                string url = serviceURL_ + "commands";

                var urlParameters = new Dictionary<string, string>();

                var bodyParameters = new
                {
                    UserID = userID_,
                    WhoToken = whoToken_,
                    GraphID = graphID_,
                    CommandName = command.GetName(),
                    ClientID = clientID_,
                    GraphAccessToken = graphAccessToken_,
                    Param1 = parameters[0],
                    Param2 = parameters[1],
                    Param3 = parameters[2],
                    Param4 = parameters[3],
                    Param5 = parameters[4]
                };

                var response = RESTHelper.SendTypicalRequest(url, urlParameters,
                    "Post", bodyParameters);

                return true;
            }
            catch
            {
                return false;
            }

            return false;
        }

        /// <summary>
        /// Checks that outgoing command queue is empty
        /// </summary>
        internal bool __isAllCommandsSent()
        {
            if (outgoingCommandsQueue_.Count == 0)
                return true;
            else
                return false;
        }
    }
}
