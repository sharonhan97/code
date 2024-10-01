import {Publisher,Subjects, TicketUpdatedEvent} from '@shanticket/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    readonly subject =  Subjects.TicketUpdated;
    
}