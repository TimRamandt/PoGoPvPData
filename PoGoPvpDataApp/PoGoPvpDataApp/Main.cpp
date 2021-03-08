//turtorial on how to create a window: https://docs.microsoft.com/en-us/cpp/windows/walkthrough-creating-windows-desktop-applications-cpp?view=msvc-160
#include <windows.h>
#include <stdlib.h>
#include <string.h>
#include <tchar.h>
#include "textbox.h"
using namespace std;

//global variables

static char windowClassName[] = "MainWindow"; //I removed a _T here because I don't know what it does
static char title[] = "Pokémon Go PvP Data";
HINSTANCE hInst;

textbox commandText = NULL;

// Forward declarations of functions included in this code module:
LRESULT CALLBACK WndEventHandler(HWND, UINT, WPARAM, LPARAM);

int CALLBACK WinMain(_In_ HINSTANCE hInstance,
				     _In_opt_ HINSTANCE hPrevInstance,
					 _In_ LPSTR     lpCmdLine,
	                 _In_ int       nCmdShow) {


	//property of winClass: https://docs.microsoft.com/en-us/windows/win32/api/winuser/ns-winuser-wndclassexw
	WNDCLASSEX wndClass;

	wndClass.cbSize = sizeof(WNDCLASSEX);
	wndClass.style = CS_HREDRAW | CS_VREDRAW;
	wndClass.lpfnWndProc = WndEventHandler;
	wndClass.cbClsExtra = 0;
	wndClass.cbWndExtra = 0;
    wndClass.hInstance = hInstance;
	wndClass.hIcon = LoadIcon(hInstance, IDI_APPLICATION);
	wndClass.hCursor = LoadCursor(NULL, IDC_ARROW);
	wndClass.hbrBackground = (HBRUSH)(COLOR_WINDOW+1);
	wndClass.lpszMenuName = NULL;
	wndClass.lpszClassName = windowClassName;
	wndClass.hIconSm = LoadIcon(wndClass.hInstance, IDI_APPLICATION);

	if (!RegisterClassEx(&wndClass)) {
		MessageBox(NULL, _T("Call to RegisterClassEx failed!"),_T("Windows Desktop Guided Tour"),NULL);
		return 1;
	}

	// Store instance handle in our global variable
    hInst = hInstance;

	HWND hWnd = CreateWindow(
	    	windowClassName,
	        title,
	        WS_OVERLAPPEDWINDOW, //WS_OVERLAPPEDWINDOW: the type of window to create
	        CW_USEDEFAULT, CW_USEDEFAULT, //default position
	        600, 100, //initial size (width, length)
	        NULL, //the parent of this window
	        NULL, //initializ a menu bar (none here) 
	        hInstance,
	        NULL //not used in this application
	    ); 

    if (!hWnd)
    {
       MessageBox(NULL,
          _T("Call to CreateWindow failed!"),
          _T("Windows Desktop Guided Tour"),
          NULL);
    
       return 1;
    }

	ShowWindow(hWnd, nCmdShow);
	UpdateWindow(hWnd);

	MSG msg;
    while (GetMessage(&msg, NULL, 0, 0))
    {
       TranslateMessage(&msg);
       DispatchMessage(&msg);
    }
    
    return (int) msg.wParam;
};

LRESULT CALLBACK WndEventHandler(HWND hWnd, UINT message, WPARAM wParam, LPARAM lParam)
{
   PAINTSTRUCT ps;
   HDC hdc;
   char greeting[] = "Console Commands";
   
   switch (message)
   {
   case WM_CREATE: {
		   commandText = textbox(hWnd);
	   }
		   break;
   case WM_PAINT: {
          hdc = BeginPaint(hWnd, &ps);

          TextOut(hdc,
             5, 5,
             greeting, _tcslen(greeting));

          EndPaint(hWnd, &ps);
	   }
          break;
	   case WM_KEYDOWN: {
		   commandText.GetText();
	   }
	    break;
       case WM_DESTROY:
          PostQuitMessage(0);
          break;
	   case WM_LBUTTONDOWN:
		   SetFocus(hWnd);
		   break;
       default:
          return DefWindowProc(hWnd, message, wParam, lParam);
          break;
   }

   return 0;
}
