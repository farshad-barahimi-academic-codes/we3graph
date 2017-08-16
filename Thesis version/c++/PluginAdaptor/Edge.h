#ifndef EDGE_H
#define EDGE_H

#include<vector>
#include<unordered_map>
using namespace std;

namespace We3Graph
{
	class Graph;
	class Vertex;
	class FullID;
	class Bend;
	class EdgeLine;
	class Point3D;

	/// <summary>
	/// This class represents an edge.
	/// </summary>
	class Edge
	{
	private:
		unordered_map<string, unordered_map< string, string> *> properties_;

		Vertex * startVertex_;
		Vertex * endVertex_;
		vector<EdgeLine *> edgeLines_;
		FullID * fullID_;
		Graph * graph_;

	public:
		void __setProperty(string listName, string key, string value);

		Bend * __breakEdgeLine(Point3D * position, int index);

		Bend  * __removeBend(int index);

		Edge(Vertex * startVertex, Vertex * endVertex, FullID * fullID, Graph * graph);

		void Remove();

		Vertex * GetStartVertex();

		Vertex * GetEndVertex();

		vector<EdgeLine *> & GetEdgeLines();

		vector<Bend*> GetBends();

		/// <summary>
		/// Gets the value for a custom property of an edge specified by
		/// a list name and a key
		/// </summary>
		/// <param name="listName">
		/// The list name. Use 'None' if there is no list.
		/// </param>
		/// <param name="key">The key for the property.</param>
		/// <returns>null if not found</returns>
		string GetPropertyValue(string listName, string key);

		/// <summary>
		/// Gets the list for a custom property of an edge specified by a list name
		/// </summary>
		/// <param name="listName">The list name.</param>
		/// <returns>null if not found</returns>
		unordered_map<string, string> * GetPropertyList(string listName);

		/// <summary>
		/// Updates the value for a custom property of an edge specified by
		/// a list name and a key
		/// </summary>
		/// <param name="listName">
		/// The list name. Will be created if doesn't exist.
		/// </param>
		/// <param name="key">The key for the property.</param>
		/// <param name="value">
		/// The value for the property. An empty value indicates removing.
		/// </param>
		/// <param name="isRenderUpdateNeeded">
		/// Whether this change requires an update in rendering
		///	</param>
		void SetProperty(string listName, string key, string value,
			bool isRenderUpdateNeeded);

		FullID * GetFullID();

		Bend * BreakEdgeLine(Point3D * position, int index);

		Bend * RemoveBend(int index);

	};
}

#endif /* EDGE_H */