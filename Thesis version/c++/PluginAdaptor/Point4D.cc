#include "Point4D.h"
#include "Headers.h"

#include <cmath>

namespace We3Graph
{
	Point4D::Point4D(double x, double y, double z, double w)
	{
		Set(x, y, z, w);
	}

	void Point4D::Set(double x, double y, double z, double w)
	{
		x_ = x;
		y_ = y;
		z_ = z;
		w_ = w;
	}

	double Point4D::GetX()
	{
		return x_;
	}

	double Point4D::GetY()
	{
		return y_;
	}

	double Point4D::GetZ()
	{
		return z_;
	}

	double Point4D::GetW()
	{
		return w_;
	}

	void Point4D::SetX(double x)
	{
		x_ = x;
	}

	void Point4D::SetY(double y)
	{
		y_ = y;
	}

	void Point4D::SetZ(double z)
	{
		z_ = z;
	}

	void Point4D::SetW(double w)
	{
		w_ = w;
	}

	double Point4D::Lenght()
	{
		return sqrt(x_ * x_ + y_ * y_ + z_ * z_ + w_ * w_);
	}

	Point4D * Point4D::Normalize()
	{
		double lenght = Lenght();
		x_ = x_ / lenght;
		y_ = y_ / lenght;
		z_ = z_ / lenght;
		w_ = w_ / lenght;
		return this;
	}

	Point4D * Point4D::Clone()
	{
		return new Point4D(x_, y_, z_, w_);
	}
}