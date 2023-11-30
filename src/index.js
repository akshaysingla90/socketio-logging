import { createServer } from "http";
import { Server } from "socket.io";
import logger from "./logger.js";
import wildcard from "socketio-wildcard";
import { homePageRequestHandler } from "./controller/home.js";
// import { resondToChat } from "./controller/chat.js";

const PORT = process.env.PORT || 3000;
// const httpServer = createServer(homePageRequestHandler);
// const io = new Server(httpServer, {
//   transports: ["websocket"],
//   cors: {
//     origin: "*",
//   },
// });

const io = new Server();


// io.use(wildcard());
io.use(function (socket, next){
  console.log('middelware', socket.id)
  socket.id = '1234'
  next()
});

io.on("connection", (socket) => {
  logger.info(`A client with socket id ${socket.id} connected!`);
  // Log ALL incoming socket events

  // socket.use((packet, next) => {
  //   console.log("Socket hit:=>", packet);
  //   let [eventName, eventData] = packet;
  //   logger.info({
  //     eventName: `[Listen] ${eventName}`,
  //     eventData,
  //     socketId: socket.id,
  //   });
  //   next();
  // });


  // socket.on("*", (packet) => {
  //   const [eventName, eventData] = packet.data;
  //   logger.info({
  //     eventName: `[Listen] ${eventName}`,
  //     eventData,
  //     socketId: socket.id,
  //   });
  // });

  // The original socket emitter
  // let _emit = socket.emit;
  // decorate emit function
  // Log ALL outgoing socket events
  // socket.emit = function () {
  //   _emit.apply(socket, arguments);
  //   let { 0: eventName, 1: eventData } = arguments;
  //   // logger.info({
  //   //   eventName: `[Emit] ${eventName}`,
  //   //   eventData :eventData + '   ---> '+socket.id ,
  //   //   socketId: socket.id,
  //   // });
  // };

  socket.on("disconnect", () => {
    logger.info("Socket disconnected!", socket.id);
  });
  // resondToChat(socket);
  socket.on("chat message", (data) => {
    console.log('Emit : ',data, socket.id)
    // socket.emit("chat message", data + socket.id);
    let targetClientId = "1234"
    io.sockets.sockets.get('1234')
    console.log('Socket id is conencted or not ',io.sockets.connected[targetClientId])
    io.to("1234").emit("chat message", data);
    // io.to(socket.id).emit("chat message", data);
  });




});

// httpServer.listen(PORT);
io.listen(process.env.SOCKET_PORT);
logger.info(`Server running at http://127.0.0.1:${PORT}/`);
