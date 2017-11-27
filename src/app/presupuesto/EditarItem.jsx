import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import MUICont from 'material-ui/styles/MuiThemeProvider';
import {TextField,Avatar,List,ListItem,Paper,
        RaisedButton,SelectField,MenuItem,Divider,
        Checkbox,Subheader,Tabs,Tab,AutoComplete} from 'material-ui';
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
        let id = '';
        if(props.id){
            id = props.id
        }
        let items = [];
        let refItems = {};
        let refDesc = {};

        for (let x = 0; x < props.items.length; x++){
            items.push(props.items[x].descripcion);
            refItems[props.items[x].descripcion] = props.items[x].id;
            refDesc[props.items[x].id] = props.items[x].descripcion;
        }


        this.state={
            items:items, //lista con las descripciones
            refItems:refItems, //calve descripcion valor item id
            refDesc:refDesc, //clave item id valor descripcion
            id:id,
            area:1,
            descripcion:'',
            precio:'',
            requisitos:[''],
            requisitosFinales:[], //va a tener los numeros de ids
            tipo:false,
            estados:[{descripcion:'',id:'',completaItem:false}],

        }

        this.db = new DBHandler();
        this.actualizarPadre = props.funAct;


        this.actualizar = this.actualizar.bind(this);
        this.cargarDatos = this.cargarDatos.bind(this);
        this.actualizarLista = this.actualizarLista.bind(this);
        this.borrarDeLista = this.borrarDeLista.bind(this);
        this.actualizarRequisitos = this.actualizarRequisitos.bind(this);
        this.guardarItem = this.guardarItem.bind(this);
        
    }

    componentDidMount(){
        if(this.state.id > 0){
            this.db.pedir_item(this.cargarDatos,this.state.id);
        }
    }

    guardarItem(){

        let requisitos = [];
        for (let x = 0; x < this.state.requisitosFinales.length; x++){
            if(this.state.requisitosFinales[x] !== '' && this.state.requisitosFinales[x] !== '\r'){
                requisitos.push(this.state.requisitosFinales[x])
            }
        }
        console.log(requisitos)
        let estados = [];
        for (let x = 0; x < this.state.estados.length; x++){
            if(this.state.estados[x].descripcion !== '' || this.state.estados[x].id !== '' || this.state.estados[x].completaItem !== false){
                estados.push(this.state.estados[x]);
            }
        }

        let dic = {
            descripcion : this.state.descripcion,
            area : this.state.area,
            precio : this.state.precio,
            tipo : this.state.tipo,
            requisitos : requisitos.join(';'),
            estados: estados,
            id :this.state.id,
        }

        if(this.state.id === -1){
            this.db.agregar_item(this.actualizarPadre,dic);
        }
        else{
            this.db.actualizar_item(this.actualizarPadre,dic);
        }

    }   

    componentWillReceiveProps(props){
        let pedirInfo = false;
        if(props.id !== this.state.id || props.area !== this.state.area){
            pedirInfo = true;
        }

        let items = [];
        let refItems = {};
        let refDesc = {};
        if (pedirInfo){
            for (let x = 0; x < props.items.length; x++){
                items.push(props.items[x].descripcion);
                refItems[props.items[x].descripcion] = props.items[x].id;
                refDesc[props.items[x].id] = props.items[x].descripcion;
            }
        }

        else{
            items = this.state.items;
            refItems = this.state.refItems;
            refDesc = this.state.refDesc;
        }
    
        if(pedirInfo && props.id === -1){

            this.setState({
                items:items, //lista con las descripciones
                refItems:refItems, //calve descripcion valor item id
                refDesc:refDesc, //clave item id valor descripcion
                id:-1,
                area:props.area,
                descripcion:'',
                precio:'',
                requisitos:[''],
                requisitosFinales:[''], //va a tener los numeros de ids
                tipo:false,
                estados:[{descripcion:'',id:'',completaItem:false}],
            })
        }
        if(pedirInfo && props.id !== -1){
            this.setState({
                id:props.id,
                area:props.area,
                items:items, //lista con las descripciones
                refItems:refItems, //calve descripcion valor item id
                refDesc:refDesc, //clave item id valor descripcion
            })
            this.db.pedir_item(this.cargarDatos,props.id)
        }

    }


    cargarDatos(datos){
        let requisitosFinales = datos.requisitos.split(';');
        let refItems = {};
        let refDesc = {};
        let precio = datos.precio;
        let tipo = datos.tipo;
        let estados = datos.estados;

        

        let requisitos = [];
        for(let x = 0; x < requisitosFinales.length; x++){
            requisitos.push(this.state.refDesc[requisitosFinales[x]]);
        }

        this.setState({
            requisitos:requisitos,
            requisitosFinales:requisitosFinales,
            precio:precio,
            tipo:tipo,
            estados:estados,
            descripcion:datos.descripcion,
        })


    }

    pedirDatos(){
        this.db.pedir_item(this.cargarDatos,this.state.id)
    }


    borrarDeLista(tipo,item){
        let lista = this.state[tipo];
        lista.splice(item.orden,1);
        if(lista.length == 0){
            lista.push({
                descripcion:'',
                id:'',
                completaItem:false,
            })
        }
        this.setState({
            [tipo]:lista
        })
    }


    actualizarRequisitos(item){
        console.log(item);
        let lista = this.state.requisitos;
        let finales = this.state.requisitosFinales;
        lista[item.orden] = item.descripcion;

        if(item.descripcion in this.state.refItems){
            finales[item.orden] = this.state.refItems[item.descripcion]
        }

        if(item.orden + 1 == lista.length && !(item.descripcion === '' || item.descripcion === '\r')){
            lista.push('')
            finales.push('')
        }
        this.setState({
            requisitos:lista,
            requisitosFinales:finales,
        })
    }
    

    actualizarLista(tipo,item){
        let lista = this.state[tipo];
        lista[item.orden] = {descripcion:item.descripcion,
            id:item.id,
            completaItem:item.completaItem
        }

        if(item.orden + 1 == lista.length){
            lista.push({descripcion:'',
                id:'',
                completaItem:false
            })
        }
        if(item.completaItem == true){
            for (let x = 0; x < lista.length; x++){
                if(x != item.orden){
                    lista[x].completaItem = false;
                }
            }
        }

        this.setState({
            [tipo]:lista,
        })
    }

    actualizar(evento){
        this.setState({
            [evento.target.name]:evento.target.value
        })
    }

    render(){
        let estados = null
        if(this.state.tipo){
            estados = <Tab label='Estados'>
                         <Estados estados={this.state.estados} funAct={this.actualizarLista} funBor={this.borrarDeLista}/>
                    </Tab>;
        }
        let tipo = null
        //si tiene id esta guardado, en dicho caso no se puede modificar
        if(this.state.id == -1){
            tipo = <Checkbox checked={this.state.tipo} label='Posee estados'
            labelPosition='left'
            onCheck={()=>this.actualizar({target:{name:'tipo',value:!this.state.tipo}})} ></Checkbox>
        }

        let requi = null;

        if(this.state.items.length > 0){
            requi = <Tab label='Requisitos' >
                <Requisitos requisitos={this.state.requisitos} items={this.state.items}
                 refItems={this.state.refItems} funAct={this.actualizarRequisitos} ></Requisitos>
            </Tab>
        }

        return(
            <Paper style={{width:'450px'}} >
                <Tabs>
                    <Tab label='Item'>
                        <div style={{margin:'5px'}} >
                            <TextField floatingLabelText='Descripcion' value={this.state.descripcion}
                            onChange={this.actualizar} name='descripcion' ></TextField>
                            <br/>
                            <TextField floatingLabelText='Precio' value={this.state.precio}
                            onChange={this.actualizar} name='precio' type='number'></TextField>
                            <br/>
                            {tipo}
                        </div>
                    </Tab>
                    {estados}
                    {requi}
                </Tabs>
                <RaisedButton primary={true} label='Guardar' onClick={this.guardarItem} />
            </Paper>
        )
    }
}


class Requisitos extends Component{
    constructor(props){
        super(props);
        this.state={
            requisitos:props.requisitos,
            items:props.items,
            refItems:props.refItems,
        }

        this.actualizarPadre = props.funAct;
    }



    componentWillReceiveProps(props){
        this.setState({
            requisitos:props.requisitos,
            items:props.items,
            refItems:props.refItems,
        })
    }

    cargarRequisitos(){
        let requi = this.state.requisitos;
        let items = this.state.items;

        if(requi.length == 0 || items.length == 0){
            return null;
        }
        let lista = [];
        for (let x = 0; x < requi.length; x++){
            lista.push(<Requisito descripcion={requi[x]} 
            items={items} refItems={this.state.refItems}
            orden={x} key={x} funAct={this.actualizarPadre} ></Requisito>)
        }
        return lista;
    }

    render(){

        return(
            <List>
                {this.cargarRequisitos()}
            </List>
        )
    }

}


class Requisito extends Component{

    constructor(props){
        super(props);
        this.state={
            descripcion:props.descripcion,
            items:props.items,
            refItems:props.refItems,
            orden:props.orden,
        }
        this.actualizarPadre = props.funAct;
        this.actualizar = this.actualizar.bind(this);
        this.revisarOnBlur = this.revisarOnBlur.bind(this);
    }

    componentWillReceiveProps(props){
        this.setState({
            descripcion:props.descripcion,
            items:props.items,
            refItems:props.refItems,
            orden:props.orden,
        })
    }

    actualizar(evento){
        let valor = evento.target.value;
        let estado = this.state;
        estado.descripcion = valor;
        this.actualizarPadre(estado);
    }

    revisarOnBlur(evento){
        let estado = this.state;
        let items = estado.refItems;
        let descripcion = evento.target.value;
        if(descripcion.length == 0){
            return;
        }
        if(!(descripcion in items)){
            estado.descripcion = '\r';
        }
        this.actualizarPadre(estado);
    }

    render(){
        return(
            <ListItem disabled>
                <AutoComplete floatingLabelText='Item'
                dataSource={this.state.items} searchText={this.state.descripcion}
                value={this.state.descripcion}
                onBlur={this.revisarOnBlur} onChange={this.actualizar}
                onNewRequest={(elegido,indice)=>{
                this.actualizar({target:{value:elegido}})
                }}></AutoComplete>
            </ListItem>
        )
    }

}


class Estados extends Component{
    constructor(props){
        super(props);
        this.state={
            estados:props.estados
        }

        this.actualizar = (item)=>{props.funAct('estados',item)};
        this.borrar = props.funBor;
    }

    componentWillReceiveProps(props){
        this.setState({
            estados:props.estados
        })
    }

    cargarEstados(){
        let estados = this.state.estados;
        let lista = [];
        if(estados.length !== 0 ){
            for (let x = 0; x < estados.length; x++){
                
                lista.push(
                    <Estado descripcion={estados[x].descripcion}
                    id={estados[x].id} completaItem={estados[x].completaItem} 
                    orden={x} funAct={this.actualizar} key={x} 
                    funBor={this.borrar} />
                )
                lista.push(<Divider></Divider>)
            }
        }

        return lista;
    }

    render(){

        return(
            <List>
                <Subheader>Estados</Subheader>
                {this.cargarEstados()}
            </List>
        )

    }
}

class Estado extends Component{
    constructor(props){
        super(props);
        this.state = {
            descripcion:props.descripcion,
            id:props.id,
            completaItem:props.completaItem,
            orden:props.orden
        }
        this.actualizarPadre = props.funAct;
        this.borrarDePadre = props.funBor;
        this.actualizar = this.actualizar.bind(this);
        this.borrar = this.borrar.bind(this);

    }

    actualizar(evento){
        let estado = this.state;
        estado[evento.target.name] = evento.target.value
        this.actualizarPadre(this.state);

    }

    borrar(){
        this.borrarDePadre('estados',this.state);
    }

    componentWillReceiveProps(props){
        this.setState({
            descripcion:props.descripcion,
            id:props.id,
            completaItem:props.completaItem,
            orden:props.orden
        })
    }

    render(){
        
        let boton = null;
        if(this.state.id === ''){
            boton = <RaisedButton label='Borrar' onClick={this.borrar} ></RaisedButton>
        }

        return(

            
            <ListItem disabled>
                <TextField style={{width:'200px'}} value={this.state.descripcion} 
                floatingLabelText='Descripcion' onChange={this.actualizar}
                name='descripcion' ></TextField>
                <Checkbox checked={this.state.completaItem} 
                onCheck={()=>(this.actualizar({target:{name:'completaItem',value:!this.state.completaItem}}))} 
                name='completaItem' label='Completa Item ' labelPosition='left'></Checkbox>
                {boton}
            </ListItem>
        )
        
    }
}

