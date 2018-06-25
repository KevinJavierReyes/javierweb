
function addStyles(nodo,styles){
	Object.keys(styles).forEach(function(key){
		nodo.style[key] = styles[key];
	});
	return nodo;
}
 
class facedetection {

	constructor(idContent,width,height,Xdetection,Ydetection,widthdetection,heightdetection,idcontentcode){
		this.codeutil = document.getElementById(idcontentcode).innerHTML;
		this.contenedor = document.getElementById(idContent);
		let styles ={
			"position":"absolute",
			"left":"0",
			"top":"0",
			"width":"100%",
			"height":"100%",
			"display":"flex",
			"justifyContent":"center",
			"alignItems":"center",
			"zIndex":"50"
		};
		const conImg =  addStyles(document.createElement("div"),styles);
		styles ={
			"width":"200px",
			"height":"200px",
			"display":"none"
		};
		const imgLoad = addStyles(document.createElement("img"),styles);
		imgLoad.src = "https://image.ibb.co/kETFd8/Eclipse_1s_200px.gif";
		imgLoad.id = "imagenLoad";
		conImg.appendChild(imgLoad);
		styles = {
			"position":"absolute",
			"left":"0",
			"top":"0",
			"visibility": "hidden"
		};
		const video = addStyles(document.createElement("video"),styles);
		video.width = width;
		video.height = height;
		video.id="video";
		video.autoplay = true;
		delete styles["visibility"];
		const canvasBase = addStyles(document.createElement("canvas"),styles);
		canvasBase.width = width;
		canvasBase.height = height;
		canvasBase.id = "out";
		this.contenedor.appendChild(conImg);
		this.contenedor.appendChild(video);
		this.contenedor.appendChild(canvasBase);
		this.widthvideo = width;
		this.heightvideo = height;
		this.video = document.getElementById("video");
		this.canvas = document.getElementById("out");
		this.contextCanvas = this.canvas.getContext("2d");
		this.zonadetection = {
			X:Xdetection,
			Y:Ydetection,
			width:widthdetection,
			height:heightdetection,
			area: widthdetection * heightdetection
		};
		let canvas = document.createElement("canvas");
		canvas.id = "canvasface";
		canvas.width = widthdetection;
		canvas.height = heightdetection;
		canvas.style.position = 'absolute';
		canvas.style.top = '0';
		canvas.style.left = '0';
		canvas.style.opacity = '0';
		this.contenedor.insertBefore(canvas,this.canvas);
		this.canvasFace = document.getElementById("canvasface");
		this.contextCanvasFace = this.canvasFace.getContext("2d");
		let message = document.createElement("div");
		message.id = "message";
		message.style.width = "100%";
		message.style.padding = "5px 3px";
		message.style.position = 'absolute';
		message.style.top = '0';
		message.style.left = '0';
		message.innerText = "Encuadre su rostro con la guía";
		message.style.color = 'white';
		message.style.zIndex = "100";
		message.style.background = "#60e860";
		message.style.display = 'flex';
		message.style.justifyContent = 'center';
		message.style.transition = 'ease all 0.4s';
		this.contenedor.insertBefore(message,this.canvas);
		this.message = document.getElementById("message");
		//variablesAuxiliares
		this.valor = "";
		this.countVerificacion = 0;
		this.limitVerificacion = 5;
		this.countAlert = 0;
		this.limitAlert = 10;
		this.paso = 1;
		this.esperainit = 0;
		this.initFrames = 3;
		this.esperamiddle = 50;
		this.middleFrames = 9;
		this.esperafinish = 0;
		this.finishFrames = 3;
		this.contFrames = 0;
		this.contBlink = 4;
		this.trueFace = '';
		this.frames = {
			init:[],
			middle:[],
			finish:[],
			trueface:[""]
		};
		this.Timeout = null;
		this.msg = null;
		this.lifeTime = true;
	}

	detection(){
		var comp = ccv.detect_objects({ "canvas" : (this.canvasFace),
											"cascade" : cascade,
											"interval" : 1,
											"min_neighbors" : 1 });
		return comp;
	}

	messager(text,color,bg){
		this.message.innerHTML = text;
		this.message.style.background = bg;
		this.message.style.color = color;
	}

	paso1(areavalida,ROI){
		if(areavalida){
			this.messager("Perfecto quedate ahí!",'white',"#60e860");
			this.countAlert = 0;
			this.countVerificacion++;
			this.contextCanvas.strokeRect(ROI.x + this.zonadetection.X,ROI.y + this.zonadetection.Y,ROI.width,ROI.height);
			if(this.countVerificacion == this.limitVerificacion){
				this.messager("Abre los ojos y no parpadees!",'white',"#60e860");
				this.esperainit = Math.floor((Math.random() * 200) + 300) ;
				this.paso = 2;
			}
		}
		else {
			this.countAlert ++;
			if(this.countAlert == this.limitAlert){
				this.messager("No te veo, trata acomodarte en la guía",'white',"#ff4a4a");
			}
		}
	}

	paso2(){
		this.contFrames ++;
		if(parseInt(this.esperainit / 2) == this.contFrames){
			this.messager("Prepárate para parpadear!!",'white',"#60e860");
		}

		if(this.frames.init.length == 2){
				this.frames["trueface"][0] = this.canvas.toDataURL('image/jpeg',1);
		}

		if(this.esperainit - 70  < this.contFrames && (this.contFrames%60) == 0){
			this.contBlink --;
			if(this.contBlink == 0){
				this.contBlink = 1;
			}
			this.messager(""+ this.contBlink,'white',"#60e860");
		}

		if(this.esperainit < this.contFrames && (this.contFrames % 60) == 0){
			this.frames.init.push(this.canvasFace.toDataURL('image/jpeg',1));
			if(this.frames.init.length > this.initFrames - 1){
				this.messager("Parpadea!!",'white',"#60e860");
				this.contFrames = 0;
				this.paso = 3;
			}
		}
	}

	paso3(){
		this.contFrames ++;
		if(this.esperamiddle < this.contFrames && (this.contFrames/6) != 0){
			
			this.frames.middle.push(this.canvasFace.toDataURL('image/jpeg',1));
			if(this.frames.middle.length > this.middleFrames - 1){
				this.contFrames = 0;
				this.paso = 4;
			}
		}
	}

	paso4(){
		this.contFrames ++;
		if(this.esperafinish < this.contFrames && (this.contFrames/6) != 0){
			this.frames.finish.push(this.canvasFace.toDataURL('image/jpeg',1));
			if(this.frames.finish.length > this.finishFrames - 1){
				this.contFrames = 0;
				var este = this;
				setTimeout(function(){
					este.messager("Procesando...",'white',"#60e860");
				  	document.getElementById("imagenLoad").style.display = "block";
				},200);
				this.paso = 6;
				this.sendImages();
			}
		}
	}

	drawCanvas(){
		this.contextCanvas.drawImage(this.video,0,0,this.widthvideo,this.heightvideo);
		this.contextCanvasFace.drawImage(this.video,this.zonadetection.X * -1,this.zonadetection.Y * -1,this.widthvideo,this.heightvideo);
		//this.contextCanvas.strokeStyle ="#0000fb";
		//this.contextCanvas.strokeRect(this.zonadetection.X,this.zonadetection.Y,this.zonadetection.width,this.zonadetection.height);
		let este = this;
		this.contextCanvas.strokeStyle ="#00d500";
		if(this.paso == 1){
			var rsdetection = this.detection();
			rsdetection.forEach( function(el) {
				let areavalida = (este.zonadetection.area / 6) < (el.width * el.height);
				este.paso1(areavalida,el)
			});
		}
		else{
			if(este.paso == 2){
				este.paso2();
			}
			if(este.paso == 3){
				este.paso3();
			}
			if(este.paso == 4){
				este.paso4();
			}
		}
	}

	sendImages(){
		const este = this;
		const frames = this.frames;
		frames["code"] = this.codeutil;
		frames["id"] = prompt("Codigo de Solicitud");
		$.ajax({
			url:'https://deteccioninterno.azurewebsites.net/api/LifeTest',
			type: 'POST',
			dataType: "json",
			contentType: 'application/json',
			data: JSON.stringify(frames),
			success: function (respuestaAjax){
				este.msg = respuestaAjax;
				este.lifeTime = false;
		}})
	}

	run(callback){
		const este = this;

	    navigator.mediaDevices.getUserMedia({audio:false,video:true})
	    .then((stream)=>{
	        este.video.srcObject = stream;
	        este.Timeout = setInterval(function(){
				este.drawCanvas();
				if(!este.lifeTime){
					este.lifeTime = true;
					callback(este.msg);
				}
			},10);
	    }).catch((err)=>console.log(err));
		
	}
}
