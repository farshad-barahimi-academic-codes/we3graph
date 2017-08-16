#include "Bend.h"
#include "Headers.h"

#include <vector>
using namespace std;

namespace We3Graph
{
	Bend::Bend(Point3D * position, Edge * edge, Graph * graph)
	{
		position_ = position;
		edge_ = edge;
		graph_ = graph;
	}

	void Bend::Move(Point3D * position)
	{
		__move(position);
		graph_->__getCommandSender()->__sendMoveBendCommand(this);
	}

	void Bend::__move(Point3D * position)
	{
		position_ = position;
	}

	void Bend::Remove()
	{
		int index = GetIndexAtEdge();
		edge_->RemoveBend(index);
	}

	Point3D * Bend::GetPosition()
	{
		return position_;
	}

	Edge * Bend::GetEdge()
	{
		return edge_;
	}

	int Bend::GetIndexAtEdge()
	{
		auto edgeLines = edge_->GetEdgeLines();
		for (int i = 0; i < edgeLines.size(); i++)
		if (edgeLines[i]->GetEndBend() == this)
			return i;

		return -1;
	}
}