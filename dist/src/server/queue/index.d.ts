export = Queues;
declare class Queues {
    constructor(config: any);
    _queues: {};
    useCdn: {
        value: boolean;
        useCdn: boolean;
    };
    list(): any;
    setConfig(config: any): void;
    _config: any;
    _checkConstructors(): boolean;
    get(queueName: any, queueHost: any): Promise<any>;
    /**
     * Creates and adds a job with the given `data` to the given `queue`.
     *
     * @param {Object} queue A bee or bull queue class
     * @param {Object} data The data to be used within the job
     * @param {String} name The name of the Bull job (optional)
     */
    set(queue: any, data: any, name: string): Promise<any>;
}
