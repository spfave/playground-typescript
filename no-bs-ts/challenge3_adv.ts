interface ProcessedEvent<T> {
  eventName: keyof T;
  data: T[keyof T];
}

type FilterFunction<T> = (val: T[keyof T]) => boolean;
// type Filters<T> = Record<keyof T, FilterFunction<T>[]>;

type MapFunction<T> = (val: T[keyof T]) => T[keyof T];
// type Maps<T> = Record<keyof T, MapFunction<T>[]>;

type Handler<T> = {
  [Property in keyof T as `filter${Capitalize<string & Property>}`]?: (
    val: T[Property]
  ) => boolean;
} & {
  [Property in keyof T as `map${Capitalize<string & Property>}`]?: (
    val: T[Property]
  ) => T[Property];
};

const capitalize = (s: string) => `${s.charAt(0).toUpperCase()}${s.slice(1)}`;

class EventProcessor<EvtMap> {
  //   private filters: Filters<EvtMap> = {} as Filters<EvtMap>;
  //   private maps: Maps<EvtMap> = {} as Maps<EvtMap>;
  private handlers: Handler<EvtMap>[] = [];
  private processedEvents: ProcessedEvent<EvtMap>[] = [];

  handleEvent<EvtKey extends keyof EvtMap>(
    eventName: EvtKey,
    data: EvtMap[EvtKey]
  ): void {
    let validEvent = true;
    for (const handler of this.handlers) {
      const filterFunc = handler[
        `filter${capitalize(eventName as string)}` as keyof Handler<EvtMap>
      ] as unknown as ((val: EvtMap[EvtKey]) => boolean) | undefined;

      if (filterFunc && !filterFunc(data)) {
        validEvent = false;
        break;
      }
    }

    if (!validEvent) return;

    let mappedData = { ...data };
    for (const handler of this.handlers) {
      const mapFunc = handler[
        `map${capitalize(eventName as string)}` as keyof Handler<EvtMap>
      ] as unknown as ((val: EvtMap[EvtKey]) => EvtMap[EvtKey]) | undefined;

      if (mapFunc) {
        mappedData = mapFunc(mappedData);
      }
    }

    this.processedEvents.push({ eventName, data: mappedData });
  }

  addHandler(handler: Handler<EvtMap>): void {
    this.handlers.push(handler);
  }

  getProcessedEvents(): ProcessedEvent<EvtMap>[] {
    return this.processedEvents;
  }
}

interface EventMap {
  login: { user?: string; name?: string; hasSession?: boolean };
  logout: { user?: string };
}

class UserEventProcessor extends EventProcessor<EventMap> {}

const uep = new UserEventProcessor();
uep.addHandler({
  filterLogin: ({ user }) => Boolean(user),
  mapLogin: (data) => ({
    ...data,
    hasSession: Boolean(data.user && data.name),
  }),
});

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
