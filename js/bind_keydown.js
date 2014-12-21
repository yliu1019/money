function bind_keydown() {
    var keys = {shift: 16, dot: 190, enter: 13, bs: 8, left: 37, right: 39, tab: 9, esc: 27, up: 38, down: 40, s: 83};

    $(document).keydown(function(e) {
        if(e.keyCode == keys.esc) {
            close_new_transaction();
        } else if (e.keyCode == keys.s && e.ctrlKey) {
            $('#quick_search').focus();
            e.preventDefault();
        }
    });

    $('#amount_int').keydown(function(e) {
        if(e.shiftKey && e.keyCode == keys.tab) {
            $('#date_year').focus();
        } else if (e.keyCode == keys.dot || e.keyCode == keys.enter || e.keyCode == keys.tab) {
            $('#amount_decimal').focus();
        } else if (e.keyCode == keys.bs || e.keyCode == keys.left || e.keyCode == keys.right || (e.keyCode >= 48 && e.keyCode <= 57 && $('#amount_int').val().length < 6)) {
            return;
        }
        e.preventDefault();
    });

    $('#amount_decimal').keydown(function(e) {
        if(e.shiftKey && e.keyCode == keys.tab) {
            $('#amount_int').focus();
        } else if(e.keyCode == keys.enter || e.keyCode == keys.tab) {
            $('#tran_category').focus();
        } else if (e.keyCode == keys.bs || e.keyCode == keys.left || e.keyCode == keys.right || (e.keyCode >= 48 && e.keyCode <= 57 && $(this).val().length - $(this).selection('get').length < 2)) {
            return;
        }
        e.preventDefault();
    });

    $('#input_category').keydown(function(e) {
        if(e.shiftKey && e.keyCode == keys.tab) {
            $('#amount_decimal').focus();
        } else if (e.keyCode == keys.enter || e.keyCode == keys.tab) {
            $('#date_month').focus();
        } else if (e.keyCode == keys.up || e.keyCode == keys.down) {
            sug = $('#input_category > #suggestion-box');
            cur = sug.children('div:visible.selected');
            if (cur.length == 0) {
                sel = e.keyCode == keys.up ? sug.children('div:visible').last() : sug.children('div:visible').first();
                sel.addClass('selected');
            } else {
                available_options_cnt = e.keyCode == keys.up ? cur.prevAll('div:visible').length : cur.nextAll('div:visible').length;
                if (available_options_cnt > 0) {
                    sug.children().removeClass('selected');
                    sel = e.keyCode == keys.up ? cur.prevAll('div:visible').first() : cur.nextAll('div:visible').first();
                    sel.addClass('selected');
                }
            }
        } else {
            return;
        }
        e.preventDefault();
    });

    $('#date_month').keydown(function(e) {
        if (e.shiftKey && e.keyCode == keys.tab) {
            $('#input_category').focus();
        } else if (e.keyCode == keys.enter || e.keyCode == keys.tab) {
            $('#date_day').focus();
        } else if (e.keyCode == keys.up || e.keyCode == keys.down) {
            cur = new DateValidator($('#date_year').val(), $('#date_month').val(), $('#date_day').val());
            if(e.keyCode == keys.up)
                $('#date_month').val(cur.nextMonth().coalesceMonth());
            else {
                $('#date_month').val(cur.previousMonth().coalesceMonth());
            }
        } else if (e.keyCode == keys.bs || e.keyCode == keys.left || e.keyCode == keys.right || (e.keyCode >= 48 && e.keyCode <= 57 && $('#date_month').val().length < 2)) {
            return;
        }
        e.preventDefault();
    });

    $('#date_day').keydown(function(e) {
        if (e.shiftKey && e.keyCode == keys.tab) {
            $('#date_month').focus();
        } else if (e.keyCode == keys.enter || e.keyCode == keys.tab) {
            $('#date_year').focus();
        } else if (e.keyCode == keys.up || e.keyCode == keys.down) {
            cur = new DateValidator($('#date_year').val(), $('#date_month').val(), $('#date_day').val());
            if(e.keyCode == keys.up)
                $('#date_day').val(cur.nextDay().coalesceDay());
            else {
                $('#date_day').val(cur.previousDay().coalesceDay());
            }
        } else if (e.keyCode == keys.bs || e.keyCode == keys.left || e.keyCode == keys.right || (e.keyCode >= 48 && e.keyCode <= 57 && $('#date_day').val().length < 2)) {
            return;
        }
        e.preventDefault();
    });

    $('#date_year').keydown(function(e) {
        if (e.shiftKey && e.keyCode == keys.tab) {
            $('#date_day').focus();
        } else if (e.keyCode == keys.enter) {
            $('#btn_add_transaction').focus();
        } else if (e.keyCode == keys.tab) {
            $('#amount_int').focus();
        } else if (e.keyCode == keys.up || e.keyCode == keys.down) {
            cur = new DateValidator($('#date_year').val(), $('#date_month').val(), $('#date_day').val());
            if(e.keyCode == keys.up)
                $('#date_year').val(cur.nextYear().coalesceYear());
            else {
                $('#date_year').val(cur.previousYear().coalesceYear());
            }
        } else if (e.keyCode == keys.bs || e.keyCode == keys.left || e.keyCode == keys.right || (e.keyCode >= 48 && e.keyCode <= 57 && $('#date_year').val().length < 4)) {
            return;
        }
        e.preventDefault();
    });
}
