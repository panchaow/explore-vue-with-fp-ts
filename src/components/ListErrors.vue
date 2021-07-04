<script lang="tsx">
import { defineComponent, PropType } from "vue";
import * as O from "fp-ts/Option";

import { Errors } from "../types";
import { constant, pipe } from "fp-ts/lib/function";

export default defineComponent({
  name: "list-errors",
  props: {
    errors: {
      type: Object as PropType<O.Option<Errors>>,
      required: true,
    },
  },
  setup(props) {
    return () => {
      return pipe(
        props.errors,
        O.fold(constant(null), (errors) => (
          <ul class="error-messages">
            {Object.entries(errors).map(([name, messages]) => {
              return (
                <li>
                  <span>
                    {name} {messages.join(";")}
                  </span>
                </li>
              );
            })}
          </ul>
        ))
      );
    };
  },
});
</script>

<style></style>
