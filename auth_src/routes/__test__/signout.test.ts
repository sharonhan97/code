import request from 'supertest';
import { app } from '../../app';

it('returns a 200 on successful signout', async()=>{
    return request(app)
        .get('/api/users/signout')
        .send({})
        .expect(200);
});