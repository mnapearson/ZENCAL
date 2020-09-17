describe("Events API", () => {
  let jwt = null;
  let user = null;
  beforeEach(() => {
    cy.exec("yarn knex seed:run");
    cy.request("POST", "http://localhost:3000/signin", {
      email: "mnapearson@gmail.com",
      password: "123456",
    }).then((res) => {
      jwt = res.body.jwt;
      user = res.body.user;
      expect(jwt).to.exist; // eslint-disable-line
    });
  });

  it("should return events when logged in", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:3000/events",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }).should((res) => {
      expect(res.body[0]).to.have.keys(
        "id",
        "name",
        "date",
        "location",
        "description",
        "attending"
      );
    });
  });

  it("should return an error if jwt is missing", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:3000/events",
      failOnStatusCode: false,
    }).should((res) => {
      expect(res.status).to.eq(401);
      expect(res.body)
        .to.have.property("error")
        .and.be.eq("Please Login/Signup");
    });
  });

  it("should return an error if trying to create an event and jwt is missing", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:3000/events",
      body: {
        name: "Test Event",
        date: "20/09/20",
        location: "Basislager",
        description: "A test",
        attending: true,
      },
      failOnStatusCode: false,
    }).should((res) => {
      expect(res.status).to.eq(401);
      expect(res.body)
        .to.have.property("error")
        .and.be.eq("Please Login/Signup");
    });
  });

  it("should create a new event", () => {
    const testEvent = {
      name: "Test Event",
      date: "20/20/08",
      location: "Basislager",
      description: "A test",
      attending: "true",
    };
    cy.request({
      method: "POST",
      url: "http://localhost:3000/events",
      body: testEvent,
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }).should((res) => {
      expect(res.body).to.have.keys(
        "id",
        "name",
        "date",
        "location",
        "description",
        "attending"
      );
      expect(res.body).property("name").to.eq(testEvent.name);
      expect(res.body).property("date").to.eq(testEvent.date);
      expect(res.body).property("location").to.eq(testEvent.location);
      expect(res.body).property("description").to.eq(testEvent.description);
      expect(res.body).property("attending").to.eq(testEvent.attending);
    });
  });
});
