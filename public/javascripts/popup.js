
function kreirajKurs() {
    var naziv_kursa = $("#naziv_kursa").val();
    var semestar = $("#semestar").val();
    var ciklus = $("#ciklus").val();
    var sifra_kursa = $("#sifra_kursa").val();

/*
    if (naziv_kursa == "") {
        $("#validator_naziv_kursa").html("Unesite naziv kursa!");
    } else if (odsjek == "") {
        $("#validator_pass").html("Unesite odsjek!");
    }else if (semestar == "") {
        $("#validator_pass").html("Unesite semestar!");
    }else if (smjer == "") {
        $("#validator_pass").html("Unesite smjer!");
    }else if (ciklus == "") {
        $("#validator_pass").html("Unesite ciklus!");
    }else if (sifra_kursa == "") {
        $("#validator_pass").html("Unesite sifru kursa!");
    }

    else {*/

        $.post("/kreirajKurs", {naziv_kursa: naziv_kursa, semestar:semestar, ciklus:ciklus, sifra_kursa:sifra_kursa})
            .done(function (data) {
                if (data.status == 200) {
                    alert(data.poruka);
                    window.location.href = "/users/kurseviProfesor";
                } else if (data.status == 404) {
                    //alert(data.poruka);
                } else if(data.status == 401) {
                    alert(data.poruka);
                }else{
                    alert('Greska');
                }
            });

}


function prijaviSe(KursId) {
    var kursId = KursId;
    $(document).ready(function() {
        $('#prijaviKurs').click(function (event) {
            var sifra_kursa1 = $("#sifra_kursa1").val();
            $.post("/prijavaNaKurs", {sifra_kursa1:sifra_kursa1, kursId:kursId})
                .done(function (data) {
                    if (data.status == 200) {
                        $(alert(data.poruka));
                        window.location.href = "/users/kurseviStudent";
                    } else if (data.status == 401) {
                        $(alert(data.poruka));
                    } else if(data.status == 402){
                        $(alert(data.poruka));
                    } else if(data.status == 403){
                        $(alert(data.poruka));
                        window.location.href = "/users/kurseviStudent";
                    }
                    else {
                        $(alert('Greska!'));
                    }

                });
        });
    });
}

function kreirajIspit(KursID) {
    console.log('kreiranje ispita');
    var kursId = KursID;
    var dio_ispita = $("#ispit").val();
    var mjesto_ispita = $("#mjesto").val();
    var datum_ispita = $("#datum").val();
    var vrijeme_ispita = $("#vrijeme").val();

    $.post("/kreirajIspit", {kursId: kursId,dio_ispita: dio_ispita, mjesto_ispita: mjesto_ispita, datum_ispita: datum_ispita, vrijeme_ispita:vrijeme_ispita})
        .done(function (data) {
            if (data.status == 200) {
                alert(data.poruka);
                window.location.href = "/kursProfesor?kursId=" + kursId;
            } else if (data.status == 404) {
                alert('Greska');
            }
        });

}


function prijaviIspit(IspitId) {
    var ispitId = IspitId;

    $.post("/prijavaNaIspit", {ispitId: ispitId})
        .done(function (data) {
            if(data.status == 200){
                alert(data.poruka);
            }else if(data.status == 401){
                alert(data.poruka);
            }else if(data.status == 400){
                alert("Greska");
            }
        });

}

