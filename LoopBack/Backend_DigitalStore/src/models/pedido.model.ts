import {Entity, model, property, belongsTo, hasMany} from '@loopback/repository';
import {Persona} from './persona.model';
import {Carrito} from './carrito.model';

@model()
export class Pedido extends Entity {
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
  CantidadProductos: number;

  @property({
    type: 'number',
    required: true,
  })
  PrecioTotal: number;

  @property({
    type: 'string',
    required: true,
  })
  Estado: string;

  @belongsTo(() => Persona)
  personaId: string;

  @hasMany(() => Carrito)
  carritos: Carrito[];

  constructor(data?: Partial<Pedido>) {
    super(data);
  }
}

export interface PedidoRelations {
  // describe navigational properties here
}

export type PedidoWithRelations = Pedido & PedidoRelations;
