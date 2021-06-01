const Conversation = require('./../models/Conversation');
const Chat = require('./../models/Chat');

exports.assignRoom = async (room) => {
  try {
    // Search if the room already exists in the db
    const existingRoom = await Conversation.findOne({
      from: room.from < room.to ? room.from : room.to,
      to: room.from < room.to ? room.to : room.from,
    });

    let roomId;
    // Creating new room
    if (!existingRoom) {
      const newRoom = await Conversation.create({
        from: room.from < room.to ? room.from : room.to,
        to: room.from < room.to ? room.to : room.from,
      });
      roomId = newRoom._id;
    } else {
      // If room already exists
      roomId = existingRoom._id;
    }
    return roomId;
  } catch (err) {
    console.log(err);
    return err;
  }
};

exports.saveMessage = async (message) => {
  try {
    const messageArray = await Conversation.findOne({
      from: message.from < message.to ? message.from : message.to,
      to: message.from < message.to ? message.to : message.from,
    });

    if (!messageArray) {
      throw new Error('Conversation does not exist');
    }

    const newChat = await Chat.create({
      data: message.data,
    });

    await Conversation.updateOne(
      { _id: messageArray._id },
      {
        messages: [...messageArray.messages, newChat._id],
      }
    );
    return messageArray._id;
  } catch (err) {
    return err;
  }
};
