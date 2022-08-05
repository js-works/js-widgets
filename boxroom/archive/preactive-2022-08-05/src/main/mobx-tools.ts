import { Reaction } from 'mobx';
import { intercept } from 'preactive';

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
      const update = ctrl.getUpdater();
      const id = ctrl.getId();

      let reaction = reactionsById[id];

      if (!reaction) {
        reaction = new Reaction('reaction', () => {
          update();
        });

        reactionsById[id] = reaction;
      }

      next();
    },

    onRender(next, id) {
      reactionsById[id].track(next);
    }
  });
}
