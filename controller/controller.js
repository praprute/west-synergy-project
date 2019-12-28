

// -------------------ADD NODE---------------------------------------------------//

exports.Shownode = (req, res, next) => {
    req.getConnection((err, connection) => {
        if(err) return next(err)
        var {
            body
        } = req

        var idnode = body.idnode
        
        function nodeShow(){
            var sql = "SELECT node.* ,gateway.gateway_name, node_status.status_name FROM \
            ws_energy.node,ws_energy.node_status,ws_energy.gateway WHERE node.idnode = ? \
            AND node.node_status = node_status.id \
            AND node.idgateway = gateway.id; ";
            connection.query(sql, [idnode], (err, results) => {
                if(err){
                    return next(err)
                }
                res.json({
                    success:"success",
                    message:results
                })
            })
        }
        nodeShow()
    })
}

exports.showHistory = (req, res, next) => {
    req.getConnection((err, connection) => {
        if(err) return next(err)
        var {
            body
        } = req

        var datenow     = body.datenow
        var dateBefore  = body.dateBefore
        var idnode      = body.idnode
        
        function listHistory(){
            var sql = "SELECT history.*,node_status.status_name \
            FROM ws_energy.history,ws_energy.node_status \
            WHERE timestamp BETWEEN ? AND ? AND history.status = node_status.id AND history.idnode = ?;"      
            connection.query(sql, [dateBefore, datenow, idnode], (err, results) => {
                if(err){
                    return next(err)
                }

                res.json({
                    success:"success",
                    message:results
                })
            })
        }
        listHistory()
    })
}

exports.gateway = (req, res, next) => {
    req.getConnection((err, connection) => {
        if(err) return next(err)

        var {
            body
        } = req

        var gateway_name = body.gateway_name
        var id = body.id

        function gate(){
            var sql = "SELECT gateway.* , node.idnode, node.sensor \
            ,ws_energy.node_status.status_name, ws_energy.node.place_node \
            FROM ws_energy.gateway,ws_energy.node, \
            ws_energy.node_status \
            WHERE \
             gateway.id = ? \
            AND node.node_status = ws_energy.node_status.id\
            AND gateway.id = node.idgateway ORDER BY node.idnode;"
            connection.query(sql, [id], (err, results) => {
                if(err){
                    return next(err)
                }

                if(results.length){
                res.json({
                    success:"success",
                    message:results
                })
                }else if(!results.length){
                res.json({
                    success:"null",
                    message:results
                })
                }
            })
        }

        gate()
    })
}

exports.track = (req, res, next) => {
    req.getConnection((err, connection) => {
        if(err) return next(err)

        var {
            body
        } = req

        function tracking(){
            var sql = "SELECT lad, lng , place, id, gateway_name FROM gateway ;"
            connection.query(sql ,[], (err, results) => {
                if(err){
                    return next(err)
                }

                res.json({
                    success:"success",
                    message:results
                })
                console.log(results[0].lad)

            })
        }

        tracking();
    })
}


exports.updateSensor = (req, res, next) => {
    req.getConnection((err, connection) => {
        if(err) return next(err)

        var {
            body
        } = req

        var sensor      = body.sensor
        var idnode      = body.idnode
        var node_name   = body.node_name
        var node_status = body.node_status
        var date = new Date()
        var resultsDate



        if(sensor <= 25){
            node_status = "4";
        }else if(sensor <= 150){
            node_status = "3";
        }else{
            node_status = "2";
        }
        if(sensor < 0){
            sensor = " ";
        }

        function updatesensor(){
            var sql = "UPDATE node SET sensor = ?, node_status = ? WHERE idnode = ?;"
            connection.query(sql , [sensor, node_status , idnode], (err, results) => {
                if(err) {
                    return next(err)
                }else{

                checkTimeNewNode()
                console.log(results)
                }
            })     
        }

        function checkTimeNewNode(){
            var sql = "SELECT timestamp FROM ws_energy.history  \
            WHERE idnode = ? ORDER BY id_node DESC Limit 1;"
            connection.query(sql, [idnode], (err, results) => {
                if(err){
                    return next(err)
                }
                if(results.length <= 0) {
                    addHistory();
                }else{
                    checkTimedata();
                }      

            })
        }

        function checkTimedata() {
            var sql = "SELECT timestamp FROM ws_energy.history WHERE idnode=? \
            ORDER BY id_node DESC Limit 1 ;"
            connection.query(sql, [idnode], (err, results) => {
                if(err){
                    return next(err)
                }else{
                resultsDate = results[0].timestamp;
                date = (date-(7*3600*1000))
                var sum = (((date - resultsDate)/(1000*60))); //(1000*60);
                console.log(date)
                console.log(resultsDate)
                console.log(sum)

                if(sum >=60){
                    updatenewHistory();
                }
                //console.log(sum);
                }
            })
        }

        function addHistory(){
            var sql = "INSERT INTO ws_energy.history (`idnode`,`node_name`, `status`, `sensor`) \
            VALUES ( ?, ?, ?, ?) ;"
            connection.query(sql, [idnode, node_name,node_status, sensor], (err, results) => {
                if(err){
                    return next(err)
                }
                console.log(results);
            })
        }

        function updatenewHistory(){
            var sql = "INSERT INTO ws_energy.history (`idnode`,`node_name`, `status`, `sensor`) \
            VALUES ( ?, ?, ?, ?);"
            connection.query(sql, [idnode,node_name,node_status, sensor], (err, results) => {
                if(err){
                    return next(err)
                }
                console.log(results);
            })
        }

        updatesensor()

        //SELECT timestamp FROM ws_energy.history 
        //WHERE idnode = 9 ORDER BY id_node DESC Limit 1;
        if(node_name == null || sensor == null ){
            res.json({
                success:"false"
            })
        }else{
            res.json({
                success:"success"
            })
        }
       
    })
}


exports.addGateway = (req, res, next) => {
    req.getConnection((err, connection) => {
        if(err) return next(err)

        var {
            body
        } = req

        var gateway_name = body.gateway_name
        var lad = body.lad
        var lng = body.lng
        var place = body.place

        function addGate() {
            var sql = "INSERT INTO gateway (`gateway_name`, `lad`, `lng`, `place`) VALUE ( ?, ?, ?, ?);"
            connection.query(sql, [gateway_name, lad, lng, place], (err, results) => {
                if(err){
                    return next(err)
                }

                res.json({
                    success:"success",
                    data:results
                })

            })
        }
        addGate()
    })
}

exports.addNode = (req, res, next) => {
    req.getConnection((err, connection) => {
        if(err) return next(err)

        var {
            body
        } = req

        var idgateway = body.idgateway
        var status    = body.status
        var sensor    = body.sensor
        var place     = body.place
        //var node_status = body.node_status

        if(sensor >= 90){
            node_status = "4";
        }else if(sensor >= 40){
            node_status = "3";
        }else{
            node_status = "2";
        }


        function addnode(){
            var sql = "INSERT INTO node (`idgateway` ,`status` ,`sensor` , `node_status` ,`place_node`) VALUE ( ?, ?, ?, ?, ?);"
            connection.query(sql, [idgateway,status,sensor,node_status,place], (err, results) => {
                if(err){
                    return next(err)
                }

                res.json({
                    success:"success",
                    data:results
                })
            })
        }
        addnode()
    })
} 

// exports.sensorFail = (req, res, next) => {
//     req.getConnection((err, connection) => {
//         if(err) return next(err)

//         var {
//             body
//         } = req

//         var idgateway = body.idgateway
//         var node_status = body.node_status
//         var place     = body.place
       
//         function fail(){
//             var sql = "UPDATE node SET sensor = ? WHERE idnode = ?"
//         }

//     })
// }


// exports.addnodeClient = (req, res, next) => {
//     req.getConnection((err, connection) => {

//         if (err) return next(err)

//         var {
//             body
//         } = req

// //---------------------------------------------//
//          var  idnode    = body.idnode
//          var  idgateway = body.idgateway
//          var  status    = body.status
//          var  sensor    = body.sensor
//          var  visit     = body.visit
//          var  full      = body.full
// //---------------------------------------------//
        

//         function addnode(){
//             var sql = "INSERT INTO node ( `idnode` , \
//             `idgateway`, `status` , `sensor` , `visit` , \
//             `full` ) VALUE ( ?, ?, ?, ?, ?, ?); "

//             connection.query(sql, [idnode, idgateway, status, sensor, visit, full], (err, results) => {
//                 if(err) {
//                     return next(err);
//                 }else{
//                     res.json({
//                         success: "success",
//                         data: results
//                     })
//                 }
                
//             })
//         }

//         function checkNodeAddOn(){ 
//             var sql = "SELECT*FROM node WHERE idnode=? AND visit=? ;"
//             connection.query(sql, [idnode, visit], (err, results) => {
//                 if(err){
//                     return next(err);
//                 }
//                 if(results.length > 0){
//                     res.json({
//                         success: "fail",
//                         message: "Sensor is replace"
//                     })
//                 }else{
//                     addnode()
//                 }

//             });
//         }

//         checkNodeAddOn()

//     });
// }

// // -------------------UPDATE SENSOR---------------------------------------------------//

// exports.upDateSensor = (req, res, next) => {
//     req.getConnection((err, connection) => {
//         if(err) return next(err)

//         var { 
//             body 
//         } = req;

// //---------------------------------------------//
//         var idnode = body.idnode
//         var idgateway = body.idgateway
//         var sensor = body.sensor
//         var full = body.full
// //---------------------------------------------//

//         if(sensor >= 100){
//             full = "FULL"
//         }else{
//             full = sensor+"%"
//         }
    
//         function updateSensor(){
//             var sql = "UPDATE node SET sensor = ? , full = ? WHERE idnode = ? AND status = ? AND idgateway = ?;"
//             connection.query(sql, [sensor, full, idnode, "online", idgateway], (err, results) =>{
//                 if(err){
//                     return next(err)
//                 }

//                 if(results.affectedRows == 1){
//                 res.json({
//                     success:"success",
//                     data:results
//                 })
//                 }else{
//                     res.json({
//                         success:"fail",
//                         data:results
//                     })
//                 }

//             }) 
//         }

//         updateSensor()
        
//     })
// }

// //-------------------- upDateStatus -----------------------------------------------------------//

// exports.upDateStatus = (req, res, next) => {
//     req.getConnection((err, connection) => {
//         if(err) return next(err)

//         var {
//             body
//         } = req

// //---------------------------------------------//
//         var idnode        = body.idnode
//         var idgateway     = body.idgateway
//         var sensor        = body.sensor
//         var full          = body.full
//         var status        = body.status 
//  //---------------------------------------------//
//         var statusOffline = body.statusOffline
// //---------------------------------------------//

//         if(statusOffline == "off"){
//             status = "Offline"
//         }else{
//             status = "Online"
//         }

//         function updateStatus(){
//             var sql = "UPDATE node SET status = ? WHERE  idnode = ? AND idgateway = ? ;"
//             connection.query(sql , [status, idnode, idgateway], (err, results) => {
//                 if(err){
//                     return next(err)
//                 }
//                 res.json({
//                     success:"success",
//                     data:results
//                 })
//             })
//         }
//         updateStatus()
//     })
// }

// exports.showGateway = (req, res, next) => {
//     req.getConnection((err, connection) => {
//         if(err) return next(err)

//         var {
//             body
//         } = req 

//         var idgateway     = body.idgateway

//         function gateway(){
//             var sql = "SELECT*FROM node WHERE idgateway = ? ;"
//             connection.query(sql ,[idgateway] ,(err, results) => {
//                 if(err){
//                     return  next(err)
//                 }

//                 if(results[0] == null){
//                     res.json({
//                         success:"fail",
//                         data:results
//                     })
//                 }

//                 res.json({
//                     success:"success",
//                     data:results
//                 })
//             })
//         }

//         gateway()

//     })
// } 


// exports.showAll = (req, res, next) => {
//     req.getConnection((err, connection) => {
//         if(err) return next(err)

//         var sql = "SELECT*FROM node;"
//         connection.query(sql, (err, results) => {
//             if(err){
//                 return next(err)
//             }

//             res.json({
//                 success:"success",
//                 data:results
//             })  
//         })  

//     })
// }

// exports.showVisit = (req, res, next) => {
//     req.getConnection((err, connection) => {
//         if(err) return next(err)

//         var {
//             body
//         } = req 

//         var  visit = body.visit

//         function showvisit(){
//             var sql = "SELECT*FROM node WHERE visit = ? ;"
//             connection.query(sql , [visit], (err, results) => {
//                 if(err){
//                     return next(err)
//                 }

//                 if(results[0] == ""){
//                     res.json({
//                         success:"fail",
//                         data:results
//                     })
//                 }else{
//                 res.json({
//                     success:"success",
//                     data:results
//                 })
//             }

//             })
//         }

//         showvisit()
        
//     })

// }

// exports.showNode = (req, res, next) => {
//     req.getConnection((err, connection) => {
//         if(err) return next(err)
  
//         var {
//             body
//         } = req 

//         var  idnode =  body.idnode

//         function showNode(){
//             var sql = "SELECT*FROM node WHERE idnode = ? ;"
//             connection.query(sql, [idnode], (err, results) => {
//                 if(err){
//                     return next(err)
//                 }

//                 if(results[0] == null){
//                     res.json({
//                         success:"fail",
//                         data:results
//                     })
//                 }

//                 res.json({
//                     success:"success",
//                     data:results
//                 })

//             })
//         }
//         showNode()
//     })

// } 