#include "EdgeLine.h"
#include "Headers.h"

namespace We3Graph
{
	EdgeLine::EdgeLine(Edge * edge, Bend * startBend, Bend * endBend)
	{
		edge_ = edge;
		startBend_ = startBend;
		endBend_ = endBend;
	}

	Bend * EdgeLine::Break(Point3D * position)
	{
		return NULL;
	}

	Bend * EdgeLine::GetStartBend()
	{
		return startBend_;
	}

	Bend * EdgeLine::GetEndBend()
	{
		return endBend_;
	}

	Edge * EdgeLine::GetEdge()
	{
		return edge_;
	}

	void EdgeLine::SetEndBend(Bend * bend)
	{
		endBend_ = bend;
	}
}