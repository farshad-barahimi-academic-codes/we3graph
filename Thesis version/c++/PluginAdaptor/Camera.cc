#include "Camera.h"
#include "Headers.h"

namespace We3Graph
{
	Camera::Camera(Graph * graph)
	{
		graph_ = graph;
		position_ = new Point3D(0, 0, 0);
		quaternionRotation_ = new Point4D(0, 0, 0, 0);
	}

	void Camera::ChangePosition(Point3D * position)
	{
		__changePosition(position);
		graph_->__getCommandSender()->__sendChangeCameraPositionCommand(position);
	}

	void Camera::__changePosition(Point3D * position)
	{
		position_ = position;
	}

	Point3D * Camera::GetPosition()
	{
		return position_;
	}

	void Camera::ChangeRotation(Point4D * quaternion)
	{
		__changeRotation(quaternion);
		graph_->__getCommandSender()->__sendChangeCameraRotationCommand(quaternion);
	}

	void Camera::__changeRotation(Point4D * quaternion)
	{
		quaternionRotation_ = quaternion;
	}

	Point4D * Camera::GetRotation()
	{
		return quaternionRotation_;
	}
}