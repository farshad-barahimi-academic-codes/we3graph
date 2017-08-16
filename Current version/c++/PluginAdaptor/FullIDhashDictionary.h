#ifndef FULL_ID_HASH_DICTIONARY_H
#define FULL_ID_HASH_DICTIONARY_H

#include <vector>
using namespace std;

namespace We3Graph
{
	class FullID;
	class Vertex;
	class Edge;

	/// <summary>
	/// A hash dictionary which use FullID as key.
	/// A vertex or an edge can be used as value.
	/// </summary>
	template <typename T>
	class FullIDHashDictionary
	{
	private:
		int firstHashSize;
		int secondHashSize;
		vector<T> * buckets;
		vector<T> allItems;

	public:
		FullIDHashDictionary();

		void Add(T item);

		T Find(FullID * fullID);

		T Find(int clientID, int IDinCreator);

		void Remove(FullID * fullID);

		void Remove(int clientID, int IDinCreator);

		vector<T> & GetAllItems();

		void RemoveAll();

	private:
		int hashFunction(int firstKey, int secondKey);
	};

	template class FullIDHashDictionary<Vertex *>;
	template class FullIDHashDictionary<Edge *>;
}

#endif /* FULL_ID_HASH_DICTIONARY_H */