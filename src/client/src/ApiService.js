export async function getStuff(accessToken) {
  let response = await fetch(`http://localhost:9000/data`);
  let data = await response.json();
  console.log(data);
  return data;
}