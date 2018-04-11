<?php
session_start();

include 'core/common.php';

$c = empty($_GET['c']) ? null : $_GET['c'];

if (file_exists('c/'.$c.'.php')) {
    include 'c/'.$c.'.php';
} else {
    include 'v/index.php';
}

