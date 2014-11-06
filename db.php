<?php

session_start();
if (!isset($_SESSION['user_id'])) die();

const MYSQL_SERVER = 'localhost';
const MYSQL_USER = 'vocabulary';
const MYSQL_PSWD = 'Gg44gG77';
const MYSQL_DB = 'scopetrack';

if(isset($_GET['qtype']) == false) die('no qtype');

switch ($_GET['qtype']) {
    case "new":
        if(isset($_GET['word']))
            new_word(1, trim(strtolower($_GET['word'])));
        break;
    case "memorize":
        if(isset($_GET['word']) && isset($_GET['is_correct']))
            memorize(1, trim(strtolower($_GET['word'])), $_GET['is_correct']);
        break;
    case "next":
        echo next_word(1);
        break;
    case "progress":
        if(isset($_GET['start_time']))
            echo count_progress(1, $_GET['start_time']);
        break;
    default:
        echo "no qtype";
}

function count_progress($user_id, $start_time) {
    $mysqli = new mysqli(MYSQL_SERVER, MYSQL_USER, MYSQL_PSWD, MYSQL_DB);
    if (mysqli_connect_errno())
        die('Failed to connect to MySQL: ' . mysqli_connect_error());
     
    $stmt = $mysqli->prepare('
        SELECT
            COUNT(CASE WHEN `status` = 1 THEN 1 ELSE NULL END) correct_count,
            COUNT(CASE WHEN `status` = 0 THEN 1 ELSE NULL END) wrong_count
        FROM
            users_words_log
        WHERE
            event = "memorize"
            AND user_id = ?
            AND event_time >= ?
            AND event_time < DATE_ADD(?, INTERVAL 1 DAY);
    ');
    $stmt->bind_param('iss', $user_id, $start_time, $start_time);
    $stmt->execute();
    $stmt->bind_result($correct_count, $wrong_count);
    if (!$stmt->fetch()) {
        $correct_count = 0;
        $wrong_count = 0;
    };
    $stmt->close();
    $mysqli->close();
 
    return (string)$correct_count . '\t' . (string)$wrong_count;
}

/*function backfill_audio() {
    $mysqli = new mysqli(MYSQL_SERVER, MYSQL_USER, MYSQL_PSWD, MYSQL_DB);
    if (mysqli_connect_errno())
        die('Failed to connect to MySQL: ' . mysqli_connect_error());
    
    $stmt = $mysqli->prepare('SELECT word FROM users_words;');
    $stmt->execute();
    $stmt->bind_result($word);
    $words = array();
    while ($stmt->fetch()) {
        array_push($words, $word);
    }
    $stmt->close();

    foreach ($words as $word) {
        $audio_url_matches = get_word_audio_url($word);
        if (sizeof($audio_url_matches) > 0) {
            $stmt = $mysqli->prepare('
                UPDATE users_words SET audio_url = ?
                WHERE word = ?;
            ');
            $stmt->bind_param('ss', trim($audio_url_matches[0], '"'), $word);
            $stmt->execute();
            $stmt->close();
        }
    }

    $mysqli->close();
    echo 'done';
}*/

function new_log($user_id, $event, $word, $status) {
    $mysqli = new mysqli(MYSQL_SERVER, MYSQL_USER, MYSQL_PSWD, MYSQL_DB);
    if (mysqli_connect_errno())
        die('Failed to connect to MySQL: ' . mysqli_connect_error());

    $stmt = $mysqli->prepare('
        INSERT INTO users_words_log (user_id, event, word, status, event_time)
        VALUES (?, ?, ?, ?, NOW());
    ');
    $stmt->bind_param('isss', $user_id, $event, $word, $status);
    $stmt->execute();
    $stmt->close();

    $mysqli->close();
}

function next_word($user_id) {
    $mysqli = new mysqli(MYSQL_SERVER, MYSQL_USER, MYSQL_PSWD, MYSQL_DB);
    if (mysqli_connect_errno())
        die('Failed to connect to MySQL: ' . mysqli_connect_error());
    
    $stmt = $mysqli->prepare('
        SELECT word, audio_url FROM users_words
        WHERE user_id = ? AND word_status < 5 ORDER BY RAND() LIMIT 1;
    ');
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $stmt->bind_result($word, $audio_url);
    if (!$stmt->fetch()) {
        $word = '';
        $audio_url = '';
    } 
    $stmt->close();
    $mysqli->close();

    return $word . '\t' . $audio_url;
}

function new_word($user_id, $word) {
    $audio_url = '';
    $matches = get_word_audio_url($word);
    if (sizeof($matches) > 0) $audio_url = $matches[0];

    $mysqli = new mysqli(MYSQL_SERVER, MYSQL_USER, MYSQL_PSWD, MYSQL_DB);
    if (mysqli_connect_errno())
        die('Failed to connect to MySQL: ' . mysqli_connect_error());

    $stmt = $mysqli->prepare('
        SELECT word_status FROM users_words
        WHERE user_id = ? AND word = ?;
    ');
    $stmt->bind_param('is', $user_id, $word);
    $stmt->execute();
    $stmt->bind_result($word_status);
    if($stmt->fetch()) {
        $stmt->close();

        if ($word_status != 0) {
            $stmt = $mysqli->prepare('
                UPDATE users_words SET word_status = 0
                WHERE user_id = ? AND word = ?;
            ');
            $stmt->bind_param('is', $user_id, $word);
            $stmt->execute();
            if ($stmt->affected_rows == 1) {
                new_log($user_id, 'reset', $word, '');
            } else {
                new_log($user_id, 'reset no match', $word, '');
            }
            $stmt->close();
        } else {
            new_log($user_id, 'reset no effect', $word, '');
        }
    } else {
        $stmt->close();

        $stmt = $mysqli->prepare('
            INSERT INTO users_words (user_id, word, word_status, audio_url)
            VALUES (?, ?, 0, ?);
        ');
        $stmt->bind_param('iss', $user_id, $word, trim($audio_url, '"'));
        $stmt->execute();
        if ($stmt->affected_rows == 1) {
            new_log($user_id, 'new', $word, '');
        } else {
            new_log($user_id, 'new failed', $word, '');
        }
        $stmt->close();
    }

    $mysqli->close();
}

function get_word_audio_url($word) {
    $data = file_get_contents('http://dictionary.reference.com/browse/' . $word);
    preg_match('/"http:\/\/static.sfdict.com\/staticrep\/dictaudio\/\w{3}\/\w{8}\.mp3"/', $data, $matches);
    return $matches;
}

function memorize($user_id, $word, $is_correct) {
    $mysqli = new mysqli(MYSQL_SERVER, MYSQL_USER, MYSQL_PSWD, MYSQL_DB);
    if (mysqli_connect_errno()) {
        die('Failed to connect to MySQL: ' . mysqli_connect_error());
    }

    new_log($user_id, 'memorize', $word, $is_correct);
    $stmt = $mysqli->prepare('
        SELECT word_status FROM users_words
        WHERE user_id = ? AND word = ?;
    ');
    $stmt->bind_param('is', $user_id, $word);
    $stmt->execute();
    $stmt->bind_result($word_status);

    if ($stmt->fetch()) {
        $stmt->close();
        if ($is_correct == '0' && $word_status == 0) {
            new_log($user_id, 'memorize wrong', $word, '');
            return;
        } else {
            if ($is_correct == '1') {
                $word_status++;
            } else {
                $word_status--;
            }
            $stmt = $mysqli->prepare('
                UPDATE users_words SET word_status = ?
                WHERE user_id = ? AND word = ?;
            ');
            $stmt->bind_param('iis', $word_status, $user_id, $word);
            $stmt->execute();
            if ($stmt->affected_rows == 0) {
                new_log($user_id, 'memorize update fail', $word, $is_correct);
            }
            $stmt->close();
        }
    } else {
        $stmt->close();
        new_log($user_id, 'memorize not exist', $word, '');
    }

    $mysqli->close();
}
