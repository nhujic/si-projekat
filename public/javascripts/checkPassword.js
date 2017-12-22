function checkPass() {
    var pass1 = document.getElementById('password');
    var message = document.getElementById('confirmMessage');

    if (pass1.value.length <= 5)
    {
        message.innerHTML = " Morate unijeti najmanje 6 karaktera"
    }
    else
    {
        message.innerHTML = "Password je dovoljno dug";
    }
}

function checkPassMatch()
{
    var pass1 = document.getElementById('password');
    var pass2 = document.getElementById('passwordValidation');

    var message = document.getElementById('confirmMessage');

    if(pass1.value == pass2.value){
        message.innerHTML = "Passwordi se poklapaju!"
    }else{
        message.innerHTML = "Passwordi se ne poklapaju!"
    }
}