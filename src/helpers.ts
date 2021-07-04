import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/Option";
import * as R from "fp-ts/Reader";
import { findFirst } from "fp-ts/Array";
import { Todos, Todo } from "./types";

// export const findFirstTodo = (id: string) =>
//   pipe(R.ask<Todos>(), R.map(findFirst((x) => x.id === id)));

export const findFirstTodo = (todos: Todos) => (id: string) => {
  pipe(
    todos,
    findFirst((x) => x.id === id)
  );
};

// const 

export const doneTodo = (todo: Todo) => () => todo.done = true;