<?PHP
require_once("./include/user_config.php");
if(!$u->isLoggedIn()) {
    $u->redirectToURL("login.php");
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Money GoBanana Today!</title>
        <script src="http://code.jquery.com/jquery-1.11.0.min.js" charset="utf-8"></script>
        <script src="http://gobanana.today/DateValidator/DateValidator.js" charset="utf-8"></script>
        <script src="js/bind.js" charset="utf-8"></script>
        <link href='http://fonts.googleapis.com/css?family=Varela+Round|Open+Sans:300'
            rel='stylesheet' type='text/css'>
        <link type="text/css" rel="stylesheet" href="css/global.css"/>
        <link type="text/css" rel="stylesheet" href="css/nav-top.css"/>
        <link type="text/css" rel="stylesheet" href="css/nav-left.css"/>
        <link type="text/css" rel="stylesheet" href="css/new_transaction.css"/>
    </head>
    <body>
        <div id="nav-top">
            <a onclick="open_new_transaction()" href="#">New Transaction</a>
        </div>
        <div id="nav-left">
            <div class="nav-sec">
                <p>Timeframe</p>
                <ul>
                    <li><a class="selected" href="#">Today</a></li>
                    <li><a href="#">Yesterday</a></li>
                    <li><a href="#">This Week</a></li>
                    <li><a href="#">This Month</a></li>
                    <li><a href="#">This Quarter</a></li>
                    <li><a href="#">This Year</a></li>
                </ul>
            </div>
            <div class="nav-sec">
                <p>Category</p>
                <ul>
                    <li><a class="selected" href="#">All</a></li>
                    <li><a href="#">Restaurant</a></li>
                    <li><a href="#">Grocery</a></li>
                    <li><a href="#">Car</a></li>
                </ul>
            </div>
        </div>
        <div id="main">
        </div>
        <div id="new_transaction">
            <div></div>
            <div>
                <a onclick="close_new_transaction()" href="#"></a>
                <div id="exp-or-income">
                    <ul>
                        <li><a class="selected" href="#">Expense</a></li>
                        <li><a href="#">Income</a></li>
                    </ul>
                </div>
                <div id="expense_input">
                    <div id="input_amount" class="input">
                        <span>Amount</span>
                        <input id="amount_currency" type="text" placeholder="$" readonly/>
                        <input id="amount_int" type="text" placeholder="0"/>
                        <input id="amount_decimal" type="text" placeholder="00" />
                        <span>.</span>
                    </div>
                    <div id="input_category" class="input" data-opid="-1" data-opvalue="">
                        <span>Category</span>
                        <input id="tran_category" type="text" />
                        <div id="suggestion-box"></div>
                    </div>
                    <div id="input_date" class="input">
                        <span>Date</span>
                        <input id="date_month" type="text" placeholder="MM" />
                        <input id="date_day" type="text" placeholder="DD" />
                        <input id="date_year" type="text" placeholder="YYYY" />
                    </div>
                    <button id="btn_add_transaction" type="button" onclick="check_input_data_and_save()">Save</button>
                    <div id="similar_trans">
                        <p>* Enter the Amount above and we will find transactions with the same amount here to prevent double entries.</p>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
