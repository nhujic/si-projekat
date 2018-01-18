var express = require('express');
var router = express.Router();
var baza =  require('../konekcija.js');
var konekcija = baza.dbConnection();

router.get('/', function(req, res, next) {
    res.render('login');
});

router.get('/choose', function(req, res, next) {
    res.render('choose');
});
router.get('/dodajRezultate', function(req, res, next) {
    var ispitId =  req.query.ispitId;
    konekcija.query("SELECT * from korisnik as k inner join korisnik_ispit as ki on k.korisnikid = ki.korisnik_korisnikid "+
        "inner join tipkorisnika as tk on k.tipkorisnika_tipkorisnikaid = tk.tipkorisnikaid inner join  korisnickidetalji as kd "+
        "on kd.korisnickidetaljiid = tk.korisnickidetalji_korisnickidetaljiid where ispit_ispitid = ?", [ispitId], function (err, result, fields) {
        if (err) {
            console.log(err);
        }
        else {
            res.render('dodajRezultate', {
                studenti: result,
                ispit:ispitId
            });
        }
    });

});

router.get('/kursStudent', function(req, res, next) {
    let username = req.user.username;
    let tipKorisnikaId = req.user.tipKorisnikaId;
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
                                        konekcija.query("SELECT * FROM Ispit WHERE Kurs_KursId = ?", [KursId], function (err1, res1, fields) {
                                            if(err1){
                                                console.log(err);
                                            }
                                            else{
                                                res.render('kursStudent', {
                                                    imePrezime: results2,
                                                    kursevi: result,
                                                    nazivKursa:result1,
                                                    ispiti: res1
                                                });
                                            }
                                        })

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
                    res.render('kursProfesor',{
                        nazivKursa: result,
                        ispiti:result1
                    });
                }
            });


        }
    });
});



router.get('/pocetnaStudent', function(req, res, next) {

    let username = req.user.username;
    let tipKorisnikaId = req.user.tipKorisnikaId;
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
                                res.render('pocetnaStudent', {
                                    imePrezime: results2,
                                    kursevi: result
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
                                res.render('pocetnaProfesor', {imePrezime: results2, kursevi:result});
                            }
                        });
                    }
                });
            }
        }
    });
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