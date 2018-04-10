<?php
session_start();
?>
<!DOCTYPE  html>
<html>
<head>
<meta charset="utf-8">
<link rel="shortcut icon" href="icon.png" type="image/x-icon">
<link rel="stylesheet" href="css/default.css?v=0.1">
<script src="js/jquery-1.7.2.js" type="text/javascript"></script>
<script src="js/functions.js" type="text/javascript"></script>
<title>临时书签</title>
</head>
<style>
*{
    font-size:14px;
}
a{
    color:#3fb205;
}
textarea{
    padding:5px;
}
.header{
    overflow:hidden;
}
.info{
    padding:20px;
    color:#444;
    float:left;
}
#tip{
    margin:20px;
    display:block;
    position:absolute;
    right:0;left:auto;
    top:100px;
    background:#eee;
    padding:20px 40px;
    display:none;
}
.header-right{
    margin:20px 20px 20px 0;
    display:block;
    float:right;
    right:0;left:auto;
    top:0;
}
#main{
    margin:20px 0 50px 0;
    text-align:center;
}
#main table{
    width:1200px;
    margin:auto;
}
#main table th{
    padding:5px 0;
    background:#eee;
}
#main table th.time{
    width:150px;
}
#main table td{
    padding:5px;
    text-align:left;
    border-bottom:1px solid #eee;
}
#edit-box{
    text-align:center;
    display:none;
    position:fixed;
    left:0;
    top:20px;
    right:0;
    z-index:9;
    background:#eee;
    padding:10px;
    border:1px solid #aaa;
}
#edit-box textarea{
    width:80%;
    height:400px;
}
#edit-box button{
    margin: 0 40px;
}
#add-box{
    text-align:center;
    position:fixed;
    left:0;right:0;
    top:auto;bottom:0px;
    background:#eee;
    border-top:1px solid #aaa;
    padding:10px;
}
#add-box textarea{
    width:60%;
    height:40px;
    float: right;
}
#add-box input{
    margin: 0px 20% 0 0;
    float: right;
    padding: 16px;
}
#preview-url-box{
    position:fixed;
    width:600px;
    height:100%;
    left:0;
    top:0;
    border:1px solid #aaa;
    background:#fff;
    overflow:auto;
    display:none;
}
#preview-url-box iframe{
    min-width:100%;
    height:90%;
    border:none;
    overflow:auto;
}
</style>
<body>
<div>
    <div class="header">
        <div class="info">临时要用的URL太多了，不想放到浏览器收藏夹，又不方便记录？可以试试这里，保存临时书签。</div>
        <?php if (!empty($_SESSION['admin'])) { ?><a href="javascript:;" class="header-right" id="logout">退出登陆</a><?php } ?>
        <span class="header-right" id=""><?php if (!empty($_SESSION['admin'])) echo $_SESSION['admin'];?></span>
        <?php if (!empty($_SESSION['admin'])) { ?><a href="javascript:;" class="header-right" id="edit">编辑书签</a><?php } ?>
    </div>
    <div id="tip"></div>
    <div id="main">
        <img id="loading" src="images/system/loading.gif" />
        <div id="login-form" class="hidden">
            <div><input type="text" id="admin" placeholder="用户名" /><input type="button" id="login" value="登陆" /></div>
        </div>
    </div>

    <div id="edit-box">
        <textarea id="edit-content"></textarea>
        <p>
            <button id="" onclick="$('#edit-box').hide();">取消</button>
            <button id="edit-save">保存</button>
        </p>
    </div>
    <div id="add-box">
        <input type="button" id="add-save" value="增加" />
        <textarea id="add-content" placeholder="输入URL"></textarea>
    </div>
    <div id="preview-url-box">
        <iframe id="preview-url"></iframe>
    </div>
</div>
</body>
</html>
<script>
$(document).ready(function(){

    function show_tip(msg) {
        $('#tip').show().html('请先登陆').fadeOut(2000);
    }

    //初始化获取URL列表
    get_data();
    function get_data() {
        $.get('get_data.php?a=show', function(res){
            if (res == -9){
                $('#login-form').show();
                $('#loading').hide();
            } else {
                $('#main').html(res);
            }
        })
    }

    //登陆
    $('#login').click(function(){
        var content = {
            admin: $('#admin').val().replace(/[\s]+/g, ''),
        };
        if (!content.admin){
            alert('用户名不能为空');
            return false;
        }
        $.post('login.php', content, function(res){
            localStorage.admin = res;
            location.href = location.href;
        })
    })
    //自动登陆
    if (localStorage.admin) {
        <?php
        if (empty($_SESSION['admin'])){ ?>
            $('#admin').val(localStorage.admin);
            document.getElementById('login').click();
        <?php } ?>
    }

    //退出登陆
    $('#logout').click(function(){
        if (!confirm('确定退出登录？')) {
            return false;
        }
        $.post('login.php?a=logout', function(res){
            localStorage.admin = '';
            location.href = location.href;
        })
    })

    //编辑URL
    $('#edit').click(function(){
        $.get('get_data.php?a=edit', function(res){
            $('#edit-content').val(res);
            $('#edit-box').show();
        })
    })
    $('#edit-save').click(function(){
        var content = {
            content: $('#edit-content').val(),
        };
        $.post('save_data.php?a=edit', content, function(res){
            $('#edit-box').hide();
            get_data();
        });
    })

    //增加URL
    $('#add-save').click(function(){
        var content = {
            content: $('#add-content').val(),
        };
        $.post('save_data.php?a=add', content, function(res){
            if (res == 1){
                $('#edit-box').hide();
                $('#add-content').val('')
                get_data();
            } else if (res == -9) {
                show_tip('请先登陆');
            } else {
                show_tip('URL已存在');
            }
        });
    })

    //复制URl
    $('#main').on('click', '.copy-url', function(){
        console.log($(this).attr('data-url'));
        var url = $(this).attr('data-url');
        var id = (Math.random() + '').substr(2);
        $('body').append('<input id="copy-'+ id +'" value="'+ url +'" type="text" style="position:fixed;left:-100px;width:10px;" />');
        $('#copy-'+ id).select();
        if (document.execCommand('copy', true)) {
            //alert('复制成功');
            show_tip('复制成功');
        }
    })

    //预览URL
    $('#main').on('mouseenter', '.preview-url', function(e){
        console.log(e.clientX);
        var url = $(this).attr('data-url');
        $('#preview-url-box').show();
        $('#preview-url').attr('src', '').attr('src', url);
    }).on('mouseleave', '.preview-url', function(){
        $('#preview-url-box').hide();
        $('#preview-url').attr('src', '');
    })
});
</script>