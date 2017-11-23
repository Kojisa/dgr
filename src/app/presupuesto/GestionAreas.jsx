import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import MUICont from 'material-ui/styles/MuiThemeProvider';
import {TextField,Avatar,List,ListItem,Paper,
        RaisedButton} from 'material-ui';
import DBHandler from '../dbHandler';
import {Edicion} from './EditarArea';



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
            elegido:0,
            filtro:'',
            descElegido:'',
        }

        this.db = new DBHandler();


        this.actualizar = this.actualizar.bind(this);
        this.recibirAreas = this.recibirAreas.bind(this);
        this.cargarAreas = this.cargarAreas.bind(this);
    }

    componentDidMount(){
        this.db.pedir_areas(this.recibirAreas);
    }

    actualizar(evento){
        this.setState({
            [evento.target.name]:evento.target.value
        })
    }

    recibirAreas(datos){
        this.setState({
            areas:datos,
            elegido:0,
            descElegido:'',
        })
    }

    cargarAreas(){
        let areas = this.state.areas;
        if(areas.length == 0){
            return <ListItem>No hay Areas Cargadas</ListItem>
        }

        let lista = [];
        for( let x = 0; x < areas.length; x++){
            if(areas[x].descripcion.toLowerCase().includes(this.state.filtro.toLowerCase())){
                lista.push( <ListItem primaryText={areas[x].descripcion} 
                    onClick={()=>(this.setState({elegido:areas[x].id,descElegido:areas[x].descripcion}))}>
                    </ListItem>)
            }
        }
        return lista;
    }

    


    render(){

        let visor = null;
        if(this.state.elegido !== 0){
            visor = <Edicion id={this.state.elegido} descripcion={this.state.descElegido} 
            funAct = {()=>this.db.pedir_areas(this.recibirAreas)}></Edicion>
        }


        return(
            <div>
                <Paper style={{width:'350px',display:'inline-block',marginLeft:'5px'}}>
                    <div style={{margin:'5px'}}>
                        <TextField value={this.state.filtro} name='filtro' 
                        onChange={this.actualizar} floatingLabelText='Buscar' ></TextField>
                        <RaisedButton label='Nuevo' primary={true}
                        onClick={()=>this.setState({elegido:-1,descElegido:''})} ></RaisedButton>
                        <br/>
                        {this.cargarAreas()}
                    </div>
                    


                </Paper>
                <div style={{width:'400px',display:'inline-block',verticalAlign:'top',gravity:'left',marginLeft:'5px'}}>
                    {visor}
                </div>
            </div>
        )
    }
}