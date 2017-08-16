using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace We3Graph.IDSystem
{
    /// <summary>
    /// The interface for any thing that has a FullID such as Vertex or Edge
    /// </summary>
    public interface IHasFullID
    {
        FullID GetFullID();
    }
}
