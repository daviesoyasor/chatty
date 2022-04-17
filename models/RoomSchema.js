const mongoose = require('mongoose')

const Schema = mongoose.Schema

const RoomSchema = new Schema({
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isGroupChat: {type: Boolean, default: false},
    groupName: { type: String, trim: true}
}, { timestamps: true });

module.exports = mongoose.model('Room', RoomSchema)