import request from 'supertest';
import { app } from '../../app';

it('respond with details about the current user', async()=>{
    const authResponse = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
    
    //jest test not like web or postman, will not automactically save cookie 
    //so we need to save cookie and set in every request
    const cookie = authResponse.get('Set-Cookie')


    const response = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', cookie!)
        .send()
        .expect(200);
    
    console.log(response.body)
});
