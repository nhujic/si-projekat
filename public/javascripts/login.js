function log() {
    var username = $("#username").val();
    var password = $("#password").val();

    if (username == "") {
        $("#validator_username").html("Unesite username!");
    } else if (password == "") {
        $("#validator_pass").html("Unesite password!");
    }
    else {

        $.post("/users/login", {username: username, password: password})
            .done(function (data) {
                if (data.status == 200) {
                    if (data.tip == 'student') {
                        window.location.href = "/pocetnaStudent";
                    }
                    else if (data.tip == 'profesor') {
                        window.location.href = "/pocetnaProfesor";
                    }
                } else if (data.status == 404) {
                    alert(data.poruka);
                } else {
                    alert('Greska!');
                }

            });
    }

}


