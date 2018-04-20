<?php
// print_r($_SERVER);

if (empty($_SESSION['admin'] )) {
    echo '-9';exit;
}

if (empty($_GET['a'])) {
    $_GET['a'] = 'show';
}

$dir = 'data/'.md5($_SESSION['admin']);

switch ($_GET['a']) {
    case 'show':
        $data = return_data_by_show($dir);
        break;
    case 'edit':
        $data = return_data_by_edit($dir);
        break;
}
echo $data;


function return_data_by_edit($dir) {
    return file_get_contents($dir.'/data.txt')."\n";
}

function return_data_by_show($dir) {
    $datas = explode("\n", file_get_contents($dir.'/data.txt'));
    foreach ($datas as $k => $line){
        if ( empty(trim($line)) ) continue;
        $line_arr = explode('    ', $line);
        if ( empty($line_arr[3]) ) $line_arr[3] = '';
        $datas[$k] = '<tr>
                        <td>
                            <div class="edit-url-list-param">
                                <a class="url-list" href="'.$line_arr[0].'" target="_blank">'.$line_arr[0].'</a>
                                <span class="url-list-desc">'.$line_arr[3].'</span>
                            </div>
                            <div class="edit-url-list-box">
                                <p><input type="text" class="edit-url-value" value="'.$line_arr[0].'" placeholder="输入URL" /></p>
                                <p><input type="text" class="edit-url-desc" value="'.$line_arr[3].'" placeholder="输入描述，默认自动抓取URL的title" /></p>
                                <p><button class="edit-url-save-click" value="">保存</button></p>
                            </div>
                        </td>
                        <td class="do">
                            <a href="javascript:;" class="copy-url" data-url="'.$line_arr[0].'">复制</a>
                            <a href="javascript:;" class="edit-url" data-url="'.$line_arr[0].'">编辑</a>
                            <a href="javascript:;" class="delete-url" data-url="'.$line_arr[0].'">删除</a>
                            <a href="javascript:;" class="preview-url" data-url="'.$line_arr[0].'">预览</a>
                        </td>
                        <td>'.$line_arr[1].'</td>
                        <td>'.$line_arr[2].'</td>
                    </tr>';
    }
    if (empty($line_arr)) {
        $datas[0] = '<tr><td colspan="4">暂无书签</td></tr>';
    }
    $datas = '<table><tr><th class="url-list">URL</th><th>操作</th><th class="time">创建时间</th><th class="time">最后修改时间</th></tr>'.join("\n", $datas).'</table>';
    return $datas;
}