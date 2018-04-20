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
    case 'edit_one':
        $data = data_edit_one($dir);
        break;
    case 'edit':
        $data = data_edit($dir);
        break;
    case 'delete':
        $data = data_delete($dir);
        break;
}
echo $data;

function data_edit_one($dir) {
    $time = date('Y-m-d H:i:s');
    $url = trim($_POST['url']);
    $urlOld = trim($_POST['urlOld']);
    $urlDesc = trim($_POST['urlDesc']);
    //如果desc为空，抓取title
    if (empty($urlDesc)) {
        $temp = preg_replace('/\<\!(.)+\>/', '', file_get_contents($url));
        // echo $temp;exit;
        $temp = explode('</title>', $temp);
        $temp = explode('<title>', $temp[0]);
        $urlDesc = $temp[1];
    }
    $urlDesc = preg_replace('/[\s]+/', '', $urlDesc);

    $contents = explode("\n", file_get_contents($dir.'/data.txt'));
    foreach($contents as $k => $line){
        $line_arr = explode('    ', $line);
        if ($line_arr[0] == $urlOld) {
            $line_arr[0] = str_replace(' ', '%20', $url);
            $line_arr[2] = date('Y-m-d H:i:s');
            $line_arr[3] = $urlDesc;
            $contents[$k] = join('    ', $line_arr);
            break;
        }
    }
    $content = join("\n", $contents);

    save_data_do($dir, $content);

    echo 1;
}

function data_add($dir) {
    $data = file_get_contents($dir.'/data.txt');
    $url = trim($_POST['content']);
    $description = trim($_POST['description']);
    if (strpos($data, $url) !== false) {
        echo 0;exit;
    }
    //如果desc为空，抓取title
    if (empty($description)) {
        $temp = preg_replace('/\<\!(.)+\>/', '', file_get_contents($url));
        // echo $temp;exit;
        $temp = explode('</title>', $temp);
        $temp = explode('<title>', $temp[0]);
        $description = $temp[1];
    }
    $description = preg_replace('/[\s]+/', '', $description);
    $content = $url.'    '.date('Y-m-d H:i:s').'    '.date('Y-m-d H:i:s').'    '.trim($description)."\n".$data;

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
        //标题
        if (empty($line_arr[3])) {
            $line_arr[3] = '';
        } else {
            $line_arr[3] = preg_replace('/[\s]+/', '', $line_arr[3]);
        }

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