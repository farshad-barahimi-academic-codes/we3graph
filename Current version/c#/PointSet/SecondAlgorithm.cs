using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using We3Graph;

namespace PointSet
{
    class SecondAlgorithm
    {
        public void Start(List<Point3D> points,
            List<List<int>> adjacencyList, Graph graph)
        {
            var edges = new List<Edge>();
            var lineSegments = new List<Tuple<Point3D, Point3D>>();
            var vertices = new List<Vertex>();

            var scale = 30;
            var height = 0;

            foreach (var point in points)
            {
                vertices.Add(graph.AddVertex(point));
                height = Math.Max(height, (int)point.GetZ());
            }

            for (var start = 0; start < vertices.Count; start++)
                for (var j = 0; j < adjacencyList[start].Count; j++)
                {
                    var end = adjacencyList[start][j];
                    var edge = vertices[start].ConnectTo(vertices[end]);
                    edges.Add(edge);
                }

            var k = Math.Max(vertices.Count, edges.Count);

            var epsilon = 1e-6;

            int i = 0;
            foreach (var edge in edges)
            {
                i++;
                var u = edge.GetStartVertex().GetPosition();
                var w = edge.GetEndVertex().GetPosition();

                List<Point3D> visPoints = new List<Point3D>();

                for (int q = 0; q < 2; q++)
                {
                    var eye = u;
                    var eyeVertex = edge.GetStartVertex();
                    if (q == 1)
                    {
                        eye = w;
                        eyeVertex = edge.GetEndVertex();
                    }

                    for (int r = 1; r <= 3 * k && visPoints.Count <= q; r++)
                        for (int c = 1; c <= 3 * k; c++)
                        {
                            var p = new Point3D(r, c, height + i);
                            bool isVisible = true;
                            foreach (var lineSegment in lineSegments)
                            {
                                if (eye.Subtract(lineSegment.Item1).Length() < epsilon)
                                    continue;
                                if (eye.Subtract(lineSegment.Item2).Length() < epsilon)
                                    continue;

                                if (GeometryTools.DoesIntersect(eye, p,
                                    lineSegment.Item1, lineSegment.Item2))
                                    isVisible = false;
                            }


                            foreach (var vertex in vertices)
                            {
                                if (vertex.GetFullID() == eyeVertex.GetFullID())
                                    continue;
                                if (GeometryTools.IsOnTheLine(vertex.GetPosition(), eye, p))
                                    isVisible = false;
                            }


                            if (isVisible)
                            {
                                visPoints.Add(p);
                                var lineSegment = new Tuple<Point3D, Point3D>(eye, p);
                                lineSegments.Add(lineSegment);
                                break;
                            }
                        }
                }

                var a = visPoints[0];
                var b = visPoints[1];
                lineSegments.Add(new Tuple<Point3D, Point3D>(a, b));
                edge.BreakEdgeLine(b, 0);
                edge.BreakEdgeLine(a, 0);
            }

            foreach (var vertex in vertices)
                vertex.Move(vertex.GetPosition().MultiplyScalar(scale));

            foreach (var edge in edges)
                foreach (var bend in edge.GetBends())
                    bend.Move(bend.GetPosition().MultiplyScalar(scale));

            graph.Finish();
            System.Windows.MessageBox.Show("Finished");
        }
    }
}
