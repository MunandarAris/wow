const { books,bookPlaylists } = require('../../models');

const Joi = require('joi');

const fs = require('fs');
const { send } = require('process');

exports.addBook = async (req,res) => {

    //Create validation
    const schema = Joi.object({
        title : Joi.string().required(),
        pages : Joi.number().required(),
        publicationDate : Joi.date().required(),
        author : Joi.string().required(),
        isbn : Joi.number().required(),
        aboutBook : Joi.string().required()
    });

    const { error } = schema.validate(req.body);

    if(error)
    {
        return res.status(400).send({
            status : "Failed",
            message : error.details[0].message
        });
    }

    try {

        const addBook = await books.create({
            title : req.body.title,
            pages : req.body.pages,
            author : req.body.author,
            publicationDate : req.body.publicationDate,
            isbn : req.body.isbn,
            aboutBook : req.body.aboutBook,
            bookFile : req.files.bookFile[0].filename,
            bookCover : req.files.bookCover[0].filename,
        });

        let book = await books.findOne({
            where : {
                id : addBook.id
            },
            attributes : {
                exclude : ["createdAt","updatedAt"]
            }
        });

        book = {
            ...book.dataValues,
            bookFile : process.env.PATH_FILE + book.dataValues.bookFile,
            bookCover : process.env.PATH_FILE + book.dataValues.bookCover,
            
        }
        
        res.send({
            status : "Success",
            data : {
                book
            }
        });
        
    } catch (error) {
        
        console.log(error);
        req.send({
            status : "Error",
            message : "Server Error"
        })

    }

}

exports.getBooks = async (req,res) => {

    let dataBooks = await books.findAll({

        attributes : {
            exclude : ["createdAt","updatedAt"]
        }

    });

    dataBooks = dataBooks.map(item => {

        return {
            ...item.dataValues,
            bookCover : process.env.PATH_FILE + item.dataValues.bookCover
        }

    });

    try {

        res.send({
            status : "Success",
            data  : {
                books : dataBooks
            }
        })
        
    } catch (error) {
        
        console.log(error);
        res.send({
            status : "Error",
            message : "Server Error"
        })

    }

}

exports.getBook = async (req,res) => {

    const {id} = req.params;

    let dataBook = await books.findOne({
        where : {
            id
        },
        attributes : {
            exclude : ["createdAt","updatedAt"]
        }
    });

    if(!dataBook)
    {
        return res.status(400).send({
            status : "Failed",
            message : "Data Not Found"
        });
    }

    dataBook = {
        ...dataBook.dataValues,
        bookFile : process.env.PATH_FILE + dataBook.dataValues.bookFile,
        bookCover : process.env.PATH_FILE + dataBook.dataValues.bookCover
    }

    try {

        res.send({
           
            status : "Success",
            data : {
                book : dataBook
            }

        });
        
    } catch (error) {
        
        console.log(error);
        res.send({
            status : "Error",
            message : "Server Error"
        })

    }

}

exports.updateBook = async (req,res) => {

    //Create validation
    const schema = Joi.object({
        title : Joi.string().required(),
        pages : Joi.number().required(),
        publicationDate : Joi.date().required(),
        author : Joi.string().required(),
        isbn : Joi.number().required(),
        aboutBook : Joi.string().required()
    });
    

    const { error } = schema.validate(req.body);

    if(error)
    {
        return res.status(400).send({
            status : "Failed",
            message : error.details[0].message
        });
    }

    const {id} = req.params;

    const newData = req.body;

    try {

        const book = await books.findOne({
            where : {
                 id
            }
        });

        if(Object.keys(req.files).length === 0){

            await books.update({...newData},{
                where : {
                    id
                }
            });
        }
        else if(!req.files?.bookCover)
        {

            fs.unlinkSync("uploads/" + book.bookFile);
            await books.update({...newData,bookFile : req.files.bookFile[0].filename},{
                where : {
                    id
                }
            });
        }
        else if(!req.files?.bookFile)
        {
            fs.unlinkSync("uploads/" + book.bookCover);
            await books.update({...newData,bookCover : req.files.bookCover[0].filename},{
                where : {
                    id
                }
            });
        }
        else if(req.files.bookCover.length > 0 && req.files.bookFile.length > 0)
        {
            fs.unlinkSync("uploads/" + book.bookCover);
            fs.unlinkSync("uploads/" + book.bookFile);
            await books.update({...newData,bookCover : req.files.bookCover[0].filename,bookFile : req.files.bookFile[0].filename},{
                where : {
                    id
                }
            });
        }

        

        let dataBook = await books.findOne({
            where : {
                id
            },
            attributes : {
                exclude : ["createdAt","updatedAt"]
            }
        });

        dataBook = {
            ...dataBook.dataValues,
            bookCover : process.env.PATH_FILE + dataBook.dataValues.bookCover
        }

        res.send({
            status : "Success",
            data : {
                book : dataBook
            }
        })
        
    } catch (error) {
        
        console.log(error);
        res.send({
            status : "Error",
            message : "Server Error"
        });

    }

}

exports.deleteBook = async (req,res) => {

    const {id} = req.params;

    const book = await books.findOne({
        where : {
            id
        }
    });

    await bookPlaylists.destroy({
        where : {
            idBook : id
        }
    });

    if(!book)
    {
        res.status(400).send({
            status : "Failed",
            message : "Data Not Found"
        });
    }

    fs.unlinkSync("uploads/" + book.bookFile);
    fs.unlinkSync("uploads/" + book.bookCover);

    await books.destroy({
        where : {
            id
        }
    });

    try {

        res.send({
            status : "Success",
            data : {
                id : id
            }
        })
        
    } catch (error) {
        
        console.log(error);
        res.send({
            status : "Error",
            message : "Server Error"
        });

    }

}