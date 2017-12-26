$(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $("#sidebartext").toggle();
        $('#profilnaSlika').toggleClass('sidebarSmallIcon');
        $('#nav').toggleClass('wide');
        $('#tabela').toggleClass('wide');
        $('#dashboard').toggleClass('wide');

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