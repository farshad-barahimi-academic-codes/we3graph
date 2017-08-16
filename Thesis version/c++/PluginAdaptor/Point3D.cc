#include "Point3D.h"
#include "Headers.h"

#include<cmath>
using namespace std;

namespace We3Graph
{
	Point3D::Point3D(double x, double y, double z)
	{
		Set(x, y, z);
	}

	void Point3D::Set(double x, double y, double z)
	{
		x_ = x;
		y_ = y;
		z_ = z;
	}

	double Point3D::GetX()
	{
		return x_;
	}

	double Point3D::GetY()
	{
		return y_;
	}

	double Point3D::GetZ()
	{
		return z_;
	}

	void Point3D::SetX(double x)
	{
		x_ = x;
	}

	void Point3D::SetY(double y)
	{
		y_ = y;
	}

	void Point3D::SetZ(double z)
	{
		z_ = z;
	}

	double Point3D::Length()
	{
		return sqrt(x_ * x_ + y_ * y_ + z_ * z_);
	}

	Point3D * Point3D::Subtract(Point3D * p)
	{
		return new Point3D(x_ - p->GetX(), y_ - p->GetY(), z_ - p->GetZ());
	}

	Point3D * Point3D::Add(Point3D * p)
	{
		return new Point3D(x_ + p->GetX(), y_ + p->GetY(), z_ + p->GetZ());
	}

	Point3D * Point3D::MultiplyScalar(double num)
	{
		return new Point3D(x_ * num, y_ * num, z_ * num);
	}

	double Point3D::Dot(Point3D * p)
	{
		return x_ * p->GetX() + y_ * p->GetY() + z_ * p->GetZ();
	}

	Point3D * Point3D::Cross(Point3D * p)
	{
		double x = y_ * p->GetZ() - z_ * p->GetY();
		double y = z_ * p->GetX() - x_ * p->GetZ();
		double z = x_ * p->GetY() - y_ * p->GetX();

		return new Point3D(x, y, z);
	}

	Point3D * Point3D::Clone()
	{
		return new Point3D(x_, y_, z_);
	}
}