import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';


declare global {
  var signin: () => string[];
}

//rather than actually import real file jest will import mocks file
jest.mock('../nats-wrapper')


let mongo: MongoMemoryServer;
beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf';
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

global.signin = () => {
  //build a JWT payload
  const payload={
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  }
  //create the JWT
  const token = jwt.sign(payload,process.env.JWT_KEY!);

  const session = {jwt:token};

  const sessionJSON = JSON.stringify(session);

  const base64 = Buffer.from(sessionJSON).toString('base64');

  //build sessin object
  return [`session=${base64}`];
};

