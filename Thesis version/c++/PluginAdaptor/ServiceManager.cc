#include "Servicemanager.h"
#include "Headers.h"

#include <unordered_map>
using namespace std;

namespace We3Graph
{
	ServiceManager::ServiceManager(SystemManager * systemManager, int graphID)
	{
		serviceURL_ = systemManager->GetServiceURL();
		userID_ = systemManager->__GetUserID();
		whoToken_ = systemManager->__GetWhoToken();
		graphID_ = graphID;
		lastCommandIDReceived_ = 0;
		isLoading_ = true;
		sendEvent_ = new AutoResetEvent(false);

		getGraphAccessToken();
		getClientID();
	}



	void ServiceManager::__start(bool receiveCommands)
	{
		if (receiveCommands)
		{
			syncIncommingThread_ = new thread(&ServiceManager::syncIncommingCommands, this);
		}
		syncOutgoingThread_ = new thread(&ServiceManager::syncOutgoingCommands, this);
	}

	void ServiceManager::getGraphAccessToken()
	{
		string url = serviceURL_ + "graph-access-tokens";

		if (userID_ == INT_MIN || whoToken_ == "")
			throw new AuthenicationException();

		unordered_map<string, string> urlParameters;
		json::value bodyParameters;

		bodyParameters[L"UserID"] = json::value::number(userID_);
		bodyParameters[L"WhoToken"] = json::value::string(
			Statics::StringToWide(whoToken_));
		bodyParameters[L"GraphID"] = json::value::number(graphID_);
		bodyParameters[L"PermissionType"] = json::value::number(1);

		auto response = RESTHelper::SendTypicalRequest(
			url, urlParameters, "Post", bodyParameters);
		graphAccessToken_ = Statics::WStringToNarrow(
			response[L"GraphAccessToken"].as_string());
	}

	void ServiceManager::getClientID()
	{
		string url = serviceURL_ + "clients";

		if (userID_ == INT_MIN || whoToken_ == "")
			throw new AuthenicationException();

		unordered_map<string, string> urlParameters;
		json::value bodyParameters;

		bodyParameters[L"UserID"] = json::value::number(userID_);
		bodyParameters[L"WhoToken"] = json::value::string(
			Statics::StringToWide(whoToken_));
		bodyParameters[L"GraphID"] = json::value::number(graphID_);
		bodyParameters[L"ClientName"] = json::value::string(L"Plugin");
		bodyParameters[L"GraphAccessToken"] = json::value::string(
			Statics::StringToWide(graphAccessToken_));

		auto response = RESTHelper::SendTypicalRequest(
			url, urlParameters, "Post", bodyParameters);
		clientID_ = response[L"CreatedClientID"].as_integer();
	}

	int ServiceManager::__getClientID()
	{
		return clientID_;
	}

	void ServiceManager::__stop()
	{
	}

	void ServiceManager::syncIncommingCommands()
	{
		while (true)
		{
			string url = serviceURL_ + "commands";

			if (userID_ == INT_MIN || whoToken_ == "")
				throw new AuthenicationException();

			unordered_map<string, string> urlParameters;

			urlParameters["UserID"] = to_string(userID_);
			urlParameters["WhoToken"] = whoToken_;
			urlParameters["GraphID"] = to_string(graphID_);
			urlParameters["LastCommandID"] = to_string(lastCommandIDReceived_);
			urlParameters["GraphAccessToken"] = graphAccessToken_;

			json::value bodyParameters;

			auto response = RESTHelper::SendTypicalRequest(
				url, urlParameters, "Get", bodyParameters);
			processResponse(response);

			this_thread::sleep_for(chrono::milliseconds(20));
		}
	}

	void ServiceManager::syncOutgoingCommands()
	{
		while (true)
		{
			sendEvent_->WaitOne(20);

			while (!outgoingCommandsQueue_.empty())
			{
				Command * command;
				outgoingCommandsQueueMutex_.lock();
				command = outgoingCommandsQueue_.front();
				outgoingCommandsQueue_.pop();
				outgoingCommandsQueueMutex_.unlock();
				sendCommand(command);
			}
		}

	}

	void ServiceManager::processResponse(json::value & response)
	{
		auto responseArray = response.as_array();

		if (responseArray.size() == 0)
		{
			if (isLoading_)
			{
				isLoading_ = false;
				if (__graphLoaded != NULL)
					__graphLoaded();
			}
			return;
		}


		auto commands = new vector<Command *>();

		for (auto item : responseArray)
		{
			string commandName = Statics::WStringToNarrow(item[L"Name"].as_string());
			int commandID = item[L"ID"].as_integer();
			int clientID = item[L"ClientID"].as_integer();
			auto parameters = new vector<string>();
			for (int i = 1; i <= 5; i++)
			{
				auto parameter = Statics::WStringToNarrow(
					item[L"Param" + to_wstring(i)].as_string());
				parameters->push_back(parameter);
			}

			auto command = new Command(commandName, parameters);
			command->__setID(commandID);
			command->__setClientID(clientID);

			commands->push_back(command);
			lastCommandIDReceived_ = command->__getID();
		}

		if (__newCommandsReceived != NULL)
			__newCommandsReceived(commands);
	}

	void ServiceManager::__runCommand(Command * command)
	{
		outgoingCommandsQueue_.push(command);
		sendEvent_->Set();
	}

	bool ServiceManager::sendCommand(Command * command)
	{
		try
		{
			auto parameters = command->GetParameters();

			string url = serviceURL_ + "commands";

			unordered_map<string, string> urlParameters;
			json::value bodyParameters;

			bodyParameters[L"UserID"] = json::value::number(userID_);
			bodyParameters[L"WhoToken"] = json::value::string(
				Statics::StringToWide(whoToken_));
			bodyParameters[L"GraphID"] = json::value::number(graphID_);
			bodyParameters[L"CommandName"] = json::value::string(
				Statics::StringToWide(command->GetName()));
			bodyParameters[L"ClientID"] = json::value::number(clientID_);
			bodyParameters[L"GraphAccessToken"] = json::value::string(
				Statics::StringToWide(graphAccessToken_));
			bodyParameters[L"Param1"] = json::value::string(
				Statics::StringToWide(parameters[0]));
			bodyParameters[L"Param2"] = json::value::string(
				Statics::StringToWide(parameters[1]));
			bodyParameters[L"Param3"] = json::value::string(
				Statics::StringToWide(parameters[2]));
			bodyParameters[L"Param4"] = json::value::string(
				Statics::StringToWide(parameters[3]));
			bodyParameters[L"Param5"] = json::value::string(
				Statics::StringToWide(parameters[4]));

			auto response = RESTHelper::SendTypicalRequest(
				url, urlParameters, "Post", bodyParameters);

			return true;
		}
		catch (exception e)
		{
			return false;
		}

		return false;
	}

	bool ServiceManager::__isAllCommandsSent()
	{
		if (outgoingCommandsQueue_.size() == 0)
			return true;
		else
			return false;
	}

}