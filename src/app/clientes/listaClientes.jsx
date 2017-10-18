import {EdicionCliente} from './edicionCliente.js';
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import MUICont from 'material-ui/styles/MuiThemeProvider';
import {TextField,Avatar,List,ListItem} from 'material-ui';
import DBHandler from '../dbHandler.js';



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
            clientes:[], //lista de diccionarios. diccionario:{
                //'nombre', 
                //'letra',
                //'id'
                //}
            
        };

        this.db = new DBHandler();
        this.cargarClientes = this.cargarClientes.bind(this);
        this.pedirClientes = this.pedirClientes.bind(this);

    }

    pedirClientes(){

    }

    cargarClientes(datos){

    }

    generarListado(){

        let lista = this.state.clientes;

        return lista.map()
    }


    render(){

        return(
            <div>
                <List>
                    {this.generarListado()}
                </List>
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
    
}