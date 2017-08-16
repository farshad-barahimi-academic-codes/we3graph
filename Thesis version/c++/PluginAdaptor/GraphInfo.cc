#include "GraphInfo.h"
#include "Headers.h"

namespace We3Graph
{
	int GraphInfo::GetID()
	{
		return id_;
	}

	string GraphInfo::GetName()
	{
		return name_;
	}

	string GraphInfo::ToString()
	{
		return name_;
	}

	string GraphInfo::GetRenderEngineGUID()
	{
		return renderEngineGUID_;
	}

	int GraphInfo::GetCommandSetVersion()
	{
		return commandSetVersion_;
	}

	GraphInfo::GraphInfo(int id, string name, int commandSetVersion, string renderEngineGUID)
	{
		id_ = id;
		name_ = name;
		commandSetVersion_ = commandSetVersion;
		renderEngineGUID_ = renderEngineGUID;
	}
}