#ifndef COMMAND_SENDER_H
#define COMMAND_SENDER_H

#include<string>
using namespace std;

namespace We3Graph
{
	class ServiceManager;
	class Vertex;
	class Point3D;
	class Point4D;
	class Edge;
	class Bend;

	/// <summary>
	/// This class helps sending different command to the server
	/// </summary>
	class CommandSender
	{
	private:
		ServiceManager * serviceManager_;

	public:
		CommandSender(ServiceManager * serviceManager);

		void __sendInsertVertexCommand(Vertex * vertex);

		void __sendInsertEdgeCommand(Edge * edge);

		void __sendBreakEdgeLineCommand(Edge * edge, int index, Point3D * position);

		void __sendRemoveVertexCommand(Vertex * vertex);

		void __sendRemoveEdgeCommand(Edge * edge);

		void __sendRemoveBendCommand(Edge * edge, int index);

		void __sendMoveVertexCommand(Vertex * vertex);

		void __sendChangeVertexRotationCommand(Vertex * vertex);

		void __sendChangeVertexScaleCommand(Vertex * vertex);

		void __sendMoveBendCommand(Bend * bend);

		void __sendChangeCameraPositionCommand(Point3D * position);

		void __sendChangeCameraRotationCommand(Point4D * rotation);

		void __sendSetVertexPropertyCommand(Vertex * vertex, string listName,
			string key, string value, bool isRenderUpdateNeeded);

		void __sendSetEdgePropertyCommand(Edge * edge, string listName,
			string key, string value, bool isRenderUpdateNeeded);
	};
}

#endif /* COMMAND_SENDER_H */