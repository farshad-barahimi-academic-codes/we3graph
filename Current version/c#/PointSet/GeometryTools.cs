using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using We3Graph;

namespace PointSet
{
    class GeometryTools
    {
        public static Point3D CrossVector(Point3D a, Point3D b)
        {
            return new Point3D(a.GetY() * b.GetZ() - b.GetY() * a.GetZ(),
                a.GetZ() * b.GetX() - b.GetZ() * a.GetX(),
                a.GetX() * b.GetY() - b.GetX() * a.GetY());
        }

        public static bool DoesIntersect(Point3D p0, Point3D p1, Point3D q0, Point3D q1)
        {
            var u = p1.Subtract(p0);
            var v = q1.Subtract(q0);
            var w0 = p0.Subtract(q0);

            double a = u.Dot(u);
            double b = u.Dot(v);
            double c = v.Dot(v);
            double d = u.Dot(w0);
            double e = v.Dot(w0);

            double sc, tc;

            double eps = 1e-6;

            double denum = a * c - b * b;
            if (Math.Abs(denum) > eps)
            {
                sc = (b * e - c * d) / denum;
                tc = (a * e - b * d) / denum;
            }
            else
            {
                sc = 0;
                tc = d / b;
            }

            Point3D pc = p0.Add(u.MultiplyScalar(sc));
            Point3D qc = q0.Add(v.MultiplyScalar(tc));

            Point3D result = pc.Subtract(qc);

            if (result.Length() < 1e-6)
                return true;
            else
                return false;
        }

        public static bool IsOnTheLine(Point3D p, Point3D a, Point3D b)
        {
            var r1 = (p.GetX() - a.GetX()) / (b.GetX() - a.GetX());
            var r2 = (p.GetX() - a.GetX()) / (b.GetX() - a.GetX());
            var r3 = (p.GetX() - a.GetX()) / (b.GetX() - a.GetX());

            var epsilon = 1e-6;

            if (Math.Abs(r2 - r1) > epsilon)
                return false;

            if (Math.Abs(r3 - r2) > epsilon)
                return false;

            if (Math.Abs(r3 - r1) > epsilon)
                return false;

            if (p.GetX() > Math.Max(a.GetX(), b.GetX()))
                return false;

            if (p.GetY() > Math.Max(a.GetY(), b.GetY()))
                return false;

            if (p.GetZ() > Math.Max(a.GetZ(), b.GetZ()))
                return false;

            if (p.GetX() < Math.Min(a.GetX(), b.GetX()))
                return false;

            if (p.GetY() < Math.Min(a.GetY(), b.GetY()))
                return false;

            if (p.GetZ() < Math.Min(a.GetZ(), b.GetZ()))
                return false;

            return true;
        }
    }
}
