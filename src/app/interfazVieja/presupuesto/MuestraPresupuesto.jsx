import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import MUICont from 'material-ui/styles/MuiThemeProvider';
import {TextField,Avatar,List,ListItem,Paper,
        RaisedButton,Tab,Tabs,SelectField,MenuItem,
    Checkbox} from 'material-ui';
import DBHandler from '../dbHandler';

export default function main(){
    let root = document.getElementById("main");
    root.limpiar();

    ReactDOM.render(
        <MUICont>
            <Presupuesto/>
        </MUICont>,
        root
    )
}




export class Presupuesto extends Component{

    constructor(props){
        super(props);

        let plan = 0;
        if(props.plan){
            plan = props.plan;
        }

        this.state={
            alias:'',
            items:[],
            elegido:-1,
            estados:{},
            plan:plan,
            aprobado:false,
            activo:false,
            cancelado:false,
            fechaCreacion:'',
            fechaFinaliza:'',
            fechaAprobacion:'',
            requisitos:{},
            historial:{},
            
        }

        this.db = new DBHandler();
        this.recibirItems = this.recibirItems.bind(this);
        this.aprobarPlan = this.aprobarPlan.bind(this);
    }

    componentDidMount(){
        if(this.state.plan !== 0){
            this.db.pedir_items_presupuesto(this.recibirItems,this.state.plan);
        }
    }

    componentWillReceiveProps(props){
        if(!props.plan || props.plan === this.state.plan){
            return;
        }

        this.setState({plan:props.plan});
        this.db.pedir_items_presupuesto(this.recibirItems,props.plan);
        
    }

    actualizarComentarios(comentarios){
        this.setState({comentarios:comentarios})
    }

    recibirItems(datos){
        if(!datos){
            return;
        }
        let items = datos.items;
        let estados = {};
        let estadosRaw = datos.estados;
        for (let x = 0; x < estadosRaw.length; x++){
            if(!(estadosRaw[x].item in estados) ){
                estados[estadosRaw[x].item] = {}
            }
            estados[estadosRaw[x].item][estadosRaw[x].id] = estadosRaw[x].descripcion;

        }
        this.setState({estados:estados,
            items:items,
            comentarios:datos.comentarios,
            requisitos:datos.requisitos,
            historia:datos.historial,
            aprobado:datos.aprobado,
            activo:datos.activo,
            alias:datos.alias,
            fechaCreacion:datos.fechaCreacion,
            fechaFinaliza:datos.fechaFinaliza,
            fechaAprobacion:datos.fechaAprobacion,
            cancelado:datos.cancelado,
            estados:datos.estados,
        })

    }

    aprobarPlan(){
        this.db.aprobar_plan(()=>this.db.pedir_items_presupuesto(this.recibirItems,this.state.plan),this.state.plan)
    }

    cargarItems(){

        let items = this.state.items;
        if(items.length === 0){
            return [];
        }
        let lista = [];
        for( let x = 0; x < items.length; x++){
            let habilitado = true;
            if(items[x].id in this.state.requisitos){
                let req = this.state.requisitos[items[x].id];
                for (let x = 0; x< req.length; x++){
                    if(req[x].completo === 0){
                        habilitado = false;
                        break;
                    }
                }
            }
            if(habilitado === false){
                continue;
            }
            let segundoTexto = '';
            if(items[x].variable === 1){
                if(items[x].valor){
                    segundoTexto = 'Valor:' + items[x].valor;
                }
                segundoTexto= 'Sin valor';

            }
            else if(items[x].variable === 0){
                if(items[x].estado){
                    segundoTexto = this.state.estados[items[x].idItem][items[x].estado]
                }
                else{
                    segundoTexto = 'Sin estado';
                }
            }
            lista.push(
                <ListItem primaryText={items[x].descripcion}
                secondaryText={segundoTexto}
                onClick={()=>this.setState({elegido:x})} >
                </ListItem>
            )
        }
        return lista
    }

    render(){

        let items = null;
        if(this.state.aprobado){

            items=<List>
                    {this.cargarItems()}
                </List>

        }
        else if(this.state.activo){
            items = <RaisedButton label='Aprobar' primary={true} onClick={this.aprobarPlan} />
        }
        let estado = '';
        if(this.state.cancelado ){
            estado = 'Cancelado';
        }
        else if (!this.state.aprobado){
            estado = 'Esperando Aprobacion';
        }
        else if(this.state.aprobado && this.state.activo){
            estado = 'En proceso';
        }
        else if(this.state.aprobado && !this.state.activo){
            estado = 'Finalizado';
        }

        let item = null;
        if(this.state.elegido != -1){
            let estados = []
            let id = this.state.items[this.state.elegido].id
            if(id in this.state.estados){
                estados = this.state.estados[id]
            }
            let requisitos = [];
            if(id in this.state.requisitos){
                requisitos = this.state.requisitos[id]
            }

            item= <EstadoItem 
            comentarios={this.state.comentarios[id]}
            estados={estados}
            variable={this.state.items[this.state.elegido].variable}
            id={id}
            responsable={this.state.items[this.state.elegido].responsable}
            completo={this.state.items[this.state.elegido].completo}
            requisitos={requisitos}
            precio={this.state.items[this.state.elegido].precio}
            estado={this.state.items[this.state.elegido].estado} 
            valor={this.state.items[this.state.elegido].valor}
            funComen={this.actualizarComentarios}
            funItems={this.recibirItems}/>
        }

        return( <div>
            <Paper style={{width:'300px',margin:'5px',display:'inline-block'}} >
                <span>{this.state.alias}</span>
                <br/>
                <span>Fecha de Cracion: {this.state.fechaCreacion}</span>
                <br/>
                <span>Estado: {estado}</span>
                <br/>
                {items}
            </Paper>
            <div style={{marginLeft:'5px',display:'inline-block',verticalAlign:'top'}}>
                {item}
            </div>
        </div> )
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
            comentarios:props.comentarios,
            estados:props.estados,
            variable:props.variable,
            id:id,
            responsable:props.responsable,
            responsables:[
                <MenuItem value={1} primaryText='DGR'/>,
                <MenuItem value={2} primaryText='Cliente'/>,
                <MenuItem value={3} primaryText='Organismo'/>,
                <MenuItem value={4} primaryText='Tercerizado'/>
            ],
            completo:props.completo,
            requisitos:props.requisitos,//requisitos y su estado.
            precio:props.precio,
            estado:props.estado,
            valor:props.valor,
        }

        this.actualizarComentarios = props.funComen;
        this.actualizarItems = props.funItems;
        this.db = new DBHandler();
        
    }

    componentWillReceiveProps(props){
        this.setState({
            valor:props.valor,
            estado:props.estado,
            comentarios:props.comentarios,
            estados:props.estados,
            variable:props.variable,
            id:props.id,
            responsable:props.responsable,
            completo:props.completo,
            requisitos:props.requisitos,
            precio:props.precio})
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
                                        disponible={this.state.disponible}
                                        plan={this.state.id} 
                                        funItems = {this.actualizarItems}
                                        />
                        </Tab>
                        <Tab label='Comentarios'>
                            <Comentarios funComen ={this.actualizarItems}
                            comentarios={this.state.comentarios} plan={this.state.id} />
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
            plan:props.plan,
            comentario:'',
            fecha:'',
            alCliente:false,

        }

        this.actualizarComentarios = props.funComen;
        this.db = new DBHandler();
    }

    componentWillReceiveProps(props){
        let dic = {
            comentarios:props.comentarios,
            plan:props.plan,
            comentario:'',
            fecha:'',
            alCliente:false,
            
        }
        this.setState(dic);
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
                    <TextField floatingLabelText='Fecha' type='date' floatingLabelFixed={true}
                    onChange={(ev)=>this.setState({fecha:ev.target.value})} 
                    value={this.state.fecha} />
                    <br/>
                    <TextField
                        value={this.state.comentario}
                        floatingLabelText="Comentario"
                        multiLine={true}
                        maxLength={100}
                        style={{height:'100px'}}
                        onChange={(ev)=>this.setState({comentario:ev.target.value})} />
                    <br/>
                    <Checkbox
                        checked={this.state.alCliente}
                        labelPosition='left'
                        label="Al cliente"
                        onCheck={(e, checked) => this.setState({alCliente:checked})}/>
                    <RaisedButton
                        primary={true}
                        label="Enviar"
                        onClick={()=>this.db.guardar_comentario(this.actualizarComentarios,{
                            id:this.state.plan,
                            comentario:this.state.comentario,
                            alCliente:this.state.alCliente,
                            fecha:this.state.fecha,
                        })} />
                </div>
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
            plan:props.plan,
        }
        this.actualizarValor = this.actualizarValor.bind(this);
        this.actualizarItems = props.funItems;
        this.actualizarResponsable = this.actualizarResponsable.bind(this);
        this.db = new DBHandler();
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
            plan:props.plan
        })
    }

    actualizarValor(){
        if(this.state.variable === 0){
            this.db.actualizar_item_plan_valor(this.actualizarItems,{id:this.state.plan,valor:this.state.valor});
        }
        else{
            this.db.actualizar_item_plan_estado(this.actualizarItems,{id:this.state.plan,estado:this.state.estado});
        }
    }

    actualizarResponsable(){
        this.db.actualizar_item_plan_responsable(this.actualizarItems,{id:this.state.plan,responsable:this.state.responsable});
    }

    render(){

        let valor = null;
        let completo = false;
        if(this.state.completo === 1){
            completo = true;
        }
        if(this.state.variable === 0){
            let campo = this.state.valor;
            if(!campo){
                campo = '';
            } 
            valor = <TextField floatingLabelText='Variable' onChange={(ev)=>this.setState({valor:ev.target.value})}
             value={campo} disabled={completo} ></TextField>
        }
        else{
            let estados = this.state.estados.map((elem,index)=><MenuItem value={elem.id} primaryText={elem.descripcion} key = {index}/>)
            valor = <SelectField value={this.state.estado} disabled={completo} onChange={(elem,i,v)=>this.setState({estado:v})}>
                {estados}
            </SelectField>
        }

        return(
            <div style={{margin:'5px'}} >
                <label htmlFor="">{this.state.descripcion}</label>
                <br/>
                {valor}
                <RaisedButton label='Actualizar' disabled={completo} onClick={this.actualizarValor}/>
                <br/>
                <SelectField value={this.state.responsable} disabled={completo} onChange={(elem,i,v)=>this.setState({responsable:v})}>
                    {this.state.responsables}
                </SelectField>
                <RaisedButton label='Actualizar' disabled={completo} onClick={this.actualizarResponsable}/>
                <br/>
                Valor: <label htmlFor="">{this.state.precio}</label>
            </div>
        )

    }
}