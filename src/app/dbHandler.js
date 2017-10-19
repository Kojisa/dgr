export default class DBHandler{
    
    PORT = ':1400';
    HOST = '154.2.15.24';

    clientes=[
        {nombre:'Edesur',letra:'E',id:1},
        {nombre:'Metrogas',letra:'M',id:2},
        {nombre:'Aisa',letra:'A',id:3}
    ]

    datosClientes = {
        0:{
            cliente:{
                numeroCliente:1,
                razon:'',
                nombreFantasia:'Edesur',
                cuit:'30-65511651-2',

            }
        }
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