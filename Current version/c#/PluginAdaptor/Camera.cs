using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace We3Graph
{
    /// <summary>
    /// This class represents the camera
    /// </summary>
    public class Camera
    {
        private Graph graph_;
        private Point3D position_;
        private Point4D quaternionRotation_;

        internal Camera(Graph graph)
        {
            graph_ = graph;
            position_ = new Point3D(0, 0, 0);
            quaternionRotation_ = new Point4D(0, 0, 0, 0);
        }

        public void ChangePosition(Point3D position)
        {
            __changePosition(position);
            graph_.__getCommandSender().__sendChangeCameraPositionCommand(position);
        }

        internal void __changePosition(Point3D position)
        {
            position_ = position;
        }

        public Point3D GetPosition()
        {
            return position_;
        }

        public void ChangeRotation(Point4D quaternion)
        {
            __changeRotation(quaternion);
            graph_.__getCommandSender().__sendChangeCameraRotationCommand(quaternion);
        }

        internal void __changeRotation(Point4D quaternion)
        {
            this.quaternionRotation_ = quaternion;
        }

        public Point4D GetRotation()
        {
            return quaternionRotation_;
        }

    }
}
