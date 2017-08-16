#ifndef AUTO_RESET_EVENT_H
#define AUTO_RESET_EVENT_H

#include <mutex>
#include <condition_variable>
#include <thread>
#include <stdio.h>

/// <summary>
/// A class similar to AutoResetEvent of c#
/// Modified from http://stackoverflow.com/questions/8538575/is-there-an-easy-way-to-implement-autoresetevent-in-c0x
/// </summary>
class AutoResetEvent
{
public:
	explicit AutoResetEvent(bool initial = false);

	void Set();
	void Reset();

	bool WaitOne(int milliseconds);

private:
	AutoResetEvent(const AutoResetEvent&);
	AutoResetEvent& operator=(const AutoResetEvent&); // non-copyable
	bool flag_;
	std::mutex protect_;
	std::condition_variable signal_;
};


#endif /* AUTO_RESET_EVENT_H */