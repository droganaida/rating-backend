
$( document ).ready(function() {

    $('.vote').on ('click', function(){

        $(this).addClass('active');

        var parent = $(this).parent().parent().parent().parent();

        var commentCountElement = parent.find('.commentscount');
        var ratingValueElement = parent.find('.ratingvalue');
        var textField = parent.find('.text');
        var votedValue = parseInt($(this).attr('data-score'));

        var data = {};
        data.id = $('.content').attr('id');
        data.rating = votedValue;

        $.ajax({
            url: '/',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function(data) {
            },
            error: function(data){

                textField.text(data.responseText);
                parent.addClass('voted');
                console.log('Сервер отправил ошибку: ' + data.responseText)
            }
        }).done(function(data){

                textField.text(textField.text() + votedValue);
                parent.addClass('voted');

                var commentCount = parseInt(commentCountElement.text());
                commentCountElement.text(commentCount + 1);

                var rating = parseFloat(ratingValueElement.text());
                rating = (commentCount * rating + votedValue)/(commentCount + 1);
                ratingValueElement.text(rating.toFixed(2));
            });

    });
});