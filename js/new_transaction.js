function render_similar_transactions(output, data) {
    if(data == '') {
        output.children(".no_data").show();
        output.children(".have_data").hide();
    } else {
        result = $('\
            <table>\
                <thead>\
                    <tr>\
                        <th>Date</th>\
                        <th>Category</th>\
                        <th>Subcategory</th>\
                        <th>Amount</th>\
                        <th>Confirmed</th>\
                    </tr>\
                </thead>\
                <tbody></tbody>\
            </table>\
        ');
        rows = data.split('\\n');
        $.each(rows, function(i, row) {
            if(row != '') {
                fields = row.split('\\t');
                if(fields[5] == '0') {
                    confirmed = $('<td><button type="button">confirm</button></td>');
                } else {
                    confirmed = $('<td>confirmed</td>');
                }
                htmlRow = $('<tr><td>'+fields[1].substring(0, 10)+'</td><td>'+fields[2]+'</td><td>'+fields[3]+'</td><td>'+fields[4]+'</td></tr>');
                htmlRow.data('data', {'transaction_id': fields[0]});
                htmlRow.append(confirmed);
                result.children('tbody').append(htmlRow);
            }
        })

        result.find('button').click(function() {
            $.post("db.php?qtype=confirm_transaction",
                {transaction_id: $(this).parent().parent().data('data').transaction_id}
            ).done(function(result) {
                if(result == 'ok') {
                    alert('confirmed');
                }
            });
        });

        output.children(".have_data").empty();
        output.children(".have_data").append(result);
        output.children(".no_data").hide();
        output.children(".have_data").show();
    }
}

function save_transaction(amount, category, date) {
    amount_passed = true;
    category_passed = true;
    date_passed = true;

    if(amount.data('data') == undefined) {
        amount_passed = false;
        amount.children('span').first().css('color', 'red');
    } else if (amount.data('data').trans_amt > 0) {
        amount.children('span').first().css('color', '#ccc');
    } else {
        amount_passed = false;
        amount.children('span').first().css('color', 'red');
    }

    if(category.data('data') == undefined) {
        category_passed = false;
        category.children('span').first().css('color', 'red');
    } else {
        category.children('span').first().css('color', '#ccc');
    }

    if(date.data('data') == undefined) {
        date_passed = false;
        date.children('span').first().css('color', 'red');
    } else {
        date.children('span').first().css('color', '#ccc');
    }

    if(amount_passed == false) {
        amount.children('input:not([readonly])').first().focus();
        return;
    }

    if(category_passed == false) {
        category.children('input:not([readonly])').first().focus();
        return;
    }

    if(date_passed == false) {
        date.children('input:not([readonly])').first().focus();
        return;
    }

    $.post("db.php?qtype=new_transaction", {
        amount: amount.data('data').trans_amt,
        category: category.data('data').trans_cat_id,
        date: date.data('data').date
    }, function(result) {
        if(result == 'ok') {
            amount.children('span').first().css('color', '#ccc');
            category.children('span').first().css('color', '#ccc');
            date.children('span').first().css('color', '#ccc');
            amount.children('input:not([readonly])').val('');
            category.children('input:not([readonly])').val('');
            amount.removeData();
            category.removeData();
            $('#similar_trans').children(".no_data").show();
            $('#similar_trans').children(".have_data").hide();
            amount.children('input:not([readonly])').first().focus();
        };
    });
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
                $('<div>').data("data", {
                    'trans_cat_id': fields[0],
                    'trans_cat_display': display_category
                }).html(display_category)
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
