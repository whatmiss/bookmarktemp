<?php
session_start();

//退出登陆
if (!empty($_GET['a']) && $_GET['a'] == 'logout'){
    $_SESSION = array();
    unset($_SESSION);
}
//登陆
else {
    if(empty($_POST['admin'])){
        exit('0');
    }

    $adminDir = md5($_POST['admin']);
    $dir = 'data/'.$adminDir;

    if ( !is_dir($dir) ) {
        mkdir($dir);
    }
    if (!file_exists($dir.'/data.txt')){
        file_put_contents($dir.'/data.txt', '');
    }

    $client_ip = !empty($_SERVER['HTTP_X_REAL_IP']) ? $_SERVER['HTTP_X_REAL_IP'] : $_SERVER['REMOTE_ADDR'];
    file_put_contents($dir.'/user.txt', $_POST['admin'].' -- '.$client_ip.' -- '.date('Y-m-d H:i:s')."\n", FILE_APPEND);

    $_SESSION['admin'] = $_POST['admin'];

    echo $_POST['admin'];
}