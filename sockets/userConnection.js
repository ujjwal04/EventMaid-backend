const Conversation = require('./../models/Conversation');

exports.assignRoom = async (room) => {
  try {
    // Search if the room already exists in the db
    const existingRoom = await Conversation.findById(
      room.from > room.to ? room.from + room.to : room.to + room.from
    );

    let roomId;
    // Creating new room
    if (!existingRoom) {
      const newRoom = await Conversation.create({
        from: room.from,
        to: room.to,
        _id: room.from > room.to ? room.from + room.to : room.to + room.from,
      });
      roomId = newRoom._id;
    } else {
      // If room already exists
      roomId = existingRoom._id;
    }
    return roomId;
  } catch (err) {
    return err;
  }
};

exports.saveMessage = async (roomId, message) => {
  try {
    const messageArray = await Conversation.findOne({
      _id: roomId,
    });

    if (!messageArray) {
      throw new Error('Conversation does not exist');
    }

    await Conversation.updateOne(
      { _id: roomId },
      {
        messages: [...messageArray.messages, message.data],
      }
    );
  } catch (err) {
    return err;
  }
};
