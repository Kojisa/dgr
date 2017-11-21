import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import MUICont from 'material-ui/styles/MuiThemeProvider';
import {TextField,Avatar,List,ListItem,Paper,
        RaisedButton,SelectField,MenuItem,Divider,
        Checkbox} from 'material-ui';
import DBHandler from '../dbHandler';



export default function main(){
    let root = document.getElementById("main");
    root.limpiar();

    ReactDOM.render(
        <MUICont>
            <Edicion/>
        </MUICont>,
        root
    )
}


export class Edicion extends Component{

    constructor(props){
        super(props);
        let id = '';
        if(props.id){
            id = props.id
        }
        this.state={
            items:[],
            id:id,
            area:props.area,
            descripcion:'',
            precio:'',
            requisitos:[],
            tipo:'',
            estados:[{descripcion:'',id:'',completaItem:false}],

        }

        this.db = new DBHandler();

        this.actualizar = this.actualizar.bind(this);
        this.cargarDatos

    }


    cargarDatos(datos){
        let requisitos = datos.requisitos.split(';');
        let items = datos.items;
        let precio = datos.precio;
        let tipo = datos.tipo;
        let estados = datos.estados;

        this.setState({
            requisitos:requisitos,
            items:items,
            precio:precio,
            tipo:tipo,
            estados:estados

        })


    }

    pedirDatos(){
        this.db.pedir_item(this.cargarDatos,this.state.id)
    }


    actualziarLista(tipo,item){
        let lista = this.state[tipo];

        lista[item.orden] = {descripcion:item.descripcion,
            id:item.id,
            completaItem:item.completaItem
        }

        this.setState({
            [tipo]:lista,
        })
    }

    actualizar(evento){
        this.setState({
            [evento.target.name]:evento.target.value
        })
    }

    render(){
        let estados = null
        if(this.state.tipo === 1){
            estados = <Estados/>;
        }

        return(
            <Paper style={{width:'300px'}} >
                <div style={{margin:'5px'}} >
                    <TextField floatingLabelText='Descripcion' value={this.state.descripcion}
                    onChange={this.actualizar} name='descripcion' ></TextField>
                    <br/>
                    <TextField floatingLabelText='Precio' value={this.state.precio}
                    onChange={this.actualizar} name='precio' ></TextField>
                    <br/>
                    {estados}

                </div>
            </Paper>
        )
    }
}


class Estados extends Component{
    constructor(props){
        super(props);
        this.state={
            estados:props.estados
        }

        this.actualizar = props.funAct
    }

    componentWillReceiveProps(props){
        this.setState({
            estados:props.estados
        })
    }

    cargarEstados(){
        let estados = this.state.estados;
        let lista = [];
        if(len(estados) !== 0 ){
            for (let x = 0; x < estados.length; x++){
                
                lista.append(
                    <Estado descripcion={estados[x].descripcion}
                    id={estados[x].id} completaItem={estados[x].completaItem} 
                    orden={x}/>
                )
            }
        }
        
        return lista;
    }

    render(){

        <List>
            {this.cargarEstados()}
        </List>

    }
}

class Estado extends Component{
    constructor(props){
        super(props);
        this.state = {
            descripcion:props.descripcion,
            id:props.id,
            completaItem:props.completaItem,
            orden:props.orden
        }
        this.actualizarPadre = props.funAct;
        this.borrarDePadre = props.funBor;
        this.actualizar = this.actualizar.bind(this);
        this.borrar = this.borrar.bind(this);

    }

    actualizar(evento){
        this.setState({
            [evento.target.name]:evento.target.value
        });
        this.actualizarPadre(evento.target.name,evento.target.value);

    }

    borrar(){
        this.borrarDePadre(this.state.id);
    }

    componentWillReceiveProps(props){
        this.setState({
            descripcion:props.descripcion,
            id:props.id,
            completaItem:props.completaItem,
            orden:props.orden
        })
    }

    render(){
        
        let boton = null;
        if(this.state.id !== ''){
            boton = <RaisedButton label='Borrar' onClick={this.borrar} ></RaisedButton>
        }

        return(

            
            <ListItem disabled>
                <TextField style={{}} value={this.state.descripcion} 
                floatingLabelText='Descripcion' onChange={this.actualizar}
                name='descripcion' ></TextField>
                <Checkbox value={this.state.completaItem} onChange={this.actualizar} 
                name='completaItem' ></Checkbox>
                {boton}
            </ListItem>
        )
        
    }
}