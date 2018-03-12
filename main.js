//App Begins Here
const electron = require('electron');
const url = require('url');
const path = require('path');
// const dialog = electron.dialog;
const fs = require('fs');
// const ipc = require('electron').ipcMain;
const os = require('os');

//Define Const and vars
const {app , BrowserWindow , Menu , dialog } = electron;
let mainWindow,aboutWindow,recordWindow;

//Bug ClearFix
let filetoload = `${os.tmpdir()}/sound.prog`;
if(!fs.existsSync(filetoload)) {
  fs.writeFile(filetoload , '', (err) => {if(err) console.log(err)});
}



//About Window
let aboutopenWindow = () => {
  aboutWindow = new BrowserWindow({
    width: 400,
    height:400,
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
let processargvLength = process.argv.length;
for(i=0; i<processargvLength; i++){
  let ext = process.argv[i].split('.').pop();
  if((ext == 'mp3') || (ext == 'ogg') || (ext == 'wav')){
    fs.appendFile(filetoload, process.argv[i] + "\n");
  }
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
        fs.appendFile(filetoload, filepath[i] + "\n");
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
      fs.writeFile(filetoload, '');
      for(i=0; i < filepath.length; i++ ){
        let theFiles = fs.readdirSync(filepath[i]);
        for(var e in theFiles){
          if((path.extname(theFiles[e]) === ".mp3")  || (path.extname(theFiles[e]) === ".ogg") || path.extname(theFiles[e]) === ".wav") {
            let theFileURL = filepath + "/" + theFiles[e];
            fs.appendFile(filetoload, theFileURL + "\n");    
          }
        }
      }
      mainWindow.reload();  
    }
  );

}

//Listen for app to be ready
app.on('ready', () => {
  mainWindow = new BrowserWindow({
    minHeight: 600,
    minWidth: 800,
    icon: path.join(__dirname , 'assets/img/sound-logo.png') 
  });

  //loading html into the window
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname , 'mainWindow.html'),
    protocol: 'file:',
    slashes: true
  })); 
  setTimeout(() => {
    mainWindow.maximize();
  }, 2000);
  
  const menu = Menu.buildFromTemplate(headermenu);
  Menu.setApplicationMenu(menu);

  // if(process.platform == "darwin"){
  //   const dashMenu = Menu.buildFromTemplate(theDashDockMenu);
  //   app.dash.setMenu(dashMenu);
  // }else if(process.platform == "win32"){

  //   app.setUserTasks([
  //     {
  //       program: process.execPath,
  //       arguments: '--quit-please',
  //       iconPath: process.execPath,
  //       iconIndex: 0,
  //       title: 'Quit Sound',
  //       iconPath: path.join(__dirname , 'assets/icons/win32.ico')
  //     }
  //   ])

  // }
  //Listen app quit
  mainWindow.on("closed",() => {
    aboutWindow = null;
    app.quit();
  });
  mainWindow.on("close",() => {
    aboutWindow = null;
    app.quit();
  });
  // let recentPlayList = fs.readFileSync('file.txt').toString().split("\n");
  // for(i = 0; i < recentPlayList.length; i++ ){
  //   app.addRecentDocument( recentPlayList[i] );
  // }

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
// const theDashDockMenu = [
//   {label: 'Open File' , click() { openThatFile() } },
//   {label: 'Open Directory', click() { openThatDir() } },
//   {label: 'Quit', click () { app.quit() }}
// ];




//Fix electron issue on darwin
if(process.platform == "darwin"){ 
  headermenu.unshift({});
}
//Developer Tools if !in_production

// if(process.env.NODE_ENV !== "production"){
//   headermenu.push({
//     label: "Developer Tools",
//     submenu: [
//       {
//         label:"Toggle",
//         accelerator : process.platform == "darwin" ? "Cmd+Alt+I" : "Ctrl+Shift+I",
//         click(item,focusedWindow){
//           focusedWindow.toggleDevTools();
//         }
//       },
//       {
//         role: "reload"
//       }
//     ]
//   });
// }
// // Now The App is Gonna Publish So It is Better to Comment it!

/////////////////////////////////////////////////////////////////////////////
// Only one Instance
const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
  if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
  }
});

if (isSecondInstance) {
  app.quit()
}