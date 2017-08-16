#ifndef VERTEX_H
#define VERTEX_H

#include <unordered_map>
#include <vector>
using namespace std;

namespace We3Graph
{
	class Edge;
	class Graph;
	class Point3D;
	class Point4D;
	class FullID;

	/// <summary>
	/// This class represents a vertex
	/// </summary>
	class Vertex
	{
	private:
		Graph * graph_;

		unordered_map<string, unordered_map<string, string> * > properties_;

		vector<Edge *> edges_;
		Point3D * position_;
		Point4D * rotation_;
		double scale_;
		FullID * fullID_;
		int index_;

	public:

		Vertex(Graph * graph, Point3D * position, FullID * fullID, int index);

		void __setIndex(int index);

		Edge * __connectTo(Vertex * endVertex, FullID * edgeFullID);

		void __move(Point3D * position);

		void __setRotation(Point4D * rotation);

		void __setScale(double scale);

		void __setProperty(string listName, string key, string value);

		Edge * ConnectTo(Vertex * endVertex);

		void Move(Point3D * position);

		void SetRotation(Point4D * rotation);

		void SetScale(double scale);

		void Remove();

		FullID * GetFullID();

		int GetIndex();

		Point3D * GetPosition();

		Point4D * GetRotation();

		double Vertex::GetScale();

		vector<Edge *> & GetEdges();

		vector<Vertex *> GetAdjacentVertices(bool isDirected = false);

		/// <summary>
		/// Gets the value for a custom property of a vertex specified by
		/// a list name and a key
		/// </summary>
		/// <param name="listName">
		/// The list name. Use 'None' if there is no list.
		/// </param>
		/// <param name="key">The key for the property.</param>
		/// <returns>null if not found</returns>
		string GetPropertyValue(string listName, string key);

		/// <summary>
		/// Gets the list for a custom property of a vertex specified by a list name
		/// </summary>
		/// <param name="listName">The list name.</param>
		/// <returns>null if not found</returns>
		unordered_map<string, string> * GetPropertyList(string listName);

		/// <summary>
		/// Updates the value for a custom property of a vertex specified by
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
		/// </param>
		void SetProperty(string listName, string key, string value,
			bool isRenderUpdateNeeded);

		bool IsConnectedTo(Vertex * vertex);
	};
}

#endif /* VERTEX_H */