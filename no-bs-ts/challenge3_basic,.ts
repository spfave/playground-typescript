class EventProcessor {
    handleEvent(eventName: ..., data: ...): void {
        ...
    }
  
    addFilter(
      eventName: ...,
      filter: (data: ...) => boolean
    ): void {
        ...
    }
  
    addMap(eventName: ..., map: (data: ...) => ...): void {
        ...
    }
  
    getProcessedEvents() {
        ...
    }
  }
  
  interface UserEventMap {
    login: { user?: string; name?: string; hasSession?: boolean };
    logout: { user?: string };
  }
  
  class UserEventProcessor extends EventProcessor<UserEventMap> {}
  const uep = new UserEventProcessor();
  
  uep.addFilter("login", ({ user }) => Boolean(user));
  uep.addMap("login", (data) => ({
    ...data,
    hasSession: Boolean(data.user && data.name),
  }));
  
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