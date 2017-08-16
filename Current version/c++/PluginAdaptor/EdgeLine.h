#ifndef EDGE_LINE_H
#define EDGE_LINE_H

namespace We3Graph
{
	class Edge;
	class Bend;
	class Point3D;

	/// <summary>
	/// This class represents an edge line.
	/// Bends break edges into edge lines
	/// </summary>
	class EdgeLine
	{
	private:
		Edge * edge_;
		Bend * startBend_;
		Bend * endBend_;

	public:
		/// <summary>
		/// Constructor for the edge line class
		/// </summary>
		/// <param name="edge">The parent edge for the edge line</param>
		/// <param name="startBend">
		/// The bend at the beginning of the edge line.
		/// null if the start vertex of the edge is the beginning
		/// </param>
		/// <param name="endBend">
		/// The bend at the end of the edge line.
		/// null if the end vertex of the edge is the end
		/// </param>
		EdgeLine(Edge * edge, Bend * startBend, Bend * endBend);

		Bend * Break(Point3D * position);

		Bend * GetStartBend();

		Bend * GetEndBend();

		Edge * GetEdge();

		void SetEndBend(Bend * bend);
	};
}

#endif /* EDGE_LINE_H */