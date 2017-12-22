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


module.exports = router;
