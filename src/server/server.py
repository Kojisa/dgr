#coding=latin
from bottle import template, route, run, response, Bottle, \
ServerAdapter,server_names, hook, request,static_file,post,default_app
from json import dumps,loads
import dbServer
import datetime


