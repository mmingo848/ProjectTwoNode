const Tour = require('./../models/tourModel')

exports.getAllTours = async (req, res) => {
    try{
        console.log(req.query)
        // BUILD QUERY
        // 1A) Filtering 
        const queryObj = {...req.query}
        const excludedFields = ['page', 'sort', 'limit', 'fields']
        excludedFields.forEach(el => delete queryObj[el])

        // 1B) Adavanced filtering
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        console.log(JSON.parse(queryStr))
        
        let query = Tour.find(JSON.parse(queryStr))

        // Approach one for writing a query
        // const query = Tour.find(req.query)

        // 2) Sorting
        if(req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ')
            query = query.sort(sortBy)
        } else {
            query = query.sort('-createdAt')
        }

        // 3) Field limiting
        if(req.query.fields){
            const fields = req.query.fields.split(',').join(' ')
            query = query.select(fields)
        } else {
            query = query.select('-__v')    // Excludes the Mongoose added field '__v:' from being sent to the client
        }
        
        // EXECUTE QUERY
        const tours = await query
        
        // SEND RESPONSE
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        })
    }catch(err){
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
}

exports.getIndivTour = async (req, res) => {
    try{
        const tour = await Tour.findById(req.params.id)
        res.status(200).json({
            status: "success",
            data:{
                tour
            }
        })
    }catch(err){
        res.status(404).json({
            status: "fail",
            message: err
        })
    }
}

exports.updateTour = async (req, res) => {
    try{
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new:true, // New upated document will be returned to the client
            runValidators: true
        })
        res.status(200).json({
            status: 'success',
            data:{
                tour
            }
        })
    }catch(err){
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
}

exports.deleteTour = async (req, res) => {
    try{
        await Tour.findByIdAndDelete(req.params.id)
        res.status(204).json({
            status: 'success',
            data: null
        })
    } catch(err){
        res.status(404).json({
            status: 'fail',
            message: err
        })
        
    }
}

exports.createTour = async (req, res) => {
    try{
        const newTour = await Tour.create(req.body)
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    } catch(err){
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

// Approach two for writing a query
// const tours = await Tour.find({
//     duration: 5,
//     difficulty: 'easy'
// })

// Approach three for writing a query
// const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy')