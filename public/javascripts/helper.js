/*
$(document).ready(function() {
    $('#prijavaDugme').click(function (event) {
        $('#prijavaModal').modal('show')
    });
});
$(document).ready(function() {
    $('#dodajKursDugme').click(function (event) {
        $('#dodajKursModal').modal('show')
    });
});*/
$(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });
});/*
$(document).ready(function () {
    $("#dodajKurs").on('click', function () {
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
/*$(document).ready(function(){
    $("#allC").click(function(){
        $.get("/users/sviKursevi")
            .done(function (data) {
                if (data.status == 200) {
                    $("#tabela").html();
                }else{
                    alert('Greska!');
                }

            });
    });
});*/