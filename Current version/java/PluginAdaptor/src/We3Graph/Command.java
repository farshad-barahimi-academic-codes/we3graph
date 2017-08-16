package We3Graph;

import java.util.ArrayList;

public class Command
{
    private String name_;
    private ArrayList<String> parameters_;
    private int clientID_;
    private int ID_;

    int __getClientID()
    {
        return clientID_;
    }

    void __setClientID(int clientID)
    {
        this.clientID_ = clientID;
    }

    int __getID()
    {
        return ID_;
    }

    void __setID(int ID)
    {
        this.ID_ = ID;
    }

    Command(String name, ArrayList<String> parameters)
    {
        this.name_ = name;
        this.parameters_ = parameters;

        for (int i = parameters_.size(); i < 5; i++)
            parameters_.add("");
    }

    public String GetName()
    {
        return name_;
    }

    public ArrayList<String> GetParameters()
    {
        return parameters_;
    }

}
