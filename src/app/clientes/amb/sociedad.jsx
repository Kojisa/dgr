import {Component} from 'react';
import {TextField,SelectField,MenuItem} from 'material-ui';



export default class Contenedor extends Component{
    constructor(props){
        super(props);
        this.state = {
            nombre:'',
            iva:'',
            tiposIvas:[],
            cuit:'',
            fechaNac:'',
            persona:0,
            nacionalidad:'',
            actPrin:'',
            dom:'',
            localidad:'',
            telefonos:[],
            email:'',
            iibb:'',
            socie:'',
            tipoSocie:[
                <MenuItem value='S.A.' label='S.A.' />,
                <MenuItem value='S.R.L.' label='S.R.L.'/>,
                <MenuItem value='Comandita' label='Comandita'/>
            ],
            dppj:'',
            codPost:'',
            provincia:'',
            fax:'',
            contComer:''
        }
    }

    componentWillReceiveProps(props){
        this.setState({
            nombre:'',
            iva:'',
            tiposIvas:[],
            cuit:'',
            fechaNac:'',
            persona:0,
            nacionalidad:'',
            actPrin:'',
            dom:'',
            localidad:'',
            telefonos:[],
            email:'',
            iibb:'',
            socie:'',
            tipoSocie:[
                <MenuItem value='S.A.' label='S.A.' />,
                <MenuItem value='S.R.L.' label='S.R.L.'/>,
                <MenuItem value='Comandita' label='Comandita'/>
            ],
            dppj:'',
            codPost:'',
            provincia:'',
            fax:'',
            contComer:'',
        })
    }

    render(){
        return (
            <div>
                <TextField
                    value={this.state.nombre}
                    onChange={(ev,txt)=>this.setState({nombre:txt})}
                    floatingLabelText="Nombre o Razon Social"
                    />
                <br/>
                <div>
                    <SelectField
                        style={{display:'inline-block'}}
                        value={this.state.iva}
                        floatingLabelText="Condicion I.V.A"
                        floatingLabelFixed={true}
                        onChange={(e, i, value) => this.setState({ iva:value })}
                        maxHeight={200}>
                        {this.state.tiposIvas}
                    </SelectField>
                    <TextField
                        floatingLabelText="C.U.I.T"
                        value={this.state.cuit}
                        onChange={(ev,txt)=>this.setState({cuit:txt})}
                        />
                </div>
                



            </div>
        )
    }
}