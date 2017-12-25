function registracijaStudent() {

    var ime = $("#ime").val();
    var prezime = $("#prezime").val();
    var datumRodjenja = $("#datumRodjenja").val();
    var fakultet = $("#fakultet").val();
    var odsjek = $("#odsjek").val();
    var smjer = $("#smjer").val();
    var brojIndexa = $("#brojIndexa").val();
    var username = $("#username").val();
    var email = $("#email").val();
    var password = $("#password").val();

    if( username== "" ) {
        $("#val_username").html("Unesite username!");
    }else if(password == ""){
        $("#val_pass").html("Unesite password!");
    }else if(ime ==""){
        $("#val_ime").html("Unesite ime!");
    }else if(prezime ==""){
        $("#val_ime").html("Unesite prezime!");
    }else if(datumRodjenja ==""){
        $("#val_ime").html("Unesite datum rođenja!");
    }else if(fakultet ==""){
        $("#val_ime").html("Unesite fakultet!");
    }else if(odsjek ==""){
        $("#val_ime").html("Unesite odsjek!");
    }else if(smjer ==""){
        $("#val_ime").html("Unesite smjer!");
    }else if(brojIndexa ==""){
        $("#val_ime").html("Unesite broj indexa!");
    }else if(email ==""){
        $("#val_ime").html("Unesite email!");
    }
    else {
    $.post("/users/registracija/student", {ime: ime, prezime: prezime, datumRodjenja: datumRodjenja, fakultet: fakultet, odsjek: odsjek, smjer: smjer, brojIndexa: brojIndexa, email: email, username: username, password: password})
        .done(function (data) {
            if(data.status == 200){
                $(alert(data.poruka));
                window.location.href = "/";
            }else if (data.status == 401) {
                $(alert(data.poruka));
            }
            else if (data.status == 402) {
                $(alert(data.poruka));
            }
            else if (data.status == 403) {
                $(alert(data.poruka));
            }
            else{
                $(alert("Greska"));
            }

        });
 }
}
function registracijaProfesor() {

    var ime = $("#ime").val();
    var prezime = $("#prezime").val();
    var fakultet = $("#fakultet").val();
    var odsjek = $("#odsjek").val();
    var username = $("#username").val();
    var email = $("#email").val();
    var password = $("#password").val();

    if(ime ==""){
        $("#val_ime").html("Unesite ime!");
    }else if(prezime ==""){
        $("#val_ime").html("Unesite prezime!");
    }else if(fakultet ==""){
        $("#val_ime").html("Unesite fakultet!");
    }else if(odsjek =="") {
        $("#val_ime").html("Unesite odsjek!");
    }else if( username== "" ) {
        $("#val_username").html("Unesite username!");
    }else if(email ==""){
        $("#val_ime").html("Unesite email!");
    }else if(password == ""){
        $("#val_pass").html("Unesite password!");
    }
    else {
        $.post("/users/registracija/profesor", {
            ime: ime,
            prezime: prezime,
            fakultet: fakultet,
            odsjek: odsjek,
            email: email,
            username: username,
            password: password
        })
            .done(function (data) {
                if (data.status == 200) {
                    $(alert(data.poruka));
                    window.location.href = "/";
                } else if (data.status == 401) {
                    $(alert(data.poruka));
                }
                else if (data.status == 402) {
                    $(alert(data.poruka));
                }
                else {
                    $(alert("Greska"));
                }


            });
    }
}