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
  Producto,
} from '../models';
import {CarritoRepository} from '../repositories';

export class CarritoProductoController {
  constructor(
    @repository(CarritoRepository)
    public carritoRepository: CarritoRepository,
  ) { }

  @get('/carritos/{id}/producto', {
    responses: {
      '200': {
        description: 'Producto belonging to Carrito',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Producto)},
          },
        },
      },
    },
  })
  async getProducto(
    @param.path.string('id') id: typeof Carrito.prototype.Id,
  ): Promise<Producto> {
    return this.carritoRepository.producto(id);
  }
}
