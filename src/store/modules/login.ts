import { analyzeResponseError, analyzeResponseUser, Errors } from "../../types";
import { RootState, rootMutations } from "..";
import { Auth } from "../../agent";
import { commit } from '../../utils';
import { Module } from "vuex";
import * as O from "fp-ts/Option";
import * as T from "fp-ts/Task";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";

interface State {
  inProgress: boolean;
  errors: O.Option<Errors>;
}

const mutations = {
  startLoading: commit("startLoading"),
  stopLoading: commit("stopLoading"),
  setErrors: (errors: Errors) => commit("setErrors", errors),
  clearErrors: commit("clearErrors"),
}

const module: Module<State, RootState> = {
  namespaced: true,
  state() {
    return {
      inProgress: false,
      errors: O.none,
    };
  },
  mutations: {
    startLoading: (state) => {
      state.inProgress = true;
    },
    stopLoading: (state) => {
      state.inProgress = false;
    },
    setErrors: (state, payload: Errors) => {
      state.errors = O.of(payload);
    },
    clearErrors: (state) => {
      state.errors = O.none;
    },
  },
  actions: {
    login: {
      root: true,
      async handler(context, payload: { email: string; password: string }) {
        const { email, password } = payload;

        return pipe(
          TE.Do,
          TE.chainFirstIOK(() => mutations.clearErrors(context.commit)),
          TE.chainFirstIOK(() => mutations.startLoading(context.commit)),
          TE.chain(() => Auth.login(email, password)),
          TE.fold(
            e => pipe(
              TE.fromEither(analyzeResponseError(e)),
              TE.map(r => r.errors),
              TE.chainFirstIOK(errors => mutations.setErrors(errors)(context.commit)),
              TE.chain(() => TE.left(e)),
            ),
            res => pipe(
              TE.fromEither(analyzeResponseUser(res)),
              TE.map(res => res.user),
              TE.chainFirstIOK(user => rootMutations.setCurrentUser(user)(context.commit))
            )
          ),
          T.chainFirstIOK(() => mutations.stopLoading(context.commit))
        )()
      },
    },
  }
};

export default module;
