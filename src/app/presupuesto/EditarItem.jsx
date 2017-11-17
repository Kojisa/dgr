import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import MUICont from 'material-ui/styles/MuiThemeProvider';
import {TextField,Avatar,List,ListItem,Paper,
        RaisedButton,SelectField,MenuItem,Divider} from 'material-ui';
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
        let id = null;
        if(props.id){
            id = props.id
        }
        this.state={
            items:[],
            id:0,
            area:props.area,
            descripcion:'',
            precio:'',
            requisitos:[],
            tipo:'',
            estados:[],

        }
        this.actualizar = this.actualizar.bind(this);
    }

    actualizar(evento){
        this.setState({
            [evento.target.name]:evento.target.value
        })
    }

    render(){

        return(
            <Paper style={{width:'300px'}} >
                <div style={{margin:'5px'}} >
                    <TextField floatingLabelText='Descripcion' value={this.state.descripcion}
                    onChange={this.actualizar} name='descripcion' ></TextField>
                    <br/>
                    <TextField floatingLabelText='Precio' value={this.state.precio}
                    onChange={this.actualizar} name='precio' ></TextField>
                    <br/>
                    
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

    cargarEstados(){
        let estados = this.state.estados;
        let lista = [];
        if(len(estados) !== 0 ){
            lista.append(  )
        }
    }

    render(){

    }
}

class Estado extends Component{
    constructor(props){
        super(props);
        this.state = {
            descripcion:props.descripcion,
            id:props.id,
            completaItem:props.completaItem,
        }
    }

    componentWillReceiveProps(props){
        this.setState({
            descripcion:props.descripcion,
            id:props.id,
            completaItem:props.completaItem,
        })
    }

    render(){
        
    }
}