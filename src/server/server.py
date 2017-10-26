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


@route('/<modulo>')
def devolverModulo(modulo):
    return static_file(modulo,root="../../build/")

@route('/')
def devolverPagina():
    return static_file("index.html",root="../../build/")


@route('/guardarCliente',method='POST')
def guardarCliente():
    datos = request.json['datos']

    ordenAgregarCliente = 'INSERT INTO CLIENTES(razon,nombreFantasia,cuit,mail,web,\
     calle,altura,piso,localidad,codigoPostal,posIva,fechaAlta) values(%(razon)s,\
     %(nombreFantasia)s, %(cuit)s, %(mail)s, %(web)s, %(calle)s, %(altura)s, %(piso)s,\
     %(localidad)s, %(codigoPostal)s, %(posIva)s, %(fechaAlta)s );'

    ordenActualizarCliente = 'UPDATE CLIENTES SET razon = %(razon)s,\
     nombreFantasia = %(nombreFantasia)s, cuit = %(cuit)s, mail = %(mail)s, web = %(web)s,\
     calle = %(calle)s, altura = %(altura)s, piso = %(piso)s, localidad = %(localidad)s,\
     codigoPostal = %(codigoPostal)s, posIva = %(posIva)s, fechaAlta = %(fechaAlta)s where \
     id = %(numeroCliente)s;'

    crearContacto = 'INSERT INTO CONTACTOS (cliente,nombre,apellido,area,cargo,telefono,\
    mail,rubro,orden) values(%s,%s,%s,%s,%s,%s,%s,%s,%s);'

    actualizarContacto = 'UPDATE CONTACTOS set nombre = %(nombre)s, apellido = %(apellido)s,\
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

run(host="0.0.0.0",port=1400,server='sslwebserver')
