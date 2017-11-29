import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import MUICont from 'material-ui/styles/MuiThemeProvider';
import {TextField,List,ListItem,Paper,
        RaisedButton,SelectField,Table,
        TableRow,TableRowColumn,TableHeader,
        TableHeaderColumn,TableFooter,TableBody,
        MenuItem,Checkbox} from 'material-ui';
import DBHandler from '../dbHandler';


export default function main(){
    let root = document.getElementById("main");
    root.limpiar();

    ReactDOM.render(
        <MUICont>
            <EditarPlan/>
        </MUICont>,
        root
    )
}

//4798
export class EditarPlan extends Component{

    constructor(props){
        super(props);

        this.state={
            alias:'',
            cliente:props.id,
            area:0,
            areas:[],
            items:[],
            responsables:[],
        }
        this.db = new DBHandler();

        this.pedirItems = this.pedirItems.bind(this);
        this.cargarAreas = this.cargarAreas.bind(this);
        this.pedirResponsables = this.pedirResponsables.bind(this);
        this.recibirItems = this.recibirItems.bind(this);
        this.recibirResponsables = this.recibirResponsables.bind(this);
        this.actualizarArea =this.actualizarArea.bind(this);
        this.guardarPresupuesto = this.guardarPresupuesto.bind(this);
    }


    componentDidMount(){
        this.pedirResponsables();
        this.db.pedir_areas(this.cargarAreas);
    }

    actualizarArea(evento,index,valor){
        if(valor === this.state.area || valor === 0){
            return;
        }
        this.setState({area:valor},this.pedirItems)
        
        
    }

    guardarPresupuesto(){
        let idCliente = 1 //esto despues se cambia
        let alias = this.state.alias;
        let area = this.state.area;
        let items = [];
        for (let x = 0; x < this.state.items.length; x++){
            if(this.state.items[x].elegido){
                items.push({id:this.state.items[x].id,
                    precio:this.state.items[x].precio,
                    responsable:this.state.items[x].aCargo,
                    descripcion:this.state.items[x].descripcion})
            }
        }

        let dic = {cliente:idCliente,
            alias:alias,
            items:items,
            area:area,
        }

        this.db.guardar_plan(null,dic);
    }


    cargarAreas(areas){

        let lista = [];
        for( let x = 0; x < areas.length; x++){
            lista.push( <MenuItem key={x} value={areas[x].id} primaryText={areas[x].descripcion} ></MenuItem>)
        }
        this.setState({areas:lista});
    }
    
    pedirItems(){
        let area = this.state.area;
        this.db.pedir_items_requisitos(this.recibirItems,area);
    }

    pedirResponsables(){
        this.db.pedir_responsables(this.recibirResponsables);
    }

    recibirItems(items){
        let lista = [];
        for (let x = 0; x < items.length; x++){
            
            if(items[x]['elegido'] === undefined){
                items[x]['elegido'] = false;
            }
            if(items[x]['aCargo'] === undefined ){
                items[x]['aCargo'] = 1;
            }
            items[x]['orden'] = x;
            items[x].requisitos = items[x].requisitos.split(';')
            lista.push(items[x])
        }
        this.setState({items:lista})
    }

    seleccionar(valor,x){
        let value = valor;//.target.value;
        let items = this.state.items;
        items[x].elegido = value;
        
        if(valor === false){
            for (let y = 0; y < items.length; y++){
                if(items[y].requisitos.indexOf(items[x].id.toString()) !== -1 ){
                    items[y].elegido = false;
                }
            }
        }

        if(valor === true){
            for (let y = 0; y < items.length; y++){
                if(items[x].requisitos.indexOf(items[y].id.toString()) !== -1){
                    items[y].elegido = true;
                }
            }
        }
        
        this.setState({
            items:items
        })

    }

    recibirResponsables(responsables){
        let lista = [];
        for (let x = 0; x < responsables.length; x++){
            lista.push( <MenuItem key={x} value={responsables[x].id} key={x}
                primaryText={responsables[x].descripcion}  ></MenuItem> )
        }
        this.setState({
            responsables:lista
        })
    }

    cambiarCargo(valor,indice){
        let items = this.state.items;
        items[indice].aCargo = valor;
        this.setState({items:items})
    }

    calcularTotal(){
        let items = this.state.items;
        let total = 0;

        for(let x = 0; x < items.length; x++){
            if(items[x].elegido && items[x].aCargo === 1){
                total += items[x].precio;
            }
        }
        console.log(total)

        return total;
    }

    cargarItems(){
        let items = this.state.items;
        let lista = [];
        for (let x = 0; x < items.length; x++){

            lista.push( 
            <TableRow key={x} style={{marginLeft:'5px'}} >
                <TableRowColumn>
                    <Checkbox checked={items[x].elegido} onCheck={(evento,check)=>this.seleccionar(check,x)}></Checkbox>
                </TableRowColumn>
                <TableRowColumn>
                    {items[x].descripcion}
                </TableRowColumn>
                <TableRowColumn>
                    $ {items[x].precio}
                </TableRowColumn>
                <TableRowColumn>
                    <SelectField value={items[x].aCargo} onChange={(evento,index,valor)=>this.cambiarCargo(valor,x)}>
                        {this.state.responsables}
                    </SelectField>
                </TableRowColumn>

            </TableRow> )
            
        }
        return lista;
    }


    render(){

        return(
            <div style={{marginLeft:'5px'}}>
                <Paper style={{width:'600px'}}>
                    <TextField value={this.state.alias} onChange={(evento)=>(this.setState({alias:evento.target.value}))}
                    floatingLabelText='Alias del Plan' >
                    </TextField>
                    <br/>
                    <SelectField value={this.state.area} onChange={this.actualizarArea}  >
                        {this.state.areas}
                    </SelectField>
                    <br/>
                    <Table selectable = {false} >
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                            <TableRow>
                                <TableHeaderColumn>
                                    Seleccionar
                                </TableHeaderColumn>
                                <TableHeaderColumn>
                                    Item
                                </TableHeaderColumn>
                                <TableHeaderColumn>
                                    Precio
                                </TableHeaderColumn>
                                <TableHeaderColumn>
                                    Responsable
                                </TableHeaderColumn>
                            </TableRow>
                            
                        </TableHeader>
                        <TableBody displayRowCheckbox={false} >
                            {this.cargarItems()}
                        </TableBody>
                        
                        <TableFooter>
                            <TableRow>
                                <TableRowColumn>
                                </TableRowColumn>
                                <TableRowColumn>
                                    <span style={{fontSize:'20px'}} >Total: </span>
                                </TableRowColumn>
                                <TableRowColumn>
                                    <span style={{fontSize:'20px'}} >$ {this.calcularTotal()} </span>
                                </TableRowColumn>
                            </TableRow>
                        </TableFooter>
                    </Table>
                    <RaisedButton primary={true} label='Crear Plan' onClick={this.guardarPresupuesto} ></RaisedButton>
                </Paper>
            </div>
        )
    }
}


