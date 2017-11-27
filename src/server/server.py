#coding:latin-1
from bottle import template, route, run, response, Bottle, \
ServerAdapter,server_names, hook, request,static_file,post,default_app
from json import dumps,loads
import dbServer
import datetime
from jose import jwt
import dateutil.parser


db = dbServer.DBServer()



@hook('after_request')
def enable_cors():
    """
    You need to add some headers to each request.
    Don't use the wildcard '*' for Access-Control-Allow-Origin in production.
    """
    response.add_header("Access-Control-Allow-Origin", "*")
    response.add_header("Access-Control-Allow-Methods", "POST,GET")
    response.add_header("Access-Control-Allow-Headers", "Origin, Accept, Content-Type")
    response.add_header("Access-Control-Max-Age", "1728000")

@post('/cors')
def lvambience():
    response.headers['Content-Type'] = 'application/json'
    return "[1]"


@route('/<:re:.*>', method='OPTIONS')
def dummy():
    return


#########################################################################################
#                                  PLANES                                               #
#########################################################################################

@route('/planes',method='POST')
def devolverPlanes():
    cliente = request.json['datos']

    orden = 'Select id,area,fechaCreacion,alias,activo,aprobado,cancelado \
    from presupuestos where cliente = %(cliente)s;'

    planes = db.contestarQuery(orden,{'cliente':cliente})

    for plan in planes:
        plan['fechaCreacion'] = plan['fechaCreacion'].isoformat()
    return dumps(planes)

@route('/plan/agregar',method='POST')
def agregarPlan():

    #diccionarios => datos= {'cliente':idCliente,'alias':'aliasdelPlan','items':[{'id':idItem,'responsable':tipoResponsable}]}

    plan = request.json['datos']

    ordenPlan = 'insert into presupuestos(cliente,aprobado,activo,alias,fechaCreacion,area)\
    values(%(cliente)s,false,true,%(alias)s,%(fechaCreacion)s,%(area)s);'

    plan['fechaCreacion'] = datetime.datetime.now()

    db.contestarQuery(ordenPlan,{'cliente':plan['cliente'],
    'alias':plan['alias'],'fechaCreacion':plan['fechaCreacion'],'area':plan['area'] },False)
    
    db.aceptarCambios()

    plan['id'] = db.ultimaId()

    ordenObtenerDatosItem = 'select area,requisitos,descripcion from items where id = %(id)s'
    ordenGenerarRequisitosPresup = 'insert into requisitosItemPresupuesto(item,requisito,completo)\
    values(%(id)s,%(requisito)s,false);'

    ordenAgregarItem = 'insert into itemsPresupuesto(area,presupuesto,precio,responsable,\
    descripcion,completo,pago) values(%(area)s,%(presupuesto)s,%(precio)s,%(responsable)s,\
    %(descripcion)s,%(completo)s,%(pago)s);'
    

    for item in plan['items']:
        
        item['presupuesto'] = plan['id']

        datos = db.contestarQuery(ordenObtenerDatosItem,item)[0]
        requisitos = datos['requisitos'].split(';')

        db.contestarQuery(ordenAgregarItem,{'id':item['id'],'presupuesto':item['presupuesto'],
        'area':plan['area'],'responsable':item['responsable'],'descripcion':item['descripcion'],
        'precio':item['precio'],'completo':False,'pago':False } ,False)
        db.aceptarCambios()
        item['idPresu'] = db.ultimaId()

        for requisito in requisitos:
            if(requisito == ''):
                continue
            db.contestarQuery(ordenGenerarRequisitosPresup,{'id':item['idPresu'],'requisito':requisito},False)
            db.aceptarCambios()
        
    
@route('/plan',method='POST')
def devolverPlan():

    datos = request.json['datos']

    ordenPlan = 'Select aprobado,activo,alias,fechaCreacion,fechaFinaliza,fechaAprobacion\
    from presupuestos where id=%(id)s'

    plan = db.contestarQuery(ordenPlan,datos)

    ordenItems = 'select id,descripcion,completo from itemsPresupuesto where presupuesto = %(id)s'

    plan['items'] = db.contestarQuery(ordenItems,datos)

    ordenComentarios = 'select comentario,fecha,alCliente from comentariosItems where item = %(id)s'

    comentarios = {}

    for item in plan['items']:
        
        comentarios[item['id']] = db.contestarQuery(ordenComentarios,item)

    plan['comentarios'] = comentarios

    return dumps(plan)




#########################################################################################
#                                  AREAS                                                #
#########################################################################################

@route('/areas',method='GET')
def devolverAreas():

    ordenAreas = 'select id,descripcion from areas;'
    areas =db.contestarQuery(ordenAreas)
    return dumps(areas)

@route('/area/agregar',method='POST')
def agregarArea():

    datos = request.json['datos']

    orden = 'insert into areas(descripcion) values(%(descripcion)s);'
    
    db.contestarQuery(orden,datos,False)
    db.aceptarCambios()
    return dumps('Ok')

@route('/area/editar',method='POST')
def modificarArea():

    datos = request.json['datos']

    orden = 'update areas set descripcion = %(descripcion)s where id = %(id)s;'
    db.contestarQuery(orden,datos,False)
    db.aceptarCambios()
    return dumps('Ok')

#########################################################################################
#                              RESPONSABLES                                             #
#########################################################################################
@route('/responsables',method='GET')
def devolverResponsables():
    
    orden = 'select id,descripcion from responsables order by id;'

    resp = db.contestarQuery(orden)
    return dumps(resp)



#########################################################################################
#                                  ITEMS                                                #
#########################################################################################

@route('/items',method='POST')
def devolverItems():
    datos = request.json['datos']
    ordenItems = 'select id,descripcion,area from items where area = %(area)s'
    
    items = db.contestarQuery(ordenItems,datos)
    return dumps({'items':items })

@route('/item',method='POST')
def devolverItem():
    datos = request.json['datos']
    
    orden = 'select descripcion,precio,requisitos,tipo from items where id = %(id)s;'

    ordenEstados = 'select id,descripcion,completaItem from estadosItems where item = %(id)s;'

    item = db.contestarQuery(orden,datos)[0]

    item['estados'] = db.contestarQuery(ordenEstados,datos)


    return dumps(item)


@route('/items/requisitos',method='POST')
def devolverItemsRequisitos():
    datos = request.json['datos']

    orden = 'select id,descripcion,requisitos,precio from items where area = %(area)s'
    
    items = db.contestarQuery(orden,datos)

    return dumps(items)
    


@route('/item/agregar',method='POST')
def agregarItem():

    datos = request.json['datos']
    print (datos)
    orden = 'insert into items(area,descripcion,precio,requisitos,tipo) \
    values(%(area)s,%(descripcion)s,%(precio)s,%(requisitos)s,%(tipo)s); '

    db.contestarQuery(orden,{
        'area':datos['area'],
        'descripcion':datos['descripcion'],
        'precio':datos['precio'],
        'requisitos':datos['requisitos'],
        'tipo':datos['tipo']
        }
        ,False)
    db.aceptarCambios()
    idItem = db.ultimaId()
    
    ordenEstados = 'insert into estadosItems(descripcion,item,completaItem) \
    values(%(descripcion)s,%(item)s,%(completaItem)s)'

    for estado in datos['estados']:
        estado['item'] = idItem
        db.contestarQuery(ordenEstados,estado,False)
        db.aceptarCambios()
    
    return dumps({'id':idItem})

@route('/item/actualizar',method='POST')
def actualizarItem():

    datos = request.json['datos']

    print datos

    orden = 'update items set descripcion = %(descripcion)s, precio = %(precio)s, \
    requisitos = %(requisitos)s where id = %(id)s;'

    ordenAgregarEstado = 'insert into estadosItems(descripcion,item,completaItem) \
    values(%(descripcion)s,%(item)s,%(completaItem)s)'

    ordenActualizarEstado = 'update estadosItems set descripcion = %(descripcion)s, \
    completaItem = %(completaItem)s where id = %(id)s '

    db.contestarQuery(orden,{'descripcion':datos['descripcion'],
    'precio':datos['precio'],
    'requisitos':datos['requisitos'],
    'id':datos['id']},False)
    db.aceptarCambios()


    for estado in datos['estados']:
        estado['item'] = datos['id']
        if(estado['id'] == ''):
            db.contestarQuery(ordenAgregarEstado,estado,False)
            
        else:
            db.contestarQuery(ordenActualizarEstado,estado,False)

        db.aceptarCambios()

@route('/item/anular',method='POST')
def anularItem():

    datos = response.json['datos']

    orden = 'update items set habilitado = %(habilitado)s where id = %(id)s'

    db.contestarQuery(orden,datos,False)
    db.aceptarCambios()




#########################################################################################
#                                  ESTATICOS                                            #
#########################################################################################

@route('/<modulo>')
def devolverModulo(modulo):
    return static_file(modulo,root="../../build/")

@route('/')
def devolverPagina():
    return static_file("index.html",root="../../build/")



#########################################################################################
#                                  Clientes                                             #
#########################################################################################

@route('/guardarCliente',method='POST')
def guardarCliente():
    datos = request.json['datos']

    ordenAgregarCliente = 'INSERT INTO clientes(razon,nombreFantasia,cuit,mail,web,\
     calle,altura,piso,localidad,codigoPostal,posIva,fechaAlta) values(%(razon)s,\
     %(nombreFantasia)s, %(cuit)s, %(mail)s, %(web)s, %(calle)s, %(altura)s, %(piso)s,\
     %(localidad)s, %(codigoPostal)s, %(posIva)s, %(fechaAlta)s );'

    ordenActualizarCliente = 'UPDATE clientes SET razon = %(razon)s,\
     nombreFantasia = %(nombreFantasia)s, cuit = %(cuit)s, mail = %(mail)s, web = %(web)s,\
     calle = %(calle)s, altura = %(altura)s, piso = %(piso)s, localidad = %(localidad)s,\
     codigoPostal = %(codigoPostal)s, posIva = %(posIva)s, fechaAlta = %(fechaAlta)s where \
     id = %(numeroCliente)s;'

    crearContacto = 'INSERT INTO contactos (cliente,nombre,apellido,area,cargo,telefono,\
    mail,rubro,orden) values(%s,%s,%s,%s,%s,%s,%s,%s,%s);'

    actualizarContacto = 'UPDATE contactos set nombre = %(nombre)s, apellido = %(apellido)s,\
    area = %(area)s, cargo = %(cargo)s, telefono = %(telefono)s, mail = %(mail)s, rubro = %(rubro)s\
     where orden = %(orden)s and cliente = %(cliente)s;'

    if(datos['cliente']['numeroCliente'] != ''):
        db.contestarQuery(ordenActualizarCliente,datos['cliente'],False)
        db.aceptarCambios()
        for x in range(3):
            datos['contactos'][x]['cliente'] = datos['cliente']['numeroCliente']
        datos['cliente']['fechaAlta'] = dateutil.parser.parse(datos['cliente']['fechaAlta'])
    else:
        datos['cliente']['fechaAlta'] = datetime.datetime.now()
        db.contestarQuery(ordenAgregarCliente,datos['cliente'],False)
        db.aceptarCambios()
        datos['cliente']['numeroCliente'] = db.ultimaId()
        for x in range(3):
            datos['contactos'][x]['cliente'] = datos['cliente']['numeroCliente']
            db.contestarQuery(crearContacto, [datos['cliente']['numeroCliente'],'','','','','','','',x],False)
            db.aceptarCambios()

    for x in range (3):
        
        db.contestarQuery(actualizarContacto,datos['contactos'][x],False)
        db.aceptarCambios()
    
    return dumps({'numeroCliente':datos['cliente']['numeroCliente'],'fechaAlta':datos['cliente']['fechaAlta'].isoformat()})


@route('/tiposIvas')
def devolverTiposIvas():
    orden = 'select * from tiposPosicionesIva order by id asc;'

    datos = db.contestarQuery(orden,None,True)
    return dumps(datos)




@route('/listadoClientes')
def devolverClientes():

    orden = 'Select nombreFantasia as nombre, SUBSTR(nombreFantasia,1,1) as letra,\
    id from clientes order by nombreFantasia ASC;'

    datos = db.contestarQuery(orden,None,True)

    return dumps(datos)


@route('/devolverCliente',method='POST')
def devolverCliente():

    numeroCliente = request.json['datos']

    ordenCliente = 'select * from clientes where id = %s;'
    cliente = db.contestarQuery(ordenCliente,[numeroCliente])[0]
    cliente['numeroCliente'] = numeroCliente

    ordenContactos = 'select * from contactos where cliente = %s order by orden ASC;'
    contactos = db.contestarQuery(ordenContactos,[numeroCliente])

    cliente['fechaAlta'] = cliente['fechaAlta'].isoformat()

    return dumps({'cliente':cliente,'contactos':contactos})



#########################################################################################
#                                  USERS                                                #
#########################################################################################



@route('/usuario',method='POST')
def login():
    data = request.json['datos']
    usuario = data['usuario']
    contra = data['contra']

    usuario = usuario.lower()

    buscarUsuario = 'Select id from usuarios where usuario = %s and contra = %s;'
    
    permisos = db.contestarQuery(buscarUsuario,[usuario,contra])

    if (len(permisos) == 0):
        return dumps({'error':'Error en usuario o contraseña'})
    
    permisos = permisos[0]
    return dumps(permisos)


class SSLWebServer(ServerAdapter):

    def run(self, handler):
        from cherrypy import wsgiserver
        from cherrypy.wsgiserver.ssl_pyopenssl import pyOpenSSLAdapter
        

        server = wsgiserver.CherryPyWSGIServer((self.host,self.port), handler)

        try:
            server.start()
        except:
            server.stop()

server_names['sslwebserver'] = SSLWebServer

run(host="0.0.0.0",port=1400)
