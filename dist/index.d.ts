export = runDefault;
declare function runDefault(config: any, listenOpts?: {}): import("express-serve-static-core").Express;
declare namespace runDefault {
    export { run };
}
declare function run(config: any, listenOpts?: {}): {
    app: import("express-serve-static-core").Express;
    queues: any;
};
