import mongoose from "mongoose";

//set schema/rule/structure
const productSchema = new mongoose.Schema(
 {
    name: {
        type: String,
        required: true,
        trim:true,
        maxLength: 155
    },
    price: {
        type: String,
        required: true,
        min:0,
    },
    brand: {
        type: String,
        required: true,
        trim:true,
        maxLength: 155
    },
    category: {
        type: String,
        required: true,
        trim:true,
        enum: [
            "grocery", 
            "electronics",
            "electrical", 
            "clothing",
            "Kitchen",
            "Kids",
            "Laundry"
        ],
    },
    image: {
        type: String,
        required: false,
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    
 },
 {
    timestamps: true,
 }
);


//create model/table/collection
const ProductTable = mongoose.model('Product', productSchema);

export default ProductTable;


//product
//_id
//fullName
//price
// brand
//category
//image
//quantity
// created_at
// updated_at