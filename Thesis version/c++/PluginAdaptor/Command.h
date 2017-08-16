#ifndef COMMAND_H
#define COMMAND_H

#include<string>
#include<vector>
using namespace std;

namespace We3Graph
{
	/// <summary>
	/// This class represent a command sent or received from the server.
	/// </summary>
	class Command
	{
	private:
		string name_;
		vector<string> * parameters_;
		int clientID_;
		int ID_;

	public:

		int __getClientID();

		void __setClientID(int clientID);

		int __getID();

		void __setID(int ID);

		Command(string name, vector<string> * parameters);

		string GetName();

		vector<string> & GetParameters();
	};
}

#endif /* COMMAND_H */