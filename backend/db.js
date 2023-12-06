const mongoose = require("mongoose");

const db = {
    connect: function() {
        console.log("connecting to db...")
        mongoose.connect('mongodb+srv://yehorzudikhin17:V4VpSpDo4o2zywhF@cluster0.gc5vwvr.mongodb.net/')
            .then(() => {
                console.log("db conn successful")
            })
            .catch((e) => {
                console.log("db conn failed: ", e)
            })
    }
}

module.exports = db;