<html>
<head>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
</head>
<body>
<form id="form" method="POST" action="post.php">
    <input id="text-1" type="text" name="name" value="Your Name" />
    <input id="submit-1" type="submit" name="submit" value="SUBMIT" />
</form>
<script>
$(function() {
    $('#text-1').on('submit', function () {
        alert('submitted text-1');
    });
    $('#submit-1').on('submit', function () {
        alert('submitted submit-1');
    });
});

</script>
</body>
</html>