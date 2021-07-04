import { RootState } from '..';
import { analyzeResponseArticle, analyzeResponseError, Article, Errors } from '../../types';
import { commit } from '../../utils';
import { Module } from 'vuex';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { Articles } from '../../agent';

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
      errors: O.none
    }
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
    }
  },
  actions: {
    create(context, payload: { article: Article }) {
      return pipe(
        TE.Do,
        TE.chainIOK(() => mutations.clearErrors(context.commit)),
        TE.chainIOK(() => mutations.startLoading(context.commit)),
        TE.chain(() => Articles.create(payload.article)),
        TE.fold(
          e => pipe(
            TE.fromEither(analyzeResponseError(e)),
            TE.map(r => r.errors),
            TE.chainFirstIOK(errors => mutations.setErrors(errors)(context.commit)),
            TE.chain(() => TE.left(e))
          ),
          res => pipe(
            TE.fromEither(analyzeResponseArticle(res)),
            TE.map(r => r.article),
            // TE.chainFirstIOK(article => )
          )
        ),
        T.chainFirstIOK(() => mutations.stopLoading(context.commit))
      )()
    },
    edit(context, payload: { article: Article }) {
      return pipe(
        TE.Do,
        TE.chainIOK(() => mutations.clearErrors(context.commit)),
        TE.chainIOK(() => mutations.startLoading(context.commit)),
        TE.chain(() => Articles.update(payload.article)),
        TE.fold(
          e => pipe(
            TE.fromEither(analyzeResponseError(e)),
            TE.map(r => r.errors),
            TE.chainFirstIOK(errors => mutations.setErrors(errors)(context.commit)),
            TE.chain(() => TE.left(e))
          ),
          res => pipe(
            TE.fromEither(analyzeResponseArticle(res)),
            TE.map(r => r.article),
            // TE.chainFirstIOK(article => )
          )
        ),
        T.chainFirstIOK(() => mutations.stopLoading(context.commit))
      )()
    },
    load(context, payload: { slug: string }) {
      return pipe(
        TE.Do,
        TE.chain(() => Articles.get(payload.slug)),
        TE.chainEitherK(analyzeResponseArticle),
        TE.map(r => r.article)
      )();
    },
  }
}

export default module;