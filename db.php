<?php

session_start();
if (!isset($_SESSION['user_id'])) die();

const MYSQL_SERVER = '127.0.0.1';
const MYSQL_USER = 'money';
const MYSQL_PSWD = 'Gg44gG77';
const MYSQL_DB = 'scopetrack';

if(isset($_GET['qtype']) == false) die('no qtype');

switch ($_GET['qtype']) {
    case "similar":
        if(isset($_GET['amt']) && is_numeric($_GET['amt']))
            similar_transactions(floatval($_GET['amt']));
        break;
    case "trans_cat":
        print get_transactions_categories();
        break;
    default:
        echo "no qtype";
}

function similar_transactions($transaction_amount) {
    
}

function get_transactions_categories() {
    $mysqli = new mysqli(MYSQL_SERVER, MYSQL_USER, MYSQL_PSWD, MYSQL_DB);
    if (mysqli_connect_errno())
        die('Failed to connect to MySQL: ' . mysqli_connect_error());
     
    $stmt = $mysqli->prepare('
        SELECT
            sc.subcategory_id,
            sc.subcategory_display_name,
            c.category_display_name
        FROM
            spending_subcategory sc
            INNER JOIN
            spending_category c
                ON sc.category_id = c.category_id;
    ');
    if ($mysqli->errno)
        die('MySQL Error: ' . mysqli_error($mysqli) .
            " Error Code: " . $mysqli->errno);

    $stmt->execute();
    $stmt->bind_result(
        $subcategory_id,
        $subcategory_display_name,
        $category_display_name);
    $return = '';
    while($stmt->fetch()) {
        $return = $return .
            $subcategory_id . '\t' .
            $subcategory_display_name . '\t' .
            $category_display_name . '\n';
    }
    $stmt->close();
    $mysqli->close();

    return $return;
}
