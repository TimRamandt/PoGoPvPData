#include <windows.h>
#include <Windowsx.h>
#include <iostream>

#pragma once
class BaseWindow
{
public:
	static LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam);
	BaseWindow();
	BOOL Create(LPCSTR lpWindowName,
		        DWORD dwStyle,
		        DWORD dwExStyle = 0,
		        int x = CW_USEDEFAULT,
		        int y = CW_USEDEFAULT,
		        int nWidth = CW_USEDEFAULT,
		        int nHeight = CW_USEDEFAULT,
		        HWND hWndParent = 0,
		        HMENU hMenu = 0);
	HWND Window() const;
protected:
	virtual LPCSTR ClassName() const;
    virtual LRESULT HandleMessage(UINT uMsg, WPARAM wParam, LPARAM lParam);
	HWND m_hwnd;
};

