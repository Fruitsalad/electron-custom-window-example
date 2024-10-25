import {contextBridge, ipcRenderer} from "electron";

// Expose a bunch of functions to the renderer process so that it can
// communicate with the main process.
contextBridge.exposeInMainWorld("main", {
  set_window_bounds(bounds: Electron.Rectangle) {
    ipcRenderer.send(
      "set_window_bounds", bounds.x, bounds.y, bounds.width, bounds.height
    );
  },
  get_window_bounds(): Promise<Electron.Rectangle> {
    return ipcRenderer.invoke("get_window_bounds");
  },

  minimize() {
    ipcRenderer.send("minimize");
  },
  toggle_maximized() {
    ipcRenderer.send("toggle_maximized");
  },
  after_maximization_changed(callback: (is_maximized: boolean) => void) {
    ipcRenderer.on("after_maximization_changed", (_, is_maximized) => {
      callback(is_maximized)
    });
  },
  close() {
    ipcRenderer.send("close");
  }
});

// The rest of this file is just here to make Typescript happy.
interface MainAPI {
  set_window_bounds: (bounds: Electron.Rectangle) => void,
  get_window_bounds: () => Promise<Electron.Rectangle>,
  minimize: () => void,
  toggle_maximized: () => void,
  after_maximization_changed:
    (callback: (is_maximized: boolean) => void) => void,
  close: () => void
}

declare global {
  interface Window {
    main: MainAPI;
  }
}
