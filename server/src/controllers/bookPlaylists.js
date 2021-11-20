const { bookPlaylists, books, users } = require("../../models");

const Joi = require("joi");

exports.addBookPlaylist = async (req,res) => {

    const schema = Joi.object({
        idBook : Joi.required()
    });

    const {error} = schema.validate(req.body);

    if(error)
    {
        return res.status(400).send({
            status : "Failed",
            message : error.details[0].message
        });
    }

    const idUser = req.user.id;
    const idBook = req.body.idBook;

    const bookExists = await books.findOne({
        where : {
            id : idBook
        }
    });

    if(!bookExists)
    {
        return res.status(400).send({
            status : "Failed",
            message : "Book Not Found"
        });
    }

    
    const bookPlaylistExists = await bookPlaylists.findAll({
        where : {
            idUser,
            idBook
        }
    });

    if(bookPlaylistExists.length > 0)
    {
        return res.status(400).send({
            status : "Failed",
            message : "Book Already In Playlist"
        });
    }

    const createPlaylist = await bookPlaylists.create({
        idUser,
        idBook
    });

    const data = await bookPlaylists.findOne({
        where : {
            id : createPlaylist.id
        },
        include : [
            {
                model : users,
                as : "user",
                attributes : {
                    exclude : ["email","password","role","createdAt","updatedAt"]
                }
            },
            {
                model : books,
                as : "book",
                attributes : {
                    exclude : ["publicationDate","pages","bookFile","aboutBook","createdAt","updatedAt"]
                }
            }
        ],  
        attributes : {
            exclude : ["idBook","idUser","createdAt","updatedAt"]
        }
    });

    try {

        res.send({
            status : "Success",
            data : {
                bookplaylist : data
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

exports.getBookPlaylists = async (req,res) => {

    const idUser = req.user.id;

    let data = await bookPlaylists.findAll({
        where : {
            idUser
        },
        include : [
            {
                model : users,
                as : 'user',
                attributes : {
                    exclude : ['email','password','role','createdAt','updatedAt']
                }
            },
            {
                model : books,
                as : 'book',
                attributes : {
                    exclude : ["publicationDate","pages","aboutBook","createdAt","updatedAt"]
                }
            }
        ],
        attributes : {
            exclude : ['idUser','idBook','createdAt','updatedAt']
        }
    });

    data = data.map(item => {

        return {
            ...item.dataValues,
            bookCover : process.env.PATH_FILE + item.book.dataValues.bookCover
     
        }

    });

    try {

        res.send({
            status : "Success",
            data : {
                bookPlaylists : data
            }
        });
        
    } catch (error) {
        
        console.log(error);
        res.send({
            status : "Error",
            message : "Server Error"
        });

    }

}

exports.deleteBookList = async (req,res) => {

    const idUser = req.user.id;
    const idBook = req.body.idBook;
    
    try {

        const data = await bookPlaylists.findOne({
            where : {
                idUser,
                idBook
            }
        });

        await bookPlaylists.destroy({
            where : {
                id : data.id
            }
        });

        res.send({
            status : "Success",
            message : "Data Successfully Delete"
        })
        
    } catch (error) {
        console.log(error);
        res.send({
            status : "Failed",
            message : "Server Error"
        })
    }

}