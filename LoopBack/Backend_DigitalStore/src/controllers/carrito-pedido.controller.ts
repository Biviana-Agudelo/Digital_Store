import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Carrito,
  Pedido,
} from '../models';
import {CarritoRepository} from '../repositories';

export class CarritoPedidoController {
  constructor(
    @repository(CarritoRepository)
    public carritoRepository: CarritoRepository,
  ) { }

  @get('/carritos/{id}/pedido', {
    responses: {
      '200': {
        description: 'Pedido belonging to Carrito',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Pedido)},
          },
        },
      },
    },
  })
  async getPedido(
    @param.path.string('id') id: typeof Carrito.prototype.Id,
  ): Promise<Pedido> {
    return this.carritoRepository.pedido(id);
  }
}
