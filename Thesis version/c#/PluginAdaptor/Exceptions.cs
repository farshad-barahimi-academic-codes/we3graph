using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace We3Graph
{
    /// <summary>
    /// This exception is raised when the user is not authenticated to the system.
    /// </summary>
    public class AuthenicationException : Exception
    {

    }

    /// <summary>
    /// This exception is raised when the user is not authorized to make 
    /// the requested action.
    /// </summary>
    public class AuthorizationException : Exception
    {

    }

    /// <summary>
    /// This exception is raised when the system is not able to interact with 
    /// the web service.
    /// </summary>
    class WebServiceException : Exception
    {

    }
}
