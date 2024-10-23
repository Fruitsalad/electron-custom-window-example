import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';

dialog.showErrorBox = function(title, content) {
  console.error(`Electron error: ${title}\n${content}`);
};

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let main_window: BrowserWindow;

const createWindow = () => {
  //@ts-ignore  MAIN_WINDOW_VITE_DEV_SERVER_URL is an environment variable
  const dev_url = MAIN_WINDOW_VITE_DEV_SERVER_URL;
  //@ts-ignore  MAIN_WINDOW_VITE_NAME is also an environment variable
  const name = MAIN_WINDOW_VITE_NAME;

  // On the Linux implementation of Electron, the `maximizable` boolean has no
  // effect and windows can only be maximized if they are resizable.
  const resizable = (process.platform === "linux");

  // Create the browser window.
  main_window = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 400,
    minHeight: 300,
    frame: false,
    resizable,
    maximizable: true,
    transparent: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  });

  // Load the index.html of the app.
  if (dev_url)
    main_window.loadURL(dev_url);
  else {
    const index_path = `../renderer/${name}/index.html`
    main_window.loadFile(path.join(__dirname, index_path));
  }

  // Open the DevTools.
  main_window.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', main);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.


function main() {
  init_ipc_part_1();
  createWindow();
  init_ipc_part_2();
}

// Call this one before `main_window` is defined.
function init_ipc_part_1() {
  ipcMain.on("set_window_bounds", (e, x, y, width, height) => {
    console.log("resize:", x, y, width, height);
    const old_size = main_window.getSize();
    const new_w = (width < 0 ? old_size[0] : width);
    const new_h = (height < 0 ? old_size[1] : height);
    main_window.setBounds({x, y, width, height});
  });

  ipcMain.handle("get_window_bounds", e => {
    return main_window.getBounds();
  });

  ipcMain.on("minimize", e => {
    main_window.minimize();
  });

  ipcMain.on("toggle_maximized", e => {
    if (main_window.isMaximized())
      main_window.unmaximize()
    else main_window.maximize();
  });

  ipcMain.on("close", e => {
    main_window.close();
  });
}

// Call this one after `main_window` is defined.
function init_ipc_part_2() {
  main_window.on("maximize", after_maximization_changed);
  main_window.on("unmaximize", after_maximization_changed);

  function after_maximization_changed() {
    main_window.webContents.send(
      "after_maximization_changed", main_window.isMaximized()
    );
  }
}

