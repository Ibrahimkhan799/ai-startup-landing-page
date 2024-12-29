export async function getColors() : Promise<Record<string,string>> {
  let headersList = {
    Accept: "*/*",
  };

  let response = await fetch("/api/update-colors", {
    method: "GET",
    headers: headersList,
  });

  let data = await response.json();
  return data;
}