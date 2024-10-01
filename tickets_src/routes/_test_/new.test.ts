import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';


it('has a router handler listening to /api/tickets for post requests',async()=>{
    const response = await request(app)
        .post('/api/tickets')
        .send({});
    expect(response.status).not.toEqual(404)

})

it('can only be accessed if the user is signed in',async()=>{
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie',global.signin())
        .send({});
    expect(response.status).not.toEqual(401);
    
})

it('returns an error if an invalid title is provided',async()=>{
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie',global.signin())
    .send({
        title:'',
        price:10
    });
    expect(400)
})

it('returns an error if an invalid price is provided',async()=>{
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie',global.signin())
    .send({
        title:'harry potter',
        price:-10
    });
    expect(400)
})

it('create a ticket with valid inputs',async()=>{
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0)


    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie',global.signin())
    .send({
        title:'harry potter',
        price:10
    });
    expect(201)

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1)

});

it('publishes an event',async()=>{
    const title = 'sdgweg';

    await request(app)
    .post('/api/tickets')
    .set('Cookie',global.signin())
    .send({
        title: title,
        price: 10
    });
    expect(201)

    console.log(natsWrapper)

});

