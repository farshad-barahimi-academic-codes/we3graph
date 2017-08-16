using We3Graph.IDSystem;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace We3Graph
{
    /// <summary>
    /// This class helps sending different command to the server
    /// </summary>
    internal class CommandSender
    {
        private ServiceManager serviceManager_;
        internal CommandSender(ServiceManager serviceManager)
        {
            serviceManager_ = serviceManager;
        }
        internal void __sendInsertVertexCommand(Vertex vertex)
        {
            var position = vertex.GetPosition();
            var parameters = new List<string>();
            parameters.Add(vertex.GetFullID().GetIDinCreator().ToString());
            parameters.Add(position.GetX().ToString());
            parameters.Add(position.GetX().ToString());
            parameters.Add(position.GetX().ToString());

            var command = new Command("InsertVertex", parameters);
            serviceManager_.__runCommand(command);
        }

        internal void __sendInsertEdgeCommand(Edge edge)
        {
            var parameters = new List<string>();
            parameters.Add(edge.GetStartVertex().GetFullID().ToString());
            parameters.Add(edge.GetEndVertex().GetFullID().ToString());
            parameters.Add(edge.GetFullID().GetIDinCreator().ToString());

            var command = new Command("InsertEdge", parameters);
            serviceManager_.__runCommand(command);
        }

        internal void __sendBreakEdgeLineCommand(Edge edge, int index, Point3D position)
        {
            var parameters = new List<string>();
            parameters.Add(edge.GetFullID().ToString());
            parameters.Add(index.ToString());
            parameters.Add(position.GetX().ToString());
            parameters.Add(position.GetY().ToString());
            parameters.Add(position.GetZ().ToString());

            var command = new Command("BreakEdgeLine", parameters);
            serviceManager_.__runCommand(command);
        }

        internal void __sendRemoveVertexCommand(Vertex vertex)
        {
            var parameters = new List<string>();
            parameters.Add(vertex.GetFullID().ToString());

            var command = new Command("RemoveVertex", parameters);
            serviceManager_.__runCommand(command);
        }

        internal void __sendRemoveEdgeCommand(Edge edge)
        {
            var parameters = new List<string>();
            parameters.Add(edge.GetFullID().ToString());

            var command = new Command("RemoveEdge", parameters);
            serviceManager_.__runCommand(command);
        }

        internal void __sendRemoveBendCommand(Edge edge, int index)
        {
            var parameters = new List<string>();
            parameters.Add(edge.GetFullID().ToString());
            parameters.Add(index.ToString());

            var command = new Command("RemoveBend", parameters);
            serviceManager_.__runCommand(command);
        }

        internal void __sendMoveVertexCommand(Vertex vertex)
        {
            var position = vertex.GetPosition();
            var parameters = new List<string>();
            parameters.Add(vertex.GetFullID().ToString());
            parameters.Add(position.GetX().ToString());
            parameters.Add(position.GetY().ToString());
            parameters.Add(position.GetZ().ToString());

            var command = new Command("MoveVertex", parameters);
            serviceManager_.__runCommand(command);
        }

        internal void __sendChangeVertexRotationCommand(Vertex vertex)
        {
            var rotation = vertex.GetRotation();
            var parameters = new List<string>();
            parameters.Add(vertex.GetFullID().ToString());
            parameters.Add(rotation.GetX().ToString());
            parameters.Add(rotation.GetY().ToString());
            parameters.Add(rotation.GetZ().ToString());
            parameters.Add(rotation.GetW().ToString());

            var command = new Command("ChangeVertexRotation", parameters);
            serviceManager_.__runCommand(command);
        }

        internal void __sendChangeVertexScaleCommand(Vertex vertex)
        {
            var scale = vertex.GetScale();
            var parameters = new List<string>();
            parameters.Add(vertex.GetFullID().ToString());
            parameters.Add(scale.ToString());

            var command = new Command("ChangeVertexScale", parameters);
            serviceManager_.__runCommand(command);
        }

        internal void __sendMoveBendCommand(Bend bend)
        {
            var position = bend.GetPosition();
            var parameters = new List<string>();
            parameters.Add(bend.GetEdge().GetFullID().ToString());
            parameters.Add(bend.GetIndexAtEdge().ToString());
            parameters.Add(position.GetX().ToString());
            parameters.Add(position.GetY().ToString());
            parameters.Add(position.GetZ().ToString());


            var command = new Command("MoveBend", parameters);
            serviceManager_.__runCommand(command);
        }

        internal void __sendChangeCameraPositionCommand(Point3D position)
        {
            var parameters = new List<string>();
            parameters.Add(position.GetX().ToString());
            parameters.Add(position.GetY().ToString());
            parameters.Add(position.GetZ().ToString());

            var command = new Command("ChangeCameraPosition", parameters);
            serviceManager_.__runCommand(command);
        }

        internal void __sendChangeCameraRotationCommand(Point4D rotation)
        {
            var parameters = new List<string>();
            parameters.Add(rotation.GetX().ToString());
            parameters.Add(rotation.GetY().ToString());
            parameters.Add(rotation.GetZ().ToString());
            parameters.Add(rotation.GetW().ToString());

            var command = new Command("ChangeCameraRotation", parameters);
            serviceManager_.__runCommand(command);
        }

        internal void __sendSetVertexPropertyCommand(Vertex vertex, string listName,
            string key, string value, bool isRenderUpdateNeeded)
        {
            var parameters = new List<string>();
            parameters.Add(vertex.GetFullID().ToString());
            parameters.Add(listName);
            parameters.Add(key);
            parameters.Add(value);
            if (isRenderUpdateNeeded)
                parameters.Add("1");
            else
                parameters.Add("0");

            var command = new Command("SetVertexProperty", parameters);
            serviceManager_.__runCommand(command);
        }

        internal void __sendSetEdgePropertyCommand(Edge edge, string listName,
            string key, string value, bool isRenderUpdateNeeded)
        {
            var parameters = new List<string>();
            parameters.Add(edge.GetFullID().ToString());
            parameters.Add(listName);
            parameters.Add(key);
            parameters.Add(value);
            if (isRenderUpdateNeeded)
                parameters.Add("1");
            else
                parameters.Add("0");

            var command = new Command("SetEdgeProperty", parameters);
            serviceManager_.__runCommand(command);
        }
    }
}
