<?php
header("Content-type: text/javascript");
foreach (glob('*.js') as $file)
{
    if($file!='default-engine.js')
        readfile($file);
}
?>