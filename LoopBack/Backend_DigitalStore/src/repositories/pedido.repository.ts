import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Pedido, PedidoRelations, Persona, Carrito} from '../models';
import {PersonaRepository} from './persona.repository';
import {CarritoRepository} from './carrito.repository';

export class PedidoRepository extends DefaultCrudRepository<
  Pedido,
  typeof Pedido.prototype.Id,
  PedidoRelations
> {

  public readonly persona: BelongsToAccessor<Persona, typeof Pedido.prototype.Id>;

  public readonly carritos: HasManyRepositoryFactory<Carrito, typeof Pedido.prototype.Id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('PersonaRepository') protected personaRepositoryGetter: Getter<PersonaRepository>, @repository.getter('CarritoRepository') protected carritoRepositoryGetter: Getter<CarritoRepository>,
  ) {
    super(Pedido, dataSource);
    this.carritos = this.createHasManyRepositoryFactoryFor('carritos', carritoRepositoryGetter,);
    this.registerInclusionResolver('carritos', this.carritos.inclusionResolver);
    this.persona = this.createBelongsToAccessorFor('persona', personaRepositoryGetter,);
    this.registerInclusionResolver('persona', this.persona.inclusionResolver);
  }
}
