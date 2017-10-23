import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import MUICont from 'material-ui/styles/MuiThemeProvider';
import {TextField,SelectField,RaisedButton,Paper,
        MenuItem,Tab,Tabs} from 'material-ui'
import DBHandler from '../dbHandler';

export default function main(){
    
    let root = document.getElementById("main");
    root.limpiar();

    ReactDOM.render(
        <MUICont>
            <EdicionCliente/>
        </MUICont>,
        root
    )
}



export class EdicionCliente extends Component{

    constructor(props){

        super(props);
        let numeroCliente = ''
        if(props.numeroCliente){
            numeroCliente = props.numeroCliente;
        }
        this.state={
            cliente:{
                numeroCliente:numeroCliente,
                razon:'',
                nombreFantasia:'',
                cuit:'',
                telefonos:[],
                mail:'',
                web:'',
                calle:'',
                altura:'',
                piso:'',
                localidad:'', //pienso hacerlo id para vincularlo de forma fija, ayudando a posteriores busquedas
                codigoPostal:'',
                posIva:0,//idem localidad, puedo sacarlas de la pagina de afip de facturacion
                fechaAlta:'',
            },
            contactos:[{orden:'',
                nombre:'',
                apellido:'',
                area:'',
                cargo:'',
                telefono:'',
                mail:'',
                rubro:'',},
                {orden:'',
                nombre:'',
                apellido:'',
                area:'',
                cargo:'',
                telefono:'',
                mail:'',
                rubro:'',},
                {orden:'',
                nombre:'',
                apellido:'',
                area:'',
                cargo:'',
                telefono:'',
                mail:'',
                rubro:'',}
            ],

            tiposIVAS:[],
            localidades:[],
        }

        this.db = new DBHandler();
        this.cargarIvas = this.cargarIvas.bind(this);
        this.cargarCliente = this.cargarCliente.bind(this);

    }

    cargarLocalidades(datos){
        this.setState({localidades:datos});
    }
    
    cargarIvas(datos){
        this.setState({tiposIVAS:datos});
    }

    cargarCliente(datos){{
        this.setState(
            {cliente:datos.cliente,contactos:datos.contactos}
            )
        }

    }

    componentDidMount(){
        this.db.pedir_posiciones_frente_al_iva(this.cargarIvas);
        if(this.state.cliente.numeroCliente != '' && this.state.cliente.numeroCliente != 'NUEVO'){
            this.db.pedir_datos_cliente(this.cargarCliente,this.state.cliente.numeroCliente);
        }
    }



    actualizar(valor,campo){
        this.setState({campo:valor})
    }

    componentWillReceiveProps(props){
        if(props.numeroCliente){
            
            if(props.numeroCliente === 'NUEVO'){
               
                this.setState(
                    {
                    cliente:{
                        numeroCliente:'',
                        razon:'',
                        nombreFantasia:'',
                        cuit:'',
                        telefonos:[],
                        mail:'',
                        web:'',
                        calle:'',
                        altura:'',
                        piso:'',
                        localidad:'', //pienso hacerlo id para vincularlo de forma fija, ayudando a posteriores busquedas
                        codigoPostal:'',
                        posIva:0,//idem localidad, puedo sacarlas de la pagina de afip de facturacion
                        fechaAlta:'',
                    },
                    contactos:[{orden:'',
                        nombre:'',
                        apellido:'',
                        area:'',
                        cargo:'',
                        telefono:'',
                        mail:'',
                        rubro:'',},{orden:'',
                        nombre:'',
                        apellido:'',
                        area:'',
                        cargo:'',
                        telefono:'',
                        mail:'',
                        rubro:'',},{orden:'',
                        nombre:'',
                        apellido:'',
                        area:'',
                        cargo:'',
                        telefono:'',
                        mail:'',
                        rubro:'',}
                    ],

                })
                return;
            }
            else{
                this.db.pedir_datos_cliente(this.cargarCliente,props.numeroCliente);
                
            }
        }
    }

    render(){

        return(
            <div>
                <Tabs style={{width:'410px',margin:'5px'}} >
                    <Tab label='Cliente' >
                        <div style={{display:'inline-block', verticalAlign:'top', margin:'5px'}}>
                            <Cliente numeroCliente={this.state.cliente.numeroCliente} razon={this.state.cliente.razon} nombreFantasia={this.state.cliente.nombreFantasia} 
                            cuit={this.state.cliente.cuit} telefonos={this.state.cliente.telefonos} mail={this.state.cliente.mail} web={this.state.cliente.web} 
                            calle={this.state.cliente.calle} altura={this.state.cliente.altura} piso={this.state.cliente.piso} localidad={this.state.localidad} 
                            codigoPostal={this.state.cliente.codigoPostal} posIva={this.state.cliente.posIva} fechaAlta={this.state.cliente.fechaAlta} 
                            tiposIVAS={this.state.tiposIVAS} localidades={this.state.localidades}/>
                        </div>
                    </Tab>
                    <Tab label='Contactos' >
                        <div style={{display:'inline-block', verticalAlign:'top', margin:'5px'}}>
                            <Contactos contactos={this.state.contactos} funAct={this.actualizar}/>
                        </div>
                    </Tab>
                </Tabs>
            </div>  
        )
    }

}


class Cliente extends Component{

    constructor(props){
        super(props);

        this.state = {
            numeroCliente:props.numeroCliente,
            razon:props.razon,
            nombreFantasia:props.nombreFantasia,
            cuit:props.cuit,
            telefonos:props.telefonos,
            mail:props.mail,
            web:props.web,
            calle:props.calle,
            altura:props.altura,
            piso:props.piso,
            localidad:props.localidad, //pienso hacerlo id para vincularlo de forma fija, ayudando a posteriores busquedas
            codigoPostal:props.codigoPostal,
            posIva:props.posIva,//idem localidad, puedo sacarlas de la pagina de afip de facturacion
            fechaAlta:props.fechaAlta,

            tiposIVAS:props.tiposIVAS,//se pide al servidor, es para el selector
            localidades:props.localidades,//idem tiposivas
        }

        this.actualizar = this.actualizar.bind(this);
        this.tiposIvas = this.tiposIvas.bind(this);
    }

    componentWillReceiveProps(props){
        this.setState({
            numeroCliente:props.numeroCliente,
            razon:props.razon,
            nombreFantasia:props.nombreFantasia,
            cuit:props.cuit,
            telefonos:props.telefonos,
            mail:props.mail,
            web:props.web,
            calle:props.calle,
            altura:props.altura,
            piso:props.piso,
            localidad:props.localidad, //pienso hacerlo id para vincularlo de forma fija, ayudando a posteriores busquedas
            codigoPostal:props.codigoPostal,
            posIva:props.posIva,//idem localidad, puedo sacarlas de la pagina de afip de facturacion
            fechaAlta:props.fechaAlta,

            tiposIVAS:props.tiposIVAS,//se pide al servidor, es para el selector
            localidades:props.localidades,//idem tiposivas
        })
        this.tiposIvas=this.tiposIvas.bind(this);
    }

    actualizar(evento){
        if(evento.target.name==='posIva'){
            console.log(evento);
        }

        this.setState({[evento.target.name]:evento.target.value});
    }

    tiposIvas(){
        return this.state.tiposIVAS.map((elem,index)=>( <MenuItem value={index + 1} primaryText={elem} key={index}/> ))
    }


    render(){
        console.log(this.state.localidad);

        return(
            <Paper style={{width:'400px'}} >
                <div style={{margin:'5px'}}>
                    <TextField value={this.state.numeroCliente} floatingLabelText={ <label>Numero de Cliente</label> } 
                    onChange={this.actualizar} name='numeroCliente' disabled/>
                    <br/>
                    <TextField value={this.state.razon} floatingLabelText={ <label htmlFor="">Razón Social</label> } 
                    onChange={this.actualizar} name='razon'/>
                    <TextField value={this.state.nombreFantasia} floatingLabelText={ <label htmlFor="">Nombre Fantasia</label> }
                    onChange={this.actualizar} name='nombreFantasia' />
                    <br/>
                    <TextField value={this.state.cuit} floatingLabelText={ <label htmlFor="">CUIT</label> }
                    onChange={this.actualizar} name='cuit' />
                    <br/>
                    <TextField value={this.state.mail} floatingLabelText={ <label htmlFor="">E-Mail</label> } 
                    onChange={this.actualizar} name='mail'/>
                    <TextField value={this.state.web} floatingLabelText={ <label htmlFor="">Web</label> }
                    onChange={this.actualizar} name='web' />
                    <br/>
                    <span>Domicilio</span>
                    <br/>
                    <TextField value={this.state.calle} floatingLabelText={ <label htmlFor="">Calle</label> }
                    onChange={this.actualizar} name='calle' />
                    <TextField value={this.state.altura} floatingLabelText={ <label htmlFor="">Altura</label> }
                    onChange={this.actualizar} name='altura' style={{width:'80px'}} />
                    <TextField value={this.state.piso} floatingLabelText={ <label htmlFor="">Piso</label> }
                    onChange={this.actualizar} name='piso' style={{width:'40px'}} ></TextField>
                    <br/>
                    <TextField value={this.state.localidad} floatingLabelText={ <label htmlFor="">Localidad</label> }
                    onChange={this.actualizar} name='localidad' />
                    <TextField value={this.state.codigoPostal} floatingLabelText={ <label htmlFor="">CP</label> }
                    onChange={this.actualizar} name='codigoPostal' />
                    <br/>
                    <SelectField onChange={(event,index,value)=>{this.actualizar({target:{value:value,name:'posIva'}})}} 
                        floatingLabelText={ <label htmlFor="">Posición frente al IVA</label>} value={this.state.posIva} >
                        {this.tiposIvas()}
                    </SelectField>
                    <br/>
                    <Telefonos telefonos={this.state.telefonos} funAct={this.actualizar} />
                    <RaisedButton label='Guardar' primary={true} />
                </div>
            </Paper>
        )
    }
}



class Telefonos extends Component{

    constructor(props){
        super(props);

        this.state={
            telefonos:props.telefonos,
        }
        this.actualizarPadre = this.funAct;

        this.actualizar = this.actualizar.bind(this);
        this.borrar = this.borrar.bind(this);
    }

    componentWillReceiveProps(props){
        this.setState({
            telefonos:props.telefonos,
        })
    }

    borrar(orden){
        let tele = this.state.telefonos;
        tele.splice(orden,1);

        this.setState({telefonos:tele});
        
    }

    actualizar(valor,orden){
        
        let tele= this.state.telefonos;

        tele[orden] = valor;
        this.setState({telefonos:tele});
        this.actualizarPadre({target:{value:tele,name:'telefonos'}});
    }

    cargarTelefonos(){

        this.state.telefonos.map((elem,index)=>(<Telefono numero={elem} orden={index} 
        funAct={this.actualizar} funBor={this.borrar} />))
    }

    render(){

        return(
            <Paper>
                <div>
                    {this.cargarTelefonos()}
                </div>
            </Paper>
        )
    }
}



class Telefono extends Component{

    constructor(props){
        super(props);
        
        this.state={
            numero:props.numero,
            orden:props.orden
        }

        this.actualizarPadre = props.funAct;
        this.borrarNumero = props.funBor;
        this.actualizar = this.actualizar.bind(this);
    }

    componentWillReceiveProps(props){
        this.setState({numero:props.numero,orden:props.orden});
    }


    actualizar(evento){
        this.actualizarPadre(evento.target.value,this.state.orden);

    }

    render(){
        return(
            <div>
                <TextField value={this.state.numero} onChange={this.actualizar} />
                <RaisedButton label='X' onClick={()=>(this.borrarNumero(this.state.orden))} />
            </div>
        )

    }

}



class Contactos extends Component{

    constructor(props){
        super(props);

        this.state={
            contactos:props.contactos,
        }

        this.actualizarPadre = props.funAct;
        this.actualizar = this.actualizar.bind(this);
    }

    actualizar(info,index){
        let contactos = this.state.contactos;
        contactos[index] = info;
        //this.setState({contactos:contactos});
        this.actualizarPadre(contactos,'contactos')
    }

    componentWillReceiveProps(props){
        this.setState({
            contactos:props.contactos
        })
    }

    crearNombre(nombre, apellido){
        let nombreFinal = nombre + ' ' + apellido;
        if(nombreFinal.length === 1){
            nombreFinal = 'Contacto';
        }
        return nombreFinal;
    }

    cargarContactos(){
        let lista = this.state.contactos;
        lista = lista.map((elem,index)=>( <Tab label={this.crearNombre(elem.nombre,elem.apellido)} key={index} >
            <Contacto orden={index} nombre={elem.nombre} apellido={elem.apellido} 
            area={elem.area} cargo={elem.cargo} telefono={elem.telefono} mail={elem.mail} rubro={elem.rubro}
            funAct={this.actualizar} indice={index}/>
            </Tab>) )
        if(lista.length < 3){
            lista.push(<Tab />)
        }

        return lista
    }

    render(){

        return(
            <Paper style={{width:'400px'}} >
                <Tabs>
                    {this.cargarContactos()}
                </Tabs>
            </Paper>
        )
    }
}


class Contacto extends Component{

    constructor(props){
        super(props);

        this.state={
            orden:props.orden,
            nombre:props.nombre,
            apellido:props.apellido,
            area:props.area,
            cargo:props.cargo,
            telefono:props.telefono,
            mail:props.mail,
            rubro:props.rubro,
            indice:props.indice,
        }

        this.actualizarPadre = props.funAct;
        this.actualizar = this.actualizar.bind(this);
    }

    componentWillReceiveProps(props){
        this.setState({
            orden:props.orden,
            nombre:props.nombre,
            apellido:props.apellido,
            area:props.area,
            cargo:props.cargo,
            telefono:props.telefono,
            mail:props.mail,
            rubro:props.rubro,
            indice:props.indice,
        })
    }

    actualizar(evento){
        //this.setState({[evento.target.name]:evento.target.value});
        let datos = this.state;
        datos[evento.target.name] = evento.target.value;
        this.actualizarPadre(datos,this.state.indice);
    }

    render(){

        return(
            <div>
                <TextField value={this.state.nombre} onChange={this.actualizar} name='nombre' 
                floatingLabelText={<label htmlFor="">Nombre</label> } style={{width:'150px'}} />
                <TextField value={this.state.apellido} onChange={this.actualizar} name='apellido' 
                floatingLabelText={ <label htmlFor="">Apellido</label> } style={{width:'150px'}} />
                <br/>
                <TextField value={this.state.area} onChange={this.actualizar} name='area'
                floatingLabelText={ <label htmlFor="">Area</label> } style={{width:'150px'}} />
                <TextField value={this.state.cargo} onChange={this.actualizar} name='cargo'
                floatingLabelText={ <label htmlFor="">Cargo</label>} style={{width:'150px'}} />
                <br/>
                <TextField value={this.state.telefono} onChange={this.actualizar} name='telefono'
                floatingLabelText={ <label htmlFor="">Telefono</label> } style={{width:'150px'}} />
                <br/>
                <TextField value={this.state.mail} onChange={this.actualizar} name='mail'
                floatingLabelText={ <label htmlFor="">E-Mail</label> } />
                <br/>
                <RaisedButton label='Borrar' secondary={true} />
            </div>
        )
    }
}