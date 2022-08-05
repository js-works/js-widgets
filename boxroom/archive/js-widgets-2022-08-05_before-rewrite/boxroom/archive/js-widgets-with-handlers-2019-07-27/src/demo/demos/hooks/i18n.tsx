import { createElement, defineComponent, defineContext } from '../../../modules/core/main/index'
import { useContext, useProps, useState } from '../../../modules/hooks/main/index'
import { Spec } from 'js-spec'

const translations: Record<string, Record<string, string>> = {
  en: {
    salutation: 'Hello, ladies and gentlemen!'
  },
  de: {
    salutation: 'Hallo, meine Damen und Herren!'
  },
  fr: {
    salutation: 'Salut, Mesdames, Messieurs!'
  }
}

const LocaleCtx = defineContext({
  displayName: 'LocaleCtx',
  default: 'en'
})

type AppProps = {
  defaultLocale: string
}

const App = defineComponent<AppProps>({
  displayName: 'App',

  validate: Spec.exact({
    defaultLocale: Spec.optional(Spec.oneOf('en', 'fr', 'de'))
  }),

  defaults: {
    defaultLocale: 'en'
  },

  init(c) {
    const
      getProps = useProps(c),
      [getLocale, setLocale] = useState(c, getProps().defaultLocale)

    return () => 
      <LocaleCtx.Provider value={getLocale()}>
        <div>
          <label htmlFor="lang-selector">Select language: </label>
          <select id="lang-selector" value={getLocale()} onChange={(ev: any) => setLocale(ev.target.value)}>
            <option value="en">en</option>
            <option value="fr">fr</option>
            <option value="de">de</option>
          </select>
          <LocaleText id="salutation"/>
        </div>
      </LocaleCtx.Provider>
  }
})

interface LocaleTextProps {
  id: string
}

const LocaleText = defineComponent<LocaleTextProps>({
  displayName: 'LocaleText',

  validate: Spec.exact({
    id: Spec.string
  }),

  init(c) {
    const getLocale = useContext(c, LocaleCtx)

    return props =>
      <p>
        { translations[getLocale()][props.id] }
      </p>
  }
})

export default <App defaultLocale="en"/>