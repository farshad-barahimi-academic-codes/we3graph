#ifndef STATICS_H
#define STATICS_H

#include<string>
using namespace std;

namespace We3Graph
{
	class Statics
	{
	public:
		/// <summary>
		/// The version of command set used to interact with or create graphs.
		/// </summary>
		const int COMMAND_SET_VERSION = 1;

		/// <summary>
		/// The GUID for the default render engine
		/// </summary>
		const string DEFAULT_ENGINE_GUID = "{4A2D36F8-7749-417B-8BC2-AF85F67D08DF}";

		/// <summary>
		/// The GUID for the class diagram engine
		/// </summary>
		const string CLASS_DIAGRAM_ENGINE_GUID = "{D213CC0C-1054-4A1C-B64B-4815A91C049C}";

		/// <summary>
		/// The GUID for chemistry engine
		/// </summary>
		const string CHEMISTRY_ENGINE_GUID = "{1E04BB7A-339E-40E7-84DA-187B3FBFC059}";

		/// <summary>
		/// The GUID for color engine
		/// </summary>
		const string COLOR_ENGINE_GUID = "{95EF6618-3716-427B-867D-6E642633C419}";

		/// <summary>
		/// The GUID for multi edge engine
		/// </summary>
		const string MULTI_EDGE_ENGINE_GUID = "{67D9B4AD-AEA0-4DBC-947B-8636BCF0913A}";

		/// <summary>
		/// The GUID for directed engine
		/// </summary>
		const string DIRECTED_ENGINE_GUID = "{46DA88A6-2067-4A12-A40B-9A25BBA59979}";

		static wstring StringToWide(string narrow);
		static string WStringToNarrow(wstring wide);
	};
}

#endif /* STATICS_H */