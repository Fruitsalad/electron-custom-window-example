import {contextBridge, ipcRenderer} from "electron";

contextBridge.exposeInMainWorld("main", {
  set_window_bounds(bounds: Electron.Rectangle) {
    ipcRenderer.send(
      "set_window_bounds", bounds.x, bounds.y, bounds.width, bounds.height
    );
  },
  get_window_bounds() {
    return ipcRenderer.invoke("get_window_bounds");
  }
});