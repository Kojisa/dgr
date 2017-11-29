import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import MUICont from 'material-ui/styles/MuiThemeProvider';
import {TextField,Avatar,List,ListItem,Paper,
        RaisedButton,Divider,SelectField,MenuItem} from 'material-ui';
import DBHandler from '../dbHandler';



export default function main(){
    let root = document.getElementById("main");
    root.limpiar();

    ReactDOM.render(
        <MUICont>
            <Muestra/>
        </MUICont>,
        root
    )
}


export class Muestra extends Component{
    constructor(props){
        super(props);

        let cliente = 1;
        if(props.cliente){
            cliente = props.cliente
        }

        this.state={
            planes:[],
            cliente:cliente,
            elegido:0,
            estado:0,
        }

        this.actualizarPadre = props.funAct;
        this.db = new DBHandler();
        this.recibirPlanes = this.recibirPlanes.bind(this);
    }

    componentDidMount(){
        this.db.pedir_planes(this.recibirPlanes,this.state.cliente)
    }

    componentWillReceiveProps(props){
        if(!props.cliente || props.cliente === this.state.cliente){
            return 
        }
        this.setState({cliente:props.cliente},()=>this.db.pedir_planes(this.recibirPlanes,props.cliente))
    }

    recibirPlanes(planes){
        this.setState({planes:planes})
    }

    cargarPlanes(){

        let planes = this.state.planes;
        let lista = [];
        for(let x = 0; x < planes.length; x++){
            
            let estado = '';
            if(planes[x].cancelado ){
                estado = 'Cancelado';
            }
            else if (!planes[x].aprobado){
                estado = 'Esperando Aprobacion';
            }
            else if(planes[x].aprobado && planes[x].activo){
                estado = 'En proceso';
            }
            else if(planes[x].aprobado && !planes[x].activo){
                estado = 'Finalizado';
            }
            let agregar = false;
            if(this.state.estado == 0){
                agregar = true;
            }
            else if(planes[x].cancelado && this.state.estado == 3){
                agregar = true;
            }
            else if(!planes[x].aprobado && !planes[x].cancelado && this.state.estado == 1){
                agregar = true;
            }
            else if(planes[x].aprobado && planes[x].activo && this.state.estado == 2){
                agregar = true;
            }
            else if(planes[x].aprobado && !planes[x].activo && this.state.estado == 4){
                agregar = true;
            }

            if(agregar){
                lista.push( <ListItem onClick={()=>this.actualizarPadre(planes[x].id,'planActual')}
                primaryText={planes[x].alias}
                secondaryText={'Estado: ' + estado}
                >
                </ListItem> )
                lista.push(<Divider></Divider>)
            }
        }

        return lista;
    }

    cargarEstados(){
        let lista = [];
        let estados = ['Todos','Sin Aprobar','Vigentes','Cancelados','Completos'];

        for( let x = 0; x < estados.length; x++){
            lista.push( <MenuItem value={x} primaryText={estados[x]} onClick={()=>this.setState({
                estado:x
            })}></MenuItem> )
        }

        return lista

    }

    
    render(){
        let altura = window.innerHeight -100;
        return(
            <Paper style={{width:'300px',maxHeight:altura,overflowY:'auto'}} >
                <div style={{margin:'5px'}} >
                    <SelectField value={this.state.estado} style={{width:'220px'}} >
                        {this.cargarEstados()}
                    </SelectField>
                    <br/>
                    <RaisedButton primary={true}
                    onClick={()=>this.actualizarPadre(-1,'planActual')} 
                    label='Nuevo' ></RaisedButton>
                    <br/>
                    <List>
                        {this.cargarPlanes()}
                    </List>
                </div>
            </Paper>
        )
    }
}