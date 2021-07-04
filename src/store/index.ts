import { analyzeResponseUser, User } from "../types";
import { Auth } from "../agent";
import { configureAxiosDefaults } from "../requests";
import { getItem } from "../utils/localStorage";
import { commit, noop } from "../utils";
import login from "./modules/login";
import register from "./modules/register";
import settings from "./modules/settings";
import home from "./modules/home";
import articles from "./modules/articles";
import article from "./modules/article";
import profile from "./modules/profile";
import editor from './modules/editor';
import { removeItem, setItem } from "../utils/localStorage";
import { InjectionKey } from "vue";
import { createStore, Store, Module } from "vuex";
import * as O from "fp-ts/Option";
import * as IO from "fp-ts/IO";
import * as T from "fp-ts/Task";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";

export interface RootState {
  appLoaded: boolean;
  currentUser: O.Option<User>;
}

const modules = {
  login,
  register,
  settings,
  home,
  articles,
  article,
  profile,
  editor,
};

type GetModuleState<T> = T extends Module<infer S, RootState> ? S : unknown;

type Modules = typeof modules;

export type State = RootState &
  {
    [key in keyof Modules]: GetModuleState<Modules[key]>;
  };

export const key: InjectionKey<Store<State>> = Symbol();

export const rootMutations = {
  setCurrentUser: (user: User) =>
    commit("setCurrentUser", user, { root: true }),
  clearCurrentUser: commit("clearCurrentUser", null, { root: true }),
  appLoad: commit("load", null, { root: true }),
};

const setAuth = (tok: string) => {
  return configureAxiosDefaults(
    (axios) => () => (axios.headers["authorization"] = `Token ${tok}`)
  );
};

const clearAuth = configureAxiosDefaults(
  (axios) => () => (axios.headers["authorization"] = null)
);
export const store = createStore<RootState>({
  state() {
    return {
      appLoaded: false,
      currentUser: O.none,
    };
  },
  mutations: {
    setCurrentUser: (state, user: User) => {
      state.currentUser = O.of(user);
    },
    clearCurrentUser: (state) => {
      state.currentUser = O.none;
    },
    load: (state) => {
      state.appLoaded = true;
    },
  },
  actions: {
    initApp(context) {
      return pipe(
        T.Do,
        T.chainIOK(() => getItem("jwt")),
        T.chain(
          O.foldW(
            () => TE.fromIO(noop),
            (tok) =>
              pipe(
                TE.Do,
                TE.chainIOK(() => setAuth(tok)),
                TE.chain(() => Auth.current()),
                TE.chainEitherK(analyzeResponseUser),
                TE.map((res) => res.user),
                TE.chainIOK((user) =>
                  rootMutations.setCurrentUser(user)(context.commit)
                )
              )
          )
        ),
        T.chainIOK(() => rootMutations.appLoad(context.commit))
      )();
    },
  },
  plugins: [
    (store) => {
      store.subscribe((mutation) => {
        if (mutation.type === "setCurrentUser") {
          const currentUser = mutation.payload as User;

          const token = currentUser.token;

          pipe(
            setAuth(token),
            IO.chain(() => setItem("jwt")(token))
          )();
        }

        if (mutation.type === "clearCurrentUser") {
          pipe(
            clearAuth,
            IO.chain(() => removeItem("jwt"))
          )();
        }
      });
    },
  ],
  modules,
});
