using We3Graph.IDSystem;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace We3Graph
{
    /// <summary>
    /// This class processes incoming commands and make necessary actions.
    /// </summary>
    internal class CommandProcessor
    {
        private Graph graph_;

        internal CommandProcessor(Graph graph)
        {
            graph_ = graph;
        }

        internal void __processCommand(Command command)
        {
            string name = command.GetName();

            switch (name)
            {
                case "InsertVertex":
                    processInsertVertexCommand(command);
                    break;
                case "InsertEdge":
                    processInsertEdgeCommand(command);
                    break;
                case "BreakEdgeLine":
                    processBreakEdgeLineCommand(command);
                    break;
                case "RemoveVertex":
                    processRemoveVertexCommand(command);
                    break;
                case "RemoveEdge":
                    processRemoveEdgeCommand(command);
                    break;
                case "RemoveBend":
                    processRemoveBendCommand(command);
                    break;
                case "MoveVertex":
                    processMoveVertexCommand(command);
                    break;
                case "ChangeVertexScale":
                    processChangeVertexScaleCommand(command);
                    break;
                case "ChangeVertexRotation":
                    processChangeVertexRotationCommand(command);
                    break;
                case "MoveBend":
                    processMoveBendCommand(command);
                    break;
                case "ChangeCameraPosition":
                    processChangeCameraPositionCommand(command);
                    break;
                case "ChangeCameraRotation":
                    processChangeCameraRotationCommand(command);
                    break;
                case "SetVertexProperty":
                    processSetVertexPropertyCommand(command);
                    break;
                case "SetEdgeProperty":
                    processSetEdgePropertyCommand(command);
                    break;
            }
        }

        private void processInsertVertexCommand(Command command)
        {
            var parameters = command.GetParameters();
            var commandClientID = command.__getClientID();


            var position = new Point3D(double.Parse(parameters[1]),
                            double.Parse(parameters[2]), double.Parse(parameters[3]));
            var vertexFullID = new FullID(commandClientID, int.Parse(parameters[0]));
            Vertex insertedVertex = graph_.__insertVertex(position, vertexFullID);
            if (graph_.IsLoading() && commandClientID == graph_.__getClientID())
                graph_.__setLastCreatedVertexID(vertexFullID.GetIDinCreator());

            graph_.__raiseVertexAddedEvent(insertedVertex);
        }

        private void processInsertEdgeCommand(Command command)
        {
            var parameters = command.GetParameters();
            var commandClientID = command.__getClientID();
            var verticesDictionary = graph_.__getVerticesDictionary();

            var fromVertex = verticesDictionary.Find(FullID.FromString(parameters[0]));
            var endVertex = verticesDictionary.Find(FullID.FromString(parameters[1]));

            if (fromVertex == null || endVertex == null)
                return;

            if (fromVertex.IsConnectedTo(endVertex))
                return;

            var edgeFullID = new FullID(commandClientID, int.Parse(parameters[2]));

            Edge edge = fromVertex.__connectTo(endVertex, edgeFullID);
            if (graph_.IsLoading() && commandClientID == graph_.__getClientID())
                graph_.__setLastCreatedEdgeID(edgeFullID.GetIDinCreator());

            graph_.__raiseEdgeAddedEvent(edge);
        }

        private void processBreakEdgeLineCommand(Command command)
        {
            var parameters = command.GetParameters();
            var edgesDictionary = graph_.__getEdgesDictionary();

            var edge = edgesDictionary.Find(FullID.FromString(parameters[0]));
            if (edge == null)
                return;

            var position = new Point3D(double.Parse(parameters[2]),
                double.Parse(parameters[3]), double.Parse(parameters[4]));

            var bend = edge.__breakEdgeLine(position, int.Parse(parameters[1]));

            graph_.__raiseBendAddedEvent(bend);
        }

        private void processRemoveVertexCommand(Command command)
        {
            var parameters = command.GetParameters();
            var verticesDictionary = graph_.__getVerticesDictionary();

            var vertex = verticesDictionary.Find(FullID.FromString(parameters[0]));

            graph_.__removeVertex(vertex);

            graph_.__raiseVertexRemovedEvent(vertex);
        }

        private void processRemoveEdgeCommand(Command command)
        {
            var parameters = command.GetParameters();
            var edgesDictionary = graph_.__getEdgesDictionary();

            var edge = edgesDictionary.Find(FullID.FromString(parameters[0]));
            graph_.__removeEdge(edge);

            graph_.__raiseEdgeRemovedEvent(edge);
        }

        private void processRemoveBendCommand(Command command)
        {
            var parameters = command.GetParameters();
            var edgesDictionary = graph_.__getEdgesDictionary();

            var edge = edgesDictionary.Find(FullID.FromString(parameters[0]));

            if (edge == null)
                return;

            var bend = edge.__removeBend(int.Parse(parameters[1]));

            graph_.__raiseBendRemovedEvent(bend);
        }

        private void processMoveVertexCommand(Command command)
        {
            var parameters = command.GetParameters();
            var verticesDictionary = graph_.__getVerticesDictionary();

            var vertex = verticesDictionary.Find(FullID.FromString(parameters[0]));

            if (vertex == null)
                return;

            var position = new Point3D(double.Parse(parameters[1]),
                            double.Parse(parameters[2]), double.Parse(parameters[3]));

            vertex.__move(position);

            graph_.__raiseVertexMovedEvent(vertex);
        }

        private void processChangeVertexRotationCommand(Command command)
        {
            var parameters = command.GetParameters();
            var verticesDictionary = graph_.__getVerticesDictionary();

            var vertex = verticesDictionary.Find(FullID.FromString(parameters[0]));

            if (vertex == null)
                return;

            var rotation = new Point4D(
                double.Parse(parameters[1]), double.Parse(parameters[2]),
                double.Parse(parameters[3]), double.Parse(parameters[4]));

            vertex.__setRotation(rotation);

            graph_.__raiseVertexRotationChangedEvent(vertex);
        }

        private void processChangeVertexScaleCommand(Command command)
        {
            var parameters = command.GetParameters();
            var verticesDictionary = graph_.__getVerticesDictionary();

            var vertex = verticesDictionary.Find(FullID.FromString(parameters[0]));

            if (vertex == null)
                return;

            var scale = double.Parse(parameters[1]);

            vertex.__setScale(scale);

            graph_.__raiseVertexScaleChangedEvent(vertex);
        }

        private void processMoveBendCommand(Command command)
        {
            var parameters = command.GetParameters();
            var edgesDictionary = graph_.__getEdgesDictionary();

            var edge = edgesDictionary.Find(FullID.FromString(parameters[0]));
            if (edge == null)
                return;

            var position = new Point3D(double.Parse(parameters[2]),
                double.Parse(parameters[3]), double.Parse(parameters[4]));

            int index = int.Parse(parameters[1]);
            var bend = edge.GetEdgeLines()[index].GetEndBend();
            bend.__move(position);

            graph_.__raiseBendMovedEvent(bend);
        }

        private void processChangeCameraPositionCommand(Command command)
        {
            var parameters = command.GetParameters();

            var position = new Point3D(double.Parse(parameters[0]),
                double.Parse(parameters[1]), double.Parse(parameters[2]));
            graph_.GetCamera().__changePosition(position);

            graph_.__raiseCameraChangedEvent();
        }

        private void processChangeCameraRotationCommand(Command command)
        {
            var parameters = command.GetParameters();

            var quaternion = new Point4D(double.Parse(parameters[0]),
                double.Parse(parameters[1]), double.Parse(parameters[2]),
                double.Parse(parameters[3]));

            graph_.GetCamera().__changeRotation(quaternion);

            graph_.__raiseCameraChangedEvent();
        }

        private void processSetVertexPropertyCommand(Command command)
        {
            var parameters = command.GetParameters();
            var verticesDictionary = graph_.__getVerticesDictionary();

            var vertex = verticesDictionary.Find(FullID.FromString(parameters[0]));

            if (vertex == null)
                return;

            vertex.__setProperty(parameters[1], parameters[2], parameters[3]);

            graph_.__raiseVertexPropertyChangedEvent(vertex, parameters[1], parameters[2]);
        }

        private void processSetEdgePropertyCommand(Command command)
        {
            var parameters = command.GetParameters();
            var edgesDictionary = graph_.__getEdgesDictionary();

            var edge = edgesDictionary.Find(FullID.FromString(parameters[0]));

            if (edge == null)
                return;

            edge.__setProperty(parameters[1], parameters[2], parameters[3]);

            graph_.__raiseEdgePropertyChangedEvent(edge, parameters[1], parameters[2]);
        }
    }
}
