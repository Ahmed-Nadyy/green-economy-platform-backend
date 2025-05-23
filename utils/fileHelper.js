const fs = require('fs');
const path = require('path');

function isImage(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
}

function isVideo(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  return ['.mp4', '.mov', '.avi', '.mkv', '.webm'].includes(ext);
}

function deleteFile(filePath) {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error deleting file:', err);
    }
  });
}

module.exports = {
  isImage,
  isVideo,
  deleteFile
};
