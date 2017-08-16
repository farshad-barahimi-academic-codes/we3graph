#ifndef SERVICE_MANAGER_H
#define SERVICE_MANAGER_H

#include "RESTHelper.h"

#include<functional>
#include<thread>
#include<mutex>
#include <queue>
#include <vector>
using namespace std;

class AutoResetEvent;

namespace We3Graph
{
	class SystemManager;
	class Command;

	/// <summary>
	/// A class to handle graph interactions with the web service.
	/// </summary>
	class ServiceManager
	{
	private:
		string serviceURL_;
		mutex outgoingCommandsQueueMutex_;
		queue<Command *> outgoingCommandsQueue_;
		int clientID_;
		thread * syncIncommingThread_;
		thread * syncOutgoingThread_;
		AutoResetEvent * sendEvent_;
		int lastCommandIDReceived_;
		bool isLoading_;
		int graphID_;
		int userID_;
		string whoToken_;
		string graphAccessToken_;

	public:
		function<void(vector<Command *> *)> __newCommandsReceived;
		function<void()> __graphLoaded;

		ServiceManager(SystemManager * systemManager, int graphID);

		void __start(bool receiveCommands);

		int __getClientID();

		void __stop();

		void __runCommand(Command * command);

		bool __isAllCommandsSent();

	private:
		void getGraphAccessToken();

		void getClientID();

		void syncIncommingCommands();

		void syncOutgoingCommands();

		void processResponse(json::value & response);

		bool sendCommand(Command * command);

	};
}

#endif /* SERVICE_MANAGER_H */