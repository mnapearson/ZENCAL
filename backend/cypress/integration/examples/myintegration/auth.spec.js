describe("Authentication", () => {
  beforeEach(() => {
    cy.exec("yarn knex seed:run");
  });

  it("should create a new user on signup and return a JWT token", () => {
    cy.request("POST", "http://localhost:3000/signup", {
      email: "light1234@gmail.com",
      password: "123456",
    }).should((response) => {
      expect(response.body).to.have.property("jwt").and.be.a("string");
      expect(response.body).to.have.property("user");
      expect(response.body.user)
        .to.have.property("email")
        .and.be.eq("light1234@gmail.com");
      expect(response.body.user).to.have.property("id").and.be.a("number");
    });
  });

  it("should return an error if the email is not valid", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:3000/signup",
      body: {
        email: "test",
        password: "123456",
      },
      failOnStatus: false,
    }).should((response) => {
      expect(response.status).to.be.eq(400);
      expect(response.body)
        .to.have.property("error")
        .and.be.eq("Missing email/password");
    });
  });

  it("should return user and jwt on signin", () => {
    cy.request("POST", "http://localhost:3000/signin", {
      email: "mnapearson@gmail.com",
      password: "123456",
    }).should((response) => {
      expect(response.body).to.have.property("jwt").and.be.a("string");
      expect(response.body).to.have.property("user");
      expect(response.body.user)
        .to.have.property("email")
        .and.be.eq("mnapearson@gmail.com");
      expect(response.body.user).to.have.property("id").and.be.eq(2);
    });
  });

  it("should return an error when the user doesn't exit", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:3000/signin",
      body: {
        email: "asdf@codecampleipzig.de",
        password: "123456",
      },
      failOnStatus: false,
    }).should((response) => {
      expect(response.status).to.be.eq(401);
      expect(response.body)
        .to.have.property("error")
        .and.be.eq("Invalid Credentials");
    });
  });

  it("should return an error when the password is incorrect", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:3000/signin",
      body: {
        email: "mnapearson@gmail.com",
        password: "1234567",
      },
      failOnStatus: false,
    }).should((response) => {
      expect(response.status).to.be.eq(401);
      expect(response.body)
        .to.have.property("error")
        .and.be.eq("Invalid Credentials");
    });
  });
});
