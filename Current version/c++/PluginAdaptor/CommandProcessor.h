#ifndef COMMAND_PROCESSOR_H
#define COMMAND_PROCESSOR_H


namespace We3Graph
{
	class Graph;
	class Command;

	/// <summary>
	/// This class processes incoming commands and make necessary actions.
	/// </summary>
	class CommandProcessor
	{
	private:
		Graph * graph_;

	public:
		CommandProcessor(Graph * graph);

		void __processCommand(Command * command);

	private:

		void processInsertVertexCommand(Command * command);

		void processInsertEdgeCommand(Command * command);

		void processBreakEdgeLineCommand(Command * command);

		void processRemoveVertexCommand(Command * command);

		void processRemoveEdgeCommand(Command * command);

		void processRemoveBendCommand(Command * command);

		void processMoveVertexCommand(Command * command);

		void processChangeVertexRotationCommand(Command * command);

		void processChangeVertexScaleCommand(Command * command);

		void processMoveBendCommand(Command * command);

		void processChangeCameraPositionCommand(Command * command);

		void processChangeCameraRotationCommand(Command * command);

		void processSetVertexPropertyCommand(Command * command);

		void processSetEdgePropertyCommand(Command * command);
	};
}

#endif /* COMMAND_PROCESSOR_H */