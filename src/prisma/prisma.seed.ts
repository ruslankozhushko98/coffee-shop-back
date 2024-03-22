import { PrismaClient, Beverage } from '@prisma/client';
import { join } from 'path';

type BeverageOptions = Pick<
  Beverage,
  'title' | 'description' | 'imgUrl' | 'price'
>;

const prisma = new PrismaClient();

export const beverages: Array<BeverageOptions> = [
  {
    title: 'Espresso',
    description: 'Small coffee shot',
    imgUrl: join(__dirname, '..', 'assets/espresso.jpeg'),
    price: 2,
  },
  {
    title: 'Americano',
    description: 'An espresso shot with hot water at a 1:3 to 1:4 ratio',
    imgUrl: join(__dirname, '..', 'assets/americano.jpeg'),
    price: 2,
  },
  {
    title: 'Latte',
    description: 'Less coffee, more milk',
    imgUrl: join(__dirname, '..', 'assets/latte.jpeg'),
    price: 4,
  },
  {
    title: 'Cappuccino',
    description: 'More coffee, less milk',
    imgUrl: join(__dirname, '..', 'assets/cappuccino.jpeg'),
    price: 4,
  },
  {
    title: 'Macchiato',
    description: 'More coffee, small amount of milk (foamed)',
    imgUrl: join(__dirname, '..', 'assets/macchiato.jpeg'),
    price: 4.5,
  },
  {
    title: 'Raf',
    description:
      'Cream and vanilla sugar to a single shot of espresso and then foaming the mix with a steam heater.',
    imgUrl: join(__dirname, '..', 'assets/raf.jpeg'),
    price: 4.75,
  },
];

const upsertBeverage = (data: BeverageOptions): Promise<Beverage> =>
  prisma.beverage.upsert({
    where: {
      title: data.title,
    },
    update: {},
    create: data,
  });

(async () => {
  await Promise.allSettled(beverages.map(upsertBeverage));
})();
