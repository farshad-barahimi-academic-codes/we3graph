#include "SystemManager.h"
#include "Headers.h"

#include <unordered_map>
using namespace std;

namespace We3Graph
{
	string SystemManager::GetServiceURL()
	{
		return serviceURL_;
	}

	void SystemManager::SetServiceURL(string serviceURL)
	{
		serviceURL_ = serviceURL;
	}


	int SystemManager::__GetUserID()
	{
		return userID_;
	}

	string SystemManager::__GetWhoToken()
	{
		return whoToken_;
	}

	SystemManager::SystemManager(string serviceURL)
	{
		serviceURL_ = serviceURL;
	}

	void SystemManager::Login(string username, string password)
	{
		string url = serviceURL_ + "who-tokens";

		unordered_map<string, string> urlParameters;
		json::value bodyParameters;

		bodyParameters[L"Username"] = json::value::string(
			Statics::StringToWide(username));
		bodyParameters[L"Password"] = json::value::string(
			Statics::StringToWide(password));

		auto response = RESTHelper::SendTypicalRequest(
			url, urlParameters, "Post", bodyParameters);
		userID_ = response[L"UserID"].as_integer();
		whoToken_ = Statics::WStringToNarrow(response[L"WhoToken"].as_string());



	}

	int SystemManager::CreateGraph(string graphName, int folderID, string renderEngineGUID)
	{
		string url = serviceURL_ + "graphs";

		if (userID_ == INT_MIN || whoToken_ == "")
			throw new AuthenicationException();

		unordered_map<string, string> urlParameters;
		json::value bodyParameters;

		bodyParameters[L"UserID"] = json::value::number(userID_);
		bodyParameters[L"WhoToken"] = json::value::string(
			Statics::StringToWide(whoToken_));
		bodyParameters[L"GraphName"] = json::value::string(
			Statics::StringToWide(graphName));
		bodyParameters[L"FolderID"] = json::value::number(folderID);
		bodyParameters[L"RenderEngineGUID"] = json::value::string(
			Statics::StringToWide(renderEngineGUID));

		auto response = RESTHelper::SendTypicalRequest(
			url, urlParameters, "Post", bodyParameters);
		return response[L"CreatedGraphID"].as_integer();
	}

	void SystemManager::DeleteGraph(int graphID)
	{
		string url = serviceURL_ + "graphs/" + to_string(graphID);

		if (userID_ == INT_MIN || whoToken_ == "")
			throw new AuthenicationException();

		unordered_map<string, string> urlParameters;

		urlParameters["UserID"] = to_string(userID_);
		urlParameters["WhoToken"] = whoToken_;
		urlParameters["GraphID"] = to_string(graphID);

		json::value bodyParameters;

		auto response = RESTHelper::SendTypicalRequest(
			url, urlParameters, "Delete", bodyParameters);
	}

	vector<Folder *> & SystemManager::GetFolders()
	{
		auto result = new vector<Folder *>();

		string url = serviceURL_ + "folders";

		if (userID_ == INT_MIN || whoToken_ == "")
			throw new AuthenicationException();

		unordered_map<string, string> urlParameters;

		urlParameters["UserID"] = to_string(userID_);
		urlParameters["WhoToken"] = whoToken_;

		json::value bodyParameters;

		auto response = RESTHelper::SendTypicalRequest(
			url, urlParameters, "Get", bodyParameters);
		auto responseArray = response.as_array();
		for (auto responseItem : responseArray)
		{
			auto folder = new Folder(responseItem[L"ID"].as_integer(),
				Statics::WStringToNarrow(responseItem[L"Name"].as_string()), this);
			result->push_back(folder);
		}

		return *result;
	}

	Graph * SystemManager::StartGraph(int graphID,
		bool waitForLoadingToFinish, bool receiveCommands)
	{
		if (userID_ == INT_MIN || whoToken_ == "")
			throw new AuthenicationException();

		return new Graph(this, graphID, waitForLoadingToFinish, receiveCommands);
	}
}