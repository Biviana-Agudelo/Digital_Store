import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import { Llaves } from '../config/llaves';
const fetch = require('node-fetch');

@injectable({scope: BindingScope.TRANSIENT})
export class NotificacionService {
  constructor(/* Add @inject to inject parameters */) {}

  /*
   * Add service methods here
   */

  EnviarCorreo(destino: string, asunto: string, contenido: string) {
    fetch(`${Llaves.urlServicioNotificaciones}/envio-correo?correo_destino=${destino}&asunto=${asunto}&contenido=${contenido}`)
    .then ((data: any) => {
      console.log(data);
    })
  }

  EnviarSMS(destino: string, contenido: string) {
    fetch(`${Llaves.urlServicioNotificaciones}/sms?mensaje=${contenido}&telefono=${destino}`)
    .then ((data: any) => {
      console.log(data);
    })
  }


}

