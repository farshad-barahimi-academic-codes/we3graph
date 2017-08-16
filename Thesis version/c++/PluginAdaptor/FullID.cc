#include "FullID.h"
#include "Headers.h"

namespace We3Graph
{
	FullID::FullID(int clientID, int IDinCreator)
	{
		this->clientID = clientID;
		this->IDinCreator = IDinCreator;
	}

	FullID * FullID::FromString(string IDString)
	{
		int dashIndex = IDString.find("-");
		int clientID = stoi(IDString.substr(0, dashIndex));
		int IDinCreator = stoi(IDString.substr(dashIndex + 1));
		return new FullID(clientID, IDinCreator);
	}

	string FullID::ToString()
	{
		return clientID + "-" + IDinCreator;
	}

	int FullID::GetClientID()
	{
		return clientID;
	}

	int FullID::GetIDinCreator()
	{
		return IDinCreator;
	}

	bool FullID::IsEqualTo(FullID * fullID)
	{
		if (this == fullID)
			return true;

		if (fullID == NULL)
			return false;

		if (clientID == fullID->GetClientID() &&
			IDinCreator == fullID->GetIDinCreator())
			return true;

		return false;
	}
}