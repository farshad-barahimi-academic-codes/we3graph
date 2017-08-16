#include "Edge.h"
#include "Headers.h"

namespace We3Graph
{
	void Edge::__setProperty(string listName, string key, string value)
	{
		if (properties_.find(listName) == properties_.end())
			properties_[listName] = new unordered_map<string, string>();

		if (value == "")
			properties_[listName]->erase(key);
		else
			(*properties_[listName])[key] = value;
	}

	Bend * Edge::__breakEdgeLine(Point3D * position, int index)
	{
		auto newBend = new Bend(position, this, graph_);
		auto edgeLine = edgeLines_[index];
		auto edgeLine1 = new EdgeLine(this, newBend, edgeLine->GetEndBend());
		edgeLine->SetEndBend(newBend);

		edgeLines_.insert(edgeLines_.begin() + index + 1, edgeLine1);

		return newBend;
	}

	Bend * Edge::__removeBend(int index)
	{
		auto beforeEdgeLine = edgeLines_[index];
		auto afterEdgeLine = edgeLines_[index + 1];
		auto removedBend = beforeEdgeLine->GetEndBend();

		beforeEdgeLine->SetEndBend(afterEdgeLine->GetEndBend());
		edgeLines_.erase(edgeLines_.begin() + index + 1);

		return removedBend;
	}

	Edge::Edge(Vertex * startVertex, Vertex * endVertex, FullID * fullID, Graph * graph)
	{
		startVertex_ = startVertex;
		endVertex_ = endVertex;
		edgeLines_.push_back(new EdgeLine(this, NULL, NULL));
		fullID_ = fullID;
		graph_ = graph;
	}

	void Edge::Remove()
	{
		graph_->__removeEdge(this);
		graph_->__getCommandSender()->__sendRemoveEdgeCommand(this);
	}

	Vertex * Edge::GetStartVertex()
	{
		return startVertex_;
	}

	Vertex * Edge::GetEndVertex()
	{
		return endVertex_;
	}

	vector<EdgeLine *> & Edge::GetEdgeLines()
	{
		return edgeLines_;
	}

	vector<Bend *> Edge::GetBends()
	{
		vector<Bend *> result;
		for (auto edgeLine : edgeLines_)
		if (edgeLine->GetStartBend() != NULL)
			result.push_back(edgeLine->GetStartBend());
		return result;
	}

	string Edge::GetPropertyValue(string listName, string key)
	{
		if (properties_.find(listName) == properties_.end())
			return NULL;
		if (properties_[listName]->find(key) == properties_[listName]->end())
			return NULL;

		return (*properties_[listName])[key];
	}

	unordered_map<string, string> * Edge::GetPropertyList(string listName)
	{
		if (properties_.find(listName) != properties_.end())
			return properties_[listName];
		else
			return NULL;
	}

	void Edge::SetProperty(string listName, string key, string value,
		bool isRenderUpdateNeeded)
	{
		__setProperty(listName, key, value);
		graph_->__getCommandSender()->__sendSetEdgePropertyCommand(this,
			listName, key, value, isRenderUpdateNeeded);
	}

	FullID * Edge::GetFullID()
	{
		return fullID_;
	}

	Bend * Edge::BreakEdgeLine(Point3D * position, int index)
	{
		auto bend = __breakEdgeLine(position, index);

		graph_->__getCommandSender()->__sendBreakEdgeLineCommand(this, index, position);

		return bend;
	}

	Bend * Edge::RemoveBend(int index)
	{
		auto bend = __removeBend(index);

		graph_->__getCommandSender()->__sendRemoveBendCommand(this, index);

		return bend;
	}
}