using OpenTK;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OculusLeap
{
    class LeapHelper
    {
        private float leapOffsetX_;
        private float leapOffsetY_;
        private float leapOffsetZ_;

        public LeapHelper(float leapOffsetX, float leapOffsetY, float leapOffsetZ)
        {
            leapOffsetX_ = leapOffsetX;
            leapOffsetY_ = leapOffsetY;
            leapOffsetZ_ = leapOffsetZ;
        }
        public bool GetTargetPoint(Leap.Vector start, Leap.Vector direction,
            out int x, out int y)
        {
            var planeNormal = new Leap.Vector(0, 0, 1);
            var aPointInPlane = new Leap.Vector(0, 0, 0);



            start.z += leapOffsetZ_;
            start.y += leapOffsetY_;
            start.x += leapOffsetX_;

            double epsilon = 1e-8;

            float denom = direction.Dot(planeNormal);
            if (Math.Abs(denom) < epsilon)
            {
                x = 0; y = 0;
                return false;
            }

            var diff = new Leap.Vector(aPointInPlane.x - start.x,
                aPointInPlane.y - start.y, aPointInPlane.z - start.z);

            float distance = diff.Dot(planeNormal) / denom;

            var v2 = new Leap.Vector(distance * direction.x + start.x,
                distance * direction.y + start.y,
                distance * direction.z + start.z);

            float width = 475;
            float height = 270;

            float halfWidth = width / 2;
            float halfHeight = height / 2;

            x = millimeterToPixel(v2.x + halfWidth);
            y = millimeterToPixel(height - v2.y);

            return true;
        }

        private int millimeterToPixel(float millimeters)
        {
            int dpi = 96;
            return (int)((millimeters * dpi) / 25.4);
        }

        public Quaternion QuatrnionBetweenTwoVectors(Leap.Vector v1, Leap.Vector v2)
        {
            var v1n = v1.Normalized;
            var v2n = v2.Normalized;
            var angle = (float)Math.Acos(v1n.Dot(v2n));
            var axis = v1n.Cross(v2n).Normalized;
            return Quaternion.FromAxisAngle(new Vector3(-axis.x, axis.y, axis.z), angle);
        }
    }
}
