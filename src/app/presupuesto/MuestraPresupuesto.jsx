import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import MUICont from 'material-ui/styles/MuiThemeProvider';
import {TextField,Avatar,List,ListItem,Paper,
        RaisedButton,Tab,Tabs,SelectField} from 'material-ui';
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

        let plan = 0;
        if(props.plan){
            plan = props.plan;
        }

        this.state={
            alias:'',
            items:[],
            elegido:0,
            estados:{},
            plan:0,
            
        }

        this.db = new DBHandler();
        this.recibirItems = this.recibirItems.bind(this);
    }

    componentWillReceiveProps(props){
        if(!props.plan || props.plan === this.state.plan){
            return;
        }

        this.setState({plan:props.plan});
        this.db.pedir_items_presupuesto(this.recibirItems,props.plan);
        
    }

    recibirItems(datos){
        let items = datos.items;
        let estados = {};
        let estadosRaw = datos.estados;
        for (let x = 0; x < estadosRaw.length; x++){
            if(!(estadosRaw[x].item in estados) ){
                estados[estadosRaw[x].item] = {}
            }
            estados[estadosRaw[x].item][estadosRaw[x].id] = estadosRaw[x].descripcion;

        }
        this.setState({estados:estados,items:items})

    }

    cargarItems(){

        let items = this.state.items;
        if(items.length === 0){
            return [];
        }
        let lista = [];
        for( let x = 0; x < items.length; x++){
            let segundoTexto = '';
            if(items[x].variable === 1){
                segundoTexto = items[x].valor;
            }
            else if(items[x].variable === 0){
                segundoTexto = this.state.estados[items[x].idItem][items[x].estado]
            }
            lista.push(
                <ListItem primaryText={items[x].descripcion}
                secondaryText={segundoTexto}
                onClick={()=>this.setState({elegido:items[x].id})} >
                </ListItem>
            )
        }
    }

    render(){

        return( <Paper>
            <div style={{margin:'5px'}} >
                <List>
                    {this.cargarItems()}
                </List>
            </div>
        </Paper> )
    }

}


class EstadoItem extends Component{
    constructor(props){
        
        super(props);

        let id = 0;
        if(props.id){
            id = props.id;
        }

        this.state = {
            comentarios:[],
            estados:[],
            variable:false,
            id:id,
            responsable:0,
            responsables:[],
            completo:false,
            requisitos:[],//requisitos y su estado.
        }
        this.db = new DBHandler();
        this.recibirItem = this.recibirItem.bind(this);
    }

    recibirItem(datos){

    }


    componentWillReceiveProps(props){
        if(!props.id || this.state.id === props.id){
            return;
        }

        this.setState({
            id:props.id
        })
        this.db.pedir_estado_item(this.recibirItem,props.id);
    }

    render(){

        return(
            <Paper>
                <div>
                    <Tabs >
                        <Tab label='Datos' >
                            <DatosItem descripcion={this.state.descripcion}
                                        responsable={this.state.responsable}
                                        responsables={this.state.responsables}
                                        completo={this.state.completo}
                                        fechaCompletado={this.state.fechaCompletado}
                                        variable={this.state.variable}
                                        estado={this.state.estado}
                                        estados={this.state.estados}
                                        valor={this.state.valor}
                                        precio={this.state.precio}
                                        disponible={this.state.disponible}  />
                        </Tab>
                        <Tab label='Comentarios'>
                            
                        </Tab>
                        <Tab label='Otros' >

                        </Tab>
                    </Tabs>
                </div>
            </Paper>
        )
    }
}


class Comentarios extends Component{

    constructor(props){
        super(props);
        this.state ={
            comentarios:props.comentarios,

        }
    }

    componentWillReceiveProps(props){
        this.setState({
            comentarios:props.comentarios
        });
    }

    cargarComentarios(){
        let comens = this.state.comentarios;
        let lista = [];

        for(let x = 0; x < comens.length; x++){
            lista.push( <Comentario comentario={comens[x].comentario}
                alCliente={comens[x].alCliente} fecha={comens[x].fecha} 
                />)
        }

        return lista;
    }

    render(){

        return(
            <div style={{margin:'5px'}} >
                <div>
                    <List>
                        {this.cargarComentarios()}
                    </List>
                </div>
            </div>
        )
    }
}


class Comentario extends Component{
    constructor(props){
        super(props);
        this.state= {
            comentario:props.comentario,
            alCliente:props.alCliente,
            fecha:props.fecha,
        }
    }

    componentWillReceiveProps(props){
        this.setState({
            comentario:props.comentario,
            alCliente:props.alCliente,
            fecha:props.fecha,
        })
    }


    armarFecha(fecha){
        let date = Date.parse(fecha);
        let string = '';
        string += fecha.substring(8,10) + '/' + fecha.substring(5,7) + '/' +  fecha.substring(0,4)
        return string;
    }

    render(){
        let hablado = '';
        if(this.state.alCliente){
            hablado = 'Hablado con el cliente';
        }
        return(
            <ListItem>
                {this.armarFecha(this.state.fecha)}
                <br/>
                {this.state.comentario}
                <br/>
                <span style={{float:'right'}} >{hablado}</span>
            </ListItem>
        )
    }
}





class DatosItem extends Component{

    constructor(props){
        super(props);
        this.state={
            descripcion:props.descripcion,
            responsable:props.responsable,
            responsables:props.responsables,
            completo:props.completo,
            fechaCompletado:props.fechaCompletado,
            variable:props.variable,
            estado:props.estado,
            estados:props.estados,
            valor:props.valor,
            precio:props.precio,
            disponible:props.disponible,
        }
    }

    componentWillReceiveProps(props){

        this.setState({
            descripcion:props.descripcion,
            responsable:props.responsable,
            responsables:props.responsables,
            completo:props.completo,
            fechaCompletado:props.fechaCompletado,
            variable:props.variable,
            estado:props.estado,
            estados:props.estados,
            valor:props.valor,
            precio:props.precio,
            disponible:props.disponible,
        })
    }

    render(){

        let valor = null;
        if(this.state.variable === 1){    
            valor = <TextField floatingLabelText='Valor'
             value={this.state.valor} disabled={this.state.completo}></TextField>
        }
        else{
            valor = <SelectField value={this.state.estado} disabled={this.state.completo}>
                {this.state.estados}
            </SelectField>
        }


        return(
            <div style={{margin:'5px'}} >
                <label htmlFor="">{this.state.descripcion}</label>
                <br/>
                {valor}
                <RaisedButton label='Actualizar' disabled={this.state.completo}/>
                <br/>
                <SelectField value={this.state.responsable} disabled={this.state.completo} >
                    {this.state.responsables}
                </SelectField>
                <RaisedButton label='Actualizar' disabled={this.state.completo} />
                <br/>
                Valor: <label htmlFor="">{this.state.precio}</label>
            </div>
        )

    }
}