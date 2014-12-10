$(document).ready(function() {
    var a = new DateValidator('', '12', '');
    console.log(a.coalesceYear());
    console.log(a.coalesceMonth());
    console.log(a.coalesceDay());
})
