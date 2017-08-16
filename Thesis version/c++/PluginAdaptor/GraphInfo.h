#ifndef GRAPH_INFO_H
#define GRAPH_INFO_H

#include<string>
using namespace std;

namespace We3Graph
{
	/// <summary>
	/// A class to provide basic information about a graph
	/// But it is not intended for interaction with the graph
	/// </summary>
	class GraphInfo
	{
	private:
		int id_;
		string name_;
		string renderEngineGUID_;
		int commandSetVersion_;

	public:

		int GetID();

		string GetName();

		string ToString();

		string GetRenderEngineGUID();

		int GetCommandSetVersion();

		GraphInfo(int id, string name, int commandSetVersion, string renderEngineGUID);
	};
}

#endif /* GRAPH_INFO_H */