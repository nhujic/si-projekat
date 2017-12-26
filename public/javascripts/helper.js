$(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $("#test").toggle();
        $('#profilnaSlika').toggleClass('sidebarSmallIcon');
        $('#nav').toggleClass('wide');
        $('#tabela').toggleClass('wide');
        $('#dashboard').toggleClass('wide');

    });
});