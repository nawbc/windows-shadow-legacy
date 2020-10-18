#include <napi.h>
#include <Windows.h>
#include <iostream>

using namespace std;
using namespace Napi;

Value _MAKELPARAM(const CallbackInfo &info)
{
	Env env = info.Env();

	cout << info[0].As<String>().Utf8Value().c_str() << info[1].As<Number>().Int32Value() << endl;
	cout << MAKELPARAM(info[0].As<String>().Utf8Value().c_str(), info[1].As<Number>().Int32Value()) << endl;
	cout << MAKELPARAM("as", 2) << endl;
	return Number::New(env, 2);
}

Object Init(Env env, Object exports)
{

	exports.Set(String::New(env, "MAKELPARAM"), Function::New(env, _MAKELPARAM));

	return exports;
}

NODE_API_MODULE(winwin, Init);