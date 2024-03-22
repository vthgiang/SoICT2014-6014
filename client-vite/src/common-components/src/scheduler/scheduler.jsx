import { createRef, useEffect } from 'react'
import '@fullcalendar/react/dist/vdom'
import FullCalendar, { formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import './scheduler.css'

const Scheduler = (props) => {
  const {
    id = 'full-calendar-react',
    height = 'auto',
    className,
    plugins = [dayGridPlugin, timeGridPlugin, interactionPlugin],
    updateSizeEventRegistrations = [],
    ...others
  } = props
  const calendarRef = createRef()
  const updateSize = () => {
    if (calendarRef.current && calendarRef.current.getApi()) {
      let api = calendarRef.current.getApi()
      if (api) {
        api.updateSize()
      }
    }
  }
  useEffect(() => {
    updateSizeEventRegistrations.push({
      selector: `#${id}`,
      eventName: 'onActive'
    })
    updateSizeEventRegistrations.forEach((element) => {
      window.$(element.selector).on(element.eventName, (e) => {
        updateSize()
      })
    })
    window.$('table').addClass('not-sort')
  }, [])
  return (
    <div id={id} className={className}>
      <FullCalendar ref={calendarRef} plugins={plugins} height={height} {...others} />
    </div>
  )
}

export { Scheduler, formatDate }
