#coding=latin-1
import mysql.connector as CON
import datetime

HOST = "localhost"
USER = "root"
PASS = '1991'
DBNAME = "gest_planes"


class DBServer:




    def __init__(self):
        self.con,self.cur = conectar()
        #self.actualizarUsuarios()
        self.usuarios ={}

    def aceptarCambios(self):
        self.con.commit()
        return

    def contestarQuery(self,sql,data=None,fetch=True):

        self.con,self.cur = conectar()
        self.cur.execute(sql,data)
        if fetch == False:
            return
        return self.cur.fetchall()

    def ultimaId(self):
        return self.cur.lastrowid


def conectar():

    try:
        con = CON.connect(host=HOST,user=USER,password=PASS)
    except:
        print("No se pudo realizar la conexion con la base de datos")



    cur = con.cursor(dictionary=True)
    try:
        con.database = DBNAME

    except  CON.Error as err:
        if err.errno == errorcode.ER_BAD_DB_ERROR:
            try:
                cur.execute("CREATE DATABASE {} DEFAULT CHARACTER SET 'utf8'".format(DBNAME))
                cur.execute("SET GLOBAL max_allowed_packet = %s",(50000000,))

            except CON.Error as err:

                print("Fallo la creación de la base de datos: {}".formate(DBNAME))
                exit(1)

            con.database = DBNAME

    return con,cur
