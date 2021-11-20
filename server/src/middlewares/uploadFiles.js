const multer = require('multer');

exports.uploadFiles = (file1,file2) => {

    const storage = multer.diskStorage({

        destination : function(req,file,cb){
            cb(null,"uploads")
        },
        filename : function(req,file,cb){
            cb(null, Date.now() + "-" + file.originalname.replace(/\s/g,""))
        }

    });

    const fileFilter = function(req,file,cb){

        if(file.filename === file1)
        {
            if(!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/))
            {
                req.fileValidatorError = {
                    message : "Please Insert Image Only"
                }
                return cb(new Error("Please Insert Image Only"),false);
            }
        }

        cb(null,true);

    };

    const sizeInMB = 10;
    const maxSize = sizeInMB * 1000 * 1000;

    const upload = multer({
        storage,
        fileFilter,
        limits : {
            fileSize : maxSize
        }
    }).fields([
        {
            name : file2
        },
        {
            name : file1
        }
    ])

    return (req,res,next) => {

        upload(req,res,function(err){

            if(req.fileValidatorError)
            {
                return res.status(400).send(req.fileValidatorError);
            }

            if(!req.file && !err)
            {
                return next()
            }

            if(err)
            {
                if(err.code == "LIMIT_FILE_SIZE")
                {
                    return res.status(400).send({
                        message : "File Max 10 MB"
                    });
                }

                return res.status(400).send(err);
            }

            return next();

        });

    }

}