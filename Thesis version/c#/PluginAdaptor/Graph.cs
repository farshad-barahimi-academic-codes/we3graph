using We3Graph.IDSystem;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace We3Graph
{
    /// <summary>
    /// This class represents a graph.
    /// </summary>
    public class Graph
    {
        #region private fields
        private int clientID_;
        private FullIDHashDictionary<Vertex> verticesDictionary_;
        private FullIDHashDictionary<Edge> edgesDictionary_;
        private Camera camera_;
        private int lastCreatedVertexID_;
        private int lastCreatedEdgeID_;
        private bool isLoading_;
        private ServiceManager serviceManager_;
        private CommandSender commandSender_;
        #endregion

        #region internal functions

        internal CommandSender __getCommandSender()
        {
            return commandSender_;
        }

        internal int __getClientID()
        {
            return clientID_;
        }

        internal int __getLastCreatedEdgeID()
        {
            return lastCreatedEdgeID_;
        }

        internal void __setLastCreatedEdgeID(int edgeID)
        {
            lastCreatedEdgeID_ = edgeID;
        }

        internal void __setLastCreatedVertexID(int vertexID)
        {
            lastCreatedVertexID_ = vertexID;
        }

        internal FullIDHashDictionary<Edge> __getEdgesDictionary()
        {
            return edgesDictionary_;
        }

        internal FullIDHashDictionary<Vertex> __getVerticesDictionary()
        {
            return verticesDictionary_;
        }

        internal Vertex __insertVertex(Point3D position, FullID fullID)
        {
            var vertex = new Vertex(this, position, fullID,
                verticesDictionary_.GetAllItems().Count);
            verticesDictionary_.Add(vertex);

            return vertex;
        }

        internal void __removeEdge(Edge edge)
        {
            if (edge == null)
                return;

            edgesDictionary_.Remove(edge.GetFullID());

            var startVertexEdges = edge.GetStartVertex().GetEdges();
            var endVertexEdges = edge.GetEndVertex().GetEdges();

            int i;
            int index = -1;
            for (i = 0; i < startVertexEdges.Count; i++)
                if (startVertexEdges[i].GetFullID() == edge.GetFullID())
                    index = i;
            if (index != -1)
                startVertexEdges.RemoveAt(index);

            index = -1;
            for (i = 0; i < endVertexEdges.Count; i++)
                if (endVertexEdges[i].GetFullID() == edge.GetFullID())
                    index = i;
            if (index != -1)
                endVertexEdges.RemoveAt(index);
        }

        internal void __removeVertex(Vertex vertex)
        {
            if (vertex == null)
                return;

            int index = vertex.GetIndex();
            var vertices = GetVertices();
            for (int i = index + 1; i < vertices.Count; i++)
                vertices[i].__setIndex(vertices[i].GetIndex() - 1);

            verticesDictionary_.Remove(vertex.GetFullID());

            var edges = vertex.GetEdges();
            var edgesCopy = new List<Edge>();
            foreach (var edge in edges)
                edgesCopy.Add(edge);

            foreach (var edge in edgesCopy)
                __removeEdge(edge);


        }

        #endregion

        #region internal event raise functions
        internal void __raiseVertexAddedEvent(Vertex vertex)
        {
            if (VertexAdded != null)
                VertexAdded(vertex);
        }

        internal void __raiseVertexMovedEvent(Vertex vertex)
        {
            if (VertexMoved != null)
                VertexMoved(vertex);
        }

        internal void __raiseVertexRotationChangedEvent(Vertex vertex)
        {
            if (VertexRotationChanged != null)
                VertexRotationChanged(vertex);
        }

        internal void __raiseVertexScaleChangedEvent(Vertex vertex)
        {
            if (VertexScaleChanged != null)
                VertexScaleChanged(vertex);
        }

        internal void __raiseVertexRemovedEvent(Vertex vertex)
        {
            if (VertexRemoved != null)
                VertexRemoved(vertex);
        }

        internal void __raiseVertexPropertyChangedEvent(Vertex vertex,
            string listName, string key)
        {
            if (VertexPropertyChanged != null)
                VertexPropertyChanged(vertex, listName, key);
        }

        internal void __raiseEdgeAddedEvent(Edge edge)
        {
            if (EdgeAdded != null)
                EdgeAdded(edge);
        }

        internal void __raiseEdgeRemovedEvent(Edge edge)
        {
            if (EdgeRemoved != null)
                EdgeRemoved(edge);
        }

        internal void __raiseEdgePropertyChangedEvent(Edge edge,
            string listName, string key)
        {
            if (EdgePropertyChanged != null)
                EdgePropertyChanged(edge, listName, key);
        }

        internal void __raiseBendAddedEvent(Bend bend)
        {
            if (BendAdded != null)
                BendAdded(bend);
        }

        internal void __raiseBendMovedEvent(Bend bend)
        {
            if (BendMoved != null)
                BendMoved(bend);
        }

        internal void __raiseBendRemovedEvent(Bend bend)
        {
            if (BendRemoved != null)
                BendRemoved(bend);
        }

        internal void __raiseCameraChangedEvent()
        {
            if (CameraChanged != null)
                CameraChanged(camera_);
        }

        internal void __raiseGraphChangedEvent()
        {
            if (GraphChanged != null)
                GraphChanged(this);
        }

        #endregion

        #region public events

        public event VertexEventHandler VertexAdded;
        public event VertexEventHandler VertexMoved;
        public event VertexEventHandler VertexRotationChanged;
        public event VertexEventHandler VertexScaleChanged;
        public event VertexEventHandler VertexRemoved;
        public event VertexPropertyEventHandler VertexPropertyChanged;

        public event EdgeEventHandler EdgeAdded;
        public event EdgeEventHandler EdgeRemoved;
        public event EdgePropertyEventHandler EdgePropertyChanged;

        public event BendEventHandler BendAdded;
        public event BendEventHandler BendMoved;
        public event BendEventHandler BendRemoved;

        public event CameraEventHandler CameraChanged;

        public event GraphEventHandler GraphChanged;

        #endregion

        #region public functions

        internal Graph(SystemManager systemManager, int graphID,
            bool waitForLoadingToFinish = true, bool receiveCommands = true)
        {
            verticesDictionary_ = new FullIDHashDictionary<Vertex>();
            edgesDictionary_ = new FullIDHashDictionary<Edge>();
            lastCreatedVertexID_ = 0;
            lastCreatedEdgeID_ = 0;
            isLoading_ = true;
            camera_ = new Camera(this);

            serviceManager_ = new ServiceManager(systemManager, graphID);
            clientID_ = serviceManager_.__getClientID();
            serviceManager_.__newCommandsReceived += newCommandsReceived;
            serviceManager_.__graphLoaded += graphLoaded;

            commandSender_ = new CommandSender(serviceManager_);

            serviceManager_.__start(receiveCommands);

            if (waitForLoadingToFinish)
            {
                while (IsLoading())
                    Thread.Sleep(20);
            }

        }

        public List<Vertex> GetVertices()
        {
            return verticesDictionary_.GetAllItems();
        }

        public Camera GetCamera()
        {
            return camera_;
        }

        public Vertex AddVertex(Point3D position)
        {
            int IDinCreator = ++lastCreatedVertexID_;
            var fullID = new FullID(clientID_, IDinCreator);

            var vertex = __insertVertex(position, fullID);

            commandSender_.__sendInsertVertexCommand(vertex);

            return vertex;
        }

        public bool IsAllCommandsSent()
        {
            return serviceManager_.__isAllCommandsSent();
        }

        public bool IsLoading()
        {
            return isLoading_;
        }

        public void Finish(bool waitForAllCommandsToBeSent = true)
        {
            if (waitForAllCommandsToBeSent)
            {
                while (!serviceManager_.__isAllCommandsSent())
                    Thread.Sleep(20);
            }

            serviceManager_.__stop();
        }

        #endregion

        #region private functions

        private void graphLoaded()
        {
            isLoading_ = false;
        }

        private void newCommandsReceived(List<Command> commands)
        {
            var commandProcesor = new CommandProcessor(this);
            foreach (var command in commands)
                commandProcesor.__processCommand(command);

            if (commands.Count > 0)
                __raiseGraphChangedEvent();
        }

        #endregion
    }
}
