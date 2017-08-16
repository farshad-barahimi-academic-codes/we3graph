using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace We3Graph
{
    /// <summary>
    /// A class to represent a 3D point.
    /// </summary>
    public class Point3D
    {
        private double x_;
        private double y_;
        private double z_;

        public Point3D(double x, double y, double z)
        {
            Set(x, y, z);
        }

        public void Set(double x, double y, double z)
        {
            x_ = x;
            y_ = y;
            z_ = z;
        }

        public double GetX()
        {
            return x_;
        }

        public double GetY()
        {
            return y_;
        }

        public double GetZ()
        {
            return z_;
        }

        public void SetX(double x)
        {
            this.x_ = x;
        }

        public void SetY(double y)
        {
            this.y_ = y;
        }

        public void SetZ(double z)
        {
            this.z_ = z;
        }

        public double Length()
        {
            return Math.Sqrt(x_ * x_ + y_ * y_ + z_ * z_);
        }

        public Point3D Subtract(Point3D p)
        {
            return new Point3D(x_ - p.GetX(), y_ - p.GetY(), z_ - p.GetZ());
        }

        public Point3D Add(Point3D p)
        {
            return new Point3D(x_ + p.GetX(), y_ + p.GetY(), z_ + p.GetZ());
        }

        public Point3D MultiplyScalar(double num)
        {
            return new Point3D(x_ * num, y_ * num, z_ * num);
        }

        public double Dot(Point3D p)
        {
            return x_ * p.GetX() + y_ * p.GetY() + z_ * p.GetZ();
        }

        public Point3D Cross(Point3D p)
        {
            double x = y_ * p.GetZ() - z_ * p.GetY();
            double y = z_ * p.GetX() - x_ * p.GetZ();
            double z = x_ * p.GetY() - y_ * p.GetX();

            return new Point3D(x, y, z);
        }

        public Point3D Clone()
        {
            return new Point3D(x_, y_, z_);
        }
    }
}
