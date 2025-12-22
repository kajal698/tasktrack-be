// import multer from 'multer'


// // he disk storage engine gives you full control on storing files to disk.
// const storage = multer.diskStorage({ // descr is a call back fun n dit receve two parameter
//   destination: function (req, file, cb) { // in which folder we can store a file , cb means call back 
//     cb(null, './utils')
//   },
//   filename: function (req, file, cb) {
//    cd(null, `${Date.now()}- ${file.orignalname}`); //date is unique file name , file ke sath ek unique no append kr rhe hai   - Append means: add something to the end.(push in js)
//   }
// })   // null means error 

// const upload = multer({ storage: storage })

