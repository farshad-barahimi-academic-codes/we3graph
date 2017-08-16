#ifndef POINT3D_H
#define POINT3D_H

#include <cstdint>

namespace We3Graph
{
	/// <summary>
	/// A class to represent a 3D point.
	/// </summary>
	class Point3D
	{
	private:
		double x_;
		double y_;
		double z_;

	public:

		Point3D(double x, double y, double z);

		void Set(double x, double y, double z);

		double GetX();

		double GetY();

		double GetZ();

		void SetX(double x);

		void SetY(double y);

		void SetZ(double z);

		double Length();

		Point3D * Subtract(Point3D * p);

		Point3D * Add(Point3D * p);

		Point3D * MultiplyScalar(double num);

		double Dot(Point3D * p);

		Point3D * Cross(Point3D * p);

		Point3D * Clone();
	};
}

#endif /* POINT3D_H */