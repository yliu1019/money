$(document).ready(function() {
    bind_click();
    bind_keydown();
    bind_keyup();
    bind_focusout();

    $('#btn_add_transaction').focus(function() {
        $(this).css('background', '#ccc');
        $(this).css('color', 'black');
    })
});
