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
        <link type="text/css" rel="stylesheet" href="css/new_transaction.css"/>
    </head>
    <body>
        <div id="expense_input">
            <div>
            </div>
        </div>
    </body>
</html>
