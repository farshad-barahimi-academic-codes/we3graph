#include "FullIDHashDictionary.h"
#include "Headers.h"

namespace We3Graph
{
	template<typename T>
	FullIDHashDictionary<T>::FullIDHashDictionary()
	{
		firstHashSize = 37;
		secondHashSize = 1543;

		buckets = new vector<T>[firstHashSize * secondHashSize];
	}

	template<typename T>
	void FullIDHashDictionary<T>::Add(T item)
	{
		auto fullID = item->GetFullID();
		int index = hashFunction(fullID->GetClientID(), fullID->GetIDinCreator());

		buckets[index].push_back(item);
		allItems.push_back(item);
	}

	template<typename T>
	T FullIDHashDictionary<T>::Find(FullID * fullID)
	{
		return Find(fullID->GetClientID(), fullID->GetIDinCreator());
	}

	template<typename T>
	T FullIDHashDictionary<T>::Find(int clientID, int IDinCreator)
	{
		int index = this->hashFunction(clientID, IDinCreator);

		for (T item : buckets[index])
		{
			auto fullID = item->GetFullID();
			if (fullID->GetClientID() == clientID &&
				fullID->GetIDinCreator() == IDinCreator)
				return item;
		}

		return NULL;
	}

	template<typename T>
	void FullIDHashDictionary<T>::Remove(FullID * fullID)
	{
		Remove(fullID->GetClientID(), fullID->GetIDinCreator());
	}

	template<typename T>
	void FullIDHashDictionary<T>::Remove(int clientID, int IDinCreator)
	{
		int index = hashFunction(clientID, IDinCreator);

		int itemIndex = -1;

		int i;
		for (i = 0; i < buckets[index].size(); i++)
		{
			auto fullID = buckets[index][i]->GetFullID();
			if (fullID->GetClientID() == clientID &&
				fullID->GetIDinCreator() == IDinCreator)
				itemIndex = i;
		}

		if (itemIndex != -1)
			buckets[index].erase(buckets[index].begin() + itemIndex);

		itemIndex = -1;
		for (i = 0; i < allItems.size(); i++)
		{
			auto fullID = allItems[i]->GetFullID();
			if (fullID->GetClientID() == clientID &&
				fullID->GetIDinCreator() == IDinCreator)
				itemIndex = i;
		}

		if (itemIndex != -1)
			allItems.erase(allItems.begin() + itemIndex);
	}

	template<typename T>
	vector<T> & FullIDHashDictionary<T>::GetAllItems()
	{
		return allItems;
	}

	template<typename T>
	void FullIDHashDictionary<T>::RemoveAll()
	{
		buckets = new vector<T>[firstHashSize * secondHashSize];
		allItems.clear();
	}

	template<typename T>
	int FullIDHashDictionary<T>::hashFunction(int firstKey, int secondKey)
	{
		return (firstKey % firstHashSize) * secondHashSize +
			(secondKey % secondHashSize);
	}
}