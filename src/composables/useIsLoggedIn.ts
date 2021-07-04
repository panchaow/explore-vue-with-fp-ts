import useCurrentUser from './useCurrentUser';
import { computed } from 'vue';
import * as O from 'fp-ts/Option';

export default () => {
  const currentUser = useCurrentUser();
  
  const isLoggedIn = computed(() => O.isSome(currentUser.value))

  return isLoggedIn;
}