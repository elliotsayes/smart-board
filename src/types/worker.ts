export type WorkerResponse<T> =
  | {
      type: "result";
      result: T;
    }
  | {
      type: "done";
    };
