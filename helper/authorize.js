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

function getObjectFromToken(token){
    if (!token || token.length === 0) return null;
    str = decrypt(token.substr(5));
    var obj = JSON.parse(str);
    return obj;
}

function authorize() {
    let validationPaths = ['/pocetnaProfesor','/pocetnaStudent'];
    let profesorValidationPaths = ['/pocetnaProfesor'];
    let studentValidationPaths = ['/pocetnaStudent'];
    let regLogValidationPaths = ['/','/login', '/users/registracija/profesor', 'users/registracija/student', '/choose'];

    return function (req,res,next) {
        var obj = getObjectFromToken(req.headers.cookie);
        var path = req.path;
        var ruta = req.path;
        var x = req.path.substr(1).indexOf('/');

        if (x>0) {
            path = path.substr(0, x+1);
        }



        if (obj) {
            req.user = {
                username: obj.username,
                password: obj.password,
                tip: obj.tip
            }

            for (var i = 0; i < regLogValidationPaths.length; i++){
                if(ruta === regLogValidationPaths[i] && req.user.tip == 'profesor'){
                    console.log("Redirecting!");
                    res.redirect('/pocetnaProfesor');
                }
                else if(ruta === regLogValidationPaths[i] && req.user.tip == 'student'){
                    console.log("Redirecting!");
                    res.redirect('/pocetnaStudent');
                }
            }

            for (var i = 0; i<studentValidationPaths.length; i++) {
                if (path === studentValidationPaths[i] && req.user.tip == 'profesor') {
                    console.info("Redirecting!");
                    res.redirect('/pocetnaProfesor');
                }
            }
            for (var i = 0; i<profesorValidationPaths.length; i++) {
                if (path === profesorValidationPaths[i] && req.user.tip == 'student') {
                    console.info("Redirecting!");
                    res.redirect('/pocetnaStudent');
                }
            }

            // Ako path ne treba validirati dalje
        } else {
            req.user = null;
        }


        for (var i=0; i<validationPaths.length; i++) {
            if (path === validationPaths[i] && req.user == null) {
                //console.info("Redirecting!");
                res.redirect('/');
            }
        }
        next();
    }



}

module.exports = authorize;