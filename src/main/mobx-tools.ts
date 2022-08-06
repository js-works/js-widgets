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
    onInit(next, getCtrl) {
      const ctrl = getCtrl(0);
      const id = ctrl.getId();

      if (!reactionsById[id]) {
        const update = ctrl.getUpdater();
        const reaction = new Reaction('js-widgets::reaction', () => update());
        reactionsById[id] = reaction;

        ctrl.beforeUnmount(() => {
          reaction.dispose();
          delete reactionsById[id];
        });
      }

      next();
    },

    onRender(next, id) {
      reactionsById[id].track(next);
    }
  });
}
