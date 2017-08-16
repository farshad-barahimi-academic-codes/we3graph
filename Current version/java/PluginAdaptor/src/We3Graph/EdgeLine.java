package We3Graph;

/**
 * This class represents an edge line.
 * Bends break edges into edge lines
 */
public class EdgeLine
{

    private Edge edge_;
    private Bend startBend_;
    private Bend endBend_;

    /**
     * Constructor for the edge line class
     *
     * @param edge      The parent edge for the edge line
     * @param startBend The bend at the beginning of the edge line.
     *                  null if the start vertex of the edge is the beginning
     * @param endBend   The bend at the end of the edge line.
     *                  null if the end vertex of the edge is the end
     */
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
