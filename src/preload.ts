import {contextBridge, ipcRenderer} from "electron";

contextBridge.exposeInMainWorld("main", {
  set_window_bounds(bounds: Electron.Rectangle) {
    ipcRenderer.send(
      "set_window_bounds", bounds.x, bounds.y, bounds.width, bounds.height
    );
  },
  get_window_bounds() {
    return ipcRenderer.invoke("get_window_bounds");
  },

  minimize() {
    ipcRenderer.send("minimize");
  },
  toggle_maximized() {
    ipcRenderer.send("toggle_maximized");
  },
  after_maximization_changed(callback: Function) {
    ipcRenderer.on("after_maximization_changed", (e, is_maximized) => {
      callback(is_maximized)
    });
  },
  close() {
    ipcRenderer.send("close");
  }
});