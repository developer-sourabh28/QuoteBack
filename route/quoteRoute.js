const express = require('express');
const router = express.Router();
const Quote = require('../schema/quoteSchema')
const uploads = require('../configure/images')
const authMiddleWare = require('../middleware/authMiddleware')


router.post ( '/', async(req, res) => {
    try {
        const quote = new Quote({
          theme : req.body.theme,
          quote : req.body.quote,
          writer : req.body.writer,
          imageUrl : req.body.imageUrl,
        });
        const savedQuote = await quote.save();
        res.status(200).json(savedQuote)
    } catch (error) {
        res.status(500).json({message : error.message})
    }
});

router.get('/test', (req, res) => {
    res.send('QuoteRoute is working!');
});


// router.patch('/quote/:id/like', authMiddleWare, async (req, res) => {
//     const { id } = req.params;
//     const userId = req.user.userId; // User ID from the token

//     try {
//         const quote = await Quote.findById(id);

//         if (!quote) {
//             return res.status(404).json({ message: 'Quote not found' });
//         }

//         // Like/dislike logic (example: toggle functionality)
//         if (quote.likes.includes(userId)) {
//             quote.likes = quote.likes.filter((uid) => uid !== userId);
//         } else {
//             quote.likes.push(userId);
//         }

//         await quote.save();

//         return res.status(200).json({ likes: quote.likes.length });
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// });

// router.post('/uploads', uploads.single('image'), (req, res) => {
//     try {
//         if(!req.file){
//             return res.status(400).json({message : 'No file uploaded'})
//         }
//         const filePath = `/uploads/${req.file.filename}`;
//         res.status(200).json({
//             message : 'Image Uploades Successfully',
//             url : `http://localhost:8000${filePath}`,      
//         });
//     } catch (error) {
//         res.status(500).json({message : error.message});
//     }
// })


router.get('/', authMiddleWare, async (req, res) => {
    try {
        const userId = req.user._id;
        const getQuote = await Quote.find();
        if(!getQuote || getQuote.length === 0) {
            return res.status(404).json({message : "Quote not found"})
        }
        const quotesWithLikes = getQuote.map((quote) => ({
            ...quote.toObject(),
            userLiked: quote.likes.includes(userId),
        }));
        res.status(200).json(quotesWithLikes);
    } catch (error) {
        console.log(error)
        res.status(500).json({message : error.message})
    }
});

router.get('/:id', async (req, res) => {
    try {
        const getQuoteId = await Quote.findById(req.params.id);
        if(!getQuoteId) return res.status(404).json({message : 'Quote not found'})
            res.status(200).json(getQuoteId);
    } catch (error) {
        res.status(500).json({message : error.message})
    }
})

router.put('/:id', async (req, res) => {
    try {
     const updateQuote = await Quote.findByIdAndUpdate(
        req.params.id, req.body, {new : true});
        if(!updateQuote) return res.status(404).json({message : "Quote not found"})
     res.status(200).json(updateQuote);
    } catch (error) {
     res.status(500).json({message : error.message})
    }
 });
 
 router.delete('/:id', async (req, res) => {
    try {
     const deleteQuote = await Quote.findByIdAndDelete(req.params.id);
     if(!deleteQuote) return res.status(404).json({message : "Quote not found"})
     res.status(200).json({message : 'Quote Deleted Successfully'});
    } catch (error) {
     res.status(500).json({message : error.message})
    }
 });

 module.exports = router;