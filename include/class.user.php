<?php
class User {
    var $site_rand_key;
    var $err_msg;

    var $user_id;
    var $user_display_name;
    var $user_email;
    var $user_gender;
    var $user_agreed_terms;

    var $db;
    var $db_server;
    var $db_user;
    var $db_pswd;
    var $db_name;

    function User() {
        $this->site_rand_key = 'lfei3#Sd0iDfe';
    }

    function login() {
        if(empty($_POST['user_email'])) {
            $this->handleError("Email is empty.");
            return false;
        }
        
        if(empty($_POST['password'])) {
            $this->handleError("Password is empty.");
            return false;
        }
        
        $user_email = trim($_POST['user_email']);
        $password = trim($_POST['password']);
        if(!isset($_SESSION)) session_start();
        if(!$this->checkCredential($user_email ,$password)) return false;
        $_SESSION[$this->GetLoginSessionVar()] = $user_email;
        return true;
    }

    function logout() {
        session_start();
        $sessionvar = $this->getLoginSessionVar();
        $_SESSION[$sessionvar] = null;
        unset($_SESSION[$sessionvar]);
    }

    function checkCredential($user_email, $password) {
        if(!$this->dbLogin()) {
            $this->handleError("Database login failed!");
            return false;
        }
        $stmt = $this->db->prepare('
            SELECT
                user_password_salt
            FROM
                users
            WHERE
                user_email = ?;
        ');
        $stmt->bind_param('s', $user_email);
        if(!$stmt->execute()) {
            $this->handleDbError("Failed to retrieve user password salt.");
            $stmt->close();
            return false;
        }

        $stmt->bind_result($user_password_salt);
        if(!$stmt->fetch()) {
            $stmt->close();
            return false;
        }
        $stmt->close();

        $stmt = $this->db->prepare('
            SELECT
                user_id,
                user_display_name,
                user_gender,
                user_agreed_terms
            FROM
                users
            WHERE
                user_email = ?
                AND user_encrypted_password = ?;
        ');

        $stmt->bind_param('ss', $user_email, md5($user_password_salt
            .$user_password_salt
            .$password
            .$user_password_salt));
        if(!$stmt->execute()) {
            $this->handleDbError("Failed to retrieve user details.");
            $stmt->close();
            return false;
        }
        $stmt->bind_result($this->user_id, $this->user_display_name,
            $this->user_gender, $this->user_agreed_terms);
        if(!$stmt->fetch()) {
            $stmt->close();
            return false;
        } else {
            $this->handleError('here2');
        }
        $stmt->close();

        $_SESSION['user_id'] = $this->user_id;
        $_SESSION['user_display_name'] = $this->user_display_name;
        $_SESSION['user_email'] = $this->user_email;
        $_SESSION['user_gender'] = $this->user_gender;
        $_SESSION['user_agreed_terms'] = $this->user_agreed_terms;

        return true;
    }

    function isLoggedIn() {
        if(!isset($_SESSION)) session_start();
        if(empty($_SESSION[$this->GetLoginSessionVar()])) return false;
        return true;
    }

    function getLoginSessionVar() {
        return 'usr_'.substr($this->site_rand_key, 0, 10);
    }

    function redirectToURL($url) {
        header("Location: $url");
        exit;
    }

    function dbLogin() {
        $this->db = new mysqli(
            $this->db_server,
            $this->db_user,
            $this->db_pswd,
            $this->db_name
        );

        if (mysqli_connect_errno()) {
            $this->handleError("Failed to connect to the database.\n"
                .mysqli_connect_error().'<br\>'
                .mysqli_connect_errno().'<br\>');
            return false;
        }
        $stmt = $this->db->prepare("SET NAMES 'UTF8';");
        if (!$stmt->execute()) {
            $this->handleDbError("Failed to set UTF8 encoding.");
            $stmt->close();
            return false;
        }
        $stmt->close();
        return true;
    }

    function initDB($server, $user, $pswd, $db) {
        $this->db_server = $server;
        $this->db_user = $user;
        $this->db_pswd = $pswd;
        $this->db_name = $db;
    }

    function handleError($err) {
        $this->err_msg .= "$err\n";
    }

    function handleDbError($err) {
        $this->handleError("$err\n".$this->db->error);
    }
}
?>
