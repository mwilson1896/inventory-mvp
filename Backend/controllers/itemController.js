const asyncHandler = require("express-async-handler");
const Item = require("../models/itemModel");
const cloudinary = require("cloudinary").v2;

const createItem = asyncHandler(async (req, res) => {
  const { name, price, description, image, category } = req.body;

  //validate
  if(!name || !price || !description || !image || !category) {
    res.status(400)
    throw new Error('Please fill in all fields')
  }

   // Handle Image upload
   let fileData = {};
   if (req.file) {
     // Save image to cloudinary
     let uploadedFile;
     try {
       uploadedFile = await cloudinary.uploader.upload(req.file.path, {
         folder: "Pinvent App",
         resource_type: "image",
       });
     } catch (error) {
       res.status(500);
       throw new Error("Image could not be uploaded");
     }
 
     fileData = {
       fileName: req.file.originalname,
       filePath: uploadedFile.secure_url,
       fileType: req.file.mimetype,
       fileSize: fileSizeFormatter(req.file.size, 2),
     };

    }

    const item = await Item.create({
        name,
        price,
        description,
        image: fileData,
        category
    });

    res.status(201).json(item);
});

// Get items
const getItems = asyncHandler(async (req, res) => {
    const items = await Item.find({user: req.user._id}).sort("-createdAt");
    res.status(200).json(items);

});

// Get single item
const getItem = asyncHandler(async (req, res) => {
    const item = await Item.findById(req.params.id);
    if(!item) {
        res.status(404);
        throw new Error('Item not found');
    }

    if(item.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized');
    }

    res.status(200).json(item);
});

// Delete item
const deleteItem = asyncHandler(async (req, res) => {
    const item = await Item.findById(req.params.id);
    if(!item) {
        res.status(404);
        throw new Error('Item not found');
    }
    // match item to user
    if(item.user.toString() !== req.user._id) {
        res.status(401);
        throw new Error('Not authorized');
    }

    await item.remove();
    res.status(200).json({message: 'Item removed'});
});

// Update item
const updateItem = asyncHandler(async (req, res) => {
    const { name, price, description, category } = req.body;
    const { id } = req.params;

    const item = await Item.findById(id);

    if(!item) {
        res.status(404);
        throw new Error('Item not found');
    }
    // match item to user
    if(item.user.toString() !== req.user._id) {
        res.status(401);
        throw new Error('Not authorized');
    }

    // Handle Image upload
    let fileData = {};
    if (req.file) {
        // Save image to cloudinary
        let uploadedFile;
        try {
            uploadedFile = await cloudinary.uploader.upload(req.file.path, {
            folder: "INVENTORY-MANGE-APP",
            resource_type: "image",
            });
        } catch (error) {
            res.status(500);
            throw new Error("Image could not be uploaded");
        }
    
        fileData = {
            fileName: req.file.originalname,
            filePath: uploadedFile.secure_url,
            fileType: req.file.mimetype,
            fileSize: fileSizeFormatter(req.file.size, 2),
        };
    }

    const updatedItem = await item.findByIdAndUpdate(
        {_id: id},
        {
            name,
            price,
            description,
            quantity,
            price,
            category,
            image: Object.keys(fileData).length === 0 ? item.image : fileData,
        },
        {new: true, runValidators: true} 
    );

    res.status(200).json(updatedItem);
});

module.exports = {
    createItem,
    getItems,
    getItem,
    deleteItem,
    updateItem
};