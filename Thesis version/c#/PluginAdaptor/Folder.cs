using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace We3Graph
{
    /// <summary>
    /// This class represents a folder
    /// </summary>
    public class Folder
    {
        private string name_;

        public string GetName()
        {
            return name_;
        }

        public override string ToString()
        {
            return name_;
        }

        private int id_;

        public int GetID()
        {
            return id_;
        }

        private SystemManager systemManager_;

        public List<GraphInfo> GetChildren()
        {
            var result = new List<GraphInfo>();

            string url = systemManager_.GetServiceURL() + "folders/" + id_;

            int? userID = systemManager_.__GetUserID();
            string whoToken = systemManager_.__GetWhoToken();

            if (userID == null || whoToken == null)
                throw new AuthenicationException();

            var urlParameters = new Dictionary<string, string>();
            urlParameters["UserID"] = userID.ToString();
            urlParameters["WhoToken"] = whoToken;

            var bodyParameters = new { };

            var response = RESTHelper.SendTypicalRequest(url, urlParameters,
                "Get", bodyParameters);
            var dic = (Dictionary<string, object>)response;
            var graphsArray = (object[])dic["Graphs"];
            foreach (var item in graphsArray)
            {
                var itemDic = (Dictionary<string, object>)item;
                var graphInfo = new GraphInfo(
                    (int)itemDic["ID"],
                    (string)itemDic["Name"],
                    (int)itemDic["CommandSetVersion"],
                    (string)itemDic["RenderEngineGUID"]);
                result.Add(graphInfo);
            }

            return result;
        }

        public int GetPermissionType()
        {
            string url = systemManager_.GetServiceURL() + "folders/" + id_;

            int? userID = systemManager_.__GetUserID();
            string whoToken = systemManager_.__GetWhoToken();

            if (userID == null || whoToken == null)
                throw new AuthenicationException();

            var urlParameters = new Dictionary<string, string>();
            urlParameters["UserID"] = userID.ToString();
            urlParameters["WhoToken"] = whoToken;

            var bodyParameters = new { };

            var response = RESTHelper.SendTypicalRequest(url, urlParameters,
                "Get", bodyParameters);
            var dic = (Dictionary<string, object>)response;

            return (int)dic["PermissionType"];
        }



        internal Folder(int id, string name, SystemManager systemManager)
        {
            name_ = name;
            id_ = id;
            systemManager_ = systemManager;
        }

    }
}
