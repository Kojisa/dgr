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
            <Edicion/>
        </MUICont>,
        root
    )
}


export class Edicion extends Component{
    constructor(props){
        super(props);

        let id = 0;
        if (props.id){
            id = props.id;
        }
        let descripcion = '';
        if(props.descripcion){
            descripcion = props.descripcion;
        }

        this.state = ({
            id:id,
            descripcion:descripcion,
        })
        this.db = new DBHandler();
        this.actualizarPadre = props.funAct;

        this.guardar = this.guardar.bind(this);
        this.actualizar = this.actualizar.bind(this);
    }

    componentWillReceiveProps(props){
        this.setState({
            id:props.id,
            descripcion:props.descripcion
        })
    }

    actualizar(evento){
        this.setState({
            [evento.target.name]:evento.target.value,
        });
    }

    guardar(){
        if( this.state.id === -1){
            this.db.guardar_area(this.actualizarPadre,this.state);
        }
        else{
            this.db.actualizar_area(this.actualizarPadre,this.state);
        }
    }

    render(){

        return(
            <Paper style={{width:'350px'}} >
                <div style={{margin:'5px'}}>
                    <TextField value={this.state.descripcion} name='descripcion'
                    onChange={this.actualizar} floatingLabelText='Descripcion'></TextField>
                    <br/>
                    <RaisedButton label='Guardar' onClick={this.guardar} ></RaisedButton>
                </div>

            </Paper>
        )
    }
}