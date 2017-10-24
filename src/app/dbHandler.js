export default class DBHandler{
    
    PORT = ':1400';
    HOST = '138.219.40.2';

    clientes=[
        {nombre:'Edesur',letra:'E',id:1},
        {nombre:'Metrogas',letra:'M',id:2},
        {nombre:'Aisa',letra:'A',id:3}
    ]

    posicionesFrenteIva=['Responsable Inscripto','Monotributista','Exento',
        'No alcanzado o No Responsable','Consumidor final'];

    datosClientes = {
        1:{
            cliente:{
                numeroCliente:1,
                razon:'',
                nombreFantasia:'Edesur',
                cuit:'30-65511651-2',
                email:'edesur@algo',
                web:'www.edesur.com',
                calle:'algun lugar',
                altura:'123',
                piso:'1',
                localidad:'Capital Federal',
                codigoPostal:'1321',
                posIva:2,
                fechaAlta:'',
                telefonos:[],
            },
            contactos:[{
                orden:'0',
                nombre:'Juan',
                apellido:'Perez',
                area:'enegia',
                cargo:'Gerente',
                telefono:'4121312',
                mail:'pejuan@edesur',
                rubro:''
            },
            {
                orden:'1',
                nombre:'Alan',
                apellido:'Diaz',
                area:'enegia',
                cargo:'Gerente',
                telefono:'4121312',
                mail:'aldiz@edesur',
                rubro:''
            },
            {
                orden:'',
                nombre:'',
                apellido:'',
                area:'',
                cargo:'',
                telefono:'',
                mail:'',
                rubro:''
            }

            ]

        },
        2:{
            cliente:{
                numeroCliente:2,
                razon:'',
                nombreFantasia:'Metrogas',
                cuit:'30-21311651-2',
                email:'edesur@algo',
                web:'www.edesur.com',
                calle:'algun lugar',
                altura:'123',
                piso:'1',
                localidad:'Capital Federal',
                codigoPostal:'1321',
                posIva:2,
                fechaAlta:'',
                telefonos:[],
            },
            contactos:[{
                orden:'0',
                nombre:'Juan',
                apellido:'Perez',
                area:'enegia',
                cargo:'Gerente',
                telefono:'4121312',
                mail:'pejuan@edesur',
                rubro:''
            },
            {
                orden:'1',
                nombre:'Alan',
                apellido:'Diaz',
                area:'enegia',
                cargo:'Gerente',
                telefono:'4121312',
                mail:'aldiz@edesur',
                rubro:''
            },
            {
                orden:'',
                nombre:'',
                apellido:'',
                area:'',
                cargo:'',
                telefono:'',
                mail:'',
                rubro:''
            }
            ]

        },
        3:{
            cliente:{
                numeroCliente:3,
                razon:'',
                nombreFantasia:'Aisa',
                cuit:'34-21311651-2',
                email:'aisr@algo',
                web:'www.ais.com',
                calle:'algun lugar',
                altura:'123',
                piso:'1',
                localidad:'Capital Federal',
                codigoPostal:'1321',
                posIva:2,
                fechaAlta:'',
                telefonos:[],
            },
            contactos:[{
                orden:'0',
                nombre:'Juan',
                apellido:'Perez',
                area:'enegia',
                cargo:'Gerente',
                telefono:'4121312',
                mail:'pejuan@edesur',
                rubro:''
            },
            {
                orden:'1',
                nombre:'Alan',
                apellido:'Diaz',
                area:'enegia',
                cargo:'Gerente',
                telefono:'4121312',
                mail:'aldiz@edesur',
                rubro:''
            },
            {
                orden:'',
                nombre:'',
                apellido:'',
                area:'',
                cargo:'',
                telefono:'',
                mail:'',
                rubro:''
            }
            ]

        
            
        }
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