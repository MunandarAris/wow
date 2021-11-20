const { users,profile,chats } = require('../../models');
const jwt = require('jsonwebtoken');
const {Op} = require("sequelize");

let  connectedUser = {};

const socketIo = (io) => {

    // Middleware
    io.use((socket,next) => {

        if(socket.handshake.auth && socket.handshake.auth.token)
        {
            next();
        }
        else
        {
            next(new Error("Not Authorization"));
        }

    });

    io.on('connection',(socket) => {

        const userId = socket.handshake.query.id;

        connectedUser[userId] = socket.id;

        // Get All Contact User
        socket.on('load customer contacts', async () => {
            try {

                let contactCustomers = await users.findAll({
                    include : [
                        {
                            model : profile,
                            as : "profile",
                            attributes : {
                                exclude : ['createdAt','updatedAt']
                            }
                        }
                    ],
                    where : {
                        role : "user"
                    },
                    attributes : {
                        exclude : ['createdAt','updatedAt','password']
                    }
                });

                contactCustomers = JSON.parse(JSON.stringify(contactCustomers))
                contactCustomers = contactCustomers.map(item => ({
                    ...item,
                }))

                socket.emit('customer contacts',contactCustomers);
                
            } catch (error) {
                console.log(error);
            }

        });

        // Get Contact Admin
        socket.on('load contact admin', async () => {

            const data = await users.findOne({
                where : {
                    role : "admin"
                }
            });

            socket.emit('contact admin',data);

        })

        // Send Message
        socket.on('send message', async (data) => {

            const token = socket.handshake.auth.token;
            const verifikasi = jwt.verify(token,process.env.TOKEN_KEY);
            const idSender = verifikasi.id;

            const {idRecipient,message} = data;

            await chats.create({
                idRecipient,
                idSender,
                message
            });

            io.to(socket.id).to(connectedUser[idRecipient]).emit('new message',data);

        })

        // Load Message
        socket.on('load message',async (data) => {

            const token = socket.handshake.auth.token;
            const verifikasi = jwt.verify(token,process.env.TOKEN_KEY);
            const idSender = verifikasi.id;
            const idRecipient = data;

            const messages = await chats.findAll({

                where : {
                    idSender: {
                        [Op.or]: [idRecipient, idSender]
                      },
                      idRecipient: {
                        [Op.or]: [idRecipient, idSender]
                      }
                }

            });

            socket.emit('messages',messages);

        });

        // User Disconnect
        socket.on('disconnect', () => {
            console.log('disc')
        })

    });
}

module.exports = socketIo