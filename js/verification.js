function conform_trans_amt_int(txt_trans_amt_int) {
    trans_amt_int = parseInt(txt_trans_amt_int.val());
    if(isNaN(trans_amt_int)) {
        trans_amt_int = 0;
    } else if (trans_amt_int < 0) {
        trans_amt_int = 0;
    } else if (trans_amt_int >= 1000000) {
        trans_amt_int = 999999;
    }

    txt_trans_amt_int.val(trans_amt_int == 0 ? '' : trans_amt_int);
    txt_trans_amt_int.data('data', {'trans_amt_int': trans_amt_int});

    return trans_amt_int;
}

function conform_trans_amt_decimal(txt_trans_amt_decimal) {
    trans_amt_decimal = parseInt(txt_trans_amt_decimal.val());
    if(isNaN(trans_amt_decimal)) {
        trans_amt_decimal = 0;
    } else if (trans_amt_decimal < 10) {
        trans_amt_decimal = trans_amt_decimal * 10;
    } else if (trans_amt_decimal >= 100) {
        trans_amt_decimal = 99;
    }
    
    txt_trans_amt_decimal.val(trans_amt_decimal == 0 ? '' : trans_amt_decimal);
    txt_trans_amt_decimal.data('data', {'trans_amt_decimal': trans_amt_decimal});

    return trans_amt_decimal;
}

function conform_trans_amt(div_group, trans_amt_int, trans_amt_decimal) {
    if(trans_amt_int == undefined) trans_amt_int = 0;
    if(trans_amt_decimal == undefined) trans_amt_decimal = 0.0;
    trans_amt = trans_amt_int + trans_amt_decimal / 100.0;

    div_group.data('data', {
        'trans_amt_int': trans_amt_int,
        'trans_amt_decimal': trans_amt_decimal,
        'trans_amt': trans_amt
    });

    return trans_amt;
}

function conform_trans_cat(txt_trans_cat, suggestion_box) {
    parent_div = txt_trans_cat.parent();
    if(suggestion_box.is(':visible')) {
        sel = suggestion_box.children('div:visible.selected');
        if(sel.length == 1) {
            txt_trans_cat.val(sel.data('data').trans_cat_display);
            parent_div.data('data', {
                'trans_cat_id': sel.data('data').trans_cat_id,
                'trans_cat_display': sel.data('data').trans_cat_display
            });
        } else {
            txt_trans_cat.val('');
            parent_div.removeData();
        }
        suggestion_box.hide();
    } else if (parent_div.data('data') == undefined) {
        txt_trans_cat.val('');
    } else if (txt_trans_cat.val() == parent_div.data('data').trans_cat_display) {
        txt_trans_cat.val(parent_div.data('data').trans_cat_display);
    } else {
        txt_trans_cat.val('');
        parent_div.removeData();
    }
}

function conform_trans_date(txt_trans_amt_yyyy, txt_trans_amt_mm, txt_trans_amt_dd) {
    dv = new DateValidator(txt_trans_amt_yyyy.val(), txt_trans_amt_mm.val(), txt_trans_amt_dd.val());
    if (dv.isCurrentYearValid) {
        yyyy = dv.currentYear();
        txt_trans_amt_yyyy.val(yyyy);
        txt_trans_amt_yyyy.data('data', {
            'yyyy': yyyy,
            'yyyy_display': yyyy
        });
    } else {
        txt_trans_amt_yyyy.val('');
        txt_trans_amt_yyyy.removeData();
    }

    if (dv.isCurrentMonthValid) {
        mm = dv.currentMonth();
        mm_display = mm < 10 ? '0' + mm : mm;
        txt_trans_amt_mm.val(mm_display);
        txt_trans_amt_mm.data('data', {
            'mm': mm,
            'mm_display': mm_display
        });
    } else {
        txt_trans_amt_mm.val('');
        txt_trans_amt_mm.removeData();
    }

    if (dv.isCurrentDayValid) {
        dd = dv.currentDay();
        dd_display = dd < 10 ? '0' + dd : dd;
        txt_trans_amt_dd.val(dd_display);
        txt_trans_amt_dd.data('data', {
            'dd': dd,
            'dd_display': dd_display
        });
    } else {
        txt_trans_amt_dd.val('');
        txt_trans_amt_dd.removeData();
    }

    if (dv.isDateValid) {
        txt_trans_amt_yyyy.parent().data('data', {
            'date': txt_trans_amt_yyyy.data('data').yyyy_display + '-'
                + txt_trans_amt_mm.data('data').mm_display + '-'
                + txt_trans_amt_dd.data('data').dd_display
        });
    } else {
        txt_trans_amt_yyyy.parent().removeData();
    }
}
