$(document).ready(function() {
    var a = new DateValidator($('#date_month').val(), '23', '2014');
    a.previousMonth();
    a.nextMonth();
})
