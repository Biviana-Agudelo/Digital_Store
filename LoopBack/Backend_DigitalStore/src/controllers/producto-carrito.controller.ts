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
  Producto,
  Carrito,
} from '../models';
import {ProductoRepository} from '../repositories';

export class ProductoCarritoController {
  constructor(
    @repository(ProductoRepository) protected productoRepository: ProductoRepository,
  ) { }

  @get('/productos/{id}/carritos', {
    responses: {
      '200': {
        description: 'Array of Producto has many Carrito',
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
    return this.productoRepository.carritos(id).find(filter);
  }

  @post('/productos/{id}/carritos', {
    responses: {
      '200': {
        description: 'Producto model instance',
        content: {'application/json': {schema: getModelSchemaRef(Carrito)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Producto.prototype.Id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Carrito, {
            title: 'NewCarritoInProducto',
            exclude: ['Id'],
            optional: ['productoId']
          }),
        },
      },
    }) carrito: Omit<Carrito, 'Id'>,
  ): Promise<Carrito> {
    return this.productoRepository.carritos(id).create(carrito);
  }

  @patch('/productos/{id}/carritos', {
    responses: {
      '200': {
        description: 'Producto.Carrito PATCH success count',
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
    return this.productoRepository.carritos(id).patch(carrito, where);
  }

  @del('/productos/{id}/carritos', {
    responses: {
      '200': {
        description: 'Producto.Carrito DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Carrito)) where?: Where<Carrito>,
  ): Promise<Count> {
    return this.productoRepository.carritos(id).delete(where);
  }
}
