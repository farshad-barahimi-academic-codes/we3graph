using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace We3Graph
{
    /// <summary>
    /// This class represent a command sent or received from the server.
    /// </summary>
    public class Command
    {
        private string name_;
        private List<string> parameters_;
        private int clientID_;
        private int ID_;

        internal int __getClientID()
        {
            return clientID_;
        }

        internal void __setClientID(int clientID)
        {
            this.clientID_ = clientID;
        }

        internal int __getID()
        {
            return ID_;
        }

        internal void __setID(int ID)
        {
            this.ID_ = ID;
        }

        internal Command(string name, List<string> parameters)
        {
            this.name_ = name;
            this.parameters_ = parameters;

            for (int i = parameters_.Count; i < 5; i++)
                parameters_.Add("");
        }

        public string GetName()
        {
            return name_;
        }

        public List<string> GetParameters()
        {
            return parameters_;
        }

    }
}
