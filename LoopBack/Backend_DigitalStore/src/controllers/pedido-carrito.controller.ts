import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Pedido,
  Carrito,
} from '../models';
import {PedidoRepository} from '../repositories';

export class PedidoCarritoController {
  constructor(
    @repository(PedidoRepository) protected pedidoRepository: PedidoRepository,
  ) { }

  @get('/pedidos/{id}/carritos', {
    responses: {
      '200': {
        description: 'Array of Pedido has many Carrito',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Carrito)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Carrito>,
  ): Promise<Carrito[]> {
    return this.pedidoRepository.carritos(id).find(filter);
  }

  @post('/pedidos/{id}/carritos', {
    responses: {
      '200': {
        description: 'Pedido model instance',
        content: {'application/json': {schema: getModelSchemaRef(Carrito)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Pedido.prototype.Id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Carrito, {
            title: 'NewCarritoInPedido',
            exclude: ['Id'],
            optional: ['pedidoId']
          }),
        },
      },
    }) carrito: Omit<Carrito, 'Id'>,
  ): Promise<Carrito> {
    return this.pedidoRepository.carritos(id).create(carrito);
  }

  @patch('/pedidos/{id}/carritos', {
    responses: {
      '200': {
        description: 'Pedido.Carrito PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Carrito, {partial: true}),
        },
      },
    })
    carrito: Partial<Carrito>,
    @param.query.object('where', getWhereSchemaFor(Carrito)) where?: Where<Carrito>,
  ): Promise<Count> {
    return this.pedidoRepository.carritos(id).patch(carrito, where);
  }

  @del('/pedidos/{id}/carritos', {
    responses: {
      '200': {
        description: 'Pedido.Carrito DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Carrito)) where?: Where<Carrito>,
  ): Promise<Count> {
    return this.pedidoRepository.carritos(id).delete(where);
  }
}
