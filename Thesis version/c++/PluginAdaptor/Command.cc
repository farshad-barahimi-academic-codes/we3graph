#include "Command.h"
#include "Headers.h"

namespace We3Graph
{
	int Command::__getClientID()
	{
		return clientID_;
	}

	void Command::__setClientID(int clientID)
	{
		clientID_ = clientID;
	}

	int Command::__getID()
	{
		return ID_;
	}

	void Command::__setID(int ID)
	{
		ID_ = ID;
	}

	Command::Command(string name, vector<string> * parameters)
	{
		name_ = name;
		parameters_ = parameters;

		for (int i = parameters_->size(); i < 5; i++)
			parameters_->push_back("");
	}

	string Command::GetName()
	{
		return name_;
	}

	vector<string> & Command::GetParameters()
	{
		return *parameters_;
	}
}