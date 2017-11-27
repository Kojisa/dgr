export default class DBHandler{
    
    PORT = ':1400';
    HOST = 'localhost';


    posicionesFrenteIva=['Responsable Inscripto','Monotributista','Exento',
        'No alcanzado o No Responsable','Consumidor final'];



    pedir_items_requisitos(fun,area){
        this.enviarPeticion(fun,'items/requisitos','POST',{'area':area},false,false);
    }

    agregar_item(fun,datos){
        this.enviarPeticion(fun,'item/agregar','POST',datos,false,false)
    }

    actualizar_item(fun,datos){
        this.enviarPeticion(fun,'item/actualizar','POST',datos,false,false)
    }
    
    pedir_items(fun,area){
        this.enviarPeticion(fun,'items','POST',{area:area},false,false);
    }

    pedir_item(fun,id){
        this.enviarPeticion(fun,'item','POST',{'id':id},false,false);
    }


    pedir_responsables(fun){
        this.enviarPeticion(fun,'responsables','GET',null,false,false);
    }


    guardar_plan(fun,datos){
        this.enviarPeticion(fun,'plan/agregar','POST',datos,false,false);
    }

    pedir_planes(fun,datos){
        this.enviarPeticion(fun,'planes','POST',datos,false,false);
    }


    guardar_area(fun,datos){
        this.enviarPeticion(fun,'area/agregar','POST',datos,false,false);
    }

    actualizar_area(fun,datos){
        this.enviarPeticion(fun,'area/editar','POST',datos,false,false);
    }


    pedir_areas(fun){
        this.enviarPeticion(fun,'areas','GET',null,false,false)
    }

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
        this.enviarPeticion(fun,'devolverCliente','POST',id,true);
        
    }

    guardar_datos_cliente(fun,datos){
        this.enviarPeticion(fun,'guardarCliente','POST',datos,true);
    }

    
    enviarPeticion(fun,url,metodo,datos,asinc=true,auth=false){
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