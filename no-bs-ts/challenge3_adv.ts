class EventProcessor {
    handleEvent(eventName: ..., data: ...): void {
    }
  
    addHandler(handler: ...) {
    }
  
    getProcessedEvents(): ...[] {
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
  
  uep.handleEvent("login", {
    user: null,
    name: "jack",
  });
  uep.handleEvent("login", {
    user: "tom",
    name: "tomas",
  });
  uep.handleEvent("logout", {
    user: "tom",
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