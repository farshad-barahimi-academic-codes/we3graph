using We3Graph.IDSystem;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace We3Graph
{
    /// <summary>
    /// This class represents a vertex
    /// </summary>
    public class Vertex : IHasFullID
    {
        #region private members
        private Graph graph_;

        private Dictionary<string, Dictionary<string, string>> properties_;

        private List<Edge> edges_;
        private Point3D position_;
        private Point4D rotation_;
        private double scale_;
        private FullID fullID_;
        private int index_;
        #endregion

        #region internal functions

        internal Vertex(Graph graph, Point3D position, FullID fullID, int index)
        {
            graph_ = graph;
            properties_ = new Dictionary<string, Dictionary<string, string>>();
            edges_ = new List<Edge>();
            position_ = position;
            rotation_ = new Point4D(0, 0, 1, 1);
            scale_ = 1;
            fullID_ = fullID;
            index_ = index;
        }

        internal void __setIndex(int index)
        {
            this.index_ = index;
        }

        internal Edge __connectTo(Vertex endVertex, FullID edgeFullID)
        {
            var edge = new Edge(this, endVertex, edgeFullID, graph_);
            graph_.__getEdgesDictionary().Add(edge);
            edges_.Add(edge);
            endVertex.edges_.Add(edge);

            return edge;
        }

        internal void __move(Point3D position)
        {
            this.position_ = position;
        }

        internal void __setRotation(Point4D rotation)
        {
            this.rotation_ = rotation;
        }

        internal void __setScale(double scale)
        {
            this.scale_ = scale;
        }

        internal void __setProperty(string listName, string key, string value)
        {
            if (!properties_.ContainsKey(listName))
                properties_[listName] = new Dictionary<string, string>();

            if (value == "")
                properties_[listName].Remove(key);
            else
                properties_[listName][key] = value;
        }

        #endregion

        #region Public functions

        public Edge ConnectTo(Vertex endVertex)
        {
            int edgeClientID = graph_.__getClientID();
            int edgeIDinCreator = graph_.__getLastCreatedEdgeID() + 1;
            graph_.__setLastCreatedEdgeID(edgeIDinCreator);

            var edge = __connectTo(endVertex, new FullID(edgeClientID, edgeIDinCreator));

            graph_.__getCommandSender().__sendInsertEdgeCommand(edge);

            return edge;
        }

        public void Move(Point3D position)
        {
            __move(position);
            graph_.__getCommandSender().__sendMoveVertexCommand(this);
        }

        public void SetRotation(Point4D rotation)
        {
            __setRotation(rotation);
            graph_.__getCommandSender().__sendChangeVertexRotationCommand(this);
        }

        public void SetScale(double scale)
        {
            __setScale(scale);
            graph_.__getCommandSender().__sendChangeVertexScaleCommand(this);
        }

        public void Remove()
        {
            graph_.__removeVertex(this);
            graph_.__getCommandSender().__sendRemoveVertexCommand(this);
        }

        public FullID GetFullID()
        {
            return fullID_;
        }

        public int GetIndex()
        {
            return index_;
        }

        public Point3D GetPosition()
        {
            return position_;
        }

        public Point4D GetRotation()
        {
            return rotation_;
        }

        public double GetScale()
        {
            return scale_;
        }

        public List<Edge> GetEdges()
        {
            return edges_;
        }

        public List<Vertex> GetAdjacentVertices(bool isDirected = false)
        {
            List<Vertex> result = new List<Vertex>();
            foreach (var edge in edges_)
            {
                var startVertex = edge.GetStartVertex();
                var endVertex = edge.GetEndVertex();
                if (startVertex.GetFullID() == fullID_)
                    result.Add(endVertex);
                else if (endVertex.GetFullID() == fullID_ && !isDirected)
                    result.Add(startVertex);
            }
            return result;
        }

        /// <summary>
        /// Gets the value for a custom property of a vertex specified by
        /// a list name and a key
        /// </summary>
        /// <param name="listName">
        /// The list name. Use 'None' if there is no list.
        /// </param>
        /// <param name="key">The key for the property.</param>
        /// <returns>null if not found</returns>
        public string GetPropertyValue(string listName, string key)
        {
            if (!properties_.ContainsKey(listName))
                return null;
            if (!properties_[listName].ContainsKey(key))
                return null;

            return properties_[listName][key];
        }

        /// <summary>
        /// Gets the list for a custom property of a vertex specified by a list name
        /// </summary>
        /// <param name="listName">The list name.</param>
        /// <returns>null if not found</returns>
        public Dictionary<string, string> GetPropertyList(string listName)
        {
            if (properties_.ContainsKey(listName))
                return properties_[listName];
            else
                return null;
        }

        /// <summary>
        /// Updates the value for a custom property of a vertex specified by
        /// a list name and a key
        /// </summary>
        /// <param name="listName">
        /// The list name. Will be created if doesn't exist.
        /// </param>
        /// <param name="key">The key for the property.</param>
        /// <param name="value">
        /// The value for the property. An empty value indicates removing.
        /// </param>
        /// <param name="isRenderUpdateNeeded">
        /// Whether this change requires an update in rendering
        /// </param>
        public void SetProperty(string listName, string key, string value, bool isRenderUpdateNeeded)
        {
            __setProperty(listName, key, value);
            graph_.__getCommandSender().__sendSetVertexPropertyCommand(this,
                listName, key, value, isRenderUpdateNeeded);
        }

        public bool IsConnectedTo(Vertex vertex)
        {
            foreach (Edge edge in edges_)
                if (edge.GetStartVertex().GetFullID() == vertex.GetFullID() ||
                    edge.GetEndVertex().GetFullID() == vertex.GetFullID())
                    return true;

            return false;
        }

        #endregion
    }
}
