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

        this.state ={
            areas:[],
            elegiro:'',
        }
    }

    render(){
        return(
            <Paper>

            </Paper>
        )
    }
}