const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    roomId: { type: Schema.Types.ObjectId, ref: 'Room'},
    sender: { type: Schema.Types.ObjectId, ref: 'User'},
    content: { type: String}
}, { timestamps: true })

module.exports = mongoose.model('Message', MessageSchema)