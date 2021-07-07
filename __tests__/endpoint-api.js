const app = require("../app");
const request = require("supertest");
const faker = require("faker");
const getCoordinates = require("../dataSources/middlePoint");
const mongoose = require("mongoose");

test("give the coordinates of middle point", async () => {
  expect(await getCoordinates("Hamburg", "Berlin")).toStrictEqual({
    latitude: 54.05888,
    longitude: 13.530765,
  });
});
beforeAll((done) => {
  server = app.listen(8080, () => {
    global.agent = request.agent(server);
    done();
  });
});

afterAll(async () => {
  await server.close();
  await mongoose.disconnect();
});
