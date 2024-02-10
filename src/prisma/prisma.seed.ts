import { PrismaClient, Beverage } from '@prisma/client';

type BeverageOptions = Pick<Beverage, 'title' | 'description'>;

const prisma = new PrismaClient();

export const beverages: Array<BeverageOptions> = [
  {
    title: 'Espresso',
    description: 'Small coffee shot',
  },
  {
    title: 'Americano',
    description: 'An espresso shot with hot water at a 1:3 to 1:4 ratio',
  },
  {
    title: 'Latte',
    description: 'Less coffee, more milk',
  },
  {
    title: 'Cappuccino',
    description: 'More coffee, less milk',
  },
  {
    title: 'Macchiato',
    description: 'More coffee, small amount of milk (foamed)',
  },
  {
    title: 'Raf',
    description:
      'Cream and vanilla sugar to a single shot of espresso and then foaming the mix with a steam heater.',
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
