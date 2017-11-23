import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import MUICont from 'material-ui/styles/MuiThemeProvider';
import {TextField,Avatar,List,ListItem,Paper,
        RaisedButton,SelectField,MenuItem,Divider} from 'material-ui';
import DBHandler from '../dbHandler';
import {Edicion} from './EditarItem';



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
            items:[],
            elegido:0,
            area:0,
            areas:[],

        }
        this.db = new DBHandler();
        this.cambiarArea = this.cambiarArea.bind(this);
        this.cargarItems = this.cargarItems.bind(this);
        this.cargarAreas = this.cargarAreas.bind(this);
    }

    componentDidMount(){
        this.db.pedir_areas(this.cargarAreas)
    }

    cargarItems(datos){
        this.setState({
            items:datos.items,
            elegido:0,
        })
    }

    cargarAreas(datos){
        this.setState({areas:datos})
    }

    cambiarArea(evento,index,valor){
        if(valor !== this.state.area){
            this.setState({
                area:valor
            },this.db.pedir_items(this.cargarItems,valor))
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
        return items.map((elem,index)=>{
            if(elem.area == this.state.area){
                return <ListItem primaryText={elem.descripcion} 
                onClick={()=>(this.setState({elegido:elem.id}))} 
                ></ListItem>
            }
        })
    }

    render(){
        let edicion = null;
        
        if(this.state.elegido != 0){
            edicion= <div>
                <Edicion id={this.state.elegido} area={this.state.area} 
                items={this.state.items} funAct={()=>this.db.pedir_items(this.cargarItems,this.state.area)} />
            </div>
        }

        let botonNuevo = null;
        if(this.state.area != 0){
            botonNuevo = <RaisedButton label='Nuevo'
             onClick={()=>(this.setState({elegido:-1}))} ></RaisedButton>
        }



        return(
            <div>
                <Paper style={{width:'450px',display:'inline-block'}} >
                    <div style={{margin:'5px'}}>
                        <SelectField value={this.state.area} floatingLabelText='Tipo de Presupuesto' onChange={this.cambiarArea} >
                            {this.generarAreas()}
                        </SelectField>
                        {botonNuevo}
                        <br/>
                        <List>
                            {this.generarItems()}
                        </List>
                    </div>
                </Paper>
                <div style={{width:'400px',display:'inline-block',verticalAlign:'top',gravity:'left',marginLeft:'5px'}}>
                    {edicion}
                </div>
            </div>
        )
    }
}