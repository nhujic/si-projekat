var express = require('express');
var router = express.Router();
var baza =  require('../konekcija.js');
var konekcija = baza.dbConnection();

let crypto = require('crypto');
let kljuc = new Buffer('PmFsaraJEVOS3cr3TK3y', 'hex');

function decrypt(text) {
    var decipher = crypto.createDecipher('aes-256-cbc', kljuc);
    var decrypted = decipher.update(text, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    console.log('Decrypted : ', decrypted);

    return decrypted;
}
function getObjectFromToken(token){
    if (!token || token.length === 0) return null;
    str = decrypt(token.substr(5));
    var obj = JSON.parse(str);
    return obj;
}


router.get('/', function(req, res, next) {
    res.render('login');
});

router.get('/choose', function(req, res, next) {
    res.render('choose');
});

router.get('/kursevi', function(req, res, next) {
    res.render('kursevi');
});

router.get('/pocetnaStudent', function(req, res, next) {

    var obj = getObjectFromToken(req.headers.cookie);
    let username = obj.username;
    konekcija.query("SELECT TipKorisnika_TipKorisnikaId from Korisnik where Username = '" + username +"'", function (err,results, fields) {
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
                                    if(results2.length>0){
                                        konekcija.query("SELECT * FROM Odsjek WHERE KorisnickiDetalji_KorisnickiDetaljiId = ?", [results1[0].KorisnickiDetalji_KorisnickiDetaljiId], function (err3, results3, fields) {
                                            if(err3){
                                                console.log(err3);
                                            }
                                            else{
                                                if(results3.length > 0){
                                                    console.log(results2);
                                                    res.render('pocetnaStudent', {imePrezime: results2, odsjek:results3});
                                                }
                                            }
                                        });

                                    }
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
    var obj = getObjectFromToken(req.headers.cookie);
    let username = obj.username;
    konekcija.query("SELECT TipKorisnika_TipKorisnikaId from Korisnik where Username = '" + username +"'", function (err,results, fields) {
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
                                    if(results2.length>0){
                                        konekcija.query("SELECT * FROM Odsjek WHERE KorisnickiDetalji_KorisnickiDetaljiId = ?", [results1[0].KorisnickiDetalji_KorisnickiDetaljiId], function (err3, results3, fields) {
                                            if(err3){
                                                console.log(err3);
                                            }
                                            else{
                                                if(results3.length > 0){
                                                    res.render('pocetnaProfesor', {imePrezime: results2, odsjek:results3});
                                                }
                                            }
                                        });

                                    }
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
    var detaljiKursa = {
        "nazivKursa": req.body.naziv_kursa,
        "odsjek": req.body.odsjek,
        "semestar": req.body.semestar,
        "ciklus": req.body.ciklus,
        "sifraKursa": req.body.sifra_kursa
    }

    var token = req.headers.cookie;
    var obj = getObjectFromToken(token);
    var username = obj.username;
    var KorisnikId, TipId;
    konekcija.query("SELECT * from Korisnik where username = ?", [username], function (err, results, fields) {
        if (err) {
            console.log(err);
            res.send({status:404});
        }else if(results.length > 0){
            KorisnikId = results[0].KorisnikId;
            TipId = results[0].TipKorisnika_TipKorisnikaId;
        }else{
            res.send({status:404});
        }
    });
    konekcija.query('INSERT INTO Kurs SET ?', detaljiKursa, function (err, results, fields) {
        if(err){
            console.log(err);
            res.send({status:404});
        }else {
            var KursId = results.insertId;
                        konekcija.query("INSERT INTO Korisnik_Kurs (Korisnik_KorisnikId, Korisnik_TipKorisnika_TipKorisnikaId ,Kurs_KursId) VALUES ('" + KorisnikId + "', '" + TipId + "', '" + KursId + "')", function (err, results, fields) {
                if(err){
                    console.log(err);
                    res.send({status:404});
                }else{
                    console.log("uspjesno ste kreirali kurs");
                    res.send({status:200});

                }
            });
        }
    });



});

router.post('/prijavaNaKurs', function (req, res, next) {

    var sifraKursa = req.body.sifra_kursa1;
    var obj = getObjectFromToken(req.headers.cookie);
    let username = obj.username;
    var KursId = req.body.kursId;
    console.log("KURS JEEEE:      ",KursId);
    console.log("sifra kursa: ", sifraKursa);

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
                                    konekcija.query("INSERT INTO korisnik_kurs (Korisnik_KorisnikId, Korisnik_TipKorisnika_TipKorisnikaId, Kurs_KursId) VALUES ('" + results1[0].KorisnikId + "', '" + results1[0].TipKorisnika_TipKorisnikaId + "', '" + KursId +"' )", function (error2, results2, fields2) {
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
