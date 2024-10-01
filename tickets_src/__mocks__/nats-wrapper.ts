export const natsWrapper = {
    client: {
        //jest.fn will records how it's called
        publish: jest.fn().mockImplementation(
            (subject: string, data: string, callback: ()=>void) =>{
                callback();
            }
        )
    }
}