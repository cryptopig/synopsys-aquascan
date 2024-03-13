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

  let after = searchParams.get('after'); // Length of each unit received previously, so that we do not have to send redundant data
  // ex: after = [1, 2, 2];
  if (after) {
    // After: saves bandwidth and resources by not sending previously received data and only sending new data
    after = JSON.parse(after); // Parsing the after search query (should be JSON array of integers)
    let out = {}; // Here is the queried data
    for (const [k, v] of Object.entries(data)) { // For each units
      let a = after[k]; // Get the after data for current 
      if (a) {
        // If the length of the previously recieved array is greater than the length of the current array, some data has been added
        if (a > v.data.length) {
          // Create object (unit class)
          out[k] = {name: v.name, data: []};
          // Filter data for all the data that is new to the client
          for (let i = a; i < v.data.length; i++) {
            out[k].data.push(v.data[i]);
          }
        }
      } else {
        // If there is no previously received length, then it is all new data
        out[k] = v;
      }
    }

    // Stringify and return
    return Response.json(out);
  } else {
    // If there is no after parameter, we will return the entire data that we have stored
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

    // simulate safe fluctuation v3
  function random(a, b) {return (Math.random() * (a - b) + b).toFixed(4)}for (let i = 0; i < 100; i++) {fetch('/api', {method: 'Post', body: JSON.stringify([0, (() => {let c = new Date(); c.setTime(c.getTime() - 1000 * (100 - i)); return c.getTime();})(), random(6.5, 8.5), random(0, 5), random(0, 500)])})}
  */
}