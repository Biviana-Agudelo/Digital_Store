import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Producto, ProductoRelations, Carrito} from '../models';
import {CarritoRepository} from './carrito.repository';

export class ProductoRepository extends DefaultCrudRepository<
  Producto,
  typeof Producto.prototype.Id,
  ProductoRelations
> {

  public readonly carritos: HasManyRepositoryFactory<Carrito, typeof Producto.prototype.Id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('CarritoRepository') protected carritoRepositoryGetter: Getter<CarritoRepository>,
  ) {
    super(Producto, dataSource);
    this.carritos = this.createHasManyRepositoryFactoryFor('carritos', carritoRepositoryGetter,);
    this.registerInclusionResolver('carritos', this.carritos.inclusionResolver);
  }
}
