import {EdicionCliente} from './edicionCliente';
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import MUICont from 'material-ui/styles/MuiThemeProvider';
import {TextField,Avatar,List,ListItem,Paper,
        RaisedButton} from 'material-ui';
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
            ], //lista de diccionarios. diccionario:{
                //'nombre', 
                //'letra',
                //'id'
                //}
            actual:'', //cliente a mostrar
            mostrarEdicion:false,
            filtro:'',
        };

        this.db = new DBHandler();
        this.cargarClientes = this.cargarClientes.bind(this);
        this.pedirClientes = this.pedirClientes.bind(this);
        this.actualizarDatos = this.actualizarDatos.bind(this);
        //this.db.pedir_clientes(this.cargarClientes);

    }

    actualizarDatos(valor,campo){
        let dic = {[campo]:valor};
        if(campo === 'actual'){
            dic['mostrarEdicion'] = true;
        }
        this.setState(dic)
    }

    pedirClientes(){
        this.db.pedir_clientes(this.cargarClientes);
    }

    cargarClientes(datos){

        this.setState({clientes:datos});

    }

    componentDidMount(){
        this.pedirClientes();
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
        let edicion = <EdicionCliente  numeroCliente = {this.state.actual}></EdicionCliente>
        if( this.state.mostrarEdicion === false){
            edicion = null;
        }
        return(
            <div>
                <Paper style={{width:'400px',display:'inline-block'}} >
                    <TextField floatingLabelText={ <label>Busqueda</label> } 
                    onChange={(evento)=>this.actualizarDatos(evento.target.value,evento.target.name)
                    } name='filtro' ></TextField>
                    <RaisedButton label={'Nuevo'} primary={true} onClick={()=>(this.actualizarDatos('NUEVO','actual'))}/>
                    <br/>
                    <div style={{margin:'5px'}} >
                        <List>
                            {this.generarListado()}
                        </List>
                    </div>
                </Paper>
                <div style={{width:'400px',display:'inline-block',verticalAlign:'top',gravity:'left'}} >
                    {edicion}
                </div>
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