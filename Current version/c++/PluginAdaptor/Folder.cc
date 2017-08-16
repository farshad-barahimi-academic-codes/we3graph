#include "Folder.h"
#include "Headers.h"

namespace We3Graph
{
	string Folder::GetName()
	{
		return name_;
	}

	string Folder::ToString()
	{
		return name_;
	}

	int Folder::GetID()
	{
		return id_;
	}

	vector<GraphInfo *> & Folder::GetChildren()
	{
		auto result = new vector<GraphInfo *>();

		string url = systemManager_->GetServiceURL() + "folders/" + to_string(id_);

		int userID = systemManager_->__GetUserID();
		string whoToken = systemManager_->__GetWhoToken();

		if (userID == INT_MIN || whoToken == "")
			throw new AuthenicationException();

		unordered_map<string, string> urlParameters;

		urlParameters["UserID"] = to_string(userID);
		urlParameters["WhoToken"] = whoToken;

		json::value bodyParameters;

		auto response = RESTHelper::SendTypicalRequest(url, urlParameters,
			"Get", bodyParameters);
		auto graphsArray = response[L"Graphs"].as_array();
		for (auto item : graphsArray)
		{
			auto graphInfo = new GraphInfo(
				item[L"ID"].as_integer(),
				Statics::WStringToNarrow(item[L"Name"].as_string()),
				item[L"CommandSetVersion"].as_integer(),
				Statics::WStringToNarrow(item[L"RenderEngineGUID"].as_string()));
			result->push_back(graphInfo);
		}

		return *result;
	}

	int Folder::GetPermissionType()
	{
		string url = systemManager_->GetServiceURL() + "folders/" + to_string(id_);

		int userID = systemManager_->__GetUserID();
		string whoToken = systemManager_->__GetWhoToken();

		if (userID == INT_MIN || whoToken == "")
			throw new AuthenicationException();

		unordered_map<string, string> urlParameters;
		urlParameters["UserID"] = to_string(userID);
		urlParameters["WhoToken"] = whoToken;

		json::value bodyParameters;

		auto response = RESTHelper::SendTypicalRequest(url, urlParameters,
			"Get", bodyParameters);

		return response[L"PermissionType"].as_integer();
	}



	Folder::Folder(int id, string name, SystemManager * systemManager)
	{
		name_ = name;
		id_ = id;
		systemManager_ = systemManager;
	}
}