<?php
$startTime = microtime(true);

try {
    $x = $_GET["x"];
    $y = $_GET["y"];
    $r = $_GET["r"];
    $result = "Скосил";
    preg_match('/\-?\d+\.?\d{0,}/', $x, $matches);
    if (count($matches) == 1 && $matches[0] == $x) {
        $x = (float)$x;
    } else {
        exit("X должен быть float");
    }

    preg_match('/\-?\d+\.?\d{0,}/', $y, $matches);
    if (count($matches) == 1 && $matches[0] == $y) {
        $y = (float)$y;
    } else {
        exit("Y должен быть float");
    }

    preg_match('/\-?\d+\.?\d{0,}/', $r, $matches);
    if (count($matches) == 1 && $matches[0] == $r) {
        $r = (float)$r;

        if ($r <= 0) {
            exit("R должен быть больше 0");
        }
    } else {
        exit("R должен быть float");
    }
} catch (Exception $e) {
    exit($e);
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