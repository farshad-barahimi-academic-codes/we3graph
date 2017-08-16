#ifndef FULL_ID_H
#define FULL_ID_H

#include <string>
using namespace std;

namespace We3Graph
{
	/// <summary>
	/// A full ID represent an ID in form of clientID-IDinCreator
	/// It can be used as a unique ID for vertices or edges
	/// </summary>
	class FullID
	{
	private:
		int clientID;
		int IDinCreator;

	public:

		FullID(int clientID, int IDinCreator);

		static FullID * FromString(string IDString);

		string ToString();

		int GetClientID();

		int GetIDinCreator();

		bool FullID::IsEqualTo(FullID * fullID);
	};
}

#endif /* FULL_ID_H */