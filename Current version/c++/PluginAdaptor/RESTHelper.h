#ifndef REST_HELPER_H
#define REST_HELPER_H

#include "Exceptions.h"
#include "cpprest/http_client.h"
#include "cpprest/json.h"
#include<unordered_map>
using namespace std;

using namespace web;
using namespace web::http;
using namespace web::http::client;

namespace We3Graph
{
	/// <summary>
	/// A static class to help send REST requests
	/// </summary>
	class RESTHelper
	{
	public:
		static json::value SendTypicalRequest(string url,
			unordered_map<string, string> & urlParameters, string method,
			json::value & bodyParameters);
	};
}

#endif /* REST_HELPER_H */