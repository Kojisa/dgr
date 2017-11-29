import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import MUICont from 'material-ui/styles/MuiThemeProvider';
import {TextField,Avatar,List,ListItem,Paper,
        RaisedButton} from 'material-ui';
import DBHandler from '../dbHandler';
import {Muestra} from './MostrarPresupuestos';
import {EditarPlan} from './CrearPresupuesto';
import {Presupuesto} from './MuestraPresupuesto';



export default function main(){
    let root = document.getElementById("main");
    root.limpiar();

    ReactDOM.render(
        <MUICont>
            <Contenedor/>
        </MUICont>,
        root
    )
}

class Contenedor extends Component{

    constructor(props){
        super(props);

        this.state = {
            clientes:[
            ], //lista de diccionarios. diccionario:{
                //'nombre', 
                //'letra',
                //'id'
                //}
            clienteActual:0, //cliente a mostrar
            mostrarEdicion:false,
            filtro:'',
            planActual:0,

        };

        this.db = new DBHandler();
        this.cargarClientes = this.cargarClientes.bind(this);
        this.pedirClientes = this.pedirClientes.bind(this);
        this.actualizarDatos = this.actualizarDatos.bind(this);
        this.pedirClientes();
    }

    actualizarDatos(valor,campo){
        let dic = {[campo]:valor};
        if(campo === 'clienteActual'){
            dic['planActual'] = 0;
        }
        this.setState(dic)
    }

    pedirClientes(){
        this.db.pedir_clientes(this.cargarClientes);
    }

    cargarClientes(datos){
        this.setState({clientes:datos});

    }

    generarListado(){

        let lista = this.state.clientes;

        return lista.map((elem,index)=>
            {
                if( elem.nombre.toLowerCase().includes(this.state.filtro.toLowerCase()) || this.state.filtro === ''){return <Cliente nombre={elem.nombre} 
                letra={elem.letra} id={elem.id} 
                funAct={this.actualizarDatos} key={index}/>}
            }
        )
    }


    render(){
        
        let muestra = <div style={{width:'400px',display:'inline-block',verticalAlign:'top',gravity:'left',overflowY:'auto'}} >
            <Muestra cliente={this.state.actual} funAct={this.actualizarDatos}/>
        </div>
        if(this.state.clienteActual === 0){
            muestra = null;
        }
        let plan = null; 
        if(this.state.planActual === -1 && this.state.clienteActual !== 0 ){
            plan = <div style={{width:'600px',display:'inline-block',verticalAlign:'top',gravity:'left'}} >
                <RaisedButton onClick={()=>this.setState({planActual:0})} style={{margin:'5px',width:'600px'}}
                 label='Volver al Listado' secondary={true}></RaisedButton>
                <EditarPlan cliente={this.state.clienteActual} ></EditarPlan>
            </div>
            muestra = null;
        }
        else if(this.state.planActual !== 0 && this.state.clienteActual !== 0){
            plan = <div  style={{width:'400px',display:'inline-block',verticalAlign:'top',gravity:'left'}}>
                <RaisedButton onClick={()=>this.setState({planActual:0})} style={{margin:'5px'}}
                label='Volver al listado' secondary={true} />
                <Presupuesto plan={this.state.planActual} />
            </div>
            muestra = null;
        }
        
        return(
            <div>
                <Paper style={{width:'400px',display:'inline-block',margin:'5px'}} >
                    <div style={{margin:'5px'}} >
                    <TextField floatingLabelText={ <label>Busqueda</label> } 
                    onChange={(evento)=>this.actualizarDatos(evento.target.value,evento.target.name)
                    } name='filtro' ></TextField>
                    <br/>
                    </div>
                    <div style={{margin:'5px'}} >
                        <List>
                            {this.generarListado()}
                        </List>
                    </div>
                </Paper>
                {muestra}
                {plan}
            </div>
        )
    }

}

class Cliente extends Component{

    constructor(props){
        super(props);

        this.state = {
            nombre:props.nombre,
            letra:props.letra,
            id:props.id
        }

        this.actualizarPadre = props.funAct;
    }

    componentWillReceiveProps(props){
        this.setState({
            nombre:props.nombre,
            letra:props.letra,
            id:props.id
        })
    }

    render(){
        return(
            <ListItem onClick={()=>this.actualizarPadre(this.state.id,'clienteActual')} >
                <Avatar>
                    {this.state.letra}
                </Avatar>
                <span>
                    {this.state.nombre}
                </span>
            </ListItem>
        )
    }

}