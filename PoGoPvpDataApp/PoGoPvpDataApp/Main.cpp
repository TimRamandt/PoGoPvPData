#include <windows.h>
#include <Windowsx.h>
#include <d2d1.h>
#include <stdlib.h>
#include <string.h>
#include <tchar.h>
#include <iostream>
#include "BaseWindow.h"

using namespace std;

class MainWindow : public BaseWindow
{
public:
    LPCSTR  ClassName() const { return "Editor"; }
    LRESULT HandleMessage(UINT uMsg, WPARAM wParam, LPARAM lParam);
};

LRESULT MainWindow::HandleMessage(UINT uMsg, WPARAM wParam, LPARAM lParam)
{
	char greeting[] = "hello win32";
    switch (uMsg)
	{
     	case WM_CREATE: {
              PAINTSTRUCT ps;
              HDC hdc = BeginPaint(m_hwnd, &ps);
              FillRect(hdc, &ps.rcPaint, (HBRUSH) (COLOR_WINDOW+1));
     
     		 TextOut(hdc,
               50, 50,
               greeting, ARRAYSIZE(greeting));
     
              EndPaint(m_hwnd, &ps);
     	}
     					return 0;
         case WM_DESTROY:
             PostQuitMessage(0);
             return 0;
     
         case WM_PAINT:
             {
                 PAINTSTRUCT ps;
                 HDC hdc = BeginPaint(m_hwnd, &ps);
                 //FillRect(hdc, &ps.rcPaint, (HBRUSH) (COLOR_WINDOW+1));
     
     			TextOut(hdc,
                  5, 5,
                  greeting, ARRAYSIZE(greeting));
     
                 EndPaint(m_hwnd, &ps);
             }
             return 0;
     
         default:
             return DefWindowProc(m_hwnd, uMsg, wParam, lParam);
         }
    return TRUE;
}

//We start here boys
int WINAPI wWinMain(HINSTANCE hInstance, HINSTANCE, PWSTR pCmdLine, int nCmdShow)
{
    MainWindow win;

    if (!win.Create("Pokémon Go PvP Data", WS_OVERLAPPEDWINDOW))
    {
        return 0;
    }

    ShowWindow(win.Window(), nCmdShow);

    // Run the message loop.

    MSG msg = { };
    while (GetMessage(&msg, NULL, 0, 0))
    {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }

    return 0;
}


