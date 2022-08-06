import { Reaction } from 'mobx';
import { intercept } from 'js-widgets';

// === exports =======================================================

export { makeComponentsMobxAware };

// === makeComponentsMobxAware =======================================

let componentsAreMobxAware = false;

function makeComponentsMobxAware() {
  if (componentsAreMobxAware) {
    return;
  }

  componentsAreMobxAware = true;

  const reactionsById: Record<string, Reaction> = {};

  intercept({
    onInit(next, componentId, getCtrl) {
      const ctrl = getCtrl(0);

      if (!reactionsById[componentId]) {
        const update = ctrl.getUpdater();
        const reaction = new Reaction('js-widgets::reaction', () => update());
        reactionsById[componentId] = reaction;

        ctrl.beforeUnmount(() => {
          reaction.dispose();
          delete reactionsById[componentId];
        });
      }

      next();
    },

    onRender(next, id) {
      reactionsById[id].track(next);
    }
  });
}
