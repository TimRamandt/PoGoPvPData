#pragma once
#include <windows.h>
class textbox
{
public:
	HWND textboxHWND;
	textbox(HWND hWnd);
	void GetText();
	~textbox();
};
