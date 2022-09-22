describe('Update User Screen Name', function () {
    context('PUT should update user screen name against generated id', () => {
        this.beforeEach(function () {
            cy.fixture('mv-auth-data').then(function (testdata) {
                this.testdata = testdata;
            })
        })

        //Positive TestCases

        it('should update user screen name successfully', function () {
            cy.request({ method: this.testdata.put, url: this.testdata.updateScreenNameUrl, headers: { "Cookie": this.testdata.btoken }, body: { userScreenName: this.testdata.screenName } }).then(
                (response) => {

                    expect(response.body.data.userScreenName).contains(this.testdata.screenName);

                })
        })

        it('should return success as TRUE in response', function () {
            cy.request({ method: this.testdata.put, url: this.testdata.updateScreenNameUrl, headers: { "Cookie": this.testdata.btoken }, body: { userScreenName: this.testdata.screenName } }).then(
                (response) => {

                    expect(response.body.success).equals(true)

                })
        })

        it('should display data and success keys in response body', function () {
            cy.request({ method: this.testdata.put, url: this.testdata.updateScreenNameUrl, headers: { "Cookie": this.testdata.btoken }, body: { userScreenName: this.testdata.screenName } }).then(
                (response) => {

                    expect(response.body).to.have.keys(this.testdata.userInfoProperties)

                })
        })

        it('should return 200 OK status code', function () {
            cy.request({ method: this.testdata.put, url: this.testdata.updateScreenNameUrl, headers: { "Cookie": this.testdata.btoken }, body: { userScreenName: this.testdata.screenName } }).then(
                (response) => {

                    expect(response.status).to.eq(this.testdata.okStatus)

                })
        })

        //Negative TestCases

        it('should not update status against generated id', function () {
            cy.request({ method: this.testdata.put, url: this.testdata.updateScreenNameUrl, headers: {}, failOnStatusCode: false }).then(
                (response) => {
                    expect(response.body).contain(this.testdata.uAuth)
                })

        })

        it('should display status code 422 when user leaves the userScreenName value empty', function () {
            cy.request({ method: this.testdata.put, url: this.testdata.updateScreenNameUrl, headers: { "Cookie": this.testdata.btoken }, body: { userScreenName: "" }, failOnStatusCode: false }).then(
                (response) => {
                    expect(response.status).to.eq(this.testdata.unprocessableEntityStatus)
                })

        })

        it('should display proper error message i.e. user screen name is required.', function () {
            cy.request({ method: this.testdata.put, url: this.testdata.updateScreenNameUrl, headers: { "Cookie": this.testdata.btoken }, failOnStatusCode: false }).then(
                (response) => {
                    expect(response.body.error.message).contains(this.testdata.screenNameReqErrorMsg)
                })

        })

        it('should display 422 inside code value when user leaves the userScreenName field empty', function () {
            cy.request({ method: this.testdata.put, url: this.testdata.updateScreenNameUrl, headers: { "Cookie": this.testdata.btoken }, failOnStatusCode: false }).then(
                (response) => {
                    expect(response.body.error.code).equals(this.testdata.unprocessableEntityStatus)
                })

        })
    })
});