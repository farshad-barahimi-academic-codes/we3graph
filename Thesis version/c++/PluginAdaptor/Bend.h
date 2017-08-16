#ifndef BEND_H
#define BEND_H

namespace We3Graph
{
	class Graph;
	class Point3D;
	class Edge;

	/// <summary>
	/// This class represents a bend.
	/// Bends break edges into edge lines.
	/// </summary>
	class Bend
	{
	private:
		Point3D * position_;
		Edge * edge_;
		Graph * graph_;

	public:
		Bend(Point3D * position, Edge * edge, Graph * graph);

		void Move(Point3D * position);

		void __move(Point3D * position);

		void Remove();

		Point3D * GetPosition();

		Edge * GetEdge();

		int GetIndexAtEdge();
	};
}


#endif /* BEND_H */