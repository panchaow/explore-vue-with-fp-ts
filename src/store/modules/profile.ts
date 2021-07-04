import { RootState } from "..";
import { Profile as ProfileAgent } from "../../agent";
import { analyzeResponseProfile, Profile } from "../../types";
import { commit } from "../../utils";
import { Module } from "vuex";
import * as O from "fp-ts/Option";
import * as T from "fp-ts/Task";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";

interface State {
  _username: O.Option<string>;
  loading: boolean;
  profile: O.Option<Profile>;
}

const mutations = {
  startLoading: commit("startLoading"),
  stopLoading: commit("stopLoading"),
  setProfile: (profile: Profile) => commit("setProfile", { profile }),
};

const module: Module<State, RootState> = {
  namespaced: true,
  state() {
    return {
      _username: O.none,
      loading: false,
      profile: O.none,
    };
  },
  mutations: {
    _setUsername(state, payload: { username: string }) {
      state._username = O.some(payload.username);
    },
    startLoading(state) {
      state.loading = true;
    },
    stopLoading(state) {
      state.loading = false;
    },
    setProfile(state, payload: { profile: Profile }) {
      state.profile = O.some(payload.profile);
    },
  },
  actions: {
    async init(context, payload: { username: string }) {
      context.commit("_setUsername", { username: payload.username });

      await context.dispatch("loadProfile");
    },
    loadProfile(context) {
      return pipe(
        TE.Do,
        TE.chain(() =>
          pipe(
            context.state._username,
            TE.fromOption(
              () => new Error("Please dispatch an init action first!")
            )
          )
        ),
        TE.chainFirstIOK(() => mutations.startLoading(context.commit)),
        TE.chain(ProfileAgent.get),
        TE.chainEitherK(analyzeResponseProfile),
        TE.map(res => res.profile),
        TE.chainFirstIOK((profile) =>
          mutations.setProfile(profile)(context.commit)
        ),
        T.chainFirstIOK(() => mutations.stopLoading(context.commit))
      )();
    },
    follow(context) {
      return pipe(
        context.state._username,
        TE.fromOption(() => new Error("Please dispatch an init action first!")),
        TE.chain((username) => ProfileAgent.follow(username)),
        TE.chainEitherK(analyzeResponseProfile),
        TE.chainFirstIOK((res) =>
          mutations.setProfile(res.profile)(context.commit)
        )
      )();
    },
    unfollow(context) {
      return pipe(
        context.state._username,
        TE.fromOption(() => new Error("Please dispatch an init action first!")),
        TE.chain((username) => ProfileAgent.unfollow(username)),
        TE.chainEitherK(analyzeResponseProfile),
        TE.chainFirstIOK((res) =>
          mutations.setProfile(res.profile)(context.commit)
        )
      )();
    },
  },
};

export default module;
