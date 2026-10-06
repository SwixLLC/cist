import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, CalendarDays, Clock, Pin, PinOff } from 'lucide-react';
import { getEvents, saveEvent, deleteEvent } from '../../lib/cmsData';
import {
  useToast, useSaveToast, useConfirm, Sheet, Field, EmptyState, SkeletonList,
  eventDateToIso, isoToEventDate,
} from './ui';

const blankEvent = () => ({ title: '', date: '', time: 'All day' });

export default function EventsSection() {
  const toast = useToast();
  const saveToast = useSaveToast();
  const confirm = useConfirm();
  const [items, setItems] = useState(null);
  const [editing, setEditing] = useState(null);

  const load = async () => setItems(await getEvents());

  useEffect(() => {
    load();
  }, []);

  // Only one event can be pinned: pinning one unpins the others
  const togglePin = async (evt) => {
    const pinning = !evt.pinned;
    const others = items.filter((e) => e.id !== evt.id && e.pinned);
    const results = await Promise.all([
      ...others.map((e) => saveEvent({ ...e, pinned: false })),
      saveEvent({ ...evt, pinned: pinning }),
    ]);
    await load();
    if (results.some((r) => r && r.savedInSupabase === false)) {
      toast('Saved on this device only', {
        tone: 'warn',
        detail: 'The website database needs the "pinned" column. Run the latest supabase/setup.sql, then try again.',
      });
    } else {
      toast(pinning ? `“${evt.title}” is now at the top` : 'Event unpinned');
    }
  };

  const remove = async (evt) => {
    const ok = await confirm({
      title: 'Delete this event?',
      message: `“${evt.title}” will be removed from the Upcoming events list.`,
    });
    if (!ok) return;
    await deleteEvent(evt.id);
    setItems((list) => list.filter((e) => e.id !== evt.id));
    toast('Event deleted');
  };

  return (
    <>
      <header className="adm-head">
        <div>
          <h1>Events</h1>
          <p>Dates shown in the Upcoming events list next to the school news. Pin an event to show it first.</p>
        </div>
        <div className="adm-head__actions">
          <button type="button" className="adm-btn adm-btn--primary" onClick={() => setEditing(blankEvent())}>
            <Plus size={17} /> New event
          </button>
        </div>
      </header>

      {items === null ? (
        <SkeletonList count={3} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No upcoming events"
          action={(
            <button type="button" className="adm-btn adm-btn--primary" onClick={() => setEditing(blankEvent())}>
              <Plus size={17} /> Add an event
            </button>
          )}
        >
          Add trips, ceremonies, open days and holidays so families can plan ahead.
        </EmptyState>
      ) : (
        <div className="adm-list">
          {items.map((evt) => {
            const [mon, day] = (evt.date || '').split(' ');
            return (
              <div className="adm-row" key={evt.id}>
                <div className="adm-date" aria-hidden="true">
                  <b>{mon}</b>
                  <span>{day}</span>
                </div>
                <div className="adm-row__body">
                  <h3 className="adm-row__title">{evt.title}</h3>
                  <div className="adm-row__meta">
                    {evt.pinned && <span className="adm-tag"><Pin size={11} aria-hidden="true" style={{ marginRight: 4, verticalAlign: '-1px' }} />Pinned to top</span>}
                    <span className="adm-sr">{evt.date},</span>
                    <Clock size={13} aria-hidden="true" />
                    <span>{!evt.time || /^all day$/i.test(evt.time) ? 'All day' : evt.time}</span>
                  </div>
                </div>
                <div className="adm-row__actions">
                  <button
                    type="button"
                    className={`adm-icon-btn${evt.pinned ? ' adm-icon-btn--on' : ''}`}
                    onClick={() => togglePin(evt)}
                    aria-pressed={!!evt.pinned}
                    aria-label={evt.pinned ? `Unpin “${evt.title}”` : `Pin “${evt.title}” to the top`}
                    title={evt.pinned ? 'Unpin' : 'Pin to top'}
                  >
                    {evt.pinned ? <PinOff size={17} /> : <Pin size={17} />}
                  </button>
                  <button type="button" className="adm-icon-btn" onClick={() => setEditing(evt)} aria-label={`Edit “${evt.title}”`} title="Edit">
                    <Pencil size={17} />
                  </button>
                  <button type="button" className="adm-icon-btn adm-icon-btn--danger" onClick={() => remove(evt)} aria-label={`Delete “${evt.title}”`} title="Delete">
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editing && (
        <EventEditor
          event={editing}
          onClose={() => setEditing(null)}
          onSaved={async (result) => {
            saveToast(result, 'Event');
            setEditing(null);
            await load();
          }}
        />
      )}
    </>
  );
}

function EventEditor({ event, onClose, onSaved }) {
  const [title, setTitle] = useState(event.title || '');
  const [dateIso, setDateIso] = useState(eventDateToIso(event.date));
  const [allDay, setAllDay] = useState(!event.time || /^all day$/i.test(event.time));
  const [time, setTime] = useState(allDay ? '' : event.time);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setSaving(true);
    const result = await saveEvent({
      ...event,
      title: title.trim(),
      date: isoToEventDate(dateIso),
      time: allDay ? 'All Day' : (time.trim() || 'All Day'),
    });
    setSaving(false);
    onSaved(result);
  };

  return (
    <Sheet
      title={event.id ? 'Edit event' : 'New event'}
      onClose={onClose}
      onSubmit={submit}
      saving={saving}
      submitLabel={event.id ? 'Save changes' : 'Add event'}
    >
      <Field label="Event name" htmlFor="e-title">
        <input id="e-title" className="adm-input" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Graduation ceremony" data-autofocus />
      </Field>

      <Field label="Date" htmlFor="e-date">
        <input id="e-date" type="date" className="adm-input" required value={dateIso} onChange={(e) => setDateIso(e.target.value)} />
      </Field>

      <div className="adm-field">
        <span className="adm-label">Time</span>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14.5, cursor: 'pointer' }}>
          <input type="checkbox" checked={allDay} onChange={(e) => setAllDay(e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--red)' }} />
          All day
        </label>
        {!allDay && (
          <input
            className="adm-input"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="e.g. 10:00 AM – 2:00 PM"
            aria-label="Time"
          />
        )}
      </div>
    </Sheet>
  );
}
