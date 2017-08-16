using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Web.Script.Serialization;

namespace We3Graph
{
    /// <summary>
    /// A static class to help send REST requests
    /// </summary>
    class RESTHelper
    {
        public static object SendTypicalRequest(string url,
            Dictionary<string, string> urlParameters, string method,
            object bodyParameters = null)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();

            using (var webClient = new WebClient())
            {
                string responseString = "";
                string jsonBody = "";

                if (method == "Get" || method == "Delete")
                {
                    StringBuilder sb = new StringBuilder(url);

                    bool isFirst = true;
                    foreach (var item in urlParameters)
                    {
                        if (isFirst)
                            sb.Append("?");
                        else
                            sb.Append("&");
                        isFirst = false;

                        sb.Append(Uri.EscapeDataString(item.Key));
                        sb.Append("=");
                        sb.Append(Uri.EscapeDataString(item.Value));
                    }

                    url = sb.ToString();
                }

                if (method == "Post" || method == "Put" || method == "Delete")
                {
                    webClient.Headers["Content-Type"] = "application/json";
                    if (bodyParameters == null)
                        bodyParameters = new object { };
                    jsonBody = serializer.Serialize(bodyParameters);
                }

                try
                {
                    if (method == "Post" || method == "Put" || method == "Delete")
                        responseString = webClient.UploadString(url, method, jsonBody);
                    else if (method == "Get")
                        responseString = webClient.DownloadString(url);
                }
                catch (WebException e)
                {
                    HttpStatusCode statusCode = ((HttpWebResponse)e.Response).StatusCode;
                    string response = "";
                    using (var reader = new StreamReader(e.Response.GetResponseStream()))
                    { response = reader.ReadToEnd(); }

                    if (statusCode == HttpStatusCode.Unauthorized)
                        throw new AuthenicationException();
                    if (statusCode == HttpStatusCode.Forbidden)
                        throw new AuthorizationException();
                    else
                        throw new WebServiceException();
                }

                return serializer.DeserializeObject(responseString);
            }
        }

    }
}
