package We3Graph;

/**
 * A class to represent a 4D point.
 * It's main purpose is to handle quaternions.
 */
public class Point4D
{
    private double x_;
    private double y_;
    private double z_;
    private double w_;

    public Point4D(double x, double y, double z, double w)
    {
        Set(x, y, z, w);
    }

    public void Set(double x, double y, double z, double w)
    {
        this.x_ = x;
        this.y_ = y;
        this.z_ = z;
        this.w_ = w;
    }

    public double GetX()
    {
        return x_;
    }

    public double GetY()
    {
        return y_;
    }

    public double GetZ()
    {
        return z_;
    }

    public double GetW()
    {
        return w_;
    }

    public void SetX(double x)
    {
        this.x_ = x;
    }

    public void SetY(double y)
    {
        this.y_ = y;
    }

    public void SetZ(double z)
    {
        this.z_ = z;
    }

    public void SetW(double w)
    {
        this.w_ = w;
    }

    public double Lenght()
    {
        return Math.sqrt(x_ * x_ + y_ * y_ + z_ * z_ + w_ * w_);
    }

    public Point4D Normalize()
    {
        double lenght = Lenght();
        x_ = x_ / lenght;
        y_ = y_ / lenght;
        z_ = z_ / lenght;
        w_ = w_ / lenght;
        return this;
    }

    public Point4D Clone()
    {
        return new Point4D(x_, y_, z_, w_);
    }
}

