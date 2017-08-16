using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Web.Script.Serialization;

namespace We3Graph
{
    /// <summary>
    /// A class as starting point to manage the interaction with the system.
    /// </summary>
    public class SystemManager
    {
        private string serviceURL_;

        public string GetServiceURL()
        {
            return serviceURL_;
        }

        public void SetServiceURL(string serviceURL)
        {
            serviceURL_ = serviceURL;
        }

        private int? userID_;

        internal int? __GetUserID()
        {
            return userID_;
        }

        private string whoToken_ = null;

        internal string __GetWhoToken()
        {
            return whoToken_;
        }

        public SystemManager(string serviceURL = null)
        {
            serviceURL_ = serviceURL;
        }

        public void Login(string username, string password)
        {
            string url = serviceURL_ + "who-tokens";

            var urlParameters = new Dictionary<string, string>();

            var bodyParameters = new
            {
                Username = username,
                Password = password
            };

            var response = RESTHelper.SendTypicalRequest(url, urlParameters,
                "Post", bodyParameters);
            var responseDic = (Dictionary<string, object>)response;
            this.userID_ = (int)responseDic["UserID"];
            this.whoToken_ = (string)responseDic["WhoToken"];



        }

        public int CreateGraph(string graphName, int folderID, string renderEngineGUID)
        {
            string url = serviceURL_ + "graphs";

            if (userID_ == null || whoToken_ == null)
                throw new AuthenicationException();

            var urlParameters = new Dictionary<string, string>();

            var bodyParameters = new
            {
                UserID = userID_,
                WhoToken = whoToken_,
                GraphName = graphName,
                FolderID = folderID,
                RenderEngineGUID = renderEngineGUID
            };

            var response = RESTHelper.SendTypicalRequest(url, urlParameters,
                "Post", bodyParameters);
            var responseDic = (Dictionary<string, object>)response;
            return (int)responseDic["CreatedGraphID"];
        }

        public void DeleteGraph(int graphID)
        {
            string url = serviceURL_ + "graphs/" + graphID;

            if (userID_ == null || whoToken_ == null)
                throw new AuthenicationException();

            var urlParameters = new Dictionary<string, string>();
            urlParameters["UserID"] = userID_.ToString();
            urlParameters["WhoToken"] = whoToken_;
            urlParameters["GraphID"] = graphID.ToString();

            var bodyParameters = new { };

            var response = RESTHelper.SendTypicalRequest(url, urlParameters,
                "Delete", bodyParameters);
        }

        public List<Folder> GetFolders()
        {
            var result = new List<Folder>();

            string url = serviceURL_ + "folders";

            if (userID_ == null || whoToken_ == null)
                throw new AuthenicationException();

            var urlParameters = new Dictionary<string, string>();
            urlParameters["UserID"] = userID_.ToString();
            urlParameters["WhoToken"] = whoToken_;

            var bodyParameters = new { };

            var response = RESTHelper.SendTypicalRequest(url, urlParameters,
                "Get", bodyParameters);
            var responseArray = (object[])response;
            foreach (var responseItem in responseArray)
            {
                var itemDic = (Dictionary<string, object>)responseItem;
                var folder = new Folder((int)itemDic["ID"], (string)itemDic["Name"], this);
                result.Add(folder);
            }

            return result;
        }

        public Graph StartGraph(int graphID, bool waitForLoadingToFinish = true,
            bool receiveCommands = true)
        {
            if (userID_ == null || whoToken_ == null)
                throw new AuthenicationException();

            return new Graph(this, graphID, waitForLoadingToFinish, receiveCommands);
        }
    }
}
