package We3Graph;

/**
 * This class represents the camera
 */
public class Camera
{
    private Graph graph_;
    private Point3D position_;
    private Point4D quaternionRotation_;

    Camera(Graph graph)
    {
        graph_ = graph;
        position_ = new Point3D(0, 0, 0);
        quaternionRotation_ = new Point4D(0, 0, 0, 0);
    }

    public void ChangePosition(Point3D position)
    {
        __changePosition(position);
        graph_.__getCommandSender().__sendChangeCameraPositionCommand(position);
    }

    void __changePosition(Point3D position)
    {
        position_ = position;
    }

    public Point3D GetPosition()
    {
        return position_;
    }

    public void ChangeRotation(Point4D quaternion)
    {
        __changeRotation(quaternion);
        graph_.__getCommandSender().__sendChangeCameraRotationCommand(quaternion);
    }

    void __changeRotation(Point4D quaternion)
    {
        this.quaternionRotation_ = quaternion;
    }

    public Point4D GetRotation()
    {
        return quaternionRotation_;
    }

}
