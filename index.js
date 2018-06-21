

window.onload = ()=>{

    var face = new facedetection("facecontent",621.333,466,160.6665,50,300,300,"dniusuario");

    face.run((res)=>{
        

        if(res["status"] == "success"){
            if(res["data"]["lifeTest"]){
                messager("Bienvenido! Pasaste la prueba de vida.",'white',"#60e860");
                document.getElementById("imagenLoad").src="http://www.clker.com/cliparts/x/U/Z/k/S/7/custom-check-mark-hi.png";
            }
            else{
                messager("Lo siento, no pasaste la prueba de vida",'white',"#ff4a4a");
                document.getElementById("imagenLoad").src="http://www.clker.com/cliparts/5/u/w/z/E/3/x-marks-the-spot-hi.png";
            }
        }
        else{
            messager("Lo siento, no pasaste la prueba de vida",'white',"#ff4a4a");
            document.getElementById("imagenLoad").src="http://www.clker.com/cliparts/5/u/w/z/E/3/x-marks-the-spot-hi.png";
        }

    });

}

function messager(text,color,bg){
        const message = document.getElementById("message");
        message.innerHTML = text;
        message.style.background = bg;
        message.style.color = color;
}
