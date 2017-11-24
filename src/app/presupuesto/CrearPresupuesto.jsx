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
            <CrearPlan/>
        </MUICont>,
        root
    )
}

//4798
export class CrearPlan extends Component{

    constructor(props){
        super(props);

        this.state={
            alias:'',
            cliente:props.id,
            area:'',
            areas:[],
            elegidos:[],
            items:[],
        }
    }
}