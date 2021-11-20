const multer = require('multer');

exports.updateFiles = (file1,file2) => {

    const storage = multer.diskStorage({

        destination : function(req,file,cb){
            cb(null,"uploads")
        },
        filename : function(req,file,cb){
            cb(null,Date.now() + "-" + file.originalname.replace(/\s/g,""))
        }

    });

    const upload = multer({

        storage

    }).fields([
        {
            name : file1
        },
        {
            name : file2
        }
    ]);

    return (req,file,next) => {

        upload(req,file,function(err){
            return next();
        });

    }

}