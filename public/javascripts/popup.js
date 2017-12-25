
function kreirajKurs() {
    var naziv_kursa = $("#naziv_kursa").val();
    var odsjek = $("#odsjek").val();
    var semestar = $("#semestar").val();
    var smjer = $("#smjer").val();
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

        $.post("/kreirajKurs", {naziv_kursa: naziv_kursa, odsjek: odsjek, semestar:semestar, smjer:smjer, ciklus:ciklus, sifra_kursa:sifra_kursa})
            .done(function (data) {
                if (data.status == 200) {
                    logger.info("Uspjesno kreiranje kursa!");
                } else if (data.status == 404) {
                    alert(data.poruka);
                } else {
                    alert('Greska!');
                }

            });

}


function prijaviKurs() {

    var sifra_kursa = $("#sifra_kursa").val();
    /*

        }else if (sifra_kursa == "") {
            $("#validator_pass").html("Unesite sifru kursa!");
        }

        else {*/

    $.post("/prijavaNaKurs", {sifra_kursa:sifra_kursa})
        .done(function (data) {
            if (data.status == 200) {
                logger.info("Uspjesna prijava na kurs!");
            } else if (data.status == 404) {
                alert(data.poruka);
            } else {
                alert('Greska!');
            }

        });

}