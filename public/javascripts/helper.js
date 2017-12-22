$(document).ready(function(){
    $("#test").click(function(){
        alert("The paragraph was clicked.");
    });
});

$(document).ready(function(){
    $("#allC").click(function(){
        $.get("/users/allKursevi")
            .done(function (data) {
                if (data.status == 200) {
                    $("#tabela").html('<p> jagjajajlkgjakljgalkjga ' + data.poruka + '</p>');
                }else{
                    alert('Greska!');
                }

            });
    });
});

$(document).ready(function () {
    $(".button").on('click', function () {
        $(".cover").fadeIn('slow');
        $(".popup").fadeIn('slow');

    });
    $(".popup").on('click', function () {
        if($(event.target).is("#close")){
            $(".cover").fadeOut('slow');
            $(".popup").fadeOut('slow');
        }
    });
    $(".cover").on('click', function () {
            $(".cover").fadeOut('slow');
            $(".popup").fadeOut('slow');
    });
});

$(document).ready(function(){
    $("#logout").click(function(){
        $.post("/users/logout")
            .done(function (data) {
                if(data.status == 200){
                    window.location.href = '/';
                }
            });
    });
});

$(document).ready(function(){
    $("#logout1").click(function(){
        $.post("/users/logout")
            .done(function (data) {
                if(data.status == 200){
                    window.location.href = '/';
                }
            });
    });
});