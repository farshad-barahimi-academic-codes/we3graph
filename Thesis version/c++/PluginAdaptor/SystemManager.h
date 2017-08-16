#ifndef SYSTEM_MANAGER_H
#define SYSTEM_MANAGER_H

#include "RESTHelper.h"

#include <vector>
#include <string>
using namespace std;


namespace We3Graph
{
	class Graph;
	class Folder;

	/// <summary>
	/// A class as starting point to manage the interaction with the system.
	/// </summary>
	class SystemManager
	{
	private:
		string serviceURL_;

		int userID_ = INT_MIN;

		string whoToken_ = "";

	public:

		string GetServiceURL();

		void SetServiceURL(string serviceURL);

		int __GetUserID();

		string __GetWhoToken();

		SystemManager(string serviceURL = "");

		void Login(string username, string password);

		int CreateGraph(string graphName, int folderID, string renderEngineGUID);

		void DeleteGraph(int graphID);

		vector<Folder *> & GetFolders();

		Graph * StartGraph(int graphID, bool waitForLoadingToFinish = true,
			bool receiveCommands = true);
	};
}

#endif /* SYSTEM_MANAGER_H */