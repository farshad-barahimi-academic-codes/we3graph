using We3Graph.IDSystem;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace We3Graph
{
    /// <summary>
    /// This class represents an edge.
    /// </summary>
    public class Edge : IHasFullID
    {
        #region private members
        private Dictionary<string, Dictionary<string, string>> properties_;

        private Vertex startVertex_;
        private Vertex endVertex_;
        private List<EdgeLine> edgeLines_;
        private FullID fullID_;
        private Graph graph_;
        #endregion

        #region Internal functions
        internal void __setProperty(string listName, string key, string value)
        {

            if (!properties_.ContainsKey(listName))
                properties_[listName] = new Dictionary<string, string>();

            if (value == "")
                properties_[listName].Remove(key);
            else
                properties_[listName][key] = value;
        }

        internal Bend __breakEdgeLine(Point3D position, int index)
        {
            var newBend = new Bend(position, this, graph_);
            var edgeLine = edgeLines_[index];
            var edgeLine1 = new EdgeLine(this, newBend, edgeLine.GetEndBend());
            edgeLine.SetEndBend(newBend);

            edgeLines_.Insert(index + 1, edgeLine1);

            return newBend;
        }

        internal Bend __removeBend(int index)
        {
            var beforeEdgeLine = edgeLines_[index];
            var afterEdgeLine = edgeLines_[index + 1];
            var removedBend = beforeEdgeLine.GetEndBend();

            beforeEdgeLine.SetEndBend(afterEdgeLine.GetEndBend());
            edgeLines_.RemoveAt(index + 1);

            return removedBend;
        }

        internal Edge(Vertex startVertex, Vertex endVertex, FullID fullID, Graph graph)
        {
            startVertex_ = startVertex;
            endVertex_ = endVertex;
            edgeLines_ = new List<EdgeLine>();
            edgeLines_.Add(new EdgeLine(this, null, null));
            fullID_ = fullID;
            graph_ = graph;
            properties_ = new Dictionary<string, Dictionary<string, string>>();
        }

        #endregion

        #region Public functions

        public void Remove()
        {
            graph_.__removeEdge(this);
            graph_.__getCommandSender().__sendRemoveEdgeCommand(this);
        }

        public Vertex GetStartVertex()
        {
            return startVertex_;
        }

        public Vertex GetEndVertex()
        {
            return endVertex_;
        }

        public List<EdgeLine> GetEdgeLines()
        {
            return edgeLines_;
        }

        public List<Bend> GetBends()
        {
            List<Bend> result = new List<Bend>();
            foreach (var edgeLine in edgeLines_)
                if (edgeLine.GetStartBend() != null)
                    result.Add(edgeLine.GetStartBend());
            return result;
        }

        /// <summary>
        /// Gets the value for a custom property of an edge specified by 
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
        /// Gets the list for a custom property of an edge specified by a list name
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
        /// Updates the value for a custom property of an edge specified by 
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
            graph_.__getCommandSender().__sendSetEdgePropertyCommand(this, listName, key, value, isRenderUpdateNeeded);
        }

        public FullID GetFullID()
        {
            return fullID_;
        }

        public Bend BreakEdgeLine(Point3D position, int index)
        {
            var bend = __breakEdgeLine(position, index);

            graph_.__getCommandSender().__sendBreakEdgeLineCommand(this, index, position);

            return bend;
        }

        public Bend RemoveBend(int index)
        {
            var bend = __removeBend(index);

            graph_.__getCommandSender().__sendRemoveBendCommand(this, index);

            return bend;
        }

        #endregion

    }
}
