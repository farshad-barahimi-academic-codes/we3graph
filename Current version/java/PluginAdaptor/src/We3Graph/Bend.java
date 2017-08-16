package We3Graph;

import java.util.ArrayList;

/**
 * This class represents a bend.
 * Bends break edges into edge lines.
 */
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

    void __move(Point3D position)
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
        ArrayList<EdgeLine> edgeLines = edge_.GetEdgeLines();
        for (int i = 0; i < edgeLines.size(); i++)
            if (edgeLines.get(i).GetEndBend() == this)
                return i;

        return -1;
    }
}