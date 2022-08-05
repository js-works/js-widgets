import { createElement, defineComponent } from '../../../modules/core/main/index'
import { initStore } from 'js-stores'
import { useStore } from 'js-stores/with-js-widgets'

function createFriendlyStore() {
  const [self, update] = initStore({
    newFriendEntry: '',
    friends: [] as string[],

    addFriend(name: string, isFavorite: boolean = false) {
      const newFriends = isFavorite
        ? [name + ' *', ...self.friends]
        : [...self.friends, name]
        
      update({ friends: newFriends })
    },

    updateNewFriendEntry(name: string) {
      update({ newFriendEntry: name })
    }
  })

  return self
}

const Friendly = defineComponent({
  displayName: 'Friendly',
  memoize: true,

  init(c) {
    const
      store = useStore(c, createFriendlyStore),
 
      onChangeNewFriend = (ev: any) =>
        store.updateNewFriendEntry(ev.target.value),

      onClickAddFriend = () => {
        store.addFriend(store.newFriendEntry)
        store.updateNewFriendEntry('')
      },

      onClickAddFavoriteFriend = () => {
        store.addFriend(store.newFriendEntry, true)
        store.updateNewFriendEntry('')
      }

    return () => (
      <div>
        <input value={store.newFriendEntry} onChange={onChangeNewFriend} />
        <button onClick={onClickAddFriend}>Add friend</button>
        <button onClick={onClickAddFavoriteFriend}>Add favorite friend</button>
        <div>
           <h4>Count of friends: {store.friends.length}</h4>
          { store.friends.map(friend => <div>{friend}</div>) }
        </div>
      </div>
    )
  }
})

export default <Friendly/>
