import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Pedido} from './pedido.model';
import {Producto} from './producto.model';

@model()
export class Carrito extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  Id?: string;

  @property({
    type: 'number',
    required: true,
  })
  CantidadSolicitada: number;

  @property({
    type: 'number',
    required: true,
  })
  PrecioTotalProducto: number;

  @belongsTo(() => Pedido)
  pedidoId: string;

  @belongsTo(() => Producto)
  productoId: string;

  constructor(data?: Partial<Carrito>) {
    super(data);
  }
}

export interface CarritoRelations {
  // describe navigational properties here
}

export type CarritoWithRelations = Carrito & CarritoRelations;
