export default class DBHandler{
    
    PORT = ':1400';
    HOST = '138.219.40.2';


    posicionesFrenteIva=['Responsable Inscripto','Monotributista','Exento',
        'No alcanzado o No Responsable','Consumidor final'];

    

    pedir_usuario(fun,us,pas){
        this.enviarPeticion(fun,'usuario','POST',{'usuario':us,'contra':pas},false,false);
    }

    pedir_posiciones_frente_al_iva(fun){
        this.enviarPeticion(fun,'tiposIvas','GET',null,true,false);
    }


    pedir_clientes(fun){
        this.enviarPeticion(fun,'listadoClientes','GET',null,true,false);
    }

    pedir_datos_cliente(fun,id){
        this.enviarPeticion(fun,'devolverCliente','POST',id,true,false);
        
    }

    guardar_datos_cliente(fun,datos){
        this.enviarPeticion(fun,'guardarCliente','POST',datos,true,false);
    }

    
    enviarPeticion(fun,url,metodo,datos,asinc=true,auth=true){
            var request = new XMLHttpRequest();
            request.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                if (fun != null){
                if (this.responseText.length > 0){
                    fun(JSON.parse(this.responseText));
                }
                else{
                    fun();
                }
                }
            }
            };
            request.open(metodo,"http://"+this.HOST+this.PORT+"/"+url,asinc);
            var datosFinales = {};
            datosFinales["datos"] = datos;
            if(auth){
                request.setRequestHeader('id',document.cookie.split(';')[0].split('=')[1]);
            }
            if (metodo == "POST"){
                request.setRequestHeader('Content-type','application/json');
                request.send(JSON.stringify(datosFinales));
            }
            else {request.send();}
        }
    
}