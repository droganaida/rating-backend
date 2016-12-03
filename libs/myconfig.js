
var myconfig = {};

myconfig.port = 3001;

//============================================================//
//***************** Mongoose *******************//
//============================================================//
myconfig.mongoose = {
    "uri": "mongodb://127.0.0.1/testrating",
        "options": {
        "server": {
            "socketOptions": {
                "keepAlive": 1
            }
        }
    }
};


//============================================================//
//***************** Session *******************//
//============================================================//
myconfig.session = {
    "secret": "blondieCode",
        "key": "sid",
        "cookie": {
        "path": "/",
            "httpOnly": true,
//            "maxAge": null
            "maxAge": 9 * 1000
    }
};


module.exports = myconfig;