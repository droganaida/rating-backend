
var mongoose = require('../libs/mongoose'),

    Schema = mongoose.Schema;

var schema = new Schema({

    alias: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    votes: {
        type: Number,
        default: 0
    }
});

schema.index(
    {alias: 1}, {unique: true, dropDups: true}
);

schema.statics = {

    addRating: function(id, rating, callback){

        var Pages = this;

        Pages.update(
            {_id: id},
            {
                $inc: {
                    rating: rating,
                    votes: 1
                }
            }, function(err, opt){
                if (opt){
                    return callback(null, opt);
                } else {
                    return callback("Упс! Ошибочка вышла")
                }
            }
        )
    }
};

// Вставляем в консоль mongodb, чтобы заполнить базу
// use testrating
// db.pages.insert([{alias: "main"}, {alias: "test"}])

exports.Page = mongoose.model('Page', schema);