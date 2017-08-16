#ifndef GRAPH_H
#define GRAPH_H

#include <cstdint>
#include <functional>
#include<unordered_map>
#include<vector>
#include<string>
using namespace std;

namespace We3Graph
{
	template <typename T>
	class FullIDHashDictionary;

	class Camera;
	class Command;
	class ServiceManager;
	class CommandSender;
	class CommandProcessor;
	class Vertex;
	class FullID;
	class Edge;
	class Point3D;
	class Bend;
	class SystemManager;

	/// <summary>
	/// This class represents a graph.
	/// </summary>
	class Graph
	{
	private:
		int clientID_;
		FullIDHashDictionary<Vertex *> * verticesDictionary_;
		FullIDHashDictionary<Edge *> * edgesDictionary_;
		Camera * camera_;
		int lastCreatedVertexID_;
		int lastCreatedEdgeID_;
		bool isLoading_;
		ServiceManager * serviceManager_;
		CommandSender * commandSender_;

	public:

		CommandSender * __getCommandSender();

		int __getClientID();

		int __getLastCreatedEdgeID();

		void __setLastCreatedEdgeID(int edgeID);

		void __setLastCreatedVertexID(int vertexID);

		FullIDHashDictionary<Edge *> * __getEdgesDictionary();

		FullIDHashDictionary<Vertex *> * __getVerticesDictionary();

		Vertex * __insertVertex(Point3D * position, FullID * fullID);

		void __removeEdge(Edge * edge);

		void __removeVertex(Vertex * vertex);

		void __raiseVertexAddedEvent(Vertex * vertex);

		void __raiseVertexMovedEvent(Vertex * vertex);

		void __raiseVertexRotationChangedEvent(Vertex * vertex);

		void __raiseVertexScaleChangedEvent(Vertex * vertex);

		void __raiseVertexRemovedEvent(Vertex * vertex);

		void __raiseVertexPropertyChangedEvent(Vertex * vertex,
			string listName, string key);

		void __raiseEdgeAddedEvent(Edge * edge);

		void __raiseEdgeRemovedEvent(Edge * edge);

		void __raiseEdgePropertyChangedEvent(Edge * edge,
			string listName, string key);

		void __raiseBendAddedEvent(Bend * bend);

		void __raiseBendMovedEvent(Bend * bend);

		void __raiseBendRemovedEvent(Bend * bend);

		void __raiseCameraChangedEvent();

		void __raiseGraphChangedEvent();

		function<void(Vertex *)> VertexAdded = nullptr;
		function<void(Vertex*)> VertexMoved = nullptr;
		function<void(Vertex*)> VertexRotationChanged = nullptr;
		function<void(Vertex*)> VertexScaleChanged = nullptr;
		function<void(Vertex*)> VertexRemoved = nullptr;
		function<void(Vertex *, string, string)> VertexPropertyChanged = nullptr;

		function<void(Edge*)> EdgeAdded = nullptr;
		function<void(Edge*)> EdgeRemoved = nullptr;
		function<void(Edge *, string, string)> EdgePropertyChanged = nullptr;

		function<void(Bend*)> BendAdded = nullptr;
		function<void(Bend*)> BendMoved = nullptr;
		function<void(Bend*)> BendRemoved = nullptr;

		function<void(Camera*)> CameraChanged = nullptr;

		function<void(Graph*)> GraphChanged = nullptr;


		Graph(SystemManager * systemManager, int graphID,
			bool waitForLoadingToFinish = true, bool receiveCommands = true);

		vector<Vertex *> & GetVertices();

		Camera * GetCamera();

		Vertex * AddVertex(Point3D * position);

		bool IsAllCommandsSent();

		bool IsLoading();

		void Finish(bool waitForAllCommandsToBeSent = true);

	private:
		void graphLoaded();

		void newCommandsReceived(vector<Command *> * commands);

	};
}

#endif /* GRAPH_H */