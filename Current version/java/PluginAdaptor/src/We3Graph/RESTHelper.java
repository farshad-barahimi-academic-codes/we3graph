package We3Graph;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Hashtable;
import java.util.Set;

import We3Graph.Exceptions.AuthenicationException;
import We3Graph.Exceptions.AuthorizationException;
import We3Graph.Exceptions.WebServiceException;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 * A static class to help send REST requests
 */
class RESTHelper
{

    public static JSONObject SendTypicalRequest(
            String url, Hashtable<String, String> urlParameters, String method)
    {
        return SendTypicalRequest(url, urlParameters, method, null);
    }

    public static JSONObject SendTypicalRequest(
            String url, Hashtable<String, String> urlParameters, String method,
            JSONObject bodyParameters)
    {
        String responseString = "";
        try
        {

            if (method.equals("Get") || method.equals("Delete"))
            {
                StringBuilder sb = new StringBuilder(url);

                boolean isFirst = true;
                Set<String> keys = urlParameters.keySet();
                for (String key : keys)
                {
                    if (isFirst)
                        sb.append("?");
                    else
                        sb.append("&");
                    isFirst = false;

                    String value = urlParameters.get(key);

                    sb.append(URLEncoder.encode(key, StandardCharsets.UTF_8.toString()));
                    sb.append("=");
                    sb.append(URLEncoder.encode(value, StandardCharsets.UTF_8.toString()));
                }

                url = sb.toString();
            }

            HttpURLConnection connection = (HttpURLConnection) (new URL(url)).openConnection();

            String jsonBody = "";

            connection.setRequestMethod(method.toUpperCase());
            connection.setRequestProperty("Accept", "application/json");

            if (method.equals("Post") || method.equals("Put") ||
                    method.equals("Delete"))
            {
                connection.setRequestProperty("Content-Type", "application/json");
                if (bodyParameters == null)
                    bodyParameters = new JSONObject();
                jsonBody = bodyParameters.toString();
            }

            if (method.equals("Post") || method.equals("Put") ||
                    method.equals("Delete"))
            {
                connection.setDoOutput(true);
                OutputStream os = connection.getOutputStream();
                os.write(jsonBody.getBytes());
                os.flush();
            }

            int statusCode = connection.getResponseCode();

            if (statusCode != HttpURLConnection.HTTP_OK)
            {

                if (statusCode == HttpURLConnection.HTTP_UNAUTHORIZED)
                    throw new AuthenicationException();
                if (statusCode == HttpURLConnection.HTTP_FORBIDDEN)
                    throw new AuthorizationException();
                else
                    throw new WebServiceException();
            }

            BufferedReader br = new BufferedReader(new InputStreamReader(
                    (connection.getInputStream())));

            StringBuilder sb = new StringBuilder();
            String line = null;
            while ((line = br.readLine()) != null)
                sb.append(line).append("\n");

            responseString = sb.toString();
            connection.disconnect();
        } catch (Exception e)
        {
        }
        return new JSONObject(responseString);
    }

    public static JSONArray SendTypicalArrayRequest(
            String url, Hashtable<String, String> urlParameters, String method,
            JSONObject bodyParameters)
    {
        String responseString = "";
        try
        {

            if (method.equals("Get") || method.equals("Delete"))
            {
                StringBuilder sb = new StringBuilder(url);

                boolean isFirst = true;
                Set<String> keys = urlParameters.keySet();
                for (String key : keys)
                {
                    if (isFirst)
                        sb.append("?");
                    else
                        sb.append("&");
                    isFirst = false;

                    String value = urlParameters.get(key);

                    sb.append(URLEncoder.encode(key, StandardCharsets.UTF_8.toString()));
                    sb.append("=");
                    sb.append(URLEncoder.encode(value, StandardCharsets.UTF_8.toString()));
                }

                url = sb.toString();
            }

            HttpURLConnection connection = (HttpURLConnection) (new URL(url)).openConnection();

            String jsonBody = "";

            connection.setRequestMethod(method.toUpperCase());
            connection.setRequestProperty("Accept", "application/json");

            if (method.equals("Post") || method.equals("Put")
                    || method.equals("Delete"))
            {
                connection.setRequestProperty("Content-Type", "application/json");
                if (bodyParameters == null)
                    bodyParameters = new JSONObject();
                jsonBody = bodyParameters.toString();
            }

            if (method.equals("Post") || method.equals("Put")
                    || method.equals("Delete"))
            {
                connection.setDoOutput(true);
                OutputStream os = connection.getOutputStream();
                os.write(jsonBody.getBytes());
                os.flush();
            }

            int statusCode = connection.getResponseCode();

            if (statusCode != HttpURLConnection.HTTP_OK)
            {

                if (statusCode == HttpURLConnection.HTTP_UNAUTHORIZED)
                    throw new AuthenicationException();
                if (statusCode == HttpURLConnection.HTTP_FORBIDDEN)
                    throw new AuthorizationException();
                else
                    throw new WebServiceException();
            }

            BufferedReader br = new BufferedReader(new InputStreamReader((connection.getInputStream())));

            StringBuilder sb = new StringBuilder();
            String line = null;
            while ((line = br.readLine()) != null)
                sb.append(line).append("\n");

            responseString = sb.toString();
            connection.disconnect();
        } catch (Exception e)
        {
        }
        return new JSONArray(responseString);
    }

}

