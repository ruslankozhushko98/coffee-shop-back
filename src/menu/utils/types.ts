import { Beverage } from '@prisma/client';

export type BeverageOpts = Pick<Beverage, 'id' | 'title' | 'price'>;
