import express from "express"

const router = express.Router()
const allPost = []
// Create
router.post("/post", (req, res,next)=> {
    if(!req.body.title){ 
       return res.status (404).send({
        message : "title can not be empty"
    })}

    if(!req.body.description){ 
       return res.status (404).send({
        message : "description can not be empty"
    })}
   const newPost = {
    title: req.body.title,
    description: req.body.description,
    id : new Date().getTime(),
   }

   allPost.unshift(newPost)
   res.status(201).send({
    message : "post created successfully",
   })
})
// Post
router.get("/post", (req, res,next)=> {
return res.status(200).send({
    message : "All get post",
    data : allPost
})

})
// Single Post 
router.get("/post/:postId", (req, res, next) => {
    const postId = req.params.postId
    if (!postId) {
        return res.status(400).send({
            message: "post id is required"
        })}
    const post = allPosts.find((singlePost) => {
        return singlePost.id == postId
    })

    if (!post) {
        return res.status(404).send({
            message: "post not found"
        })
    }

    res.send({
        message: "post fetched",
        data: post
    })
})
//Edit
router.put("/post/:postId", (req, res, next) => {
    const postId = req.params.postId

    if (!req.body.title) {
        return res.status(400).send({
            message: "title is required"
        })
    }

    if (!req.body.description) {
        res.status(400).send({
            message: "description is required"
        })
    }

    if (!postId) {
        return res.status(400).send({
            message: "post id is required"
        })
    }

    const post = allPosts.find((singlePost) => {
        return singlePost.id == postId
    })

    if (!post) {
        return res.status(404).send({
            message: "post not found"
        })
    }

    const newPosts = allPosts.map((singlePost) => {
        return singlePost.id == postId ?
            {
                ...singlePost,
                title: req.body.title,
                description: req.body.description,
            }
            : singlePost})

    allPosts = newPosts

    return res.send({
        message: "post edited"
    })

})
// delete
router.delete("/post/:postId", (req, res, next) => {
    const postId = req.params.postId

    if (!postId) {
        return res.status(400).send({
            messge: "post id is required"
        })
    }

    const post = allPosts.find((singlePost) => {
        return singlePost.id == postId
    })

    if (!post) {
        return res.status(404).send({
            message: "post not found"
        })
    }

    const newPosts = allPosts.filter((singlePost) => {
        return singlePost.id != postId
    })

    allPosts = newPosts

    return res.send({
        message: "post deleted"
    })

})

export default router