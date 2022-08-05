import * as Spec from 'js-spec/validators'
import { demo } from './utils'
import { component, context, h, Component, Ctrl } from '../modules/core/main/index'
import { asRef } from '../modules/util/main/index'
import { useContext, useEffect, useInterval, useProps, useState, useTime, useValue } from '../modules/hooks/main/index'

export default {
  title: 'Hooks demos'
}

// === ClockDemo =====================================================

const ClockDemo = component({
  name: 'ClockDemo',
  memoize: true,

  init(c) {
    const time = useTime(c, 1000, () => new Date().toLocaleTimeString())

    return () => (
      <div>
        Current time: {time.value}
      </div>
    )
  }
})

// === MouseDemo =====================================================

const MouseDemo = component({
  name: 'MouseDemo',

  init(c) {
    const mousePos = useMousePosition(c)

    return () => {
      return mousePos.x === -1
        ? <div>Please move mouse ...</div>
        : <div>
            Current mouse position: {mousePos.x}x{mousePos.y}
          </div>
    }
  }
})

function useMousePosition(c: Ctrl) {
  const
    [mousePos, setMousePos] = useState(c, { x: -1, y: -1 }),
    listener = (ev: any) => setMousePos({ x: ev.pageX, y: ev.pageY })

  useEffect(c, () => {
    window.addEventListener('mousemove', listener)
    
    return () => window.removeEventListener('mousemove', listener)
  }, null)
  
  return mousePos 
}

// === I18N demo =====================================================

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

const [LocaleCtx, LocaleProvider] = context<string>({
  name: 'LocaleCtx',
  default: 'en',
  validate: Spec.string
})

type AppProps = {
  defaultLocale?: string
}

const I18nDemo: Component<AppProps> = component({
  name: 'I18nDemo',

  validate: (
    Spec.checkProps({
      optional: {
        defaultLocale: Spec.oneOf('en', 'fr', 'de')
      }
    })
  ),

  init(c) {
    const
      props = useProps(c, {
        defaultLocale: 'en'
      }),

      [state, setState] = useState(c, { locale: props.defaultLocale }),
      onChange = (ev: any) => setState({ locale: ev.target.value })

    return () =>
      <LocaleProvider value={state.locale}>
        <div>
          <label htmlFor="lang-selector">Select language: </label>
          <select id="lang-selector" value={state.locale} onChange={onChange}>
            <option value="en">en</option>
            <option value="fr">fr</option>
            <option value="de">de</option>
          </select>
          <LocaleText id="salutation"/>
        </div>
      </LocaleProvider>
  }
})

type LocaleTextProps = {
  id: string
}

const LocaleText: Component<LocaleTextProps> = component({
  name: 'LocaleText',
  
  validate: Spec.checkProps({
    required: {
      id: Spec.string
    }
  }),

  init(c) {
    const
      props = useProps(c),
      locale = useContext(c, LocaleCtx)

    return () =>
      <p>
        { translations[locale.value][props.id] }
      </p>
  }
})

// === IntervalDemo ==================================================

const IntervalDemo = component({
  name: 'IntervalDemo',

  init(c) {
    const
      [count, setCount] = useValue(c, 0),
      [delay, setDelay] = useValue(c, 1000),
      onReset = () => setDelay(1000)

    useInterval(c, () => {
      setCount(it => it + 1)
    }, asRef(() => delay.value))

    useInterval(c, () => {
      if (delay.value > 10) {
        setDelay(i => i / 2)
      }
    }, 1000)

    return () => 
      <div>
        <h1>Counter: {count.value}</h1>
        <h4>Delay: {delay.value}</h4>
        <button onClick={onReset}>
          Reset delay
        </button>
      </div>
  }
})

// --- exports -------------------------------------------------------

export const clock = demo(<ClockDemo/>)
export const mouse = demo(<MouseDemo/>)
export const internationalization = demo(<I18nDemo/>)
export const interval = demo(<IntervalDemo/>)
