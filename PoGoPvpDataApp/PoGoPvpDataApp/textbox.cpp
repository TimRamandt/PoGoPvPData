#include "textbox.h"
#include <windows.h>

textbox::textbox(HWND hWnd)
{
	textbox::textboxHWND = CreateWindow(
			   TEXT("EDIT"), TEXT("joatmienemoat"), 
			   WS_VISIBLE | WS_CHILD | WS_BORDER,
			   5, 25, 500, 20,
			   hWnd, (HMENU) NULL, NULL, NULL);
}

void textbox::GetText() {
	int len = GetWindowTextLength(textbox::textboxHWND) + 1;
    char* text = new char[len];
    GetWindowText(textbox::textboxHWND, &text[0], len);

    OutputDebugString(text);
}

textbox::~textbox()
{
}
