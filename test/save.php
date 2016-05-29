<?php
$html = $_POST['html'];
var_dump($html);
$file = fopen('test.html', 'w+');
fwrite($file, $html);
fclose($file);