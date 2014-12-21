<?PHP
require_once("./include/user_config.php");
if(isset($_POST['submitted'])) {
    if($u->Login()) $u->redirectToURL("index.php");
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>Login</title>
</head>
<body>
    <?PHP
        echo $u->err_msg;
    ?>
    <div>
        <form method="post" action="login.php">
            <input type='hidden' name='submitted' id='submitted' value='1'/>
            <p>
                <label for="login">Email:</label>
                <input type="text" name="user_email" value="thomas@zh-wang.me">
            </p>
            <p>
                <label for="password">Password:</label>
                <input type="password" name="password">
            </p>
            <p>
                <button type="submit">Login</button>
            </p>
        </form>
    </div>
</body>
</html>
