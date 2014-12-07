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
        <script src="http://code.jquery.com/jquery-1.11.0.min.js"
            charset="utf-8"></script>
        <script src="http://gobanana.today/DateValidator/DateValidator.js"
            charset="utf-8"></script>
        <script src="js/main.js"
            charset="utf-8"></script>
    </head>
    <body>
        
    </body>
</html>
