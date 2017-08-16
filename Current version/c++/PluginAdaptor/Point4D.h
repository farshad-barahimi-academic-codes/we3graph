#ifndef POINT4D_H
#define POINT4D_H

#include <cstdint>

namespace We3Graph
{
	/// <summary>
	/// A class to represent a 4D point.
	/// It's main purpose is to handle quaternions.
	/// </summary>
	class Point4D
	{
	private:
		double x_;
		double y_;
		double z_;
		double w_;

	public:

		Point4D(double x, double y, double z, double w);

		void Set(double x, double y, double z, double w);

		double GetX();

		double GetY();

		double GetZ();

		double GetW();

		void SetX(double x);

		void SetY(double y);

		void SetZ(double z);

		void SetW(double w);

		double Lenght();

		Point4D * Normalize();

		Point4D * Clone();
	};
}

#endif /* POINT4D_H */