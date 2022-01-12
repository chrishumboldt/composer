import { finalize, merge, mergeMap, of, share } from 'rxjs';

// Run different observable stream effects.
const runEffect = (input$) => (effect) => {
  return effect(input$).pipe(finalize(() => {}));
};
const runEffects = ({ effects, input }) => {
  const input$ = of(input).pipe(share());
  return merge(...effects.map(runEffect(input$)));
};
export const runEffects$ = (...effects) => {
  return mergeMap((input) => {
    return runEffects({ effects, input });
  });
};
