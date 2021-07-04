import { RootState } from '../index';
import { Articles } from "../../agent";
import {
  analyzeResponseArticle,
  analyzeResponseArticles,
  Article,
} from "../../types";
import { Module } from "vuex";
import { findIndex } from "fp-ts/Array";
import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import * as IO from "fp-ts/IO";
import * as T from "fp-ts/Task";
import * as TE from "fp-ts/TaskEither";
import { error, log } from "fp-ts/Console";
import { flow, pipe } from "fp-ts/function";

export type ArticlesFilter =
  | {
      type: "tag";
      value: string;
    }
  | {
      type: "author";
      value: string;
    }
  | {
      type: "favorited";
      value: string;
    }
  | {
      type: "feed";
    }
  | {
      type: "all";
    };

export interface State {
  _filter: ArticlesFilter | null;
  loading: boolean;
  articles: Article[];
  articlesCount: number;
  page: number;
}

const module: Module<State, RootState> = {
  namespaced: true,
  state() {
    return {
      _filter: null,
      loading: false,
      articles: [],
      articlesCount: 0,
      page: 0,
    };
  },
  mutations: {
    start(state) {
      state.loading = true;
    },
    stop(state) {
      state.loading = false;
    },
    setArticles(
      state,
      payload: {
        articles: Article[];
        articlesCount: number;
        filter: ArticlesFilter;
        page: number;
      }
    ) {
      state.articles = payload.articles;
      state.articlesCount = payload.articlesCount;
      state._filter = payload.filter;
      state.page = payload.page;
    },
    replaceArticle(state, payload: { slug: string, newArticle: Article }) {
      const idxO = pipe(
        state.articles,
        findIndex((x) => x.slug === payload.slug)
      );

      if (O.isSome(idxO)) {
        state.articles[idxO.value] = payload.newArticle;
      }
    },
  },
  actions: {
    async _fetch(context, payload: { filter: ArticlesFilter; page: number }) {
      const { filter, page } = payload;

      const getArticles =
        filter.type === "all"
          ? Articles.all(page)
          : filter.type === "feed"
          ? Articles.feed(page)
          : {
              tag: Articles.byTag(filter.value, page),
              author: Articles.byAuthor(filter.value, page),
              favorited: Articles.favoritedBy(filter.value, page),
            }[filter.type];

      await pipe(
        TE.Do,
        TE.chainIOK(() => {
          return () => context.commit("start");
        }),
        TE.chain(() => getArticles),
        TE.chainEitherKW(analyzeResponseArticles),
        TE.fold(flow(error, T.fromIO), (res) =>
          T.fromIO(() =>
            context.commit("setArticles", {
              articles: res.articles,
              articlesCount: res.articlesCount,
              filter,
              page,
            })
          )
        ),
        T.chainIOK(() => {
          return () => context.commit("stop");
        })
      )();
    },
    fetchArticles(context, payload: { filter: ArticlesFilter }) {
      return context.dispatch("_fetch", { filter: payload.filter, page: 0 });
    },
    goPage(context, payload: { page: number }) {
      return context.dispatch("_fetch", {
        filter: context.state._filter,
        page: payload.page,
      });
    },
    async delete(context, payload: { slug: string }) {
      await pipe(
        Articles.del(payload.slug),
        TE.fold(T.fromIOK(error), () => T.fromIO(log("successfully deleted.")))
      )();
    },
    async favorite(context, payload: { slug: string }) {
      await pipe(
        Articles.favorite(payload.slug),
        TE.chainEitherKW(analyzeResponseArticle),
        TE.fold(flow(error, T.fromIO), (res) =>
          T.fromIO(() => context.commit("replaceArticle", { slug: payload.slug , newArticle: res.article }))
        )
      )();
    },
    async unfavorite(context, payload: { slug: string }) {
      await pipe(
        Articles.unfavorite(payload.slug),
        TE.chainEitherKW(analyzeResponseArticle),
        TE.fold(flow(error, T.fromIO), (res) =>
          T.fromIO(() => context.commit("replaceArticle", { slug: payload.slug, newArticle: res.article }))
        )
      )();
    },
  },
};

export default module;
