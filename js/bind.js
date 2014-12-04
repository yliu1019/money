$(document).ready(function() {
    $(document).on('click', '.nav-sec li a, #exp-or-income li a', function() { 
        item_click($(this));
    })

    $(document).keydown(function(e) {
        keys = {esc: 27};
        if(e.keyCode == keys.esc) {
            close_new_transaction();
        }
    });

    $('#amount_int').keydown(function(e) {
        keys = {dot: 190, enter: 13, bs: 8, left: 37, right: 39, tab: 9};
        if(e.keyCode == keys.dot || e.keyCode == keys.enter || e.keyCode == keys.tab) {
            $('#amount_decimal').focus();
            e.preventDefault();
        } else if (e.keyCode == keys.bs || e.keyCode == keys.left || e.keyCode == keys.right) {

        } else if (e.keyCode < 48 || e.keyCode > 57 || $('#amount_int').val().length >= 6) {
            e.preventDefault();
        }
    });

    $('#amount_decimal').keydown(function(e) {
        keys = {enter: 13, bs: 8, left: 37, right: 39, tab: 9};
        if(e.keyCode == keys.enter || e.keyCode == keys.tab) {
            $('#tran_category').focus();
            e.preventDefault();
        } else if (e.keyCode == keys.bs || e.keyCode == keys.left || e.keyCode == keys.right) {

        } else if (e.keyCode < 48 || e.keyCode > 57 || $('#amount_decimal').val().length >= 2) {
            e.preventDefault();
        }
    });

    $('#input_category').keydown(function(e) {
        keys = {enter: 13, tab: 9, up: 38, down: 40};
        var sug = $('#input_category > #suggestion-box');
        if(e.keyCode == keys.enter || e.keyCode == keys.tab) {
            if($('#input_category').data('subcategory') != undefined) {
                $('#tran_category').val($('#input_category').data('subcategory').value);
            }
            $('#date_month').focus();
            e.preventDefault();
        } else if (sug.is(":visible")) {
            if(e.keyCode == keys.up || e.keyCode == keys.down) {
                e.preventDefault();
            }
            var cur = sug.children('div:visible.selected');
            if(e.keyCode == keys.up) {
                if(cur.length > 0) {
                    if(cur.prevAll('div:visible').length > 0) {
                        sug.children().removeClass('selected');
                        var sel = cur.prevAll('div:visible').first();
                        sel.addClass('selected');
                        $('#input_category').data('subcategory', {
                            id: sel.data('subcategory').id,
                            value: sel.data('subcategory').value})
                    }
                } else {
                    var sel = sug.children('div:visible').last();
                    sel.addClass('selected');
                    $('#input_category').data('subcategory', {
                        id: sel.data('subcategory').id,
                        value: sel.data('subcategory').value})
                }
            } else if (e.keyCode == keys.down) {
                if(cur.length > 0) {
                    if(cur.nextAll('div:visible').length > 0) {
                        sug.children().removeClass('selected');
                        var sel = cur.nextAll('div:visible').first();
                        sel.addClass('selected');
                        $('#input_category').data('subcategory', {
                            id: sel.data('subcategory').id,
                            value: sel.data('subcategory').value})
                    }
                } else {
                    var sel = sug.children('div:visible').first();
                    sel.addClass('selected');
                    $('#input_category').data('subcategory', {
                        id: sel.data('subcategory').id,
                        value: sel.data('subcategory').value})
                }
            }
        }
    })

    $('#input_category').keyup(function(e) {
        var sug = $('#input_category > #suggestion-box');

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
        if(sug.children(':visible').length == 0) {
            sug.hide();
        } else if(sug.children(':visible').length == 1) {
            var sel = sug.children(':visible');
            sel.addClass('selected');
            $('#input_category').data('subcategory', {
                id: sel.data('subcategory').id,
                value: sel.data('subcategory').value})
        }
    })

    $('#input_category').focusout(function() {
        var sug = $('#suggestion-box');
        if(sug.children('div:visible.selected').length == 1) {
            var sel = sug.children('div:visible.selected');
            $('#input_category').data('subcategory', {
                id: sel.data('subcategory').id,
                value: sel.data('subcategory').value})
            $('#tran_category').val($('#input_category').data('subcategory').value);
        } else {
            $('#tran_category').val('');
            $('#input_category').removeData('subcategory');
        }
        sug.hide();
        $('#date_month').focus();
    })
})

function item_click(item) {
    item.parent().siblings('li').children('a').removeClass('selected');
    item.addClass('selected');
    alert(item.html());
}

function open_new_transaction() {
    $('#new_transaction').slideDown(200, init_new_transaction);
}

function init_new_transaction() {
    $.get('db.php?qtype=trans_cat', function(data) {
        $('#suggestion-box').empty();
        var categories = data.split('\\n');
        $.each(categories, function(index, value) {
            var fields = value.split('\\t');
            var display_category = fields[2] + " > " + fields[1];
            if(fields[1] == fields[2]) {
                display_category = fields[2];
            }
            $('#suggestion-box').append(
                $('<div>').data("subcategory",
                    {id: fields[0], value: display_category})
                    .html(display_category)
            );
        });

        $('#suggestion-box div').mouseover(function() {
            $('#suggestion-box div').removeClass('selected');
            $(this).addClass('selected');
        })

        $('#new_transaction > div:last-child').show();

        $('#amount_int').focus();
    });
}

function close_new_transaction() {
    $('#new_transaction').slideUp(200, function() {
        $('#new_transaction > div:last-child').hide();
    });
}

function check_input_data_and_save() {
    var transaction_amt = check_transaction_amount();
    var transaction_category = check_transaction_category();

    if(transaction_amt == undefined) {
        $('#amount_int').focus();
        return;
    }

    if(transaction_category == undefined) {
        $('#tran_category').focus();
        return;
    }

    console.log(transaction_amt);
    console.log(transaction_category);
}

function check_transaction_amount() {
    var amount_int = parseFloat($('#amount_int').val());
    var amount_decimal = parseFloat($('#amount_decimal').val());
    var transaction_amt = ((isNaN(amount_int) ? 0.0 : amount_int) +
        (isNaN(amount_decimal) ? 0.0 : amount_decimal) / 100.0);
    if(transaction_amt == 0.0) {
        $('#input_amount > span:first-child').css('color', 'red');
        return undefined;
    } else {
        $('#input_amount > span:first-child').css('color', '#ccc');
        return transaction_amt;
    }
}

function check_transaction_category() {
    if($('#input_category').data('subcategory') == undefined) {
        $('#input_category > span:first-child').css('color', 'red');
        return undefined;
    } else {
        $('#input_category > span:first-child').css('color', '#ccc');
        return $('#input_category').data('subcategory').id;
    }
}
