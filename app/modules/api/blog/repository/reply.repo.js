const Reply = require("../model/reply");

class ReplyRepository {
    addReply = async (data) => {
        return await Reply.create(data);
    };
}

module.exports = new ReplyRepository();
