#include "BaseWindow.h"

using namespace std;

   //this used to be a CALLBACK like: LRESULT CALLBACK WindowProc(
   LRESULT BaseWindow::WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam) {
	    BaseWindow *pThis = NULL;

        if (uMsg == WM_NCCREATE)
        {
            CREATESTRUCT* pCreate = (CREATESTRUCT*)lParam;
            pThis = (BaseWindow*)pCreate->lpCreateParams;
            SetWindowLongPtr(hwnd, GWLP_USERDATA, (LONG_PTR)pThis);

            pThis->m_hwnd = hwnd;
        }

        pThis = (BaseWindow*)GetWindowLongPtr(hwnd, GWLP_USERDATA);

		if (pThis) {
            return pThis->HandleMessage(uMsg, wParam, lParam);
		}

      	return DefWindowProc(hwnd, uMsg, wParam, lParam);
   }


   BaseWindow::BaseWindow() {
	   m_hwnd = NULL;
   };
                             	 
   BOOL BaseWindow::Create(LPCSTR lpWindowName,
   		                   DWORD dwStyle,         	 
   		                   DWORD dwExStyle,   	 
   	                       int x, 	 
   	                       int y, 	 
   	                       int nWidth,
   	                       int nHeight,
   	                       HWND hWndParent,   	 
   	                       HMENU hMenu) {     	 
                             
       WNDCLASS wc = {0};        	 
        
       wc.lpfnWndProc   = WindowProc;
       wc.hInstance     = GetModuleHandle(NULL);
       wc.lpszClassName = ClassName() ;
                                 	 
       RegisterClass(&wc);       	 
       m_hwnd = CreateWindowEx(  	 
           dwExStyle, ClassName(), lpWindowName, dwStyle, x, y,
           nWidth, nHeight, hWndParent, hMenu, GetModuleHandle(NULL), this
           );                    	 
                                 	 
       return (m_hwnd ? TRUE : FALSE);
   }

   HWND BaseWindow::Window() const
   {
	   return m_hwnd;
   }

   LPCSTR BaseWindow::ClassName() const
   {
	   //needs to be overriden
	   return LPCSTR();
   }

   LRESULT BaseWindow::HandleMessage(UINT uMsg, WPARAM wParam, LPARAM lParam)
   {
	   //needs to be overriden
	   return LRESULT();
   }
