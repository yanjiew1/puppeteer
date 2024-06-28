async function* foo() {
  yield await Promise.resolve(1);
  await new Promise(res => setTimeout(res, 100));
  yield await Promise.resolve(2);
  await new Promise(res => setTimeout(res, 1000));
  yield await Promise.resolve(3);
}

let value = 0;

process.addListener('unhandledRejection', () => {});

async function generate() {
  const generator = foo();
  setTimeout(async () => {
    console.log('canceling');
    await generator.throw(-1);
    console.log('cancelled');
  }, 150);

  let data;
  while ((data = await generator.next())) {
    if (!data.value && data.done) {
      break;
    }

    value = value + data.value;
    console.log(data.value);
  }
}

await generate();
// Expected output: "abc"

console.log('value:', value);
