import {Publisher,Subjects, TicketCreatedEvent} from '@shanticket/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    readonly subject =  Subjects.TicketCreated;
    
}