import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Carrito, CarritoRelations, Pedido, Producto} from '../models';
import {PedidoRepository} from './pedido.repository';
import {ProductoRepository} from './producto.repository';

export class CarritoRepository extends DefaultCrudRepository<
  Carrito,
  typeof Carrito.prototype.Id,
  CarritoRelations
> {

  public readonly pedido: BelongsToAccessor<Pedido, typeof Carrito.prototype.Id>;

  public readonly producto: BelongsToAccessor<Producto, typeof Carrito.prototype.Id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('PedidoRepository') protected pedidoRepositoryGetter: Getter<PedidoRepository>, @repository.getter('ProductoRepository') protected productoRepositoryGetter: Getter<ProductoRepository>,
  ) {
    super(Carrito, dataSource);
    this.producto = this.createBelongsToAccessorFor('producto', productoRepositoryGetter,);
    this.registerInclusionResolver('producto', this.producto.inclusionResolver);
    this.pedido = this.createBelongsToAccessorFor('pedido', pedidoRepositoryGetter,);
    this.registerInclusionResolver('pedido', this.pedido.inclusionResolver);
  }
}
