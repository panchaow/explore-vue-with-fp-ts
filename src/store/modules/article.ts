import { RootState } from "..";
import {
  analyzeResponseArticle,
  analyzeResponseComment,
  analyzeResponseComments,
  analyzeResponseError,
  Article,
  Comment,
  Errors,
} from "../../types";
import { Articles, Comments } from "../../agent";
import { commit } from "../../utils";
import { Module, Commit } from "vuex";
import * as O from "fp-ts/Option";
import * as E from "fp-ts/Either";
import * as T from "fp-ts/Task";
import * as TE from "fp-ts/TaskEither";
import { flow, pipe } from "fp-ts/function";

const articleMutations = {
  startLoading: commit("startLoading"),
  stopLoading: commit("stopLoading"),
  setArticle: (article: Article) => commit("setArticle", { article }),
};

const commentsMutations = {
  startLoading: commit("startLoadingComments"),
  stopLoading: commit("stopLoadingComments"),
  setComments: (comments: Comment[]) => commit("setComments", { comments }),
};

const formMutations = {
  clearErrors: commit("clearErrors"),
  setErrors: (errors: Errors) => commit("setErrors", errors),
};

interface State {
  _slug: O.Option<string>;
  loading: boolean;
  article: O.Option<Article>;
  loadingComments: boolean;
  comments: Comment[];
  errors: O.Option<Errors>;
}

const module: Module<State, RootState> = {
  namespaced: true,
  state() {
    return {
      _slug: O.none,
      loading: false,
      article: O.none,
      loadingComments: false,
      comments: [],
      errors: O.none,
    };
  },
  mutations: {
    setSlug(state, payload: { slug: string }) {
      state._slug = O.of(payload.slug);
    },
    startLoading(state) {
      state.loading = true;
    },
    stopLoading(state) {
      state.loading = false;
    },
    setArticle(state, payload: { article: Article }) {
      state.article = O.of(payload.article);
    },
    startLoadingComments(state) {
      state.loadingComments = true;
    },
    stopLoadingComments(state) {
      state.loadingComments = false;
    },
    setComments(state, payload: { comments: Comment[] }) {
      state.comments = payload.comments;
    },
    setErrors: (state, payload: Errors) => {
      state.errors = O.of(payload);
    },
    clearErrors: (state) => {
      state.errors = O.none;
    },
  },
  actions: {
    async init(context, payload: { slug: string }) {
      context.commit("setSlug", { slug: payload.slug });
      await T.sequenceSeqArray([
        () => context.dispatch("_loadArticle"),
        () => context.dispatch("_loadComments"),
      ])();
    },

    _loadArticle(context) {
      return pipe(
        TE.Do,
        TE.chain(() =>
          pipe(
            context.state._slug,
            TE.fromOption(
              () => new Error("Please dispatch an init action first!")
            )
          )
        ),
        TE.chainFirstIOK(() => articleMutations.startLoading(context.commit)),
        TE.chain(Articles.get),
        TE.chainEitherK(analyzeResponseArticle),
        TE.chainFirstIOK((res) =>
          articleMutations.setArticle(res.article)(context.commit)
        ),
        T.chainFirstIOK(() => articleMutations.stopLoading(context.commit))
      )();
    },

    async delArticle(context) {
      return pipe(
        TE.Do,
        TE.chain(() =>
          pipe(
            context.state._slug,
            TE.fromOption(
              () => new Error("Please dispatch an init action first!")
            )
          )
        ),
        TE.chain((slug) => Articles.del(slug))
      )();
    },

    _loadComments(context) {
      return pipe(
        TE.Do,
        TE.chain(() =>
          pipe(
            context.state._slug,
            TE.fromOption(
              () => new Error("Please dispatch an init action first!")
            )
          )
        ),
        TE.chainFirstIOK(() => commentsMutations.startLoading(context.commit)),
        TE.chain(Comments.forArticle),
        TE.chainEitherK(analyzeResponseComments),
        TE.chainFirstIOK((res) =>
          commentsMutations.setComments(res.comments)(context.commit)
        ),
        T.chainFirstIOK(() => commentsMutations.stopLoading(context.commit))
      )();
    },

    createComment(context, payload: { body: string }) {
      return pipe(
        TE.Do,
        TE.chain(() =>
          pipe(
            context.state._slug,
            TE.fromOption(
              () => new Error("Please dispatch an init action first!")
            )
          )
        ),
        TE.chainFirstIOK(() => formMutations.clearErrors(context.commit)),
        TE.chain((slug) => Comments.create(slug, payload.body)),
        TE.fold(
          (e) =>
            pipe(
              TE.fromEither(analyzeResponseError(e)),
              TE.map((r) => r.errors),
              TE.chainFirstIOK((errors) =>
                formMutations.setErrors(errors)(context.commit)
              ),
              TE.chain(() => TE.left(e))
            ),
          (res) =>
            pipe(
              TE.fromEither(analyzeResponseComment(res)),
              TE.map((res) => res.comment),
              TE.chainFirstIOK((comment) =>
                commentsMutations.setComments([
                  comment,
                  ...context.state.comments,
                ])(context.commit)
              )
            )
        )
      )();
    },

    deleteComment(context, payload: { id: number }) {
      return pipe(
        TE.Do,
        TE.chain(() =>
          pipe(
            context.state._slug,
            TE.fromOption(
              () => new Error("Please dispatch an init action first!")
            )
          )
        ),
        TE.chain((slug) => Comments.delete(slug, payload.id)),
        TE.chainFirstIOK(() =>
          commentsMutations.setComments(
            context.state.comments.filter(
              (comment) => comment.id !== payload.id
            )
          )(context.commit)
        )
      )();
    },
  },
};

export default module;
