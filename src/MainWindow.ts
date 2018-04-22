import { BrowserWindow,  protocol, App } from "electron";
import * as url from "url";
import * as path from "path";
import { AppEvents, WindowEvents, Platforms } from "./Enumerations";


export class MainWindow {

    private static window: BrowserWindow;
    private app: App;

    constructor(app: App) {
        this.app = app;
        this.app.on(AppEvents.ready, this.create);
        this.app.on(AppEvents.windowAllClosed, this.windowAllClosed);
        this.app.on(AppEvents.activate, this.activate);
    }

    create() {
        MainWindow.window = new BrowserWindow({
            height: 600,
            width: 800
        });
        let pathName = path.join(__dirname, '../index.html');
        let urlObject: url.UrlObject = {
            pathname: pathName,
            protocol: "file",
            slashes: true
        };

        MainWindow.window.loadURL(url.format(urlObject));
        MainWindow.window.webContents.openDevTools();
        MainWindow.window.on(WindowEvents.closed, MainWindow.closed);
    }

    windowAllClosed() {
        if (process.platform !== Platforms.darwin) {
            this.app.quit();
        }
    }

    //activate needs to be lambda for us to be able to call this.create
    //Reference: https://stackoverflow.com/questions/21240775/typescript-calling-method-from-another-method-of-current-class
    activate = () => {
        if (MainWindow.window === null) {
            this.create();
        }
    }

    //closed needs to be static. - getting "listener argument must be a function"
    static closed(){
        MainWindow.window = null;
    }
}

