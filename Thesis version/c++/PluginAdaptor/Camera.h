#ifndef CAMERA_H
#define CAMERA_H

namespace We3Graph
{
	class Graph;
	class Point3D;
	class Point4D;

	/// <summary>
	/// This class represents the camera
	/// </summary>
	class Camera
	{
	private:
		Graph * graph_;
		Point3D * position_;
		Point4D * quaternionRotation_;

	public:

		Camera(Graph * graph);

		void ChangePosition(Point3D * position);

		void __changePosition(Point3D * position);

		Point3D * GetPosition();

		void ChangeRotation(Point4D * quaternion);

		void __changeRotation(Point4D * quaternion);

		Point4D * GetRotation();
	};
}

#endif /* CAMERA_H */