<!DOCTYPE html>
<html>
<head>
    <title>Contoh conditional class</title>
    <style>
        .bold-text {
            font-weight: bold;
        }

        .italic-text {
            font-style: italic;
        }
    </style>
</head>

<body>
    <?php
    $styleType = "bold";
    ?>

    <div class="
            <?php
            if ($styleType == 'bold') {
                echo 'bold-text';
            } else {
                echo 'italic-text';
            }
            ?>"
    >
        Class yang digunakan tergantung dari nilai variabel $styleType
    </div>
</body>

</html>