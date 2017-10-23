#coding=latin-1
import mysql.connector as CON
from mysql.connector import errorcode

HOST = "localhost"
USER = "root"
PASS = '1991'
DBNAME = "gest_planes"

tablas={
    'clientes':{
        'id':'INT',
        'razon':'VARCHAR(100)',
        'nombreFantasia':'VARCHAR(70)',
        'cuit':'VARCHAR(18)',
        'mail':'VARCHAR(40)',
        'web':'VARCHAR(40)',
        'calle':'VARCHAR(40)',
        'altura':'VARCHAR(8)',
        'piso':'VARCHAR(4)',
        'localidad':'VARCHAR(30)',
        'codigoPostal':'VARCHAR(10)',
        'posIva':'INT',
        'fechaAlta':'DATETIME'
    },
    'contactos':{
        'cliente':'INT',
        'nombre':'VARCHAR(30)',
        'apellido':'VARCHAR(30)',
        'area':'VARCHAR(30)',
        'cargo':'VARCHAR(30)',
        'telefono':'VARCHAR(30)',
        'mail':'VARCHAR(40)',
        'rubro':'VARCHAR(30)',
        'orden':'INT' #solo para marcar en que orden se muestran 
    },
    'tiposPosicionesIva':{
        'id':'INT',
        'descripcion':'VARCHAR(30)'
    },
    'cajasClientes':{
        'id':'INT',
        'cliente':'INT',
        'balance':'float(10,2)'
    }
}

def crearColumna(campo,tipo,nulo = False, incremental = False):

    orden = ""
    orden += campo
    orden += " "+tipo
    if nulo:
        orden += " NOT NULL"
    if incremental:
        orden += " AUTO_INCREMENT"

    return orden

def crearTabla(nombre,columnas):

    orden = "CREATE TABLE IF NOT EXISTS `{}`.`{}` (".format(DBNAME,nombre)
    for clave in columnas:
        if clave == "codigo" or clave == "id":
            orden += crearColumna(clave,columnas[clave],True,True) + ", "

        else:
            orden += crearColumna(clave,columnas[clave]) + ", "
    orden = orden[0:len(orden)-2]
    #en caso de que tengan la columna codigo la vuelvo primaria asi incrementa
    if "codigo" in columnas:
        orden += ",PRIMARY KEY(`codigo`),"
        orden += "UNIQUE INDEX `codigo{}_UNIQUE` (`codigo` ASC)".format(nombre)
    if "id" in columnas:
        orden += ",PRIMARY KEY(`id`),"
        orden += "UNIQUE INDEX `id{}_UNIQUE` (`id` ASC)".format(nombre)
    orden +=");"

    return orden



def crearBaseDeDatos():

    borrarBase()

    con,cur = conectar()


    for key in tablas:

        orden = crearTabla(key,tablas[key])
        cur.execute(orden)
    
    con.commit()

def borrarBase():
    con,cur = conectar()
    cur.execute("DROP DATABASE IF EXISTS {}".format(DBNAME))
    con.commit()




#funcion para conectar con la base de datos.
def conectar():

    try:
        con = CON.connect(host=HOST,user=USER,password=PASS)

    except:
        print("No se pudo realizar la conexion con la base de datos")

    cur = con.cursor()
    try:
        con.database = DBNAME

    except  CON.Error as err:
        if err.errno == errorcode.ER_BAD_DB_ERROR:
            try:
                cur.execute("CREATE DATABASE {} DEFAULT CHARACTER SET 'utf8'".format(DBNAME))
                cur.execute("SET GLOBAL max_allowed_packet = %s",(50000000,))

            except CON.Error as err:

                print("Fallo la creación de la base de datos: {}".format(DBNAME))
                exit(1)

            con.database = DBNAME

    return con,cur

crearBaseDeDatos()