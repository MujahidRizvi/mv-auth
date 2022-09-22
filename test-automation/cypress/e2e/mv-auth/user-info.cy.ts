describe('Get User Info. api', function () {
    context('GET /Get User Info.', () => {
        this.beforeEach(function () {
            cy.fixture('mv-auth-data').then(function (testdata) {
                this.testdata = testdata;
            })
        })

        //Positive TestCases

        it('should return 200 OK status when user inputs valid parameters', function () {
            cy.request({ method: this.testdata.get, url: this.testdata.userInfoUrl, headers: { "Cookie": this.testdata.btoken }, failOnStatusCode: false }).then(
                (response) => {
                    expect(response.status).to.eq(this.testdata.okStatus)
                })
        })

        it('should have data and success keys in response body when user inputs valid parameters', function () {
            cy.request({ method: this.testdata.get, url: this.testdata.userInfoUrl, headers: { "Cookie": this.testdata.btoken }, failOnStatusCode: false }).then(
                (response) => {
                    expect(response.body).to.have.keys(this.testdata.userInfoProperties)
                })
        })

        it('should have mentioned keys within data when user inputs valid parameters', function () {
            cy.request({ method: this.testdata.get, url: this.testdata.userInfoUrl, headers: { "Cookie": this.testdata.btoken }, failOnStatusCode: false }).then(
                (response) => {
                    expect(response.body.data).to.have.keys(this.testdata.userInfoKeys)
                })
        })

        it('should display success as TRUE when user inputs valid parameters', function () {
            cy.request({ method: this.testdata.get, url: this.testdata.userInfoUrl, headers: { "Cookie": this.testdata.btoken }, failOnStatusCode: false }).then(
                (response) => {
                    expect(response.body.success).equals(true)
                })
        })

        it('should display 1 in id when user inputs valid parameters', function () {
            cy.request({ method: this.testdata.get, url: this.testdata.userInfoUrl, headers: { "Cookie": this.testdata.btoken }, failOnStatusCode: false }).then(
                (response) => {
                    expect(response.body.data.id).equal(this.testdata.id)
                })
        })

        it('userScreenName should display updated name when user inputs valid parameters', function () {
            cy.request({ method: this.testdata.get, url: this.testdata.userInfoUrl, headers: { "Cookie": this.testdata.btoken }, failOnStatusCode: false }).then(
                (response) => {
                    expect(response.body.data.userScreenName).contains(this.testdata.screenName)
                })
        })

        //Negative TestCases

        it('user does not provide token, then 500 code should be returned in response', function () {
            cy.request({ method: this.testdata.get, url: this.testdata.userInfoUrl, headers: {}, failOnStatusCode: false }).then(
                (response) => {
                    expect(response.status).to.eq(this.testdata.internalServerErrorStatus)
                })
        })

        it('user does not provide token, then response body should return success key and error key', function () {
            cy.request({ method: this.testdata.get, url: this.testdata.userInfoUrl, headers: {}, failOnStatusCode: false }).then(
                (response) => {
                    expect(response.body).to.have.keys(this.testdata.userInfoErrorProperties)
                })
        })

        it('user does not provide token, then success value should be false', function () {
            cy.request({ method: this.testdata.get, url: this.testdata.userInfoUrl, headers: {}, failOnStatusCode: false }).then(
                (response) => {
                    expect(response.body.success).equals(false)
                })
        })

        it('user does not provide token, then Not authenticated message should be displayed', function () {
            cy.request({ method: this.testdata.get, url: this.testdata.userInfoUrl, headers: {}, failOnStatusCode: false }).then(
                (response) => {
                    expect(response.body.error.message).contains(this.testdata.notAuthenticatedErrorMsg)
                })
        })

        it('user does not provide token, then success value should be falsecode value should be 500', function () {
            cy.request({ method: this.testdata.get, url: this.testdata.userInfoUrl, headers: {}, failOnStatusCode: false }).then(
                (response) => {
                    expect(response.body.error.code).equals(this.testdata.internalServerErrorStatus)
                })
        })

    });
});

