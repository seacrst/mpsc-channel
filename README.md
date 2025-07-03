# Simple mpsc `channel` function inspired of Rust's std::sync::mpsc
## Multi-producer, single-consumer FIFO queue communication primitives


```ts
const [tx, rx] = channel<number>();

tx.send(1);

tx.send(2);

rx.recv((value) => {
  console.log(value)
});
```