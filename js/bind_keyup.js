function bind_keyup() {
    $('#input_category').keyup(function(e) {
        sug = $('#input_category > #suggestion-box');

        if($('#tran_category').val().length == 0) {
            sug.children().removeClass('selected');
            sug.hide();
            return;
        }

        sug.children('div').each(function () {
            if($(this).html().toLowerCase().indexOf($('#tran_category').val().toLowerCase()) > -1) {
                sug.show();
                $(this).show();
            } else {
                $(this).hide();
                $(this).removeClass('selected');
            }
        });

        switch(sug.children(':visible').length) {
            case 0:
                sug.hide();
                break;
            case 1:
                sug.children(':visible').addClass('selected');
                break;
        }
    });
}
