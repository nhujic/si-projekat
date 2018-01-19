var express = require('express');
var router = express.Router();
var baza =  require('../konekcija.js');

let crypto = require('crypto');
let Buffer = require('buffer').Buffer;
let kljuc = new Buffer('PmFsaraJEVOS3cr3TK3y', 'hex');

function encrypt(text) {
    var cipher = crypto.createCipher('aes-256-cbc', kljuc);
    var crypted = cipher.update(text, 'utf-8', 'hex');
    crypted += cipher.final('hex');
    console.log('Crypted : ', crypted);

    return crypted;
}

function decrypt(text) {
    var decipher = crypto.createDecipher('aes-256-cbc', kljuc);
    var decrypted = decipher.update(text, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    console.log('Decrypted : ', decrypted);

    return decrypted;
}



var konekcija = baza.dbConnection();

/* GET users listing. */

router.get('/registracija/profesor', function (req, res, next) {
    res.render('profRegistration');
});


router.get('/registracija/student', function (req, res, next) {
    res.render('studentRegistration');
});

router.post('/registracija/profesor', function (req, res, next) {
    var korisnickiDetalji={
        "ime":req.body.ime,
        "prezime":req.body.prezime,
        "brojIndexa":null,
        "datumRodjenja":null,
        "email":req.body.email,
    }

    var ime = req.body.ime;
    var prezime = req.body.prezime;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var provjeraPassword = req.body.passwordValidation;
    var fakultet = req.body.fakultet;
    var naziv = req.body.odsjek;
    var tip = 'profesor';
    var aktivan = 1;

    req.checkBody('ime', 'Ime je obavezno').notEmpty();
    req.checkBody('prezime', 'Prezime je obavezno').notEmpty();
    req.checkBody('username', 'Username je obavezan').notEmpty();
    req.checkBody('email', 'Email je obavezan').notEmpty();
    req.checkBody('email', 'Email nije ispravan').isEmail();
    req.checkBody('password', 'Password je obavezan').notEmpty();
    // req.checkBody('provjeraPassword', 'Passwordi se ne poklapaju').equals(req.body.password);
    req.checkBody('fakultet', 'Fakultet je obavezan').notEmpty();
    req.checkBody('odsjek', 'Odsjek je obavezan').notEmpty();

    password = encrypt(password);

    console.log(naziv);

    var errors = req.validationErrors();

    if(errors){
        console.log(errors);
        res.send({status:409});
    }
    else {
        konekcija.query("SELECT * FROM KorisnickiDetalji WHERE Email = ?", [email], function (error, results, fields) {
            if (error) {
                throw (error);
                console.log(error);
                res.send({status:409});

            } else if (results.length > 0) {
                console.log('Korisnik sa ovim emailom je vec registrovan, unesite novi email');
                res.send({status:401, poruka:'Korisnik sa ovim emailom je vec registrovan, unesite novi email'});
            }
            else {
                konekcija.query("SELECT * FROM Korisnik WHERE Username = ?", [username], function (error, resultsKorisnik, fields) {
                    if (error) {
                        throw (error);
                        console.log(error);
                        res.send({status:409});

                    } else if (resultsKorisnik.length > 0) {
                        console.log('Korisnik sa ovim username-om je vec registrovan, unesite novi username');
                        res.send({status:402, poruka:'Korisnik sa ovim username-om je vec registrovan, unesite novi username'})
                    }
                    else {
                        konekcija.query('INSERT INTO KorisnickiDetalji SET ?', korisnickiDetalji, function (error, results, fields) {
                            if (error) {
                                console.log("Greska", error);
                                res.send({status:409});
                            }
                            else {
                                var korisnickiDetaljiId = results.insertId;
                                var tipKorisnika = {
                                    "Tip":tip,
                                    "KorisnickiDetalji_KorisnickiDetaljiId":korisnickiDetaljiId
                                }
                                konekcija.query("INSERT INTO TipKorisnika SET ?", [tipKorisnika], function (error, resultsTip, fields) {
                                    if (error) {
                                        console.log("Greska", error);
                                        res.send({status:409});
                                    }
                                    else {
                                        var tipKorisnikaId = resultsTip.insertId;


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
                                        var godinaPlus = yyyy + 10;
                                        var vaziDo = godinaPlus + '-' + mm + '-' + dd;
                                        var korisnik = {
                                            "TipKorisnika_TipKorisnikaId":tipKorisnikaId,
                                            "Username":username,
                                            "Password":password,
                                            "Aktivan": aktivan,
                                            "DatumKreiranjaAccounta":danas,
                                            "DatumVazenjaAccounta":vaziDo
                                        }

                                        konekcija.query("INSERT INTO Korisnik SET ?", [korisnik], function (error, resultsKorisnik, fields) {
                                            if (error) {
                                                console.log("Greska", error);
                                                res.send({status:409});
                                            }
                                        });


                                    }
                                });
                                var odsjek = {
                                    "KorisnickiDetalji_KorisnickiDetaljiId":korisnickiDetaljiId,
                                    "Naziv":naziv,
                                    "Fakultet":fakultet
                                }
                                konekcija.query("INSERT INTO Odsjek SET ?", [odsjek], function (error, results, fields) {
                                    if (error) {
                                        console.log("Greska", error);
                                        res.send({status:409});
                                    }
                                    else {
                                        console.log("Korisnik je uspjesno registrovan");
                                        res.send({status:200, poruka:"Korisnik je uspjesno registrovan"});
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

router.post('/registracija/student', function (req, res, next) {
    var korisnickiDetalji = {
        "ime": req.body.ime,
        "prezime": req.body.prezime,
        "datumRodjenja": req.body.datumRodjenja,
        "brojIndexa": req.body.brojIndexa,
        "email": req.body.email,
    }
    var ime = req.body.ime;
    var prezime = req.body.prezime;
    var datumRodjenja = req.body.datumRodjenja;
    var brojIndexa = req.body.brojIndexa;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var provjeraPassword = req.body.passwordValidation;
    var fakultet = req.body.fakultet;
    var naziv = req.body.odsjek;
    var smjer = req.body.smjer;
    var tip = 'student';
    var aktivan = 1;

    console.log(smjer);


    req.checkBody('ime', 'Ime je obavezno').notEmpty();
    req.checkBody('prezime', 'Prezime je obavezno').notEmpty();
    req.checkBody('datumRodjenja', 'Datum rodjenja je obavezan').notEmpty();
    req.checkBody('brojIndexa', 'Broj indexa je obavezan').notEmpty();
    req.checkBody('username', 'Username je obavezan').notEmpty();
    req.checkBody('email', 'Email je obavezan').notEmpty();
    req.checkBody('email', 'Email nije ispravan').isEmail();
    req.checkBody('password', 'Password je obavezan').notEmpty();
    req.checkBody('fakultet', 'Fakultet je obavezan').notEmpty();
    req.checkBody('odsjek', 'Odsjek je obavezan').notEmpty();
    req.checkBody('smjer', 'Smjer je obavezan').notEmpty();

    password = encrypt(password);

    var errors = req.validationErrors();

    if(errors){
        console.log(errors);
        res.send({status:409});
    }
    else {
        konekcija.query("SELECT * FROM KorisnickiDetalji WHERE Email = ?", [email], function (error, results, fields) {
            if (error) {
                throw (error);
                console.log(error);
                res.send({status:409});

            } else if (results.length > 0) {
                console.log('Korisnik sa ovim emailom je vec registrovan, unesite novi email');
                res.send({status:401, poruka:'Korisnik sa ovim emailom je vec registrovan, unesite novi email'});
            }
            else {
                konekcija.query("SELECT * FROM KorisnickiDetalji WHERE BrojIndexa = ?", [brojIndexa], function (error, results, fields) {
                    if (error) {
                        throw(error);
                        console.log(error);
                        res.send({status:409});
                    } else if (results.length > 0) {
                        console.log('Student sa ovim indexom je vec registrovan, unesite novi broj indexa');
                        res.send({status:403, poruka:'Student sa ovim indexom je vec registrovan, unesite novi broj indexa'});
                    }
                    else {
                        konekcija.query("SELECT * FROM Korisnik WHERE Username = ?", [username], function (error, resultsKorisnik, fields) {
                            if (error) {
                                throw (error);
                                console.log(error);
                                res.send({status:409});

                            } else if (resultsKorisnik.length > 0) {
                                console.log('Korisnik sa ovim username-om je vec registrovan, unesite novi username');
                                res.send({status:402, poruka:'Korisnik sa ovim username-om je vec registrovan, unesite novi username'});
                            }
                            else {
                                konekcija.query('INSERT INTO KorisnickiDetalji SET ?', korisnickiDetalji, function (error, results, fields) {
                                    if (error) {
                                        console.log("Greska", error);
                                        res.send({status:409});
                                    }
                                    else {
                                        var korisnickiDetaljiId = results.insertId;
                                        var tipKorisnika = {
                                            "Tip": tip,
                                            "KorisnickiDetalji_KorisnickiDetaljiId":korisnickiDetaljiId
                                        }
                                        konekcija.query("INSERT INTO TipKorisnika SET ?", [tipKorisnika], function (error, resultsTip, fields) {
                                            if (error) {
                                                console.log("Greska", error);
                                                res.send({status:409});
                                            }
                                            else {
                                                var tipKorisnikaId = resultsTip.insertId;
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
                                                var godinaPlus = yyyy + 5;
                                                var vaziDo = godinaPlus + '-' + mm + '-' + dd;

                                                var korisnik = {
                                                    "TipKorisnika_TipKorisnikaId":tipKorisnikaId,
                                                    "Username":username,
                                                    "Password":password,
                                                    "Aktivan": aktivan,
                                                    "DatumKreiranjaAccounta":danas,
                                                    "DatumVazenjaAccounta":vaziDo
                                                }

                                                konekcija.query("INSERT INTO Korisnik SET ? ", [korisnik], function (error, resultsKorisnik, fields) {
                                                    if (error) {
                                                        console.log("Greska", error);
                                                        res.send({status:409});
                                                    }
                                                });
                                            }
                                        });
                                        var odsjek = {
                                            "KorisnickiDetalji_KorisnickiDetaljiId":korisnickiDetaljiId,
                                            "Naziv":naziv,
                                            "Smjer":smjer,
                                            "Fakultet":fakultet
                                        }
                                        konekcija.query("INSERT INTO Odsjek SET ?", [odsjek], function (error, results, fields) {
                                            if (error) {
                                                console.log("Greska", error);
                                                res.send({status:409});
                                            }
                                            else {
                                                console.log('Korisnik je uspjesno registrovan');
                                                res.send({status:200, poruka:"Korisnik je uspjesno registrovan"});
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
    }
});

router.post('/login', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    password = encrypt(password);

    konekcija.query("SELECT * from Korisnik where Password = ? and username = ?", [password, username], function (err, results, fields) {
        if (err) {
            res.send({status:400});
        } else if (results.length > 0) {

            console.log('Upjesan login');
            var korisnikId = results[0].KorisnikId;
            var tipKorisnikaId = results[0].TipKorisnika_TipKorisnikaId;
            console.log(tipKorisnikaId);
            konekcija.query("SELECT Tip from TipKorisnika where TipKorisnikaId = ?", [tipKorisnikaId], function (err, resultsTip, fields) {
                if (err) {
                    console.log(err);
                    res.send({status:400});
                } else if (resultsTip[0].Tip == 'student') {
                    var obj = {
                        username: username,
                        password: password,
                        korisnikId: korisnikId,
                        tipKorisnikaId: tipKorisnikaId,
                        tip: 'student'
                    }
                    var str = JSON.stringify(obj);
                    //console.log(str);
                    var kriptuj = encrypt(str);
                    res.cookie('name', kriptuj);
                    res.send({status:200, tip:'student'});
                } else if (resultsTip[0].Tip == 'profesor') {
                    var obj = {
                        username: username,
                        password: password,
                        korisnikId: korisnikId,
                        tipKorisnikaId: tipKorisnikaId,
                        tip: 'profesor'
                    }
                    var str = JSON.stringify(obj);
                    console.log(str);
                    var kriptuj = encrypt(str);
                    res.cookie('name', kriptuj);
                    res.send({status:200, tip:'profesor'});
                }
            });

        } else {
            console.log('Pogresan username ili password!')
            res.send({status:404,poruka:'Pogresan username ili password!'});
        }
    });


});



router.get('/kurseviStudent', function(req, res, next) {

    let username = req.user.username;
    let korisnikId = req.user.korisnikId;
    let tipKorisnikaId = req.user.tipKorisnikaId;

    konekcija.query( "SELECT * FROM Korisnik as k " +
        "INNER JOIN Korisnik_Kurs as kk ON k.korisnikid = kk.korisnik_korisnikid " +
        "INNER JOIN Kurs as ku ON ku.kursid = kk.kurs_kursid " +
        "WHERE username = ? ", [username], function (err, result, fields) {
        if(err){
            console.log(err);
        }
        else {
            konekcija.query("SELECT * FROM tipKorisnika WHERE TipKorisnikaId = ?",[tipKorisnikaId], function (error2, results2, fields2) {
                if(error2){
                    console.log(error2);
                }
                else{
                    var korDetaljiId = results2[0].KorisnickiDetalji_KorisnickiDetaljiId;
                    konekcija.query("SELECT * FROM Odsjek WHERE KorisnickiDetalji_KorisnickiDetaljiId = ?", [korDetaljiId], function (err1, results3, fields3) {
                        if(err1){
                            console.log(err1);
                        }
                        else{
                            var odsjekNaziv = results3[0].Naziv;
                            konekcija.query("SELECT * FROM KorisnickiDetalji AS kd " +
                                "INNER JOIN odsjek AS o ON kd.korisnickidetaljiid = o.korisnickidetalji_korisnickidetaljiid " +
                                "INNER JOIN tipkorisnika AS tk ON kd.korisnickidetaljiid = tk.korisnickidetalji_korisnickidetaljiid " +
                                "INNER JOIN korisnik AS k ON k.tipkorisnika_tipkorisnikaid = tk.tipkorisnikaid " +
                                "INNER JOIN korisnik_kurs AS kk ON k.korisnikId = kk.korisnik_korisnikid " +
                                "INNER JOIN kurs AS kurs ON kurs.kursid = kk.kurs_kursid " +
                                "WHERE tk.Tip = ? AND o.Naziv = ?", ["profesor", odsjekNaziv], function (error, results, fields) {
                                if(error){
                                    console.log(error);
                                }
                                else{
                                    konekcija.query("SELECT * FROM KorisnickiDetalji WHERE KorisnickiDetaljiId = ?", [korDetaljiId], function (err2, res1, fields) {
                                        if(err2){
                                            console.log(err2);
                                        }
                                        else{
                                            res.render('kursevi', {rows:results, kursevi:result, imePrez:res1});
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

router.get('/kurseviProfesor', function(req, res, next) {
    let username = req.user.username;
    let korisnikId = req.user.korisnikId;
    let tipKorisnikaId = req.user.tipKorisnikaId;

    konekcija.query("SELECT * FROM Korisnik as k " +
        "INNER JOIN Korisnik_Kurs as kk ON k.korisnikid = kk.korisnik_korisnikid " +
        "INNER JOIN Kurs as ku ON ku.kursid = kk.kurs_kursid " +
        "WHERE username = ?", [username], function (err, result, fields) {
        if(err){
            console.log(err);
        }
        else {
            konekcija.query("SELECT * FROM tipKorisnika WHERE TipKorisnikaId = ?",[tipKorisnikaId],function (err2, result2, fields) {
                if(err2){
                    console.log(err2);
                }
                else{
                    var korDetaljiId = result2[0].KorisnickiDetalji_KorisnickiDetaljiId;
                    konekcija.query("SELECT * FROM KorisnickiDetalji WHERE KorisnickiDetaljiId = ?", [korDetaljiId], function (err3, result3, fields) {
                        if(err3){
                            console.log(err3);
                        }
                        else{
                            res.render('mojiKursevi', {kursevi:result, imePrez:result3});
                        }
                    })
                }
            });
        }

    });
});

router.post('/logout', function (req, res, next) {

    res.clearCookie('name');
    res.send({status:200});

});

module.exports = router;