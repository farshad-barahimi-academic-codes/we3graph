using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using We3Graph;

namespace PointSet
{
    class FirstAlgorithm
    {
        private List<List<List<Point3D>>> bends_;
        private int height_;
        private int edgesCount_;
        private List<Tuple<int, int, int>> startTrack_;
        private List<Tuple<int, int, int>> endTrack_;
        public void Start(List<Point3D> points,
            List<List<int>> adjacencyList, Graph graph)
        {
            height_ = 1;
            for (var i = 0; i < points.Count; i++)
                height_ = Math.Max((int)points[i].GetZ(), height_);

            edgesCount_ = 0;
            for (var i = 0; i < points.Count; i++)
                for (var j = 0; j < adjacencyList[i].Count; j++)
                    edgesCount_++;

            int k = Math.Max(edgesCount_, points.Count);

            var visiblePointsFront = new List<SortedSet<Tuple<int, int>>>();
            var visiblePointsBack = new List<SortedSet<Tuple<int, int>>>();

            var epsilon = 1e-6;

            for (var start = 0; start < points.Count; start++)
            {
                var visSetFront = new SortedSet<Tuple<int, int>>();
                var visSetBack = new SortedSet<Tuple<int, int>>();

                for (var r = 1; r <= 2 * k; r++)
                    for (var c = 1; c <= 2 * k; c++)
                    {
                        visSetFront.Add(new Tuple<int, int>(r, c));
                        visSetBack.Add(new Tuple<int, int>(r, c));
                    }

                for (var v = 0; v < points.Count; v++)
                    if (v != start)
                    {
                        for (var q = 0; q < 2; q++)
                        {
                            var p0 = points[start];
                            var p1 = points[v];
                            var vector1 = p1.Subtract(p0);

                            var z = height_ + 1;
                            if (q == 1)
                                z = 0;
                            var t = z - p0.GetZ() / vector1.GetZ();
                            var x = p0.GetX() + vector1.GetX() * t;
                            var y = p0.GetY() + vector1.GetY() * t;
                            var xInt = (int)x;
                            var yInt = (int)y;
                            var xRemove = -1;
                            var yRemove = -1;
                            if (x - xInt > 1 - epsilon)
                                xRemove = xInt + 1;
                            if (x - xInt < epsilon)
                                xRemove = xInt;
                            if (y - yInt > 1 - epsilon)
                                yRemove = yInt + 1;
                            if (y - yInt < epsilon)
                                yRemove = yInt;
                            if (q == 0)
                                visSetFront.Remove(new Tuple<int, int>(xRemove, yRemove));
                            else
                                visSetBack.Remove(new Tuple<int, int>(xRemove, yRemove));
                        }
                    }

                visiblePointsFront.Add(visSetFront);
                visiblePointsBack.Add(visSetBack);
            }

            bends_ = new List<List<List<Point3D>>>();
            var lineSegments = new List<Tuple<int, Point3D>>();

            for (var start = 0; start < points.Count; start++)
            {
                bends_.Add(new List<List<Point3D>>());
                for (var end = 0; end < points.Count; end++)
                    bends_[start].Add(new List<Point3D>());
            }

            for (var start = 0; start < points.Count; start++)
                for (var j = 0; j < adjacencyList[start].Count; j++)
                {
                    var end = adjacencyList[start][j];
                    for (var q = 0; q < 2; q++)
                    {
                        var eyeIndex = start;
                        Tuple<int, int> a = null;
                        if (q == 0)
                        {
                            a = visiblePointsFront[eyeIndex].First();
                            visiblePointsFront[eyeIndex].Remove(a);
                        }
                        if (q == 1)
                        {
                            eyeIndex = end;
                            a = visiblePointsBack[eyeIndex].First();
                            visiblePointsBack[eyeIndex].Remove(a);
                        }


                        var lineSegment = new Tuple<int, Point3D>(eyeIndex,
                            new Point3D(a.Item1, a.Item2, height_ + 1));
                        if (q == 1)
                            lineSegment = new Tuple<int, Point3D>(eyeIndex,
                                new Point3D(a.Item1, a.Item2, 0));
                        lineSegments.Add(lineSegment);
                        bends_[start][end].Add(lineSegment.Item2);

                        for (var v = 0; v < points.Count; v++)
                        {
                            if (v == eyeIndex)
                                continue;
                            var blockedList = new List<Tuple<int, int>>();
                            var visSet = visiblePointsFront[v];
                            if (q == 1)
                                visSet = visiblePointsBack[v];

                            var p0 = points[eyeIndex];
                            var p1 = lineSegment.Item2;
                            var p2 = points[v];
                            var vector1 = p1.Subtract(p0);
                            var vector2 = p2.Subtract(p0);
                            var planeNormal = GeometryTools.CrossVector(vector1, vector2);

                            if (Math.Abs(planeNormal.Length()) < epsilon)
                            {
                                if (Math.Abs(vector1.GetZ()) > epsilon)
                                {
                                    var z = height_ + 1;
                                    if (q == 1)
                                        z = 0;
                                    var t = z - p0.GetZ() / vector1.GetZ();
                                    var x = p0.GetX() + vector1.GetX() * t;
                                    var y = p0.GetY() + vector1.GetY() * t;
                                    var xInt = (int)x;
                                    var yInt = (int)y;
                                    var xRemove = -1;
                                    var yRemove = -1;
                                    if (x - xInt > 1 - epsilon)
                                        xRemove = xInt + 1;
                                    if (x - xInt < epsilon)
                                        xRemove = xInt;
                                    if (y - yInt > 1 - epsilon)
                                        yRemove = yInt + 1;
                                    if (y - yInt < epsilon)
                                        yRemove = yInt;
                                    visSet.Remove(new Tuple<int, int>(xRemove, yRemove));
                                }
                            }
                            else
                            {

                                double lineParamA = planeNormal.GetX();
                                double lineParamB = planeNormal.GetY();
                                double lineParamC = -(planeNormal.GetX() *
                                    p0.GetX() + planeNormal.GetY() * p0.GetY() +
                                    planeNormal.GetZ() * p0.GetZ());
                                if (q == 0)
                                    lineParamC += (height_ + 1) * planeNormal.GetZ();


                                if (Math.Abs(lineParamB) < epsilon)
                                {
                                    for (var y = 1; y <= 2 * k; y++)
                                    {
                                        var x = -lineParamC / lineParamA;
                                        var xInt = (int)x;
                                        if (x - xInt > 1 - epsilon)
                                            visSet.Remove(new Tuple<int, int>(xInt + 1, y));
                                        else if (x - xInt < epsilon)
                                            visSet.Remove(new Tuple<int, int>(xInt, y));
                                    }
                                }
                                else
                                {
                                    for (var x = 1; x <= 2 * k; x++)
                                    {
                                        var y = (-lineParamC - x * lineParamA) / lineParamB;
                                        var yInt = (int)y;
                                        if (y - yInt > 1 - epsilon)
                                            visSet.Remove(new Tuple<int, int>(x, yInt + 1));
                                        else if (y - yInt < epsilon)
                                            visSet.Remove(new Tuple<int, int>(x, yInt));
                                    }
                                }
                            }
                        }
                    }
                }

            startTrack_ = new List<Tuple<int, int, int>>(); // start,end,match
            endTrack_ = new List<Tuple<int, int, int>>(); // start,end,match

            for (var start = 0; start < points.Count; start++)
                for (var j = 0; j < adjacencyList[start].Count; j++)
                {
                    var end = adjacencyList[start][j];
                    startTrack_.Add(new Tuple<int, int, int>(start, end, -1));
                    endTrack_.Add(new Tuple<int, int, int>(start, end, -1));
                }

            double eps = 1e-6;

            startTrack_.Sort((first, second) =>
            {
                var p1 = bends_[first.Item1][first.Item2][0];
                var p2 = bends_[second.Item1][second.Item2][0];

                if (Math.Abs(p1.GetX() - p2.GetX()) < eps)
                {
                    if (Math.Abs(p1.GetY() - p2.GetY()) < eps)
                        return 0;
                    else if (p1.GetY() < p2.GetY())
                        return -1;
                    else
                        return 1;
                }
                else if (p1.GetX() < p2.GetX())
                    return -1;
                else
                    return 1;

            });

            endTrack_.Sort((first, second) =>
            {
                var p1 = bends_[first.Item1][first.Item2][1];
                var p2 = bends_[second.Item1][second.Item2][1];
                if (Math.Abs(p1.GetX() - p2.GetX()) < eps)
                {
                    if (p1.GetY() < p2.GetY())
                        return -1;
                    else if (Math.Abs(p1.GetY() - p2.GetY()) < eps)
                        return 0;
                    else
                        return 1;
                }
                else if (p1.GetX() < p2.GetX())
                    return -1;
                else
                    return 1;

            });

            for (var i = 0; i < startTrack_.Count; i++)
            {
                int start = startTrack_[i].Item1;
                int end = startTrack_[i].Item2;
                int beforeEndIndex = bends_[start][end].Count - 1;
                bends_[start][end].Insert(beforeEndIndex, new Point3D(-1, i + 1,
                    Math.Max(height_ + 2, Math.Ceiling(Math.Log(edgesCount_, 2)))));
            }

            for (var i = 0; i < startTrack_.Count; i++)
                for (var j = 0; j < endTrack_.Count; j++)
                {
                    var x = startTrack_[i];
                    var y = endTrack_[j];
                    if (x.Item1 == y.Item1 && x.Item2 == y.Item2)
                    {
                        startTrack_[i] = new Tuple<int, int, int>(
                            startTrack_[i].Item1, startTrack_[i].Item2, j);
                        endTrack_[j] = new Tuple<int, int, int>(
                            endTrack_[j].Item1, endTrack_[j].Item2, i);
                    }
                }



            var firstStepTrack = new List<int>();

            for (var i = 0; i < startTrack_.Count; i++)
                firstStepTrack.Add(startTrack_[i].Item3);

            recursiveStep(firstStepTrack, 0, 0);

            var vertices = new List<Vertex>();
            var edges = new List<Edge>();
            foreach (var point in points)
                vertices.Add(graph.AddVertex(point));

            for (var start = 0; start < vertices.Count; start++)
                for (var j = 0; j < adjacencyList[start].Count; j++)
                {
                    var end = adjacencyList[start][j];
                    var edge = vertices[start].ConnectTo(vertices[end]);
                    edges.Add(edge);
                    var bends = bends_[start][end];
                    bends.Reverse();
                    foreach (var bend in bends)
                        edge.BreakEdgeLine(bend, 0);
                }

            int scale = 30;

            foreach (var vertex in vertices)
                vertex.Move(vertex.GetPosition().MultiplyScalar(scale));

            foreach (var edge in edges)
                foreach (var bend in edge.GetBends())
                    bend.Move(bend.GetPosition().MultiplyScalar(scale));

            graph.Finish();
            System.Windows.MessageBox.Show("Finished");

        }

        private void recursiveStep(List<int> stepTrack, int step, int trackBeg)
        {
            int rightStart = stepTrack.Count / 2 + trackBeg;

            List<int> leftTrack = new List<int>();
            List<int> rightTrack = new List<int>();

            int beforeEndIndex;

            for (var i = 0; i < stepTrack.Count; i++)
            {
                var start = endTrack_[stepTrack[i]].Item1;
                var end = endTrack_[stepTrack[i]].Item2;

                if (stepTrack[i] >= rightStart)
                {
                    rightTrack.Add(stepTrack[i]);

                    if (i + trackBeg < rightStart)
                    {
                        beforeEndIndex = bends_[start][end].Count - 1;
                        bends_[start][end].Insert(beforeEndIndex,
                            new Point3D(-2, rightStart + rightTrack.Count, height_ + 1 - step));
                    }

                    beforeEndIndex = bends_[start][end].Count - 1;
                    bends_[start][end].Insert(beforeEndIndex,
                        new Point3D(-1, rightStart + rightTrack.Count, height_ + 1 - step));
                }
                else
                {
                    leftTrack.Add(stepTrack[i]);
                    if (i + trackBeg >= rightStart)
                    {
                        beforeEndIndex = bends_[start][end].Count - 1;
                        bends_[start][end].Insert(beforeEndIndex,
                            new Point3D(0, trackBeg + leftTrack.Count, height_ + 1 - step));
                    }

                    beforeEndIndex = bends_[start][end].Count - 1;
                    bends_[start][end].Insert(beforeEndIndex,
                        new Point3D(-1, trackBeg + leftTrack.Count, height_ + 1 - step));
                }
            }

            if (step < Math.Ceiling(Math.Log(edgesCount_, 2)))
            {
                recursiveStep(leftTrack, step + 1, trackBeg);
                recursiveStep(rightTrack, step + 1, rightStart);
            }
            else
            {
                for (var i = 0; i < stepTrack.Count; i++)
                {
                    var start = endTrack_[stepTrack[i]].Item1;
                    var end = endTrack_[stepTrack[i]].Item2;
                    beforeEndIndex = bends_[start][end].Count - 1;
                    bends_[start][end].Insert(beforeEndIndex,
                        new Point3D(-1, trackBeg + i + 1, -1));
                }
            }
        }
    }
}
