interface ProcessedEvent<T> {
  eventName: keyof T;
  data: T[keyof T];
}

type FilterFunction<T> = (val: T[keyof T]) => boolean;
type Filters<T> = Record<keyof T, FilterFunction<T>[]>;

type MapFunction<T> = (val: T[keyof T]) => T[keyof T];
type Maps<T> = Record<keyof T, MapFunction<T>[]>;

class EventProcessor<EvtMap extends {}> {
  private filters: Filters<EvtMap> = {} as Filters<EvtMap>;
  private maps: Maps<EvtMap> = {} as Maps<EvtMap>;
  private processedEvents: ProcessedEvent<EvtMap>[] = [];

  handleEvent<EvtKey extends keyof EvtMap>(
    eventName: EvtKey,
    data: EvtMap[EvtKey]
  ): void {
    let validEvent = true;
    for (const filter of this.filters[eventName] ?? []) {
      if (!filter(data)) {
        validEvent = false;
        break;
      }
    }

    if (!validEvent) return;

    let mappedData = { ...data };
    for (const map of this.maps[eventName] ?? []) {
      mappedData = map(mappedData) as EvtMap[EvtKey];
    }
    this.processedEvents.push({ eventName, data: mappedData });
  }

  addFilter<EvtKey extends keyof EvtMap>(
    eventName: EvtKey,
    filter: (data: EvtMap[EvtKey]) => boolean
  ): void {
    this.filters[eventName] ??= [];
    this.filters[eventName].push(filter as FilterFunction<EvtMap>);
  }

  addMap<EvtKey extends keyof EvtMap>(
    eventName: EvtKey,
    map: (data: EvtMap[EvtKey]) => EvtMap[EvtKey]
  ): void {
    this.maps[eventName] ??= [];
    this.maps[eventName].push(map as unknown as MapFunction<EvtMap>);
  }

  getProcessedEvents() {
    return this.processedEvents;
  }
}

interface UserEventMap {
  login: { user?: string; name?: string; hasSession?: boolean };
  logout: { user?: string };
}

class UserEventProcessor extends EventProcessor<UserEventMap> {}
const uep = new UserEventProcessor();

uep.addFilter('login', ({ user }) => Boolean(user));
uep.addMap('login', (data) => ({
  ...data,
  hasSession: Boolean(data.user && data.name),
}));

uep.handleEvent('login', {
  user: undefined,
  name: 'jack',
});
uep.handleEvent('login', {
  user: 'tom',
  name: 'tomas',
});
uep.handleEvent('logout', {
  user: 'tom',
});

console.log(uep.getProcessedEvents());
/*
  Result:
  [
    {
      eventName: 'login',
      data: { user: 'tom', name: 'tomas', hasSession: true }
    },
    { eventName: 'logout', data: { user: 'tom' } }
  ]
  */
