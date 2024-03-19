const express = require("express")
const app = express()
const uuid = require("uuid")
const port = 3000
app.use(express.json())

const orders = []

const checkOrderId = (request, response, next) => {

    const { id } = request.params

    const index = orders.findIndex(order => order.id === id)

    if(index < 0){
        return response.status(404).json({ error: "order not found"})
    }

    request.orderIndex = index
    request.orderId = id
    next()

}

const checkUrl = (request, response, next)=>{
    console.log(request.method)
    console.log(request.url)
    next()
}

app.get("/order", checkUrl, (request, response)=>{

    return response.json(orders)
})

app.post("/order", checkUrl, (request, response)=>{
    const {order, clientName, price} = request.body

    const status = "Em preparação"

    const newOrder = {id:uuid.v4(), order, clientName, price, status}

    orders.push(newOrder)

    return response.status(201).json(newOrder)

})

app.put("/order/:id", checkOrderId, checkUrl, (request, response)=>{

    const {order, clientName, price} = request.body
    const index = request.orderIndex
    const id = request.orderId

    const updateOrder = {id, order, clientName, price}

    orders[index] = updateOrder 

    return response.json(updateOrder)
})

app.delete("/order/:id", checkOrderId, checkUrl, (request, response)=>{
    const index = request.orderIndex

    orders.splice(index,1)

    return response.status(204).json()
})

app.get("/order/:id", checkOrderId, checkUrl, (request, response)=>{
    const index = request.orderIndex

    const viewOrder = orders[index]

    return response.json(viewOrder)
})

app.patch("/order/:id", checkOrderId, checkUrl, (request, response)=>{
    const { order, clientName, price} = request.body
    const id = request.orderId
    const index = request.orderIndex
    const orderReady = {
        id,
        order: orders[index].order,
        clientName: orders[index].clientName,
        price: orders[index].price,
        status: "Pronto"
    }

    orders[index] = orderReady

    return response.json(orderReady)
})




app.listen(port, () =>{
    console.log(`server started on port ${port}`)
})