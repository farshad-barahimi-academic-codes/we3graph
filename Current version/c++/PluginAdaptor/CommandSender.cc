#include "CommandSender.h"
#include "Headers.h"

namespace We3Graph
{
	CommandSender::CommandSender(ServiceManager * serviceManager)
	{
		serviceManager_ = serviceManager;
	}

	void CommandSender::__sendInsertVertexCommand(Vertex * vertex)
	{
		auto position = vertex->GetPosition();
		auto parameters = new vector<string>();
		parameters->push_back(to_string(vertex->GetFullID()->GetIDinCreator()));
		parameters->push_back(to_string(position->GetX()));
		parameters->push_back(to_string(position->GetY()));
		parameters->push_back(to_string(position->GetZ()));

		auto command = new Command("InsertVertex", parameters);
		serviceManager_->__runCommand(command);
	}

	void CommandSender::__sendInsertEdgeCommand(Edge * edge)
	{
		auto parameters = new vector<string>();
		parameters->push_back(edge->GetStartVertex()->GetFullID()->ToString());
		parameters->push_back(edge->GetEndVertex()->GetFullID()->ToString());
		parameters->push_back(to_string(edge->GetFullID()->GetIDinCreator()));

		auto command = new Command("InsertEdge", parameters);
		serviceManager_->__runCommand(command);
	}

	void CommandSender::__sendBreakEdgeLineCommand(Edge * edge, int index, Point3D * position)
	{
		auto parameters = new vector<string>();
		parameters->push_back(edge->GetFullID()->ToString());
		parameters->push_back(to_string(index));
		parameters->push_back(to_string(position->GetX()));
		parameters->push_back(to_string(position->GetY()));
		parameters->push_back(to_string(position->GetZ()));

		auto command = new Command("BreakEdgeLine", parameters);
		serviceManager_->__runCommand(command);
	}

	void CommandSender::__sendRemoveVertexCommand(Vertex * vertex)
	{
		auto parameters = new vector<string>();
		parameters->push_back(vertex->GetFullID()->ToString());

		auto command = new Command("RemoveVertex", parameters);
		serviceManager_->__runCommand(command);
	}

	void CommandSender::__sendRemoveEdgeCommand(Edge * edge)
	{
		auto parameters = new vector<string>();
		parameters->push_back(edge->GetFullID()->ToString());

		auto command = new Command("RemoveEdge", parameters);
		serviceManager_->__runCommand(command);
	}

	void CommandSender::__sendRemoveBendCommand(Edge * edge, int index)
	{
		auto parameters = new vector<string>();
		parameters->push_back(edge->GetFullID()->ToString());
		parameters->push_back(to_string(index));

		auto command = new Command("RemoveBend", parameters);
		serviceManager_->__runCommand(command);
	}

	void CommandSender::__sendMoveVertexCommand(Vertex * vertex)
	{
		auto position = vertex->GetPosition();
		auto parameters = new vector<string>();
		parameters->push_back(vertex->GetFullID()->ToString());
		parameters->push_back(to_string(position->GetX()));
		parameters->push_back(to_string(position->GetY()));
		parameters->push_back(to_string(position->GetZ()));

		auto command = new Command("MoveVertex", parameters);
		serviceManager_->__runCommand(command);
	}

	void CommandSender::__sendChangeVertexRotationCommand(Vertex * vertex)
	{
		auto rotation = vertex->GetRotation();
		auto parameters = new vector<string>();
		parameters->push_back(vertex->GetFullID()->ToString());
		parameters->push_back(to_string(rotation->GetX()));
		parameters->push_back(to_string(rotation->GetY()));
		parameters->push_back(to_string(rotation->GetZ()));
		parameters->push_back(to_string(rotation->GetW()));

		auto command = new Command("ChangeVertexRotation", parameters);
		serviceManager_->__runCommand(command);
	}

	void CommandSender::__sendChangeVertexScaleCommand(Vertex * vertex)
	{
		auto scale = vertex->GetScale();
		auto parameters = new vector<string>();
		parameters->push_back(vertex->GetFullID()->ToString());
		parameters->push_back(to_string(scale));

		auto command = new Command("ChangeVertexScale", parameters);
		serviceManager_->__runCommand(command);
	}

	void CommandSender::__sendMoveBendCommand(Bend * bend)
	{
		auto position = bend->GetPosition();
		auto parameters = new vector<string>();
		parameters->push_back(bend->GetEdge()->GetFullID()->ToString());
		parameters->push_back(to_string(bend->GetIndexAtEdge()));
		parameters->push_back(to_string(position->GetX()));
		parameters->push_back(to_string(position->GetY()));
		parameters->push_back(to_string(position->GetZ()));

		auto command = new Command("MoveBend", parameters);
		serviceManager_->__runCommand(command);
	}

	void CommandSender::__sendChangeCameraPositionCommand(Point3D * position)
	{
		auto parameters = new vector<string>();
		parameters->push_back(to_string(position->GetX()));
		parameters->push_back(to_string(position->GetY()));
		parameters->push_back(to_string(position->GetZ()));

		auto command = new Command("ChangeCameraPosition", parameters);
		serviceManager_->__runCommand(command);
	}

	void CommandSender::__sendChangeCameraRotationCommand(Point4D * rotation)
	{
		auto parameters = new vector<string>();
		parameters->push_back(to_string(rotation->GetX()));
		parameters->push_back(to_string(rotation->GetY()));
		parameters->push_back(to_string(rotation->GetZ()));
		parameters->push_back(to_string(rotation->GetW()));

		auto command = new Command("ChangeCameraRotation", parameters);
		serviceManager_->__runCommand(command);
	}

	void CommandSender::__sendSetVertexPropertyCommand(Vertex * vertex, string listName,
		string key, string value, bool isRenderUpdateNeeded)
	{
		auto parameters = new vector<string>();
		parameters->push_back(vertex->GetFullID()->ToString());
		parameters->push_back(listName);
		parameters->push_back(key);
		parameters->push_back(value);
		if (isRenderUpdateNeeded)
			parameters->push_back("1");
		else
			parameters->push_back("0");

		auto command = new Command("SetVertexProperty", parameters);
		serviceManager_->__runCommand(command);
	}

	void CommandSender::__sendSetEdgePropertyCommand(Edge * edge, string listName,
		string key, string value, bool isRenderUpdateNeeded)
	{
		auto parameters = new vector<string>();
		parameters->push_back(edge->GetFullID()->ToString());
		parameters->push_back(listName);
		parameters->push_back(key);
		parameters->push_back(value);
		if (isRenderUpdateNeeded)
			parameters->push_back("1");
		else
			parameters->push_back("0");

		auto command = new Command("SetEdgeProperty", parameters);
		serviceManager_->__runCommand(command);
	}
}