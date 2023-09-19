<?php
$startTime = microtime(true);

try {
    $x = $_POST["x"];
    $y = $_POST["y"];
    $r = $_POST["r"];
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

    if ($x <= -3 || $x >= 5) {
        exit("X вне диапазона (-3; 5)");
    }
    if ($y <= -5 || $y >= 3) {
        exit("Y вне диапазона (-5; 3)");
    }
    if (!($r == 1 || $r == 1.5 || $r == 2 || $r == 2.5 || $r == 3)) {
        exit("R должен быть одним из [1, 1.5, 2, 2.5, 3]");
    }
} catch (Exception $e) {
    exit($e);
}

if (($x <= 0 && $y <= 0 && ($r / 2) ** 2 - $x ** 2 - $y ** 2 >= 0) || ($x <= 0 && $y >= 0 && $x >= -$r / 2 && $y <= $r) || ($x >= 0 && $y <= 0 && $x <= $r && $y >= $x / 2 - $r / 2)) {
    $result = "Попал";
}

try {
    $localTime = new DateTimeImmutable('now', new DateTimeZone('Europe/Moscow'));
} catch (Exception $e) {
    exit($e);
}

$loc_time = $localTime->format('Y-m-d H:i:s');

echo "<tr>";
echo "<td><p class='crop'>$x</p></td>";
echo "<td><p class='crop'>$y</p></td>";
echo "<td><p class='crop'>$r</p></td>";
echo "<td><p class='crop'>$result</p></td>";
echo "<td><p class='crop'>$loc_time</p></td>";

$executeTime = round(microtime(true) - $startTime, 12);
echo "<td><p class='crop'>$executeTime</p></td>";
echo "</tr>";