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
        <script src="http://code.jquery.com/jquery-1.11.0.min.js"
            charset="utf-8"></script>
        <link href='http://fonts.googleapis.com/css?family=Raleway'
            rel='stylesheet' type='text/css'>
        <link href='http://fonts.googleapis.com/css?family=Ubuntu'
            rel='stylesheet' type='text/css'>
        <link type="text/css" rel="stylesheet" href="css/style.css"/>
    </head>
    <body>
        <div id="left-nav">
            <div id="nav-main">
                <ul>
                    <li class="logo"><p>logo<p></li>
                    <li class="unselected"><p>Overview</p></li>
                    <li class="selected"><p>Expenses</p></li>
                    <li class="unselected"><p>Incomes</p></li>
                </ul>
            </div>
        </div>
        <div id="main">
            <div id="main-header">
                <div><p>Nov. 19 2014<span>Wednesday</span></p></div>
                <div><p>Thomas Wang</p></div>
            </div>
            <div id="main-content">
                <div>
                    <ul>
                        <li class="selected"><p>Transactions</p>
                        <li class="unselected"><p>By Category</p>
                    </ul>
                </div>
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th class="selector"><input type="checkbox"></th>
                                <th class="date">Date</th>
                                <th class="category">Category</th>
                                <th class="subcategory">Sub-category</th>
                                <th class="amount">Amount</th>
                                <th class="confirmed">Confirmed</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="selector"><input type="checkbox"></td>
                                <td class="date">2014-12-20</td>
                                <td class="category">Restaurant</td>
                                <td class="subcategory">-</td>
                                <td class="amount">$9.00</td>
                                <td class="confirmed">Yes</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </body>
</html>
