function resetpassword(){

console.log("reset password hello");
console.log(getParameterByName("id"));

var password = document.getElementById("passwordfirst").value;
var passwordconfirm = document.getElementById("confirmpass").value;
var formid = getParameterByName("id");
console.log(formid);
console.log(password);
if(password == passwordconfirm){

var hash = CryptoJS.SHA1(password); 
conole.log(hash);
console.log("\n");
console.log(password);


       $.ajax({
       type: "POST",
        url: "http://10.0.2.2:8080/resetPasswordFormInfo",
            contentType: "application/json",
         dataType: 'json',
       data : JSON.stringify({
           password: hash,
           id : formid
       }),
       success: function() {
         alert('success');
       }
    });

     
}else{

window.alert("The passwords do not match. Or they are empty.")

}

}

function getId(){
	return getQueryVariable("id");
}


function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}














