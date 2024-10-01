import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';

it('returns 404 if the provided id does not exist',async()=>{
    const id = new mongoose.Types.ObjectId().toHexString();
    const response = await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie',global.signin())
        .send({
            title:'harry potter',
            price: 10
        })
        .expect(404)

});

it('returns 401 if the user is not authenticated',async()=>{
    const id = new mongoose.Types.ObjectId().toHexString();
    const response = await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title:'harry potter',
            price: 10
        })
        .expect(401)

});

it('returns 401 if the user does not own the ticket',async()=>{
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie',global.signin())
    .send({
        title:'harry potter',
        price: 10
    });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',global.signin())
        .send({
            title:'harry potter',
            price: 100
        })
        .expect(401)
});

it('returns 400 if the user provide an invalid title or price',async()=>{
    const cookie = global.signin();
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie',cookie)
    .send({
        title:'harry potter',
        price: 10
    });

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie',cookie)
    .send({
        title:'harry potter',
        price: -10
    })
    .expect(400)

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie',cookie)
    .send({
        title:'',
        price: 10
    })
    .expect(400)



});

it('updates the ticket, if the user provide valid input',async()=>{
    const cookie = global.signin();
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie',cookie)
    .send({
        title:'harry potter',
        price: 10
    });

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie',cookie)
    .send({
        title:'new',
        price: 20
    })
    .expect(200)

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200);

    expect(ticketResponse.body.title).toEqual('new');
    expect(ticketResponse.body.price).toEqual(20);

});

it('publishes an event',async()=>{
    const cookie = global.signin();
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie',cookie)
    .send({
        title:'harry potter',
        price: 10
    });

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie',cookie)
    .send({
        title:'new',
        price: 20
    })
    .expect(200)

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();


});
