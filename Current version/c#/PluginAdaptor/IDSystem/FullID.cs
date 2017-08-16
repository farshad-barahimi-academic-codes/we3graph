using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace We3Graph.IDSystem
{
    /// <summary>
    /// A full ID represent an ID in form of clientID-IDinCreator
    /// It can be used as a unique ID for vertices or edges
    /// </summary>
    public class FullID
    {
        private int clientID;
        private int IDinCreator;

        public FullID(int clientID, int IDinCreator)
        {
            this.clientID = clientID;
            this.IDinCreator = IDinCreator;
        }

        public static FullID FromString(string IDString)
        {
            var parts = IDString.Split('-');
            int clientID = int.Parse(parts[0]);
            int IDinCreator = int.Parse(parts[1]);
            return new FullID(clientID, IDinCreator);
        }

        public override string ToString()
        {
            return clientID + "-" + IDinCreator;
        }

        public int GetClientID()
        {
            return clientID;
        }

        public int GetIDinCreator()
        {
            return IDinCreator;
        }

        public static bool operator ==(FullID ID1, FullID ID2)
        {
            if (ReferenceEquals(ID1, ID2))
                return true;

            if (((object)ID1 == null) || ((object)ID2 == null))
                return false;

            if (ID1.GetClientID() == ID2.GetClientID() &&
                ID1.GetIDinCreator() == ID2.GetIDinCreator())
                return true;

            return false;
        }

        public static bool operator !=(FullID ID1, FullID ID2)
        {
            return !(ID1 == ID2);
        }

        public override bool Equals(object obj)
        {
            if (obj == null)
                return false;
            if (!(obj is FullID))
                return false;

            return (this == (obj as FullID));
        }
    }
}
