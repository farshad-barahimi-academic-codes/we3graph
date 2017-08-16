using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace We3Graph
{
    /// <summary>
    /// This class represents a bend.
    /// Bends break edges into edge lines.
    /// </summary>
    public class Bend
    {
        private Point3D position_;
        private Edge edge_;
        private Graph graph_;

        public Bend(Point3D position, Edge edge, Graph graph)
        {
            position_ = position;
            edge_ = edge;
            graph_ = graph;
        }

        public void Move(Point3D position)
        {
            __move(position);
            graph_.__getCommandSender().__sendMoveBendCommand(this);
        }

        internal void __move(Point3D position)
        {
            this.position_ = position;
        }

        public void Remove()
        {
            int index = GetIndexAtEdge();
            edge_.RemoveBend(index);
        }

        public Point3D GetPosition()
        {
            return position_;
        }

        public Edge GetEdge()
        {
            return edge_;
        }

        public int GetIndexAtEdge()
        {
            var edgeLines = edge_.GetEdgeLines();
            for (int i = 0; i < edgeLines.Count; i++)
                if (edgeLines[i].GetEndBend() == this)
                    return i;

            return -1;
        }
    }
}
