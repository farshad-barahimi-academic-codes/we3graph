using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace We3Graph
{
    public delegate void VertexEventHandler(Vertex vertex);
    public delegate void EdgeEventHandler(Edge edge);
    public delegate void BendEventHandler(Bend bend);
    public delegate void CameraEventHandler(Camera camera);
    public delegate void VertexPropertyEventHandler(Vertex vertex, string listName, string key);
    public delegate void EdgePropertyEventHandler(Edge edge, string listName, string key);
    public delegate void GraphEventHandler(Graph graph);
    internal delegate void NewCommandsEventHandler(List<Command> commands);
    internal delegate void GraphLoadedEventHandler();
}
