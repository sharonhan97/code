import nats, {Stan} from 'node-nats-streaming'

class NatsWrapper{
    private _client?: Stan;

    //make sure when we use client it is already connected
    get client(){
        if (!this._client){
            throw new Error('cannot access NATS client before connecting')
        }

        return this._client;
    }

    connect(clusterId: string, clientId: string, url: string){
        this._client = nats.connect(clusterId,clientId,{url});

        //promise indicates the completion status of an asynchronous operation
        return new Promise<void>((resolve,reject)=>{
            this.client.on('connect',()=>{
                console.log('Connected to NATS');
                resolve();
            })
            this.client.on('error',(err)=>{
                console.log('Fail to connect NATS');
                reject(err)
            })
        })
    }


}
export const natsWrapper = new NatsWrapper()