#ifndef FOLDER_H
#define FOLDER_H

#include<vector>
#include<string>
using namespace std;


namespace We3Graph
{
	class SystemManager;
	class GraphInfo;

	/// <summary>
	/// This class represents a folder
	/// </summary>
	class Folder
	{
	private:
		string name_;

		int id_;

		SystemManager * systemManager_;

	public:

		string GetName();

		string ToString();

		int GetID();

		vector<GraphInfo *> & GetChildren();

		int GetPermissionType();

		Folder(int id, string name, SystemManager * systemManager);
	};
}

#endif /* FOLDER_H */