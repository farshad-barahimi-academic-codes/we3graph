#include "RESTHelper.h"
#include "Headers.h"


namespace We3Graph
{
	json::value RESTHelper::SendTypicalRequest(string url,
		unordered_map<string, string> & urlParameters, string method,
		json::value & jsonBody)
	{
		uri_builder uri(Statics::StringToWide(url));

		if (method == "Get" || method == "Delete")
		{
			for (auto item : urlParameters)
				uri.append_query(Statics::StringToWide(item.first),
				Statics::StringToWide(item.second));

		}

		auto httpClient = http_client(uri.to_string());
		auto httpRequest = http_request();


		if (method == "Post" || method == "Put" || method == "Delete")
		{
			if (method == "Post")
				httpRequest.set_method(methods::POST);
			else if (method == "Put")
				httpRequest.set_method(methods::PUT);
			else if (method == "Delete")
				httpRequest.set_method(methods::DEL);

			auto serializedBody = jsonBody.serialize();
			httpRequest.set_body(serializedBody, L"application/json");
		}
		else
			httpRequest.set_method(methods::GET);

		auto responseTask = httpClient.request(httpRequest);
		responseTask.wait();
		auto response = responseTask.get();

		if (response.status_code() == status_codes::OK)
		{
			auto responseJSONTask = response.extract_json();
			responseJSONTask.wait();
			return responseJSONTask.get();
		}

		else if (response.status_code() == status_codes::Unauthorized)
			throw new AuthenicationException();
		else if (response.status_code() == status_codes::Forbidden)
			throw new AuthorizationException();
		else
			throw new WebServiceException();
	}
}