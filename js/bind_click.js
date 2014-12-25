function bind_click() {
    $('.nav-sec li a, #exp-or-income li a').click(function() {
        $(this).parent().siblings('li').children('a').removeClass('selected');
        $(this).addClass('selected');
        alert($(this).html());
    });

    $('#btn_add_transaction').click(function() {
        $(this).prop('disabled', true);
        save_transaction(
            $('#input_amount'),
            $('#input_category'),
            $('#input_date'),
            $(this));
    })
}
