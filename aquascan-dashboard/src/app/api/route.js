/*
data = {
  [unit] = {
    name = 123,
    data = [
      [],
      ...
    ]
  },
  ...
}
*/
let data = {};

data = {
  [0]: {
    name: 'Sunnyvale',
    data: [
      // [1, 2, 3, 4],
    ]
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  let after = searchParams.get('after'); // length of each unit received previously, so that we do not have to send redundant data
  if (after) {
    after = JSON.parse(after);
    let out = {};
    for (const [k, v] of Object.entries(data)) {
      let a = after[k];
      if (a) {
        if (a > v.data.length) {
          out[k] = {name: v.name, data: []};
          for (let i = a; i < v.data.length; i++) {
            out[k].data.push(v.data[i]);
          }
        }
      } else {
        out[k] = v;
      }
    }

    return Response.json(out);
  } else {
    return Response.json(data);
  }

  // return Response.json(data);

  // const { searchParams } = new URL(request.url);
  // const id = searchParams.get('id');
  // const res = await fetch(`https://data.mongodb-api.com/product/${id}`, {
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'API-Key': process.env.DATA_API_KEY,
  //   },
  // })
  // const product = await res.json()
 
  // return Response.json({ product })
}


export async function POST(req) {
  /*
  data format:

  IT IS AN ARRAY
  [
    unit: unit id here,
    time: unix timestamp here,
    acidity: 123,
    turbidity: 123,
    totaldissolvedsolids: 123,
  ]

  - encode in JSON

  */
  let d = await req.json();
  if (!data[d[0]]) {
    data[d[0]] = {
      name: 'TODO testing',
      data: []
    };
  }

  data[d[0]].data.push([d[1], d[2], d[3], d[4]]);

  return Response.json(true);

  /*
  // testing

  fetch('/api', {method: 'Post', body: JSON.stringify([0, Date.now(), 2, 3, 4])})
  await (await fetch('/api')).json()

  for (let i = 0; i < 100; i++) {fetch('/api', {method: 'Post', body: JSON.stringify([0, Date.now(), 9, 6, 600])})}

  // test cases
  // unsafe
  for (let i = 0; i < 100; i++) {fetch('/api', {method: 'Post', body: JSON.stringify([0, Date.now(), 7, 0, 600])})}

  // simulate safe fluctuation
  function random(a, b) {return (Math.random() * (a - b) + b).toFixed(4)}for (let i = 0; i < 100; i++) {fetch('/api', {method: 'Post', body: JSON.stringify([0, Date.now(), random(6.5, 8.5), random(0, 5), random(0, 500)])})}


  function random(a, b) {return (Math.random() * (a - b) + b).toFixed(4)}for (let i = 0; i < 100; i++) {fetch('/api', {method: 'Post', body: JSON.stringify([0, Date.now(), random(6.5, 8.5), random(0, 5), random(0, 100)])})}


  // simulate safe fluctuation v2
  function random(a, b) {return (Math.random() * (a - b) + b).toFixed(4)}for (let i = 0; i < 100; i++) {fetch('/api', {method: 'Post', body: JSON.stringify([0, (() => {let c = new Date(); c.setDate(c.getDate() - (100 - i)); return c.getTime();})(), random(6.5, 8.5), random(0, 5), random(0, 500)])})}

  // date gen
  (() => {let c = new Date(); c.setDate(c.getDate() - (100 - i)); return c.getTime();})()
  */
}