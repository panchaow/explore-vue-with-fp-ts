import { key } from '../store';
import { useStore as vuexUseStore } from 'vuex';

export const useStore = () => {
  return vuexUseStore(key);
}

export default useStore;