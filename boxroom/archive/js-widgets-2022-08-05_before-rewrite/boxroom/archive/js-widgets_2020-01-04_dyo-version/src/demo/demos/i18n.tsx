import { h, component, context, useContext, useState, Component } from '../../modules/root/main/index'
import * as Spec from 'js-spec/validators'

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

const LocaleCtx = context<string>({
  displayName: 'LocaleCtx',
  validate: Spec.string,
  defaultValue: 'en',
})

type AppProps = {
  defaultLocale?: string
}

const App: Component<AppProps> = component({
  displayName: 'App',

  validate: (
    Spec.checkProps({
      optional: {
        defaultLocale: Spec.oneOf('en', 'fr', 'de')
      }
    })
  ),

  defaultProps: {
    defaultLocale: 'en'
  },

  main(c, props) {
    const
      [state, setState] = useState(c, { locale: props.defaultLocale }),
      onChange = (ev: any) => setState({ locale: ev.target.value })

    return () =>
      <LocaleCtx.Provider value={state.locale}>
        <div>
          <label htmlFor="lang-selector">Select language: </label>
          <select id="lang-selector" value={state.locale} onChange={onChange}>
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

const LocaleText: Component<LocaleTextProps> = component({
  displayName: 'LocaleText',

  validate: Spec.checkProps({
    required: {
      id: Spec.string
    }
  }),

  main(c) {
    const locale = useContext(c, LocaleCtx)

    return props =>
      <p>
        { translations[locale.value][props.id] }
      </p>
  }
})

export default <App defaultLocale="en"/>