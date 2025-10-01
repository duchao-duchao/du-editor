const { contextBridge, clipboard } = require('electron');
const fs = require('fs');

contextBridge.exposeInMainWorld('electronAPI', {
  readDataFile: () => {
    return new Promise((resolve, reject) => {
      fs.readFile('./data.json', 'utf8', (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  },
  writeDataFile: (data) => {
    return new Promise((resolve, reject) => {
      fs.writeFile('./data.json', data, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  },
  copyToClipboard: (text) => {
    clipboard.writeText(text);
  }
});