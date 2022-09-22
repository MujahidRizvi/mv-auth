describe('Automation Test Suite - Fixtures', function () {
  context('GET /Get User Info.', () => {
    this.beforeEach(function () {
      cy.fixture('mv-auth-data').then(function (testdata) {
        this.testdata = testdata;
      })
    })

    //Positive TestCases

    it('user inputs valid parameters', function () {
      cy.request({ method: this.testdata.post, url: this.testdata.signupUrl, body: { providerKey: this.testdata.pKey, providerType: this.testdata.pType }, failOnStatusCode: false }).then(
        (response) => {
          expect(response.status).to.eq(this.testdata.okStatus)
        })
    })

    it('should display mentioned key values in response when user inputs valid parameters', function () {
      cy.request({ method: this.testdata.post, url: this.testdata.signupUrl, body: { providerKey: this.testdata.pKey, providerType: this.testdata.pType }, failOnStatusCode: false }).then(
        (response) => {
          expect(response.body.data).to.have.keys(this.testdata.signupKeys)
        })
    })
    it('should display 67 against userId when user inputs valid parameters', function () {
      cy.request({ method: this.testdata.post, url: this.testdata.signupUrl, body: { providerKey: this.testdata.pKey, providerType: this.testdata.pType }, failOnStatusCode: false }).then(
        (response) => {
          expect(response.body.data.email).equals(this.testdata.email)
        })
    })

    it('should return 200 OK status code when user inputs valid parameters', function () {
      cy.request({ method: this.testdata.post, url: this.testdata.signupUrl, body: { providerKey: this.testdata.pKey, providerType: this.testdata.pType }, failOnStatusCode: false }).then(
        (response) => {
          expect(response.status).to.eq(this.testdata.okStatus)
        })
    })

    it('should have userId property in response when user inputs valid parameters', function () {
      cy.request({ method: this.testdata.post, url: this.testdata.signupUrl, body: { providerKey: this.testdata.pKey, providerType: this.testdata.pType }, failOnStatusCode: false }).then(
        (response) => {
          expect(response.body.data).to.have.property(this.testdata.signupKeys[0])
        })
    })

    //Negative TestCases

    it('user only inputs the providerKey and misses providerType param', function () {
      cy.request({ method: this.testdata.post, url: this.testdata.signupUrl, body: { providerKey: this.testdata.pKey }, failOnStatusCode: false }).then(
        (response) => {
          expect(response.status).to.eq(this.testdata.unprocessableEntityStatus)
        })
    })

    it('should return 400 status code user inputs the valid providerKey and invalid providerType param', function () {
      cy.request({ method: this.testdata.post, url: this.testdata.signupUrl, body: { providerKey: this.testdata.pKey, providerType: this.testdata.invalidpType }, failOnStatusCode: false }).then(
        (response) => {
          expect(response.status).to.eq(this.testdata.badRequestStatus)
        })
    })

    it('should display message param in response body when user inputs the valid providerKey and invalid providerType param', function () {
      cy.request({ method: this.testdata.post, url: this.testdata.signupUrl, body: { providerKey: this.testdata.pKey, providerType: this.testdata.invalidpType }, failOnStatusCode: false }).then(
        (response) => {
          expect(response.body.error).to.have.property(this.testdata.msg)
        })
    })

    it('should display invalid provider type message when user inputs the valid providerKey and invalid providerType param', function () {
      cy.request({ method: this.testdata.post, url: this.testdata.signupUrl, body: { providerKey: this.testdata.pKey, providerType: this.testdata.invalidpType }, failOnStatusCode: false }).then(
        (response) => {
          expect(response.body.error.message).contains(this.testdata.invalidProviderErrorMsg)
        })
    })

    it('should return 422 status code when user inputs the valid providerType and leaves the providerKey param EMPTY', function () {
      cy.request({ method: this.testdata.post, url: this.testdata.signupUrl, body: { providerKey: this.testdata.pKey, providerType: "" }, failOnStatusCode: false }).then(
        (response) => {
          expect(response.status).to.eq(this.testdata.unprocessableEntityStatus)
        })
    })

    it('should display success as false when user inputs the valid providerType and leaves the providerKey param EMPTY', function () {
      cy.request({ method: this.testdata.post, url: this.testdata.signupUrl, body: { providerKey: this.testdata.pKey, providerType: "" }, failOnStatusCode: false }).then(
        (response) => {
          expect(response.body.success).to.eq(false)
        })
    })

  })
})