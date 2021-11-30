import { service } from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
  HttpErrors,
} from '@loopback/rest';
import { Llaves } from '../config/llaves';
import {Credenciales, Persona} from '../models';
import {PersonaRepository} from '../repositories';
import { AutenticacionService, NotificacionService } from '../services';
const fetch = require('node-fetch');

export class PersonaController {
  constructor(
    @repository(PersonaRepository)
    public personaRepository : PersonaRepository,
    @service(AutenticacionService)
    public servicioAutenticacion: AutenticacionService,
    @service(NotificacionService)
    public servicioNotificacion: NotificacionService
  ) {}

  @post("/identificarPersona", {
    responses: {
      '200': {
        description: "Identificación de usuarios"
      }
    }
  })
  async identificarPersona(
    @requestBody() Credenciales: Credenciales
  ) {
    let p = await this.servicioAutenticacion.IdentificarPersona(Credenciales.usuario, Credenciales.clave);
    if (p) {
      let token = this.servicioAutenticacion.GenerarTokenJWT(p);
      return {
        datos: {
          nombre: p.Nombres,
          correo: p.Correo,
          id: p.Id,
          celular: p.Celular,
          rol: p.Rol
        },
        tk: token
      }
    } else {
      throw new HttpErrors[401]("Datos Inválidos");
    }
  }

  @post('/personas')
  @response(200, {
    description: 'Persona model instance',
    content: {'application/json': {schema: getModelSchemaRef(Persona)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Persona, {
            title: 'NewPersona',
            exclude: ['Id'],
          }),
        },
      },
    })
    persona: Omit<Persona, 'Id'>,
  ): Promise<Persona> {

    let clave = this.servicioAutenticacion.GenerarClave();
    let claveCifrada = this.servicioAutenticacion.CifrarClave(clave);
    persona.Password = claveCifrada;
    let p = await this.personaRepository.create(persona);

    //NOTIFICAR AL USUARIO POR CORREO

    let destino = persona.Correo;
    let asunto = `Registro exitoso como ${persona.Rol} de Digital Store`;
    let contenido = `Hola ${persona.Nombres}, su nombre de usuario es: ${persona.Correo} y su contraseña es: ${clave}`;
    this.servicioNotificacion.EnviarCorreo(destino, asunto, contenido);

    //NOTIFICAR AL USUARIO POR SMS

    let mensaje = `Hola ${persona.Nombres}, ha sido registad@ exitosamente en Digital Store como ${persona.Rol}. Su nombre de usuario es: ${persona.Correo} y su contraseña es: ${clave}`;
    let telefono = persona.Celular;
    this.servicioNotificacion.EnviarSMS(telefono, mensaje);
    return p;
  }

  @get('/personas/count')
  @response(200, {
    description: 'Persona model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Persona) where?: Where<Persona>,
  ): Promise<Count> {
    return this.personaRepository.count(where);
  }

  @get('/personas')
  @response(200, {
    description: 'Array of Persona model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Persona, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Persona) filter?: Filter<Persona>,
  ): Promise<Persona[]> {
    return this.personaRepository.find(filter);
  }

  @patch('/personas')
  @response(200, {
    description: 'Persona PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Persona, {partial: true}),
        },
      },
    })
    persona: Persona,
    @param.where(Persona) where?: Where<Persona>,
  ): Promise<Count> {
    return this.personaRepository.updateAll(persona, where);
  }

  @get('/personas/{id}')
  @response(200, {
    description: 'Persona model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Persona, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Persona, {exclude: 'where'}) filter?: FilterExcludingWhere<Persona>
  ): Promise<Persona> {
    return this.personaRepository.findById(id, filter);
  }

  @patch('/personas/{id}')
  @response(204, {
    description: 'Persona PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Persona, {partial: true}),
        },
      },
    })
    persona: Persona,
  ): Promise<void> {
    await this.personaRepository.updateById(id, persona);
  }

  @put('/personas/{id}')
  @response(204, {
    description: 'Persona PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() persona: Persona,
  ): Promise<void> {
    await this.personaRepository.replaceById(id, persona);
  }

  @del('/personas/{id}')
  @response(204, {
    description: 'Persona DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.personaRepository.deleteById(id);
  }
}
