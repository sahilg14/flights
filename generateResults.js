const API_URL =
  "https://gist.githubusercontent.com/bgdavidx/132a9e3b9c70897bc07cfa5ca25747be/raw/8dbbe1db38087fad4a8c8ade48e741d6fad8c872/gistfile1.txt";

const filterByMinAndMaxTime = (minTime, maxTime, flightData) => {
  return flightData.filter(
    (flight) => flight.departureTime > minTime && flight.arrivalTime < maxTime
  );
};

const filterByMaxDuration = (maxDuration, flightData) => {
  return flightData.filter((flight) => {
    const diff =
      (new Date(flight.arrivalTime).getTime() -
        new Date(flight.departureTime).getTime()) /
      1000;
    const diffInHours = diff / 3600;
    console.log({ diffInHours, maxDuration });
    return diffInHours <= maxDuration;
  });
};

const generateResults = async ({ carrier }) => {
  console.log(carrier);

  let minTime = "2017-06-01T19:21:17.719Z";
  let maxTime = "2017-06-01T23:21:17.719Z";
  let maxDuration = "1";

  try {
    const response = await fetch(API_URL);
    let flightData = await response.json();

    flightData = filterByMinAndMaxTime(minTime, maxTime, flightData);
    flightData = filterByMaxDuration(maxDuration, flightData);

    flightData = flightData
      .map((p) => {
        var departureTime = new Date(p.departureTime);
        var arrivalTime = new Date(p.arrivalTime);
        var seconds = (arrivalTime.getTime() - departureTime.getTime()) / 1000;

        var flightDurationInHours = seconds / 3600;

        const carrierPreferenceScore = p.carrier === carrier ? 0.9 : 1;
        const distanceBetweenAirports = 2000;

        const score =
          flightDurationInHours * carrierPreferenceScore +
          distanceBetweenAirports;
        p.score = score;
        return p;
      })
      .sort((a, b) => a.score - b.score);

    return flightData;
  } catch (error) {
    console.log(error);
  }
};

export default generateResults;
