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
            <Contenedor/>
        </MUICont>,
        root
    )
}


class Contenedor extends Component{

    constructor(props){
        super(props);
        this.state = {
            items:[{'descripcion':'Libre deuda','id':1}],
            elegido:'',
            area:0,
            areas:[{'descripcion':'Planeamiento','id':1},
            {'descripcion':'Plano Municipal Obra Civil','id':2}],

        }
        this.db = new DBHandler();
        this.cambiarArea = this.cambiarArea.bind(this);
        this.cargarItems = this.cargarItems.bind(this);
    }

    cargarItems(datos){
        this.setState({
            items:datos.items,
            elegido:0,
        })
    }

    cambiarArea(evento,index,valor){
        if(valor !== this.state.area){
            this.setState({
                area:value
            },this.db.pedir_items())
        }
    }

    generarAreas(){
        let areas = this.state.areas;
        if(areas.length === 0){
            return null;
        }
        return areas.map((elem,index)=>(
            <MenuItem value={elem.id} key={index} primaryText={elem.descripcion} ></MenuItem>
        ))
    }

    generarItems(){
        let items = this.state.items;
        if(items.length === 0){
            return <ListItem  primaryText='No hay Items para Tipo'></ListItem>
        }
        return items.map((elem,index)=>(
            <ListItem primaryText={elem.descripcion} 
            onClick={()=>(this.setState({elegido:elem.id}))} 
            ></ListItem>
        ))
    }

    render(){
        return(
            <Paper>
                <div style={{margin:'5px'}}>
                    <SelectField value={this.state.area} floatingLabelText='Tipo de Presupuesto' onChange={this.cambiarArea} >
                        {this.generarAreas()}
                    </SelectField>
                    <br/>
                    <List>
                        {this.generarItems()}
                    </List>
                </div>
            </Paper>
        )
    }
}