import { InjectionKey, provide, inject } from 'vue';
import * as O from 'fp-ts/Option';

export interface Config {
  appName: string;
}

export const configKey: InjectionKey<Config> = Symbol()

export const useConfig = () => {
  return O.fromNullable(inject(configKey));
}

export const provideConfig = (config: Config) => {
  provide(configKey, config)
}
