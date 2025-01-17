// const data = require('../../data.json')
// const { ReturnDocument } = require('mongodb');
const { connectToMongoDB } = require('../configuracion/indexconfig')
const mongoose = require('mongoose');
// const { default: errorMap } = require('zod/locales/en.js');


class ProductosModel{
    static async getAll(){
        try{
           const clientMongoDB = await connectToMongoDB();
           if (!clientMongoDB){
            throw new Error('Error al conectar con MongoDB')
           }
           const resultado = await clientMongoDB.db('LeFiu').collection('productos').find().toArray();
           
           if(!resultado) return {data:null, error:true}
           return {data:resultado, error:false}
        } catch (error) {
            return error
        }
    }

    static async getByID(_id) {
        let clientMongoDB;
        try {
            clientMongoDB = await connectToMongoDB();
            if (!clientMongoDB) {
                throw new Error('Error al conectar con MongoDB');
            }
            const resultado = await clientMongoDB.db('LeFiu').collection('productos').findOne({ _id: new mongoose.Types.ObjectId(_id) });
            if (!resultado) {
                return { data: null, error: true };
            }
            return { data: resultado, error: false };
        } catch (error) {
            console.error(error);
            return { data: null, error: true };
        }
    }
    static async createOne(body){
        try{
            const clientMongoDB = await connectToMongoDB();
            if(!clientMongoDB){
                throw new Error('Error al conectar con MongoDB')
            }
            
            const productWithDefaults = {
                ...body,
                oferta: 0, // Campo oferta con valor inicial 0
                createdAt: new Date(), // Fecha de creación
            };
            
            const insertar = await clientMongoDB.db('LeFiu').collection('productos').insertOne(productWithDefaults)
            console.log(insertar)
            if (insertar.acknowledged) {return { data: { ...body, _id: insertar.insertedId }, error: false };}    
            return { error: true, data: null };
        } catch (error) {
            console.error(error);
            return { error: true, message: error.message }
        }
    }



    static async deleteOne(_id){
        try{
            const clientMongoDB = await connectToMongoDB();
            if(!clientMongoDB){
                throw new Error('Error al conectar con MongoDB')
            }
            const filtro = { _id: new mongoose.Types.ObjectId(_id) };
            const eliminar = await clientMongoDB.db('LeFiu').collection('productos').deleteOne(filtro)
            
            // Verifica si se eliminó un documento
            if (eliminar.deletedCount === 0) {
                return { data: null, error: true, message: 'Producto no encontrado o no se pudo eliminar' };
            }
  
            return { data: { _id }, error: false };
        } catch (error) {
            console.error(error);
            return { error: true, message: error.message }
        }
    }



    static async updateOne(_id, body){
        let clientMongoDB;
        try{
            const clientMongoDB = await connectToMongoDB();
            if(!clientMongoDB){
                throw new Error('Error al conectar con MongoDB')
            }
        
        const filtro = { _id: new mongoose.Types.ObjectId(_id) };
        const actualizacion = { $set: body };

        const resultado = await clientMongoDB.db('LeFiu').collection('productos').findOneAndUpdate(filtro, actualizacion, {returnDocument: 'after'})

        if(!resultado){
            return{data:null, error: true, message: 'Producto no encontrado'}
        }
        return{data: resultado.value, error: false}
        } catch (error) {
            console.error(error)
            return {data:null, error:true, message:error.message}
        } 
}
}

module.exports = ProductosModel