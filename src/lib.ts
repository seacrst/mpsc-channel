type Self<S> = (self: S) => void;

class Channel<T> {
  values: Array<T> = [];
  receiver!: (value: T) => void;

  constructor(impl: Self<Channel<T>>) {
    impl(this);
  }
}

class Receiver<T> {
  channel!: Channel<T>;

  constructor(impl: Self<Receiver<T>>) {
    impl(this);
  }

  recv(receiver: (value: T) => void): T | undefined {
    const value = this.channel.values.pop();
    
    if (value) {
      this.channel.receiver = receiver;
      this.channel.receiver(value!);
    }
    
    return value;
  }
}

class Sender<T> {
  channel!: Channel<T>;

  constructor(impl: Self<Sender<T>>) {
    impl(this);
  }

  send(value: T) {
    this.channel.values.unshift(value);
    
    if (typeof this.channel.receiver === "function" && this.channel.values.length) {
      this.channel.receiver(this.channel.values.pop()!);
    }
  }
}

export function channel<T>(): [Sender<T>, Receiver<T>] {
  const chan = new Channel<T>(self => {
    self.values = [];
  });

  const sender = new Sender<T>(self => {
    self.channel = chan;
  });

  const receiver = new Receiver<T>(self => {
    self.channel = chan;
  });

  return [sender, receiver];
}