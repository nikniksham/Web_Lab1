<?php
$startTime = microtime(true);

try {
    $x = (float)$_GET["x"];
    $y = (float)$_GET["y"];
    $r = (float)$_GET["r"];
    $result = "Скосил";
} catch (Exception $e) {
//    echo "Передаваемые данные должны быть типа float";
    throw new Exception("Передаваемые данные должны быть типа float");
}

if (($x <= 0 && $y <= 0 && ($r / 2) ** 2 - $x ** 2 - $y ** 2 >= 0) || ($x <= 0 && $y >= 0 && $x >= -$r / 2 && $y <= $r) || ($x >= 0 && $y <= 0 && $x <= $r && $y >= $x / 2 - $r / 2)) {
    $result = "Попал";
}

$currentTime = date('Y-m-d H:i:s');
echo "<tr>";
echo "<td><p class='crop'>$x</p></td>";
echo "<td><p class='crop'>$y</p></td>";
echo "<td><p class='crop'>$r</p></td>";
echo "<td><p class='crop'>$result</p></td>";
echo "<td><p class='crop'>$currentTime</p></td>";

$executeTime = round(microtime(true) - $startTime, 12);
echo "<td><p class='crop'>$executeTime</p></td>";
echo "</tr>";