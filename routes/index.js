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

router.get('/pocetnaStudent', function(req, res, next) {

    let username = req.user.username;
    konekcija.query("SELECT TipKorisnika_TipKorisnikaId from Korisnik where Username = ?", [username], function (err,results, fields) {
        if(err){
            console.log(err);
        }else{
            if(results.length > 0){
                konekcija.query("SELECT KorisnickiDetalji_KorisnickiDetaljiId FROM tipKorisnika WHERE TipKorisnikaId =?", [results[0].TipKorisnika_TipKorisnikaId], function (err1, results1, fields) {
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
            }
        }
    });
});

router.get('/pocetnaProfesor', function(req, res, next) {
    let username = req.user.username;
    konekcija.query("SELECT TipKorisnika_TipKorisnikaId from Korisnik where Username = ?", [username], function (err,results, fields) {
        if(err){
            console.log(err);
        }else{
            if(results.length > 0){
                konekcija.query("SELECT KorisnickiDetalji_KorisnickiDetaljiId FROM tipKorisnika WHERE TipKorisnikaId =?", [results[0].TipKorisnika_TipKorisnikaId], function (err1, results1, fields) {
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
            }
        }
    });
});

router.post('/kreirajKurs', function (req, res, next) {

    var username = req.user.username;

    var KorisnikId, TipId, Odsjek;

    konekcija.query("SELECT * from Korisnik where username = ?", [username], function (err, results, fields) {
        if (err) {
            console.log(err);
            res.send({status:404});
        }else if(results.length > 0){;
            KorisnikId = results[0].KorisnikId;
            TipId = results[0].TipKorisnika_TipKorisnikaId;
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
                            konekcija.query("SELECT * from Kurs where NazivKursa = ?", [detaljiKursa.nazivKursa], function (err, results3, fields) {
                                if(err){
                                    console.log(err);
                                    res.send({status:404});
                                }else if(results3.length > 0){
                                    console.log('Kurs vec postoji!');
                                    res.send({status:401,poruka:'Kurs vec postoji!'});
                                }else{
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
                }
            });

        }else{
            res.send({status:404});
        }
    });





});

router.post('/prijavaNaKurs', function (req, res, next) {

    var sifraKursa = req.body.sifra_kursa1;
    let username = req.user.username;
    var KursId = req.body.kursId;


    konekcija.query("SELECT * FROM Kurs WHERE SifraKursa = ?", [sifraKursa], function (error, results, fields) {
       if(error){
           console.log(error);
           res.send({status:401});
       }
       else if(results.length > 0){
               konekcija.query("SELECT * FROM Korisnik WHERE Username = ?", [username], function (error1, results1, fields1) {
                   if(error1){
                       console.log(error1);
                       res.send({status:401});
                   }
                   else{
                       if(results1.length > 0){
                            konekcija.query("SELECT * FROM korisnik_kurs WHERE Kurs_KursId = ? and Korisnik_KorisnikId = ?", [KursId, results1[0].KorisnikId], function (err, result, fields){
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
                                        "Korisnik_KorisnikId": results1[0].KorisnikId,
                                        "Korisnik_TipKorisnika_TipKorisnikaId":results1[0].TipKorisnika_TipKorisnikaId,
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
                   }
               });
           }
       else{
           console.log("Pogrijesili ste sifru. Pokusajte ponovo");
           res.send({status:402, poruka:"Pogrijesili ste sifru. Pokusajte ponovo"})
       }

    });
});


module.exports = router;
