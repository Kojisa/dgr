import {EdicionCliente} from './edicionCliente';
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import MUICont from 'material-ui/styles/MuiThemeProvider';
import {TextField,Avatar,List,ListItem,Paper} from 'material-ui';
import DBHandler from '../dbHandler';



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
                {nombre:'Edesur',letra:'E',id:0},
                {nombre:'Metrogas',letra:'M',id:1},
                {nombre:'Aisa',letra:'A',id:2}
            ], //lista de diccionarios. diccionario:{
                //'nombre', 
                //'letra',
                //'id'
                //}
            actual:'', //cliente a mostrar
            
        };

        this.db = new DBHandler();
        this.cargarClientes = this.cargarClientes.bind(this);
        this.pedirClientes = this.pedirClientes.bind(this);
        this.actualizarDatos = this.actualizarDatos.bind(this);

    }

    actualizarDatos(valor,campo){
        this.setState({campo:valor})
    }

    pedirClientes(){

    }

    cargarClientes(datos){

    }

    generarListado(){

        let lista = this.state.clientes;

        return lista.map((elem,index)=>
            (<Cliente nombre={elem.nombre} 
            letra={elem.letra} id={elem.id} 
            funAct={this.actualizarDatos} />)
        )
    }


    render(){

        return(
            <div>
                <Paper style={{width:'400px'}} >
                    <div style={{margin:'5px'}} >
                        <List>
                            {this.generarListado()}
                        </List>
                    </div>
                </Paper>
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
            <ListItem onClick={()=>this.actualizarPadre(this.state.id,'actual')} >
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