

var log = require('./libs/log')(module);
var Categories = require('./models/categories').Categories;
var Shops = require('./models/shops').Shops;
var Sliders = require('./models/sliders').Sliders;
var Myconfig = require('./libs/myconfig');
var Admin = require('./models/admins').Admin;

var Articles = require('./models/article').Article;


var async = require('async');




exports.commonMiddlew = function (req, res, next){

    async.parallel([
        getEnvirements,
        getPlatform,
        getCurrentDate,
        getCategories,
		getUserRights,
        getSliders,
        getArticles
    ], function(err, result){
        if (err){
            log.info('------ err ' + err);
            next();
        } else {
            next();
        }
    });







    //====================================================================================//
    //******************* getArticles ********************//
    //====================================================================================//
    function getArticles(callback){

        Articles.find({published: true}).sort({moderated: -1}).limit(8).exec(function(err, articles) {
            if (articles && (articles.length > 0)){
                res.locals.articles = articles;
                callback();
            } else {
                res.locals.articles = [];
                callback();
            }
        })

    }




    //====================================================================================//
    //******************* getSliders ********************//
    //====================================================================================//
    function getSliders(callback){


        Sliders.find({}, function (err, sliders) {
            if (sliders && (sliders.length > 0)){

                res.locals.sliders = sliders;
                callback();
            } else {
                res.locals.sliders = [];
                callback();
            }
        })
    }







    //====================================================================================//
    //******************* Get Admin Rights ********************//
    //====================================================================================//
    function getUserRights (callback){


        //=========================================================================//
        //================  Session Views ========================//
        //=========================================================================//
        if (!req.session.views){
            req.session.views = 0;
        }




        //=========================================================================//
        //================  User Rights ========================//
        //=========================================================================//
        if (req.session.user){

            Admin.findOne({_id: req.session.user}, function(err, user){
                if (err){
                    res.locals.adminrights = '';
                    res.locals.adminname = '';
                } else {


                    if (user.rights == 'superadmin'){
                        res.locals.adminrights = 'superadmin';
                    } else if (user.rights == 'vouchermoderator') {
                        res.locals.adminrights = 'vouchermoderator';
                    } else if (user.rights == 'shopmoderator'){
                        res.locals.adminrights = 'shopmoderator';
                    } else if (user.rights == 'blogmoderator'){
                        res.locals.adminrights = 'blogmoderator';
                    } else if (user.rights == 'callmoderator'){
                        res.locals.adminrights = 'callmoderator';
                    }


                    res.locals.adminname = user.username;

                    callback();

                }
            })

        } else {
            res.locals.adminrights = '';
            res.locals.adminname = '';
            callback();
        }
    }



    //==================================================================================================//
    //============================= getCategories =================================//
    //==================================================================================================//
    function getCategories(callback){

        Categories.find({clone: false}).exec(function(err, categories){
            if (categories && (categories.length > 0)){
                res.locals.categories = categories;
                callback();
            } else {
                res.locals.categories = [];
                callback();
            }
        })
    }






    //====================================================================================//
    //******************* Get Platform ********************//
    //====================================================================================//
    function getPlatform (callback){

        function isCallerMobile() {
            var ua = req.headers['user-agent'].toLowerCase(),
                isMobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(ua) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(ua.substr(0, 4));

            if (ua.indexOf('iemobile') != -1){
                res.locals.header = 'iemobile';
            } else {
                res.locals.header = 'normal';
            }


            return !!isMobile;
        }


        var isMobile = isCallerMobile();

        if (isMobile) {
            res.locals.platform = 'mobile';
        } else {
            res.locals.platform = 'desktop';
        }

        //res.locals.platform = 'mobile';


        callback();
    }






    //====================================================================================//
    //******************* Get Envirements ********************//
    //====================================================================================//
    function getEnvirements (callback){
        res.locals.domain = Myconfig.domain;
        res.locals.pagenoindex = '';
        res.locals.scripts = Myconfig.scripts;
        res.locals.styles = Myconfig.styles;
        res.locals.category = '';
        res.locals.page = '';
        res.locals.ratecount = 500;
        res.locals.votes = 100;

        res.locals.relarticles = [];

        callback();
    }








    //====================================================================================//
    //******************* Get Current Date ********************//
    //====================================================================================//
    function getCurrentDate (callback){

        var date = new Date();
        var month = date.getMonth();
        switch (month){
            case 0:
                month = 'Januar';
                break;
            case 1:
                month = 'Februar';
                break;
            case 2:
                month = 'März';
                break;
            case 3:
                month = 'April';
                break;
            case 4:
                month = 'Mai';
                break;
            case 5:
                month = 'Juni';
                break;
            case 6:
                month = 'Juli';
                break;
            case 7:
                month = 'August';
                break;
            case 8:
                month = 'September';
                break;
            case 9:
                month = 'Oktober';
                break;
            case 10:
                month = 'November';
                break;
            case 11:
                month = 'Dezember';
                break;
        }

        res.locals.currentdate = month;
        res.locals.fullyear = date.getFullYear();
        callback();
    }



};

