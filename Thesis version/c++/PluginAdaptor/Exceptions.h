#ifndef EXCEPTIONS_H
#define EXCEPTIONS_H

#include<exception>
using namespace std;

namespace We3Graph
{
	/// <summary>
	/// This exception is raised when the user is not authenticated to the system.
	/// </summary>
	class AuthenicationException : exception
	{

	};

	/// <summary>
	/// This exception is raised when the user is not authorized to make the
	/// requested action.
	/// </summary>
	class AuthorizationException : exception
	{

	};

	/// <summary>
	/// This exception is raised when the system is not able to interact with
	/// the web service.
	/// </summary>
	class WebServiceException : exception
	{

	};
}


#endif /* EXCEPTIONS_H */