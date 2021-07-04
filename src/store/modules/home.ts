import { RootState } from "../index";
import { Tag, analyzeResponseTags } from "../../types";
import { Tags } from "../../agent";
import { Module } from "vuex";
import * as T from "fp-ts/Task";
import * as TE from "fp-ts/TaskEither";
import { error } from "fp-ts/Console";
import { flow, pipe } from "fp-ts/function";

// import articles, { State as ArticlesState } from './articles';

export interface State {
  // articles: ArticlesState;
  loadingTags: boolean;
  tags: Tag[];
}

const module: Module<State, RootState> = {
  namespaced: true,
  state() {
    return {
      loadingTags: false,
      tags: [],
    };
  },
  mutations: {
    startLoadingTags(state) {
      state.loadingTags = true;
    },
    stopLoadingTags(state) {
      state.loadingTags = false;
    },
    setTags(state, payload: { tags: Tag[] }) {
      state.tags = payload.tags;
    },
  },
  actions: {
    async loadTags(context) {
      // const setTags = (xs: Array<Tag>) => () => { tags.value = xs };

      await pipe(
        TE.Do,
        TE.chain(() => TE.fromIO(() => context.commit("startLoadingTags"))),
        TE.chain(() => Tags.getAll()),
        TE.chainEitherKW(analyzeResponseTags),
        TE.fold(flow(error, T.fromIO), (response) =>
          T.fromIO(() => context.commit("setTags", { tags: response.tags }))
        ),
        T.chainIOK(() => TE.fromIO(() => context.commit("stopLoadingTags")))
      )();
    },
  },
};

export default module;
