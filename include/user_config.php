<?php
require_once("./include/class.user.php");

const MYSQL_SERVER = '127.0.0.1';
const MYSQL_USER = 'money';
const MYSQL_PSWD = 'Gg44gG77';
const MYSQL_DB = 'scopetrack';

$u = new User();
$u->initDB(MYSQL_SERVER, MYSQL_USER, MYSQL_PSWD, MYSQL_DB);
?>
