const express= require("express");
const app= express();
const bodyParser= require("body-parser");
app.use(bodyParser.urlencoded({extended:"true"}));
const mongoose= require("mongoose");
mongoose.connect('mongodb+srv://DevSprout:Avinashkj_18@cluster0-5znjg.mongodb.net/test?retryWrites=true&w=majority', {
	useNewUrlParser:'true',
	useCreateIndex:'true',
	useUnifiedTopology:'true'
}).then(()=>{
	console.log('Db connected');
}).catch(err=>{
	console.log('Error:', err.message);
})


//*******************************************//

var carSchema=new mongoose.Schema({
	vehicleId: Number,
	vehicleModel: String,
	vehicleNo: String,
	seatCap: Number,
	rent: Number,
	available:Number
});

var car= mongoose.model("car", carSchema);

var custSchema=new mongoose.Schema({
	custId: Number,
	custName: String,
	password:String,
	phoneNo : Number,
	email: String,
});

var cust= mongoose.model("cust", custSchema);

//*******************************************//

app.get("/", (req,res)=>{
	res.render("homePage.ejs");
});

app.post("/",(req,res)=>{
	var vehicleId=req.body.vehicleId;
	var vehicleModel= req.body.vehicleModel;
	var	vehicleNo= req.body.vehicleNo;
	var seatCap= req.body.seatCap;
	var	rent= req.body.rent;
	var newCar={vehicleId:vehicleId, vehicleModel:vehicleModel, vehicleNo:vehicleNo,seatCap:seatCap, rent:rent, available:1};
	car.create(newCar, (err,car)=>{
		if(err){
			console.log("Error while adding to DB");
		}else{
			res.redirect("/");
		}
	});
	
	var custId=req.body.custId;
	var custName= req.body.custName;
	var	password= req.body.password;
	var phoneNo= req.body.phoneNo;
	var	email= req.body.email;
	var newCust={custId:custId, custName:custName, password:password, phoneNo:phoneNo, email:email};
	cust.create(newCust, (err,cust)=>{
		if(err){
			console.log("Error while adding to DB");
		}else{
			res.redirect("/");
		}
	});
	
});
app.get("/addingCar",(req,res)=>{
	res.render("addingCar.ejs");
});

app.get("/addingCust",(req,res)=>{
	res.render("addingCust.ejs");
});

app.get("/cars",(req,res)=>{
	car.find({},(err,cars)=>{
		if(err){
			console.log("Error while retrieving");
		} else{
				res.render("cars.ejs",{cars:cars});
		}
	})
});
app.get("/booking",(req,res)=>{
	res.render("booking.ejs");
});

var val=0

app.post("/booking",(req,res)=>{

	var vehicleModel= req.body.vehicleModel;
	var seatCap= req.body.seatCap;
	var	rent= req.body.rent;
	car.find({vehicleModel:vehicleModel, seatCap:{$gte:seatCap},rent:{$lte:rent},available:1},(err,cars)=>{
		if(err){
			cosole.log("Something went wrong");
		} else{
			val=cars;
			res.redirect("/searchresults");
		}
	});
});

app.get("/searchresults",(req,res)=>{
	res.render("searchresults.ejs",{cars:val});
});

app.post("/searchresults",(req,res)=>{
	var vehicleId= req.body.vehicleId;
	var available= req.body.available;
	car.update({vehicleId : vehicleId}, {available : 0}) ;
});
	

//****************************************************//
app.listen(process.env.PORT||8080, ()=>{
	console.log("server running");
});