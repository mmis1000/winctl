var winctl = require('../');

var win = winctl.GetActiveWindow();

// Output some information about the currently active window
console.log("Active Window Hwnd:", win.getHwnd());
console.log("Active Window Title:", win.getTitle());
console.log("Dimensions:", win.dimensions());
/* ->
Active Window Hwnd: 26282110
Active Window Title: Bash cpp-modules/winctl
Dimensions: { left: 708, top: 112, right: 2025, bottom: 1132 }
*/

// Manipulate the currently active window a bit
// Move active window to 0,0 and resize it to 800x600
win.move(0, 0, 800, 600);

// Move active window to the right by 30px and increase its width by 60px
win.moveRelative(30, 0, 60, 0);

// Minimize the active window
win.showWindow(winctl.WindowStates.MINIMIZE);

console.log();

// Find a windows "File Explorer" window by ClassName
console.log("Title of window with class 'CabinetWClass':", winctl.GetWindowByClassName("CabinetWClass").getTitle());

// Find a window by exact title
console.log("HWND of window with exact title 'File Explorer':", winctl.GetWindowByTitleExact("File Explorer").getHwnd());

// Find first window containing the string 'alc' and bring it to the foreground
winctl.FindByTitle("alc").then(window => {
	console.log("Title of window with title 'alc':", window.getTitle());
	// --> Title of window with title 'alc': Calculator

	// Activate the window
	window.setForegroundWindow();
});

win.moveToTop();
win.screenshot("test" + (new Date).getTime() + ".jpg");
// Iterate over all windows with a custom filter -> show all visible windows
winctl.FindWindows(win => win.isVisible() && win.getTitle() && win.getParent() == null && win.isMainWindow())
.then(windows => {
	console.log("Visible windows:");
    
	var res = windows.sort((a,b) => a.getTitle().localeCompare(b.getTitle())).map(window => {
        console.log(" - %s [processname=%s, classname=%s, pid=%d, hwnd=%d, parent=%d]", window.getTitle(), window.getProcessName(), window.getClassName(), window.getPid(), window.getHwnd(), window.getParent());
        return window;
    });
    
    // function loop(arr) {
        // if (arr.length > 0) {
            // arr[0].moveToTop();
            // setTimeout(loop.bind(null, arr.slice(1), 500));
        // } else {
            // win.moveToTop();
        // }
    // }
    
    // loop(res);
    
})
.catch((err)=>{
    console.log(err)
});
/* -->
Visible windows:
 - Bash cpp-modules/winctl [pid=27196, hwnd=26282110, parent=NaN]
 - Bash cpp-modules/winctl [pid=30696, hwnd=10357510, parent=NaN]
 - Calculator [pid=6948, hwnd=5311194, parent=NaN]
 - File Explorer [pid=4860, hwnd=5115324, parent=NaN]
 - src [pid=4860, hwnd=219155192, parent=NaN]
*/


// Log when a new window opens or the active window changes
winctl.Events.addListener("active-window", function(now, prev) {
	console.log("Changed active window to: %s [prev=%s]", now.getTitle(), prev.getTitle());
});

winctl.Events.addListener("open-window", function(win) {
	console.log("Opened new window: %s [%d]", win.getTitle(), win.getHwnd());
});

// Stop listening after 5s
setTimeout(() => {
	winctl.Events.removeAllListeners("active-window");
	winctl.Events.removeAllListeners("open-window");
	console.log("---done---");
}, 5000);