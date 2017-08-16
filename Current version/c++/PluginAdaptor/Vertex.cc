#include "Vertex.h"
#include "Headers.h"

namespace We3Graph
{
	Vertex::Vertex(Graph * graph, Point3D * position, FullID * fullID, int index)
	{
		graph_ = graph;
		position_ = position;
		rotation_ = new Point4D(0, 0, 1, 1);
		scale_ = 1;
		fullID_ = fullID;
		index_ = index;
	}

	void Vertex::__setIndex(int index)
	{
		index_ = index;
	}

	Edge * Vertex::__connectTo(Vertex * endVertex, FullID * edgeFullID)
	{
		auto edge = new Edge(this, endVertex, edgeFullID, graph_);
		graph_->__getEdgesDictionary()->Add(edge);
		edges_.push_back(edge);
		endVertex->GetEdges().push_back(edge);

		return edge;
	}

	void Vertex::__move(Point3D * position)
	{
		position_ = position;
	}

	void Vertex::__setRotation(Point4D * rotation)
	{
		rotation_ = rotation;
	}

	void Vertex::__setScale(double scale)
	{
		scale_ = scale;
	}

	void Vertex::__setProperty(string listName, string key, string value)
	{
		if (properties_.find(listName) == properties_.end())
			properties_[listName] = new unordered_map<string, string>();

		if (value == "")
			properties_[listName]->erase(key);
		else
			(*properties_[listName])[key] = value;
	}

	Edge * Vertex::ConnectTo(Vertex * endVertex)
	{
		int edgeClientID = graph_->__getClientID();
		int edgeIDinCreator = graph_->__getLastCreatedEdgeID() + 1;
		graph_->__setLastCreatedEdgeID(edgeIDinCreator);

		auto edge = __connectTo(endVertex, new FullID(edgeClientID, edgeIDinCreator));

		graph_->__getCommandSender()->__sendInsertEdgeCommand(edge);

		return edge;
	}

	void Vertex::Move(Point3D * position)
	{
		__move(position);
		graph_->__getCommandSender()->__sendMoveVertexCommand(this);
	}

	void Vertex::SetRotation(Point4D * rotation)
	{
		__setRotation(rotation);
		graph_->__getCommandSender()->__sendChangeVertexRotationCommand(this);
	}

	void Vertex::SetScale(double scale)
	{
		__setScale(scale);
		graph_->__getCommandSender()->__sendChangeVertexScaleCommand(this);
	}

	void Vertex::Remove()
	{
		graph_->__removeVertex(this);
		graph_->__getCommandSender()->__sendRemoveVertexCommand(this);
	}

	FullID * Vertex::GetFullID()
	{
		return fullID_;
	}

	int Vertex::GetIndex()
	{
		return index_;
	}

	Point3D * Vertex::GetPosition()
	{
		return position_;
	}

	Point4D * Vertex::GetRotation()
	{
		return rotation_;
	}

	double Vertex::GetScale()
	{
		return scale_;
	}

	vector<Edge *> & Vertex::GetEdges()
	{
		return edges_;
	}

	vector<Vertex *> Vertex::GetAdjacentVertices(bool isDirected)
	{
		vector<Vertex *> result;
		for (auto edge : edges_)
		{
			auto startVertex = edge->GetStartVertex();
			auto endVertex = edge->GetEndVertex();
			if (startVertex->GetFullID()->IsEqualTo(fullID_))
				result.push_back(endVertex);
			else if (endVertex->GetFullID()->IsEqualTo(fullID_) && !isDirected)
				result.push_back(startVertex);
		}
		return result;
	}

	string Vertex::GetPropertyValue(string listName, string key)
	{
		if (properties_.find(listName) == properties_.end())
			return NULL;
		if (properties_[listName]->find(key) == properties_[listName]->end())
			return NULL;

		return (*properties_[listName])[key];
	}

	unordered_map<string, string> * Vertex::GetPropertyList(string listName)
	{
		if (properties_.find(listName) != properties_.end())
			return properties_[listName];
		else
			return NULL;
	}

	void Vertex::SetProperty(string listName, string key, string value,
		bool isRenderUpdateNeeded)
	{
		__setProperty(listName, key, value);
		graph_->__getCommandSender()->__sendSetVertexPropertyCommand(this,
			listName, key, value, isRenderUpdateNeeded);
	}

	bool Vertex::IsConnectedTo(Vertex * vertex)
	{
		for (auto edge : edges_)
		if (edge->GetStartVertex()->GetFullID()->IsEqualTo(vertex->GetFullID()) ||
			edge->GetEndVertex()->GetFullID()->IsEqualTo(vertex->GetFullID()))
			return true;

		return false;
	}
}