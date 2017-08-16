#include "Graph.h"
#include "Headers.h"

#include <thread>

namespace We3Graph
{
	CommandSender * Graph::__getCommandSender()
	{
		return commandSender_;
	}

	int Graph::__getClientID()
	{
		return clientID_;
	}

	int Graph::__getLastCreatedEdgeID()
	{
		return lastCreatedEdgeID_;
	}

	void Graph::__setLastCreatedEdgeID(int edgeID)
	{
		lastCreatedEdgeID_ = edgeID;
	}

	void Graph::__setLastCreatedVertexID(int vertexID)
	{
		lastCreatedVertexID_ = vertexID;
	}

	FullIDHashDictionary<Edge *> * Graph::__getEdgesDictionary()
	{
		return edgesDictionary_;
	}

	FullIDHashDictionary<Vertex *> * Graph::__getVerticesDictionary()
	{
		return verticesDictionary_;
	}

	Vertex * Graph::__insertVertex(Point3D * position, FullID * fullID)
	{
		auto vertex = new Vertex(this, position, fullID,
			verticesDictionary_->GetAllItems().size());
		verticesDictionary_->Add(vertex);

		return vertex;
	}

	void Graph::__removeEdge(Edge * edge)
	{
		if (edge == NULL)
			return;

		edgesDictionary_->Remove(edge->GetFullID());

		auto startVertexEdges = edge->GetStartVertex()->GetEdges();
		auto endVertexEdges = edge->GetEndVertex()->GetEdges();

		int i;
		int index = -1;
		for (i = 0; i < startVertexEdges.size(); i++)
		if (startVertexEdges[i]->GetFullID()->IsEqualTo(edge->GetFullID()))
			index = i;
		if (index != -1)
			startVertexEdges.erase(startVertexEdges.begin() + index);

		index = -1;
		for (i = 0; i < endVertexEdges.size(); i++)
		if (endVertexEdges[i]->GetFullID()->IsEqualTo(edge->GetFullID()))
			index = i;
		if (index != -1)
			endVertexEdges.erase(endVertexEdges.begin() + index);
	}

	void Graph::__removeVertex(Vertex * vertex)
	{
		if (vertex == NULL)
			return;

		int index = vertex->GetIndex();
		auto vertices = GetVertices();
		for (int i = index + 1; i < vertices.size(); i++)
			vertices[i]->__setIndex(vertices[i]->GetIndex() - 1);

		verticesDictionary_->Remove(vertex->GetFullID());

		auto edges = vertex->GetEdges();
		auto edgesCopy = edges;

		for (auto edge : edgesCopy)
			__removeEdge(edge);


	}

	void Graph::__raiseVertexAddedEvent(Vertex * vertex)
	{
		if (VertexAdded != nullptr)
			VertexAdded(vertex);
	}

	void Graph::__raiseVertexMovedEvent(Vertex * vertex)
	{
		if (VertexMoved != nullptr)
			VertexMoved(vertex);
	}

	void Graph::__raiseVertexRotationChangedEvent(Vertex * vertex)
	{
		if (VertexRotationChanged != nullptr)
			VertexRotationChanged(vertex);
	}

	void Graph::__raiseVertexScaleChangedEvent(Vertex * vertex)
	{
		if (VertexScaleChanged != nullptr)
			VertexScaleChanged(vertex);
	}

	void Graph::__raiseVertexRemovedEvent(Vertex * vertex)
	{
		if (VertexRemoved != nullptr)
			VertexRemoved(vertex);
	}

	void Graph::__raiseVertexPropertyChangedEvent(Vertex * vertex,
		string listName, string key)
	{
		if (VertexPropertyChanged != nullptr)
			VertexPropertyChanged(vertex, listName, key);
	}

	void Graph::__raiseEdgeAddedEvent(Edge * edge)
	{
		if (EdgeAdded != nullptr)
			EdgeAdded(edge);
	}

	void Graph::__raiseEdgeRemovedEvent(Edge * edge)
	{
		if (EdgeRemoved != nullptr)
			EdgeRemoved(edge);
	}

	void Graph::__raiseEdgePropertyChangedEvent(Edge * edge, string listName, string key)
	{
		if (EdgePropertyChanged != nullptr)
			EdgePropertyChanged(edge, listName, key);
	}

	void Graph::__raiseBendAddedEvent(Bend * bend)
	{
		if (BendAdded != nullptr)
			BendAdded(bend);
	}

	void Graph::__raiseBendMovedEvent(Bend * bend)
	{
		if (BendMoved != nullptr)
			BendMoved(bend);
	}

	void Graph::__raiseBendRemovedEvent(Bend * bend)
	{
		if (BendRemoved != nullptr)
			BendRemoved(bend);
	}

	void Graph::__raiseCameraChangedEvent()
	{
		if (CameraChanged != nullptr)
			CameraChanged(camera_);
	}

	void Graph::__raiseGraphChangedEvent()
	{
		if (GraphChanged != nullptr)
			GraphChanged(this);
	}

	Graph::Graph(SystemManager * systemManager, int graphID,
		bool waitForLoadingToFinish, bool receiveCommands)
	{
		verticesDictionary_ = new FullIDHashDictionary<Vertex *>();
		edgesDictionary_ = new FullIDHashDictionary<Edge *>();
		lastCreatedVertexID_ = 0;
		lastCreatedEdgeID_ = 0;
		isLoading_ = true;
		camera_ = new Camera(this);

		serviceManager_ = new ServiceManager(systemManager, graphID);
		clientID_ = serviceManager_->__getClientID();
		serviceManager_->__newCommandsReceived = std::bind(
			&Graph::newCommandsReceived, this, placeholders::_1);
		serviceManager_->__graphLoaded = std::bind(&Graph::graphLoaded, this);

		commandSender_ = new CommandSender(serviceManager_);

		serviceManager_->__start(receiveCommands);

		if (waitForLoadingToFinish)
		{
			while (IsLoading())
				this_thread::sleep_for(chrono::milliseconds(20));
		}

	}

	vector<Vertex *> & Graph::GetVertices()
	{
		return verticesDictionary_->GetAllItems();
	}

	Camera * Graph::GetCamera()
	{
		return camera_;
	}

	Vertex * Graph::AddVertex(Point3D * position)
	{
		int IDinCreator = ++lastCreatedVertexID_;
		auto fullID = new FullID(clientID_, IDinCreator);

		auto vertex = __insertVertex(position, fullID);

		commandSender_->__sendInsertVertexCommand(vertex);

		return vertex;
	}

	bool Graph::IsAllCommandsSent()
	{
		return serviceManager_->__isAllCommandsSent();
	}

	bool Graph::IsLoading()
	{
		return isLoading_;
	}

	void Graph::Finish(bool waitForAllCommandsToBeSent)
	{
		if (waitForAllCommandsToBeSent)
		{
			while (!serviceManager_->__isAllCommandsSent())
				this_thread::sleep_for(chrono::milliseconds(20));
		}

		serviceManager_->__stop();
	}

	void Graph::graphLoaded()
	{
		isLoading_ = false;
	}

	void Graph::newCommandsReceived(vector<Command *> * commands)
	{
		auto commandProcesor = new CommandProcessor(this);
		for (auto command : (*commands))
			commandProcesor->__processCommand(command);

		if (commands->size() > 0)
			__raiseGraphChangedEvent();
	}
}