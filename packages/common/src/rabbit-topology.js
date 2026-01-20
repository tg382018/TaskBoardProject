export const RABBIT = {
    exchange: "taskboard.events",
    exchangeType: "topic",
    workerQueue: "worker.taskboard",
    bindings: ["task.*"], // consume patterns
};