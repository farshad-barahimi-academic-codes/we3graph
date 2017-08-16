#include "CommandProcessor.h"
#include "Headers.h"

namespace We3Graph
{
	CommandProcessor::CommandProcessor(Graph * graph)
	{
		graph_ = graph;
	}

	void CommandProcessor::__processCommand(Command * command)
	{
		string name = command->GetName();

		if (name == "InsertVertex")
			processInsertVertexCommand(command);
		else if (name == "InsertEdge")
			processInsertEdgeCommand(command);
		else if (name == "BreakEdgeLine")
			processBreakEdgeLineCommand(command);
		else if (name == "RemoveVertex")
			processRemoveVertexCommand(command);
		else if (name == "RemoveEdge")
			processRemoveEdgeCommand(command);
		else if (name == "RemoveBend")
			processRemoveBendCommand(command);
		else if (name == "MoveVertex")
			processMoveVertexCommand(command);
		else if (name == "ChangeVertexScale")
			processChangeVertexScaleCommand(command);
		else if (name == "ChangeVertexRotation")
			processChangeVertexRotationCommand(command);
		else if (name == "MoveBend")
			processMoveBendCommand(command);
		else if (name == "ChangeCameraPosition")
			processChangeCameraPositionCommand(command);
		else if (name == "ChangeCameraRotation")
			processChangeCameraRotationCommand(command);
		else if (name == "SetVertexProperty")
			processSetVertexPropertyCommand(command);
		else if (name == "SetEdgeProperty")
			processSetEdgePropertyCommand(command);
	}

	void CommandProcessor::processInsertVertexCommand(Command * command)
	{
		auto parameters = command->GetParameters();
		auto commandClientID = command->__getClientID();


		auto position = new Point3D(stod(parameters[1]),
			stod(parameters[2]), stod(parameters[3]));
		auto vertexFullID = new FullID(commandClientID, stoi(parameters[0]));
		Vertex * insertedVertex = graph_->__insertVertex(position, vertexFullID);
		if (graph_->IsLoading() && commandClientID == graph_->__getClientID())
			graph_->__setLastCreatedVertexID(vertexFullID->GetIDinCreator());

		graph_->__raiseVertexAddedEvent(insertedVertex);
	}

	void CommandProcessor::processInsertEdgeCommand(Command * command)
	{
		auto parameters = command->GetParameters();
		auto commandClientID = command->__getClientID();
		auto verticesDictionary = graph_->__getVerticesDictionary();

		auto fromVertex = verticesDictionary->Find(FullID::FromString(parameters[0]));
		auto endVertex = verticesDictionary->Find(FullID::FromString(parameters[1]));

		if (fromVertex == NULL || endVertex == NULL)
			return;

		if (fromVertex->IsConnectedTo(endVertex))
			return;

		auto edgeFullID = new FullID(commandClientID, stoi(parameters[2]));

		Edge * edge = fromVertex->__connectTo(endVertex, edgeFullID);
		if (graph_->IsLoading() && commandClientID == graph_->__getClientID())
			graph_->__setLastCreatedEdgeID(edgeFullID->GetIDinCreator());

		graph_->__raiseEdgeAddedEvent(edge);
	}

	void CommandProcessor::processBreakEdgeLineCommand(Command * command)
	{
		auto parameters = command->GetParameters();
		auto edgesDictionary = graph_->__getEdgesDictionary();

		auto edge = edgesDictionary->Find(FullID::FromString(parameters[0]));
		if (edge == NULL)
			return;

		auto position = new Point3D(stod(parameters[2]),
			stod(parameters[3]), stod(parameters[4]));

		auto bend = edge->__breakEdgeLine(position, stoi(parameters[1]));

		graph_->__raiseBendAddedEvent(bend);
	}

	void CommandProcessor::processRemoveVertexCommand(Command * command)
	{
		auto parameters = command->GetParameters();
		auto verticesDictionary = graph_->__getVerticesDictionary();

		auto vertex = verticesDictionary->Find(FullID::FromString(parameters[0]));

		graph_->__removeVertex(vertex);

		graph_->__raiseVertexRemovedEvent(vertex);
	}

	void CommandProcessor::processRemoveEdgeCommand(Command * command)
	{
		auto parameters = command->GetParameters();
		auto edgesDictionary = graph_->__getEdgesDictionary();

		auto edge = edgesDictionary->Find(FullID::FromString(parameters[0]));
		graph_->__removeEdge(edge);

		graph_->__raiseEdgeRemovedEvent(edge);
	}

	void CommandProcessor::processRemoveBendCommand(Command * command)
	{
		auto parameters = command->GetParameters();
		auto edgesDictionary = graph_->__getEdgesDictionary();

		auto edge = edgesDictionary->Find(FullID::FromString(parameters[0]));

		if (edge == NULL)
			return;

		auto bend = edge->__removeBend(stoi(parameters[1]));

		graph_->__raiseBendRemovedEvent(bend);
	}

	void CommandProcessor::processMoveVertexCommand(Command * command)
	{
		auto parameters = command->GetParameters();
		auto verticesDictionary = graph_->__getVerticesDictionary();

		auto vertex = verticesDictionary->Find(FullID::FromString(parameters[0]));

		if (vertex == NULL)
			return;

		auto position = new Point3D(stod(parameters[1]),
			stod(parameters[2]), stod(parameters[3]));

		vertex->__move(position);

		graph_->__raiseVertexMovedEvent(vertex);
	}

	void CommandProcessor::processChangeVertexRotationCommand(Command * command)
	{
		auto parameters = command->GetParameters();
		auto verticesDictionary = graph_->__getVerticesDictionary();

		auto vertex = verticesDictionary->Find(FullID::FromString(parameters[0]));

		if (vertex == NULL)
			return;

		auto rotation = new Point4D(
			stod(parameters[1]), stod(parameters[2]),
			stod(parameters[3]), stod(parameters[4]));

		vertex->__setRotation(rotation);

		graph_->__raiseVertexRotationChangedEvent(vertex);
	}

	void CommandProcessor::processChangeVertexScaleCommand(Command * command)
	{
		auto parameters = command->GetParameters();
		auto verticesDictionary = graph_->__getVerticesDictionary();

		auto vertex = verticesDictionary->Find(FullID::FromString(parameters[0]));

		if (vertex == NULL)
			return;

		auto scale = stod(parameters[1]);

		vertex->__setScale(scale);

		graph_->__raiseVertexScaleChangedEvent(vertex);
	}

	void CommandProcessor::processMoveBendCommand(Command * command)
	{
		auto parameters = command->GetParameters();
		auto edgesDictionary = graph_->__getEdgesDictionary();

		auto edge = edgesDictionary->Find(FullID::FromString(parameters[0]));
		if (edge == NULL)
			return;

		auto position = new Point3D(stod(parameters[2]),
			stod(parameters[3]), stod(parameters[4]));

		int index = stoi(parameters[1]);
		auto bend = edge->GetEdgeLines()[index]->GetEndBend();
		bend->__move(position);

		graph_->__raiseBendMovedEvent(bend);
	}

	void CommandProcessor::processChangeCameraPositionCommand(Command * command)
	{
		auto parameters = command->GetParameters();

		auto position = new Point3D(stod(parameters[0]),
			stod(parameters[1]), stod(parameters[2]));
		graph_->GetCamera()->__changePosition(position);

		graph_->__raiseCameraChangedEvent();
	}

	void CommandProcessor::processChangeCameraRotationCommand(Command * command)
	{
		auto parameters = command->GetParameters();

		auto quaternion = new Point4D(stod(parameters[0]),
			stod(parameters[1]), stod(parameters[2]),
			stod(parameters[3]));

		graph_->GetCamera()->__changeRotation(quaternion);

		graph_->__raiseCameraChangedEvent();
	}

	void CommandProcessor::processSetVertexPropertyCommand(Command * command)
	{
		auto parameters = command->GetParameters();
		auto verticesDictionary = graph_->__getVerticesDictionary();

		auto vertex = verticesDictionary->Find(FullID::FromString(parameters[0]));

		if (vertex == NULL)
			return;

		vertex->__setProperty(parameters[1], parameters[2], parameters[3]);

		graph_->__raiseVertexPropertyChangedEvent(vertex, parameters[1], parameters[2]);
	}

	void CommandProcessor::processSetEdgePropertyCommand(Command * command)
	{
		auto parameters = command->GetParameters();
		auto edgesDictionary = graph_->__getEdgesDictionary();

		auto edge = edgesDictionary->Find(FullID::FromString(parameters[0]));

		if (edge == NULL)
			return;

		edge->__setProperty(parameters[1], parameters[2], parameters[3]);

		graph_->__raiseEdgePropertyChangedEvent(edge, parameters[1], parameters[2]);
	}
}