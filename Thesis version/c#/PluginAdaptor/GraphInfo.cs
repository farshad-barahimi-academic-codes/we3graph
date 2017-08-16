using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace We3Graph
{
    /// <summary>
    /// A class to provide basic information about a graph
    /// But it is not intended for interaction with the graph
    /// </summary>
    public class GraphInfo
    {
        private int id_;
        private string name_;
        private string renderEngineGUID_;
        private int commandSetVersion_;

        public int GetID()
        {
            return id_;
        }

        public string GetName()
        {
            return name_;
        }

        public override string ToString()
        {
            return name_;
        }

        public string GetRenderEngineGUID()
        {
            return renderEngineGUID_;
        }

        public int GetCommandSetVersion()
        {
            return commandSetVersion_;
        }

        public GraphInfo(int id, string name, int commandSetVersion,
            string renderEngineGUID)
        {
            id_ = id;
            name_ = name;
            commandSetVersion_ = commandSetVersion;
            renderEngineGUID_ = renderEngineGUID;
        }
    }
}
