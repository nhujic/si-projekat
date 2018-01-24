var express = require('express');
var router = express.Router();
var baza =  require('../konekcija.js');
var konekcija = baza.dbConnection();
var nodemailer = require('nodemailer');

router.get('/', function(req, res, next) {
    res.render('login');
});

router.get('/choose', function(req, res, next) {
    res.render('choose');
});
router.get('/dodajRezultate', function(req, res, next) {
    var ispitId =  req.query.ispitId;
    var uneseniRezultati = 0;
    var tipKorisnikaId = req.user.tipKorisnikaId;
    var username = req.user.username;

    konekcija.query("SELECT KorisnickiDetalji_KorisnickiDetaljiId FROM tipKorisnika WHERE TipKorisnikaId =?", [tipKorisnikaId], function (greska, rezultat, fields) {
        if(greska){
            console.log(greska);
        }
        else{
            konekcija.query("SELECT * FROM KorisnickiDetalji WHERE KorisnickiDetaljiId = ?", [rezultat[0].KorisnickiDetalji_KorisnickiDetaljiId],function (greska1, rezultat1, fields) {
                if(greska1){
                    console.log(greska1);
                }
                else{
                    konekcija.query("SELECT * from rezultatispita where ispit_ispitid = ?",[ispitId],function (err, result, field) {
                        if(err){
                            console.log(err);
                        }else{
                            if(result.length > 0){
                                uneseniRezultati = 1;
                                konekcija.query("SELECT * from korisnik as k " +
                                    "inner join rezultatispita as rz on rz.korisnik_korisnikid = k.korisnikid " +
                                    "inner join tipkorisnika as tk on k.tipkorisnika_tipkorisnikaid = tk.tipkorisnikaid " +
                                    "inner join  korisnickidetalji as kd on kd.korisnickidetaljiid = tk.korisnickidetalji_korisnickidetaljiid " +
                                    "inner join ispit as i on i.ispitId = rz.ispit_ispitId " +
                                    "where tk.tip = 'student' and rz.ispit_ispitId = ? " , [ispitId], function (err1, result1, fields) {
                                    if (err1) {
                                        console.log(err1);
                                    }
                                    else {
                                        konekcija.query("SELECT * FROM Ispit WHERE IspitId = ?", [ispitId], function (err3, res1, fields) {
                                            if(err3){
                                                console.log(err3);
                                            }
                                            else{
                                                konekcija.query("SELECT * FROM Kurs WHERE KursId = ?", [res1[0].Kurs_KursId], function (err5, res3, fields) {
                                                    if(err5){
                                                        console.log(err5);
                                                    }
                                                    else{
                                                        konekcija.query("SELECT * FROM Korisnik as k " +
                                                            "INNER JOIN Korisnik_Kurs as kk ON k.korisnikid = kk.korisnik_korisnikid " +
                                                            "INNER JOIN Kurs as ku ON ku.kursid = kk.kurs_kursid " +
                                                            "WHERE username = ?", [username], function (greska2, rezultat2, fields) {
                                                            if(greska2){
                                                                console.log(greska2);
                                                            }
                                                            else{
                                                                var predmet = res3[0].NazivKursa;
                                                                var datumIspita = res1[0].DatumIspita;
                                                                var dioIspita = res1[0].DioIspita;
                                                                var maxBrojBodova = result1[0].MaxBrojBodova;
                                                                var datumUvida = result1[0].DatumUvida;
                                                                res.render('dodajRezultate', {
                                                                    studenti: result1,
                                                                    ispit:ispitId,
                                                                    rezultat:uneseniRezultati,
                                                                    maxBrojBodova: maxBrojBodova,
                                                                    datumUvida: datumUvida,
                                                                    datumIspita: datumIspita,
                                                                    predmet:predmet,
                                                                    kursevi: rezultat2,
                                                                    imePrezime: rezultat1,
                                                                    dioIspita: dioIspita
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }else{
                                console.log('nisu uneseni rezultati');
                                konekcija.query("SELECT * from korisnik as k inner join korisnik_ispit as ki on k.korisnikid = ki.korisnik_korisnikid " +
                                    "inner join tipkorisnika as tk on k.tipkorisnika_tipkorisnikaid = tk.tipkorisnikaid inner join  korisnickidetalji as kd "+
                                    "on kd.korisnickidetaljiid = tk.korisnickidetalji_korisnickidetaljiid " +
                                    "inner join ispit as i on i.ispitId = ki.ispit_ispitId " +
                                    "where tk.tip = 'student' and ispit_ispitid = ?", [ispitId], function (err2, result2, field) {
                                    if(err2){
                                        console.log(err2);
                                    }
                                    else{
                                        konekcija.query("SELECT * FROM Ispit WHERE IspitId = ?", [ispitId], function (err4, res2, fields) {
                                            if(err4){
                                                console.log(err4);
                                            }
                                            else{
                                                konekcija.query("SELECT * FROM Kurs WHERE KursId = ?", [res2[0].Kurs_KursId], function (err6, res4, fields) {
                                                    if(err6){
                                                        console.log(err6);
                                                    }
                                                    else{
                                                        konekcija.query("SELECT * FROM Korisnik as k " +
                                                            "INNER JOIN Korisnik_Kurs as kk ON k.korisnikid = kk.korisnik_korisnikid " +
                                                            "INNER JOIN Kurs as ku ON ku.kursid = kk.kurs_kursid " +
                                                            "WHERE username = ?", [username], function (greska3, rezultat3, fields) {
                                                            if(greska3){
                                                                console.log(greska3);
                                                            }
                                                            else{
                                                                var predmet = res4[0].NazivKursa;
                                                                var datumIspita = res2[0].DatumIspita;
                                                                var dioIspita = res2[0].DioIspita;
                                                                res.render('dodajRezultate', {
                                                                    studenti: result2,
                                                                    ispit:ispitId,
                                                                    rezultat:uneseniRezultati,
                                                                    predmet:predmet,
                                                                    datumIspita:datumIspita,
                                                                    imePrezime:rezultat1,
                                                                    kursevi:rezultat3,
                                                                    dioIspita:dioIspita
                                                                });
                                                            }
                                                        });
                                                    }
                                                });

                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
            })
        }
    });



});

router.post('/dodajRezultate', function (req, res, next) {

    var transport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "siprojekat@gmail.com",
            pass: "mreze123"
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    var id = req.body.ispitId[0];
    var danas = new Date();
    var dd = danas.getDate();
    var mm = danas.getMonth() + 1;
    var yyyy = danas.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }

    danas = yyyy + '-' + mm + '-' + dd;

    konekcija.query("SELECT * FROM RezultatIspita WHERE Ispit_IspitId = ?", [id], function (err, result1, fields) {
        if(err){
            console.log(err);
        }
        else if(result1.length > 0) {
            for (var i = 0; i < req.body.bodovi.length; i++) {
                var detaljiIspita = {
                    "OsvojeniBrojBodova": req.body.bodovi[i],
                    "Ispit_IspitId": req.body.ispitId[i],
                    "Ispit_Kurs_KursId": req.body.kursId[i],
                    "Korisnik_KorisnikId": req.body.korisnikId[i]
                };
                konekcija.query("UPDATE RezultatIspita SET ? WHERE Ispit_IspitId = ? and Korisnik_KorisnikId =?", [detaljiIspita, id, detaljiIspita.Korisnik_KorisnikId], function (err1, result2, fields) {
                    if (err1) {
                        console.log(err1);
                    }
                    else {
                        console.log("Uspjesno ste azurirali podatke");
                    }
                });
            }
        }
        else{
            for (var i = 0; i < req.body.bodovi.length; i++) {
                var detaljiIspita = {
                    "OsvojeniBrojBodova": req.body.bodovi[i],
                    "MaxBrojBodova": req.body.maxBodova,
                    "DatumObjave": danas,
                    "DatumUvida": req.body.uvid,
                    "Ispit_IspitId": req.body.ispitId[i],
                    "Ispit_Kurs_KursId": req.body.kursId[i],
                    "Korisnik_KorisnikId": req.body.korisnikId[i]
                };
                konekcija.query("INSERT INTO rezultatispita SET ?", [detaljiIspita], function (error, result, fields) {
                    if(error){
                        console.log(error);
                    }
                    else{
                        console.log('uspjesan unos');

                    }
                });
            }
            konekcija.query('SELECT * from KURS where kursid = ?',[req.body.kursId[0]], function (err3, result3, field) {
                if(err3){
                    console.log(err3);
                }else{
                    for (var i = 0; i < req.body.bodovi.length; i++) {
                        var mail = {
                            to: req.body.email[i],
                            subject: "Rezultati ispita: " + result3[0].NazivKursa,
                            text: req.body.dioIspita[0] + "\n" + "Osvojeni bodovi: " + req.body.bodovi[i] + "\nMaksimalni bodovi: " + req.body.maxBodova + "\nUvid u radove: " + req.body.uvid
                        }

                        transport.sendMail(mail, function(error, response){
                            if(error){
                                console.log(error);
                            }else{
                                console.log("Message sent: " + response.message);
                            }
                            transport.close();
                        });
                    }
                }
            });



        }
    });
    res.redirect('/dodajRezultate?ispitId='+id);
});

router.get('/kursStudent', function(req, res, next) {
    let username = req.user.username;
    let tipKorisnikaId = req.user.tipKorisnikaId;
    let korisnikId = req.user.korisnikId;
    var KursId = req.query.kursId;

    konekcija.query("SELECT * FROM Korisnik as k " +
        "INNER JOIN Korisnik_Kurs as kk ON k.korisnikid = kk.korisnik_korisnikid " +
        "INNER JOIN Kurs as ku ON ku.kursid = kk.kurs_kursid " +
        "AND ku.kursid = ? " +
        "WHERE username = ?", [KursId, username], function (err, result1, fields) {
        if(err){
            console.log(err);
            res.send({status:400, poruka:"Greska"});
        }
        else{
            console.log(result1[0].NazivKursa);
            konekcija.query("SELECT KorisnickiDetalji_KorisnickiDetaljiId FROM tipKorisnika WHERE TipKorisnikaId =?", [tipKorisnikaId], function (err1, results1, fields) {
                if(err1){
                    console.log(err1);
                }
                else{
                    if(results1.length > 0){
                        konekcija.query("SELECT * FROM KorisnickiDetalji WHERE KorisnickiDetaljiId = ?", [results1[0].KorisnickiDetalji_KorisnickiDetaljiId], function (err2, results2, fields) {
                            if(err2){
                                console.log(err2);
                            }
                            else {
                                konekcija.query("SELECT * FROM Korisnik as k " +
                                    "INNER JOIN Korisnik_Kurs as kk ON k.korisnikid = kk.korisnik_korisnikid " +
                                    "INNER JOIN Kurs as ku ON ku.kursid = kk.kurs_kursid " +
                                    "WHERE username = ?", [username], function (err, result, fields) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    else {
                                        konekcija.query("SELECT * FROM Ispit WHERE Kurs_KursId = ?", [KursId], function (err2, res1, fields) {
                                            if(err1){
                                                console.log(err2);
                                            }
                                            else {
                                                konekcija.query("SELECT * FROM RezultatIspita AS ri " +
                                                    "INNER JOIN Ispit as i ON i.ispitId = ri.ispit_ispitId " +
                                                    "WHERE ri.Korisnik_KorisnikId =? AND ri.Ispit_Kurs_KursId = ?", [korisnikId, KursId], function (err3, res2, fields) {
                                                    if (err3) {
                                                        console.log(err3);
                                                    }
                                                    else {
                                                        res.render('kursStudent', {
                                                            imePrezime: results2,
                                                            kursevi: result,
                                                            nazivKursa:result1,
                                                            ispiti: res1,
                                                            rezultati:res2
                                                        });
                                                    }

                                                });
                                            }
                                        });

                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
    });
});

router.get('/kursProfesor', function(req, res, next) {
    var kursId =  req.query.kursId;
    var tipKorisnikaId = req.user.tipKorisnikaId;
    var username = req.user.username;
    konekcija.query("SELECT KorisnickiDetalji_KorisnickiDetaljiId FROM tipKorisnika WHERE TipKorisnikaId =?", [tipKorisnikaId], function (greska, rezultat, fields) {
        if(greska){
            console.log(greska);
        }
        else{
            konekcija.query("SELECT * FROM KorisnickiDetalji WHERE KorisnickiDetaljiId = ?", [rezultat[0].KorisnickiDetalji_KorisnickiDetaljiId], function (greska1, rezultat1, fields) {
                if(greska1){
                    console.log(greska1);
                }
                else{
                    konekcija.query("SELECT * FROM Kurs where KursId = ?", [kursId], function (err, result, fields) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            konekcija.query("select *,count(Ispit_IspitId) as BrojStudenata from Ispit, Korisnik_Ispit "+
                                "where Ispit.Kurs_KursId = ? and Ispit.IspitId = Korisnik_Ispit.Ispit_IspitId " +
                                "group by Korisnik_Ispit.Ispit_IspitId;", [kursId], function (err1, result1, fields) {
                                if(err1){
                                    console.log(err1);
                                }else{
                                    konekcija.query("SELECT * FROM Korisnik as k " +
                                        "INNER JOIN Korisnik_Kurs as kk ON k.korisnikid = kk.korisnik_korisnikid " +
                                        "INNER JOIN Kurs as ku ON ku.kursid = kk.kurs_kursid " +
                                        "WHERE username = ?", [username], function (greska2, rezultat2, fields) {
                                        if(greska2){
                                            console.log(greska2);
                                        }
                                        else{
                                            res.render('kursProfesor',{
                                                nazivKursa: result,
                                                ispiti:result1,
                                                imePrezime: rezultat1,
                                                kursevi:rezultat2
                                            });
                                        }
                                    });
                                }
                            });


                        }
                    });
                }
            });
        }
    });
});



router.get('/pocetnaStudent', function(req, res, next) {

    let username = req.user.username;
    let tipKorisnikaId = req.user.tipKorisnikaId;
    let korisnikId = req.user.korisnikId;
    konekcija.query("SELECT KorisnickiDetalji_KorisnickiDetaljiId FROM tipKorisnika WHERE TipKorisnikaId =?", [tipKorisnikaId], function (err1, results1, fields) {
        if(err1){
            console.log(err1);
        }
        else{
            if(results1.length > 0){
                konekcija.query("SELECT * FROM KorisnickiDetalji WHERE KorisnickiDetaljiId = ?", [results1[0].KorisnickiDetalji_KorisnickiDetaljiId], function (err2, results2, fields) {
                    if(err2){
                        console.log(err2);
                    }
                    else {
                        konekcija.query("SELECT * FROM Korisnik as k " +
                            "INNER JOIN Korisnik_Kurs as kk ON k.korisnikid = kk.korisnik_korisnikid " +
                            "INNER JOIN Kurs as ku ON ku.kursid = kk.kurs_kursid " +
                            "WHERE username = ?", [username], function (err, result, fields) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                konekcija.query("SELECT * FROM Ispit AS i " +
                                    "INNER JOIN Korisnik_ispit AS ki ON ki.Ispit_IspitId = i.IspitId " +
                                    "WHERE ki.Korisnik_KorisnikId = ?", [korisnikId], function (err3, results3, fields) {
                                    if(err3){
                                        console.log(err3);
                                    }
                                    else{
                                        var danas = new Date();
                                        var preostaliIspiti = 0;
                                        var zavrseniIspiti = 0;
                                        for(var i = 0; i < results3.length; i++){
                                            if(results3[i].DatumIspita > danas ){
                                                preostaliIspiti = preostaliIspiti + 1;
                                            }
                                            else{
                                                zavrseniIspiti = zavrseniIspiti + 1;
                                            }
                                        }
                                        res.render('pocetnaStudent', {
                                            imePrezime: results2,
                                            kursevi: result,
                                            preostaliIspiti: preostaliIspiti,
                                            zavrseniIspiti: zavrseniIspiti
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
    });
});

router.get('/pocetnaProfesor', function(req, res, next) {
    let username = req.user.username;
    let tipKorisnikaId = req.user.tipKorisnikaId;
    let korisnikId = req.user.korisnikId;
    var brojStudenata = 0;
    konekcija.query("SELECT COUNT(DISTINCT Korisnik_KorisnikId) AS Broj FROM Korisnik_Kurs WHERE Kurs_KursId IN " +
        "(SELECT Kurs_KursId FROM Korisnik_Kurs WHERE Korisnik_KorisnikId = ?)", [korisnikId],function (greska, rezultat, fields) {
        if(greska){
            console.log(greska);
        }
        else{
            brojStudenata = rezultat[0].Broj - 1;
            konekcija.query("SELECT KorisnickiDetalji_KorisnickiDetaljiId FROM tipKorisnika WHERE TipKorisnikaId =?", [tipKorisnikaId], function (err1, results1, fields) {
                if(err1){
                    console.log(err1);
                }
                else{
                    if(results1.length > 0){
                        konekcija.query("SELECT * FROM KorisnickiDetalji WHERE KorisnickiDetaljiId = ?", [results1[0].KorisnickiDetalji_KorisnickiDetaljiId], function (err2, results2, fields) {
                            if(err2){
                                console.log(err2);
                            }
                            else{

                                konekcija.query("SELECT * FROM Korisnik as k " +
                                    "INNER JOIN Korisnik_Kurs as kk ON k.korisnikid = kk.korisnik_korisnikid " +
                                    "INNER JOIN Kurs as ku ON ku.kursid = kk.kurs_kursid " +
                                    "WHERE username = ?", [username], function (err, result, fields) {
                                    if(err){
                                        console.log(err);
                                    }
                                    else {
                                        konekcija.query("SELECT * FROM Ispit AS i " +
                                            "INNER JOIN Korisnik_ispit AS ki ON ki.Ispit_IspitId = i.IspitId " +
                                            "WHERE ki.Korisnik_KorisnikId = ?", [korisnikId], function (err3, results3, fields) {
                                            if(err3){
                                                console.log(err3);
                                            }
                                            else{
                                                        var danas = new Date();
                                                        var preostaliIspiti = 0;
                                                        var zavrseniIspiti = 0;
                                                        for(var i = 0; i < results3.length; i++){
                                                            if(results3[i].DatumIspita > danas ){
                                                                preostaliIspiti = preostaliIspiti + 1;
                                                            }
                                                            else{
                                                                zavrseniIspiti = zavrseniIspiti + 1;
                                                            }
                                                        }
                                                        res.render('pocetnaProfesor', {
                                                            imePrezime: results2,
                                                            kursevi:result,
                                                            preostaliIspiti: preostaliIspiti,
                                                            zavrseniIspiti: zavrseniIspiti,
                                                            brojStudenata: brojStudenata
                                                        });
                                                    }

                                        });
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
    })

});

router.post('/kreirajKurs', function (req, res, next) {

    var username = req.user.username;

    var KorisnikId = req.user.korisnikId;
    var TipId = req.user.tipKorisnikaId;
    var Odsjek;

    konekcija.query("SELECT * FROM tipKorisnika WHERE tipKorisnikaId = ?",[TipId], function (err1, results1, fields) {
        if(err1){
            console.log(err1);
        }
        else{
            var korDetId = results1[0].KorisnickiDetalji_KorisnickiDetaljiId;
            konekcija.query("SELECT * FROM Odsjek WHERE KorisnickiDetalji_KorisnickiDetaljiId = ?", [korDetId], function (err2, results2, fields) {
                if(err2){
                    console.log(err2);
                }
                else if(results2.length > 0){
                    Odsjek = results2[0].Naziv.toString();
                    var detaljiKursa = {
                        "nazivKursa": req.body.naziv_kursa,
                        "odsjek": Odsjek,
                        "semestar": req.body.semestar,
                        "ciklus": req.body.ciklus,
                        "sifraKursa": req.body.sifra_kursa
                    };
                    console.log("detalji kursa", detaljiKursa);
                    konekcija.query('INSERT INTO Kurs SET ?', detaljiKursa, function (err, results4, fields) {
                        if(err){
                            console.log(err);
                            res.send({status:404});
                        }else {
                            var KursId = results4.insertId;
                            var korisnik_kurs = {
                                "Korisnik_KorisnikId": KorisnikId,
                                "Korisnik_TipKorisnika_TipKorisnikaId":TipId,
                                "Kurs_KursId":KursId
                            }
                            konekcija.query("INSERT INTO Korisnik_Kurs SET ?", korisnik_kurs, function (err, results, fields) {
                                if(err){
                                    console.log(err);
                                    res.send({status:404});
                                }else{
                                    console.log("uspjesno ste kreirali kurs");
                                    res.send({status:200,poruka:'Uspjesno ste kreirali kurs'});
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

router.post('/prijavaNaKurs', function (req, res, next) {

    var sifraKursa = req.body.sifra_kursa1;
    var KursId = req.body.kursId;
    let korisnikId = req.user.korisnikId;
    let tipKorisnikaId = req.user.tipKorisnikaId;


    konekcija.query("SELECT * FROM Kurs WHERE SifraKursa = ?", [sifraKursa], function (error, results, fields) {
        if(error){
            console.log(error);
            res.send({status:401});
        }
        else if(results.length > 0){
            konekcija.query("SELECT * FROM korisnik_kurs WHERE Kurs_KursId = ? and Korisnik_KorisnikId = ?", [KursId, korisnikId], function (err, result, fields){
                if(err){
                    console.log(err);
                    res.send({status:401});
                }
                else if(result.length > 0){
                    console.log("Vec ste prijavljeni na ovaj kurs!");
                    res.send({status:403, poruka:"Vec ste prijavljeni na ovaj kurs!"});
                }
                else{
                    var korisnik_kurs = {
                        "Korisnik_KorisnikId": korisnikId,
                        "Korisnik_TipKorisnika_TipKorisnikaId":tipKorisnikaId,
                        "Kurs_KursId":KursId
                    }
                    konekcija.query("INSERT INTO korisnik_kurs SET ?", korisnik_kurs, function (error2, results2, fields2) {
                        if(error2){
                            console.log(error2);
                            res.send({status:401});
                        }
                        else{
                            console.log("Upsješno ste se prijavili na kurs!");
                            res.send({status:200, poruka:"Upsješno ste se prijavili na kurs!"})
                        }
                    })
                }
            });
        }
        else{
            console.log("Pogrijesili ste sifru. Pokusajte ponovo");
            res.send({status:402, poruka:"Pogrijesili ste sifru. Pokusajte ponovo"})
        }

    });
});

router.post('/kreirajIspit', function (req, res, next) {
    var detaljiIspita = {
        "DatumIspita": req.body.datum_ispita + ' ' + req.body.vrijeme_ispita,
        "DioIspita": req.body.dio_ispita,
        "NazivKabineta": req.body.mjesto_ispita,
        "Kurs_KursId": req.body.kursId
    };
    var IspitId;
    konekcija.query("INSERT INTO Ispit SET ?", detaljiIspita, function (err, result, fields) {
        if(err){
            console.log(err);
            res.send({status:404});
        }
        else{
            IspitId = result.insertId
            var korisnik_ispit = {
                "Korisnik_KorisnikId": req.user.korisnikId,
                "Korisnik_TipKorisnika_TipKorisnikaId":req.user.tipKorisnikaId,
                "Ispit_IspitId": IspitId
            }
            konekcija.query("INSERT INTO Korisnik_Ispit SET ?", korisnik_ispit,function (err1, result1, fields) {
                if(err1){
                    console.log(err1);
                    res.send({status:404});
                }  else{
                    console.log("Uspješno ste kreirali ispit!");
                    res.send({status:200, poruka:"Uspješno ste kreirali ispit!"});
                }
            });

        }
    });


});

router.post('/prijavaNaIspit', function (req, res, next) {

    let username = req.user.username;
    let korisnikId = req.user.korisnikId;
    let tipKorisnikaId = req.user.tipKorisnikaId;
    var ispitId = req.body.ispitId;

    var korisnikIspit = {
        "Korisnik_KorisnikId":korisnikId,
        "Korisnik_TipKorisnika_TipKorisnikaId": tipKorisnikaId,
        "Ispit_IspitId":ispitId
    }

    konekcija.query("SELECT * FROM Korisnik_Ispit WHERE Korisnik_KorisnikId = ? AND Ispit_IspitId = ?", [korisnikId, ispitId], function (error1, result1, fields) {
        if(error1){
            console.log(error1);
            res.send({status:400});
        }
        else if(result1.length >= 1){
            console.log("Vec ste prijavljeni na ovaj ispit!");
            res.send({status:401, poruka:"Vec ste prijavljeni na ovaj ispit!"});
        }
        else{
            konekcija.query("INSERT INTO Korisnik_Ispit SET ?", [korisnikIspit], function (error2, result2, fields) {
                if(error2){
                    console.log(error2);
                    res.send({status:400});
                }
                else{
                    console.log("Upsjeno ste se prijavili na ispit!");
                    res.send({status:200, poruka:"Upsjeno ste se prijavili na ispit!"});
                }
            });
        }
    });
});

module.exports = router;