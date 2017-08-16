using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace We3Graph
{
    /// <summary>
    /// This class represents an edge line.
    /// Bends break edges into edge lines
    /// </summary>
    public class EdgeLine
    {
        #region private members
        private Edge edge_;
        private Bend startBend_;
        private Bend endBend_;
        #endregion

        /// <summary>
        /// Constructor for the edge line class
        /// </summary>
        /// <param name="edge">The parent edge for the edge line</param>
        /// <param name="startBend">
        /// The bend at the beginning of the edge line.
        /// null if the start vertex of the edge is the beginning
        /// </param>
        /// <param name="endBend">
        /// The bend at the end of the edge line.
        /// null if the end vertex of the edge is the end
        /// </param>
        public EdgeLine(Edge edge, Bend startBend, Bend endBend)
        {
            edge_ = edge;
            startBend_ = startBend;
            endBend_ = endBend;
        }

        public Bend Break(Point3D position)
        {
            return null;
        }

        public Bend GetStartBend()
        {
            return startBend_;
        }

        public Bend GetEndBend()
        {
            return endBend_;
        }

        public Edge GetEdge()
        {
            return edge_;
        }

        public void SetEndBend(Bend bend)
        {
            endBend_ = bend;
        }
    }
}
