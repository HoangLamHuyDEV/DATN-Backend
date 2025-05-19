class ProductModel {
    constructor(product_id,name,size,unit,color,price,discount,imgName,brand,type,description,type_id,productImages){
        this.product_id = product_id;
        this.name = name;
        this.size = size;
        this.unit = unit;
        this.color = color;
        this.price = price;
        this.discount = discount;
        this.imgName = imgName;
        this.brand = brand;
        this.type = type;
        this.description = description;
        this.type_id= type_id;
        this.productImages = productImages
    }
}
module.exports = ProductModel;