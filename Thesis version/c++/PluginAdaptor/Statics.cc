#include "Statics.h"
#include "Headers.h"

#include <locale>
#include <codecvt>
#include <string>
using namespace std;

namespace We3Graph
{
	wstring Statics::StringToWide(string narrow)
	{
		wstring_convert<std::codecvt_utf8_utf16<wchar_t>> converter;
		return converter.from_bytes(narrow);
	}

	string Statics::WStringToNarrow(wstring wide)
	{
		wstring_convert<std::codecvt_utf8_utf16<wchar_t>> converter;
		return converter.to_bytes(wide);
	}
}