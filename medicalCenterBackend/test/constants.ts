import 'dotenv/config';
import { getConnectionOptions, createConnection } from 'typeorm';

export const app = `http://localhost:${process.env.PORT}`;
export const createConn = async () => {
  const connOptions = await getConnectionOptions('test');
  return createConnection({ ...connOptions, name: 'default' });
};
