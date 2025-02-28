import tablaSimbolos from './tablaSimbolos';
import { Instruccion } from '../Abstracto/Instruccion';
import Errores from '../Excepciones/NodoErrores';
import { reporteTabla } from '../Reportes/reporteTabla';
import obtenerValor from '../Reportes/cambiarTipo';
import Objeto from '../Expresiones/Objeto';
import nodoAST from '../Abstracto/nodoAST';
export default class Arbol {
  private instrucciones: Array<Instruccion>;
  private errores: Array<Errores>;

  public listaSimbolos: Array<reporteTabla>;
  private dot:string;
  private c:number;
  private encoding:String;



  public getEncoding():String{
    return this.encoding;
  }

  public setEncoding(encoding:String){
    this.encoding=encoding;
  }
 
  public getSimbolos(): Array<reporteTabla> {
    return this.listaSimbolos;
  }
  public actualizarTabla(
    identificador: string,
    valor: string,
    linea: string,
    entorno: string,
    columna: string
  ): boolean {
    for (var elemento of this.listaSimbolos) {
      if (
        elemento.getIdentificador().toString() == identificador.toLowerCase() &&
        elemento.getEntorno().toString() == entorno.toString()
      ) {
        elemento.setValor(valor);
        elemento.setLinea(linea);
        elemento.setColumna(columna);
        return true;
      }
    }
    return false;
  }
  public BuscarTipo(identificador: string): string {
    for (var elemento of this.listaSimbolos) {
      if (elemento.getIdentificador() == identificador.toLowerCase()) {
        return elemento.getForma().toString();
      }
    }
    return 'as';
  }


  public getFuncion(identificador: String) {
    for (let f of this.instrucciones) {
      if (f instanceof Objeto) {
        if (
          identificador.toLowerCase() ==
          (<Objeto>f).identificador.toLowerCase()
        ) {
          if (
            !this.actualizarTabla(
              f.identificador.toString(),
              '',
              f.fila.toString(),
              '',
              f.columna.toString()
            )
          ) {
            let nuevoSimbolo = new reporteTabla(
              f.identificador,
              '',
              'MetodoCreacion',
              'void',
              '',
              f.fila.toString(),
              f.columna.toString()
            );
            this.listaSimbolos.push(nuevoSimbolo);
          }

          return f;
        }
      }
    }
  }


  public geterrores(): Array<Errores> {
    return this.errores;
  }
  public seterrores(value: Array<Errores>) {
    this.errores = value;
  }

  public getinstrucciones(): Array<Instruccion> {
    return this.instrucciones;
  }
  public setinstrucciones(value: Array<Instruccion>) {
    this.instrucciones = value;
  }
  private consola: String = '';
  public getconsola(): String {
    return this.consola;
  }
  public setconsola(value: String) {
    this.consola = value;
  }
  public actualizaConsola(uptodate: String) {
    this.consola = `${this.consola}${uptodate}\n`;
  }
  private tablaGlobal: tablaSimbolos;
  public gettablaGlobal(): tablaSimbolos {
    return this.tablaGlobal;
  }
  public settablaGlobal(value: tablaSimbolos) {
    this.tablaGlobal = value;
  }

  constructor(instrucciones: Array<Instruccion>) {
    this.instrucciones = instrucciones;
    this.consola = '';
    this.tablaGlobal = new tablaSimbolos();
    this.errores = new Array<Errores>();
    this.listaSimbolos = new Array<reporteTabla>();
    this.dot = ""
    this.c = 0
  }

  public getDot(raiz:nodoAST)
    {
        this.dot = "";
        this.dot += "digraph {\n";
        this.dot += "n0[label=\"" + raiz.getValor().replace("\"", "\\\"") + "\"];\n";
        this.c = 1;
        this.recorrerAST("n0",raiz);
        this.dot += "}";
        return this.dot;
    }

    public recorrerAST(padre:String, nPadre:nodoAST)
    {
        for(let hijo of nPadre.getHijos())
        {
            var nombreHijo = "n" + this.c;
            this.dot += nombreHijo + "[label=\"" + hijo.getValor().replace("\"", "\\\"") + "\"];\n";
            this.dot += padre + "->" + nombreHijo + ";\n";
            this.c++;
            this.recorrerAST(nombreHijo,hijo);
        }
    }
}
