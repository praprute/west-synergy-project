const controller = require('../api/controller/controller')

module.exports = function(app) {


    app.post('/addGateway' , controller.addGateway)
    app.post('/addNode' , controller.addNode)

    app.post('/sensor' , controller.updateSensor)

    app.post('/gateway', controller.gateway)
    app.post('/node', controller.Shownode)
    app.post('/history', controller.showHistory)
    app.post('/trackgateway', controller.track)

    //app.post('/')

    //app.post('/sesorRepair', controller.sensorFail )
    // app.post('/addnode' , controller.addnodeClient) 
    // app.post('/upDateSensor' , controller.upDateSensor)
    // app.post('/upDateStatus' , controller.upDateStatus)
    // app.post('/showGateway' , controller.showGateway)
    // app.post('/showAll' , controller.showAll)
    // app.post('/showVisit', controller.showVisit)
    // app.post('/showNode', controller.showNode)
    
}
