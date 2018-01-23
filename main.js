//App Begins Here
const electron = require('electron');
const url = require('url');
const path = require('path');
const dialog = electron.dialog;
const fs = require('fs');
const ipc = require('electron').ipcMain;


//Define Const and vars
const {app , BrowserWindow , Menu , Dialog , Tray , protocol} = electron;
let mainWindow,aboutWindow,recordWindow;

//Bug ClearFix
fs.access('file.txt', fs.constants.F_OK , (err) => {
  console.log(err);
  if(err != undefined){
    fs.writeFile( 'file.txt' , '');
  }
});


//Record Window
let recordOpenWindow = () => {
  recordWindow = new BrowserWindow({
    width:800,
    height:600,
    title: "Record - Sound",
    icon: path.join(__dirname , 'assets/img/sound-logo.png') 
  });
  recordWindow.loadURL(url.format({
    pathname: path.join(__dirname , 'recordWindow.html'),
    protocol: 'file:',
    slashes: true
  })); 
  // recordWindow.setMenu(null);
}

//About Window
let aboutopenWindow = () => {
  aboutWindow = new BrowserWindow({
    width: 400,
    height:300,
    title: "About - Sound",
    icon: path.join(__dirname , 'assets/img/sound-logo.png') 
  });
  aboutWindow.loadURL(url.format({
    pathname: path.join(__dirname , 'versionWindow.html'),
    protocol: 'file:',
    slashes: true
  })); 
  aboutWindow.setMenu(null);
}

//File Open Function
let openThatFile = () => {
  dialog.showOpenDialog(
    {
      title: "Open Audio Files",
      properties: ['openFile', 'multiSelections'], 
      filters: [{name:"MP3 Files", extensions:['mp3','ogg','wav']}]
    },(filepath) => {
      if(filepath == undefined){return}
      for(i=0; i < filepath.length; i++){
        fs.appendFile('file.txt', filepath[i] + "\n");
      }
      mainWindow.reload();
    }
  );
}
//Open Directory Function
let openThatDir = () => {

  dialog.showOpenDialog(
    {
      title:"Open Folder",
      properties: ['openDirectory']
    },(filepath) => { 
      if(filepath == undefined){return}
      fs.writeFile('file.txt', '');
      for(i=0; i < filepath.length; i++ ){
        let theFiles = fs.readdirSync(filepath[i]);
        for(var e in theFiles){
          if(path.extname(theFiles[e]) === ".mp3") {
            let theFileURL = filepath + "/" + theFiles[e];
            fs.appendFile('file.txt', theFileURL + "\n");    
          }
        }
      }
      mainWindow.reload();  
    }
  );

}

//Listen for app to be ready
app.on('ready', () => {
  const appIcon = new Tray( path.join(__dirname , 'assets/img/sound-logo.png') );
  //Creating Windows
  const {width , height} = electron.screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    width,
    height,
    icon: path.join(__dirname , 'assets/img/sound-logo.png') 
  });

  //loading html into the window
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname , 'mainWindow.html'),
    protocol: 'file:',
    slashes: true
  })); 
  const menu = Menu.buildFromTemplate(headermenu);
  Menu.setApplicationMenu(menu);

  if(process.platform == "darwin"){
    const dashMenu = Menu.buildFromTemplate(theDashDockMenu);
    app.dash.setMenu(dashMenu);
  }else if(process.platform == "win32"){

    app.setUserTasks([
      {
        program: process.execPath,
        arguments: '--quit-please',
        iconPath: process.execPath,
        iconIndex: 0,
        title: 'Quit Sound',
        iconPath: path.join(__dirname , 'assets/icons/win32.ico')
      }
    ])

  }
  //Listen app quit
  mainWindow.on("closed",() => {
    aboutWindow = null;
    app.quit();
  });
  mainWindow.on("close",() => {
    aboutWindow = null;
    app.quit();
  });
  let recentPlayList = fs.readFileSync('file.txt').toString().split("\n");
  for(i = 0; i < recentPlayList.length; i++ ){
    app.addRecentDocument( recentPlayList[i] );
  }

});





//Menu
const headermenu = [
 {
    label: "File",
    submenu:[
      {
        label: "Open Audio Files",
        accelerator: process.platform == "darwin" ? "Command + O" : "Ctrl + O",
        click(){ openThatFile(); }
      },
      {
        label: "Open Directory",
        accelerator: process.platform == "darwin" ? "Command + Shift + O" : "Ctrl + Shift + O",
        click(){ openThatDir(); }
      },
      // {
      //   label: "Record Microphone",
      //   accelerator: process.platform == "darwin" ? "Command + R" : "Ctrl + R",
      //   click(){
      //     recordOpenWindow();
      //   }
      // },
      {
        label: "Quit",
        accelerator: process.platform == "darwin" ? "Command + Q" : "Ctrl + Q",
        click(){
          app.quit();
        }
      }
    ]
  },
  {
    label: "About",
    click(){
      aboutopenWindow();
    }
  }
];// menu 

//Dock Menu
const theDashDockMenu = [
  {label: 'Open File' , click() { openThatFile() } },
  {label: 'Open Directory', click() { openThatDir() } },
  {label: 'Quit', click () { app.quit() }}
];




//Fix electron issue on darwin
if(process.platform == "darwin"){ 
  headermenu.unshift({});
}
//Developer Tools if !in_production

if(process.env.NODE_ENV !== "production"){
  headermenu.push({
    label: "Developer Tools",
    submenu: [
      {
        label:"Toggle",
        accelerator : process.platform == "darwin" ? "Cmd+Alt+I" : "Ctrl+Shift+I",
        click(item,focusedWindow){
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: "reload"
      }
    ]
  });
}
// // Now The App is Gonna Publish So It is Better to Comment it!



//Support for Double-Click and OpenFiles
app.on('will-finish-launching', ()=>{

  // if(process.platform == "win32"){
    ipc.on('get-file-data', function(event) {
      var data = null;
      if (process.platform != 'darwin' && process.argv.length >= 2) {
        var openFilePath = process.argv[1];
        fs.append('file.txt', openFilePath);
      }
    });
  // }

  app.on('open-file', function(event, filePath){
    event.preventDefault();
    if(filepath == undefined){return}
    for(i=0; i < filepath.length; i++){
      fs.appendFile('file.txt', filepath[i] + "\n");
    }
    mainWindow.reload();
  });
  
});