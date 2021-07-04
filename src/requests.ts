import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import * as B from "fp-ts/boolean";
import * as IO from "fp-ts/IO";
import * as R from "fp-ts/Reader";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { constant, identity, pipe, unsafeCoerce } from "fp-ts/function";
import * as A from "fp-ts/Apply";

const API_ROOT =
  import.meta.env.BACKEND_URL || "https://conduit.productionready.io/api";

const instance = axios.create({
  baseURL: API_ROOT,
});

const coerceReasonToError = (reason: unknown) => unsafeCoerce<unknown, Error>(reason)

export const requests = A.sequenceS(R.Apply)({
  del: (ins: AxiosInstance) => TE.tryCatchK(ins.delete, coerceReasonToError),
  get: (ins: AxiosInstance) => TE.tryCatchK(ins.get, coerceReasonToError),
  put: (ins: AxiosInstance) => TE.tryCatchK(ins.put, coerceReasonToError),
  post: (ins: AxiosInstance) => TE.tryCatchK(ins.post, coerceReasonToError),
})(instance);

type ConfigureFn = (config: AxiosRequestConfig) => IO.IO<void>;

export const configureAxiosDefaults = pipe(
  R.ask<AxiosInstance>(),
  R.map((ins) => ins.defaults),
  R.map((config) => (configure: ConfigureFn) => configure(config))
)(instance);
