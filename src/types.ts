import { pipe, flow } from "fp-ts/function";
import * as E from "fp-ts/Either";
import * as t from "io-ts";
import { failure } from "io-ts/PathReporter";
import axios, { AxiosResponse } from "axios";

type Decode<I, A> = (i: I) => E.Either<Error, A>;

export const decodeWith = <A>(
  decoder: t.Decoder<unknown, A>
): Decode<unknown, A> =>
  flow(
    decoder.decode,
    E.mapLeft((errors) => new Error(failure(errors).join("\n")))
  );

export const responseError = t.type({
  errors: t.record(t.string, t.array(t.string)),
});

export type Errors = t.TypeOf<typeof responseError>["errors"];

export const analyzeResponseError = flow(
  (e: Error) => {
    return axios.isAxiosError(e)
      ? E.right(e)
      : E.left(new Error("the provived error is not an axios error!"))
  },
  E.chain((reason) =>
    reason.response
    ? E.right(reason.response)
    : E.left(new Error("the provived error does not contain a response!"))
  ),
  E.map(response => {
    return response.data
  }),
  E.chain(decodeWith(responseError))
);

const analyzeResponse = flow(
  decodeWith,
  <A>(decode: Decode<unknown, A>) =>
    (res: AxiosResponse<unknown>) =>
      decode(res.data)
);


const user = t.type({
  email: t.string,
  token: t.string,
  username: t.string,
  bio: t.union([t.string, t.null]),
  image: t.union([t.string, t.null]),
});

export const responseUser = t.type({
  user: user,
});

export type User = t.TypeOf<typeof user>;
// export type ResponseUser = t.TypeOf<typeof responseUser>;

export const analyzeResponseUser = analyzeResponse(responseUser);

const profile = t.type({
  username: t.string,
  bio: t.union([t.string, t.null]),
  image: t.union([t.string, t.null]),
  following: t.boolean,
});

const responseProfile = t.type({
  profile: profile,
});

export type Profile = t.TypeOf<typeof profile>;

export const analyzeResponseProfile = analyzeResponse(responseProfile);

const article = t.type({
  slug: t.string,
  title: t.string,
  description: t.string,
  body: t.string,
  tagList: t.array(t.string),
  createdAt: t.string,
  updatedAt: t.string,
  favorited: t.boolean,
  favoritesCount: t.number,
  author: profile,
});

export type Article = t.TypeOf<typeof article>;

const responseArticle = t.type({
  article: article,
});

export const analyzeResponseArticle = analyzeResponse(responseArticle);

const responseArticles = t.type({
  articles: t.array(article),
  articlesCount: t.number,
});

export const analyzeResponseArticles = analyzeResponse(responseArticles);

const comment = t.type({
  id: t.number,
  createdAt: t.string,
  updatedAt: t.string,
  body: t.string,
  author: profile,
});

export type Comment = t.TypeOf<typeof comment>;

const responseComment = t.type({
  comment: comment,
});

export const analyzeResponseComment = analyzeResponse(responseComment);

const responseComments = t.type({
  comments: t.array(comment),
});

export const analyzeResponseComments = analyzeResponse(responseComments);

const tag = t.string;

export type Tag = t.TypeOf<typeof tag>;

const responseTags = t.type({
  tags: t.array(tag),
});

export const analyzeResponseTags = analyzeResponse(responseTags);

