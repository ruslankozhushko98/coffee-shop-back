import { PrismaClient, Beverage, User, ROLES, GENDER } from '@prisma/client';
import * as argon from 'argon2';
import * as dayjs from 'dayjs';
import { join } from 'path';

type BeverageOptions = Pick<
  Beverage,
  'title' | 'description' | 'imgUrl' | 'price' | 'starsCount'
>;

type UserOptions = Pick<
  User,
  | 'email'
  | 'firstName'
  | 'lastName'
  | 'password'
  | 'dob'
  | 'gender'
  | 'role'
  | 'isActivated'
>;

const prisma = new PrismaClient();

const getUsers = (password: string): Array<UserOptions> => [
  {
    email: 'client@example.com',
    password,
    firstName: 'John',
    lastName: 'Doe',
    dob: dayjs().subtract(18, 'year').toString(),
    gender: GENDER.MALE,
    role: ROLES.CLIENT,
    isActivated: true,
  },
  {
    email: 'admin@example.com',
    password,
    firstName: 'Jane',
    lastName: 'Doe',
    dob: dayjs().subtract(18, 'year').toString(),
    gender: GENDER.FEMALE,
    role: ROLES.ADMIN,
    isActivated: true,
  },
];

export const beverages: Array<BeverageOptions> = [
  {
    title: 'Espresso',
    description: 'Small coffee shot',
    imgUrl: join(__dirname, '..', 'assets/espresso.jpeg'),
    price: 2,
    starsCount: 5,
  },
  {
    title: 'Americano',
    description: 'An espresso shot with hot water at a 1:3 to 1:4 ratio',
    imgUrl: join(__dirname, '..', 'assets/americano.jpeg'),
    price: 2,
    starsCount: 5,
  },
  {
    title: 'Latte',
    description: 'Less coffee, more milk',
    imgUrl: join(__dirname, '..', 'assets/latte.jpeg'),
    price: 4,
    starsCount: 10,
  },
  {
    title: 'Cappuccino',
    description: 'More coffee, less milk',
    imgUrl: join(__dirname, '..', 'assets/cappuccino.jpeg'),
    price: 4,
    starsCount: 10,
  },
  {
    title: 'Macchiato',
    description: 'More coffee, small amount of milk (foamed)',
    imgUrl: join(__dirname, '..', 'assets/macchiato.jpeg'),
    price: 4.5,
    starsCount: 15,
  },
  {
    title: 'Raf',
    description:
      'Cream and vanilla sugar to a single shot of espresso and then foaming the mix with a steam heater.',
    imgUrl: join(__dirname, '..', 'assets/raf.jpeg'),
    price: 4.75,
    starsCount: 20,
  },
];

const upsertBeverage = (data: BeverageOptions): Promise<Beverage> =>
  prisma.beverage.upsert({
    where: { title: data.title },
    update: {},
    create: data,
  });

const upsertUsers = (data: UserOptions): Promise<User> =>
  prisma.user.upsert({
    where: { email: data.email },
    update: {},
    create: data,
  });

(async () => {
  await Promise.allSettled(beverages.map(upsertBeverage));

  const hashedPassword = await argon.hash('Pa$$w0rd');
  const users = getUsers(hashedPassword);

  await Promise.allSettled(users.map(upsertUsers));
})();
