from bottle import template, route, run, response, Bottle, hook, request,static_file,post,default_app
from json import dumps,loads
import dbServer
import datetime
from jose import jwt


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

    ordenAgregarCliente = 'INSERT INTO CLIENTES(razon,nombreFantasia,cuit,mail,web\
     calle,altura,piso,localidad,codigoPostal,posIva,fechaAlta) values(%(razon)s,\
     %(nombreFantasia)s, %(cuit)s, %(mail)s, %(web)s, %(calle)s, %(altura)s, %(piso)s,\
     %(localidad)s, %(codigoPostal)s, %(posIva)s, %(fechaAlta)s );'

    ordenActualizarCliente = 'UPDATE CLIENTES SET razon = %(razon)s,\
     nombreFantasia = %(nombreFantasia)s, cuit = %(cuit)s, mail = %(mail)s, web = %(web)s\
     calle = %(calle)s, altura = %(altura)s, piso = %(piso)s, localidad = %(localidad)s,\
     codigoPostal = %(codigoPostal)s, posIva = %(posIva)s, fechaAlta = %(fechaAlta)s where \
     id = %(id)s;'

    crearContacto = 'INSERT INTO CONTACTOS (cliente,nombre,apellido,area,cargo,telefono,\
    mail,rubro,orden) values(%s,%s,%s,%s,%s,%s,%s,%s,%s);'

    actualizarContacto = 'UPDATE CONTACTOS set nombre = %(nombre)s, apellido = %(apellido)s,\
    area = %(area)s, cargo = %(cargo)s, telefono = %(telefono)s, mail = %(mail)s, rubro = %(rubro)\
     where orden = %(orden)s and cliente = %(cliente)s;'





@route('/listadoClientes')
def devolverClientes():

    orden = 'Select nombreFantasia as nombre, SUBSTRING(nombreFantasia,0,1) as letra,\
    id from clientes;'

    datos = db.contestarQuery(orden,False,True)

    return dumps(datos)



run(host="localhost", port=1400)