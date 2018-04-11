<?php

if(empty($_POST)){
    exit('0');
}

if (empty($_SESSION['admin'] )) {
    echo '-9';exit;
}

$dir = 'data/'.md5($_SESSION['admin']);

if ( !is_dir($dir) ) {
    mkdir($dir);
}

if (empty($_GET['a'])) {
    $_GET['a'] = 'show';
}
switch ($_GET['a']) {
    case 'add':
        $data = data_add($dir);
        break;
    case 'edit':
        $data = data_edit($dir);
        break;
    case 'delete':
        $data = data_delete($dir);
        break;
}
echo $data;

function data_add($dir) {
    $data = file_get_contents($dir.'/data.txt');
    $content = trim($_POST['content']);
    if (strpos($data, $content) !== false) {
        echo 0;exit;
    }
    $content = $content.'    '.date('Y-m-d H:i:s').'    '.date('Y-m-d H:i:s')."\n".$data;

    save_data_do($dir, $content);

    echo 1;
}

function data_delete($dir) {
    $time = date('Y-m-d H:i:s');
    $url = trim($_POST['url']);
    $contents = explode("\n", file_get_contents($dir.'/data.txt'));
    foreach($contents as $k => $line){
        $line_arr = explode('    ', $line);
        if ($line_arr[0] == $url) {
            unset($contents[$k]);
            break;
        }
    }
    $content = join("\n", $contents);

    save_data_do($dir, $content);

    echo 1;
}

function data_edit($dir) {
    $time = date('Y-m-d H:i:s');
    $contents = explode("\n", trim($_POST['content']));
    foreach($contents as $k => $line){
        $line_arr = explode('    ', $line);

        //创建时间
        if (empty($line_arr[1])){
            $line_arr[1] = $time;
        }

        //修改时间
        $line_arr[2] = $time;
        $contents[$k] = join('    ', $line_arr);
    }
    $content = join("\n", $contents);

    save_data_do($dir, $content);

    echo 1;
}

function save_data_do($dir, $content) {
    file_put_contents($dir.'/data-bak-'.date('Y-m-d-H-i').'.txt', $content);
    file_put_contents($dir.'/data.txt', $content);
}