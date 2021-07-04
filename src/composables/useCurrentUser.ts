import useStore from './useStore';
import { computed } from 'vue';

export default () => {
  const store = useStore();

  const currentUser = computed(() => store.state.currentUser);

  return currentUser;
}